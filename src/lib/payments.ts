import { ObjectId } from "mongodb";
import { cityBlipTypes, cityHoldOrg, cityIdentity, cityReleaseOrg } from "./city";
import { orgSalePrice } from "./catalog";
import { getDb } from "./db";
import { defaultProducts } from "./catalog";
import { findProduct } from "./catalog-server";
import { loadOrgs } from "./rankings";

const configIds = new Set(defaultProducts.map((item) => item.id));

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

type OrderLine = {
  id: string;
  name: string;
  category: string;
  purchaseType?: string;
  amount?: number;
  qty: number;
  price: number;
  action?: string;
  actionParams?: Record<string, unknown>;
  image?: string;
  description?: string;
  benefits?: string[];
};

export async function createCheckout(input: {
  userId: string;
  email: string;
  name: string;
  discordId?: string | null;
  targetId: number;
  items: { id: string; qty: number }[];
}) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const base = siteUrl();
  if (!token) return { ok: false as const, message: "Mercado Pago ainda não está configurado." };
  if (!base) return { ok: false as const, message: "Defina NEXT_PUBLIC_SITE_URL com o endereço HTTPS da Vercel." };

  const holder = await cityIdentity({ user: input.targetId });
  if (holder.state === "offline") return { ok: false as const, message: "A cidade não respondeu. O ID só pode ser conferido com o servidor no ar." };
  if (holder.state !== "ok") return { ok: false as const, message: "Esse passaporte não existe na cidade. Confira o ID antes de pagar." };

  const lines: OrderLine[] = [];
  let needsPassport = false;
  let needsOwner = false;
  let blipTypes: Awaited<ReturnType<typeof cityBlipTypes>> | undefined;
  let orgs: Awaited<ReturnType<typeof loadOrgs>> | undefined;
  for (const item of input.items) {
    const product = await findProduct(item.id);
    if (!product || product.category === "organizacao") {
      if (blipTypes === undefined) blipTypes = await cityBlipTypes();
      const blip = blipTypes?.find((type) => type.id === item.id);
      if (blip) {
        if (!(blip.price > 0)) return { ok: false as const, message: "Esse blip ainda não tem preço em reais." };
        lines.push({
          id: blip.id,
          name: blip.label,
          category: "organizacao",
          qty: item.qty,
          price: blip.price,
          action: "blipcredit",
          actionParams: { type: blip.id },
          image: "/imagens/loja.png",
          description: `Crédito de blip ${blip.label}. A ficha pede ticket no Discord ou um serviço na cidade.`,
          benefits: ["Crédito de blip", "PIX ou cartão"]
        });
        needsOwner = true;
        continue;
      }
    }
    const faction = !product || (product.category === "organizacao" && (!product.placeKind || product.placeKind === "faccao"));
    if (faction) {
      if (orgs === undefined) orgs = await loadOrgs();
      const key = (value: string) => value.toLocaleLowerCase("pt-BR");
      const org = orgs?.find((entry) => {
        const name = entry.name || "";
        if (!name) return false;
        return key(name) === key(item.id) || Boolean(product && (key(name) === key(product.id) || key(name) === key(product.name)));
      });
      if (!org?.name) {
        if (!product) {
          if (!orgs) return { ok: false as const, message: "A cidade não respondeu. Tente de novo." };
          return { ok: false as const, message: "Item inválido." };
        }
        if (!orgs) return { ok: false as const, message: "A cidade não respondeu. Tente de novo." };
        return { ok: false as const, message: "Essa organização não está na cidade." };
      }
      if (org.owner || org.sub) return { ok: false as const, message: "Essa organização já tem dono. A venda é única." };
      if (item.qty !== 1) return { ok: false as const, message: "Cada organização é venda única." };
      lines.push({
        id: org.name,
        name: org.name,
        category: "organizacao",
        qty: 1,
        price: orgSalePrice,
        action: "orgowner",
        actionParams: { org: org.name, term: "season" },
        image: "/imagens/organizacoes.png",
        description: "Venda única por R$ 1.000,00. O cargo de dono vale até o final da season.",
        benefits: ["Venda única", "Até o final da season"]
      });
      needsPassport = true;
      continue;
    }
    if (!product || !product.sellOnline || product.price === null) return { ok: false as const, message: "Item inválido." };
    const line: OrderLine = {
      id: product.id,
      name: product.name,
      category: product.category,
      purchaseType: product.purchaseType,
      amount: product.amount ?? product.actionParams?.amount,
      qty: item.qty,
      price: product.price,
      action: product.source === "db" && !configIds.has(product.id) ? product.action : undefined,
      actionParams: product.source === "db" && !configIds.has(product.id) ? product.actionParams : undefined,
      image: product.image,
      description: product.description,
      benefits: product.benefits.slice(0, 6)
    };
    lines.push(line);
  }
  if (needsPassport || needsOwner) {
    if (needsPassport) {
      const mine = input.discordId ? await cityIdentity({ discord: input.discordId }) : { state: "missing" as const };
      if (mine.state === "offline") return { ok: false as const, message: "A cidade não respondeu. Tente de novo." };
      if (mine.state !== "ok") return { ok: false as const, message: "Sua conta Discord não está ligada a um passaporte. Entre na cidade com o Discord vinculado." };
      if (input.targetId !== mine.identity.userId) return { ok: false as const, message: "Organização e facção só podem ser compradas no seu próprio passaporte." };
    }
    if (needsOwner && !holder.identity.orgs.length) {
      return { ok: false as const, message: "O passaporte que recebe o blip precisa ser dono de uma organização." };
    }
  }
  const reserved: string[] = [];
  for (const line of lines) {
    if (line.action !== "orgowner") continue;
    const org = String(line.actionParams?.org || line.id);
    const hold = await cityHoldOrg(org, input.targetId);
    if (!hold.ok) {
      await Promise.all(reserved.map((name) => cityReleaseOrg(name, input.targetId)));
      return { ok: false as const, message: hold.message };
    }
    reserved.push(org);
  }
  const total = Math.round(lines.reduce((sum, line) => sum + line.price * line.qty, 0) * 100) / 100;
  const db = await getDb();
  const inserted = await db.collection("orders").insertOne({
    userId: input.userId,
    email: input.email,
    name: input.name,
    targetId: input.targetId,
    targetName: holder.identity.name || `Passaporte ${input.targetId}`,
    lines,
    total,
    status: "pending",
    announced: false,
    createdAt: new Date()
  });
  const reference = String(inserted.insertedId);
  const preference = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: lines.map((line) => ({
        title: line.name,
        quantity: line.qty,
        currency_id: "BRL",
        unit_price: line.price
      })),
      external_reference: reference,
      notification_url: `${base}/api/mercadopago`,
      payer: { email: input.email },
      back_urls: {
        success: `${base}/conta?pago=ok`,
        pending: `${base}/conta?pago=pendente`,
        failure: `${base}/carrinho?pago=falhou`
      },
      auto_return: "approved"
    })
  });
  const data = await preference.json();
  const url = data.init_point || data.sandbox_init_point;
  if (!preference.ok || !url) {
    await db.collection("orders").updateOne({ _id: inserted.insertedId }, { $set: { status: "expired" } });
    await Promise.all(reserved.map((name) => cityReleaseOrg(name, input.targetId)));
    return { ok: false as const, message: "O Mercado Pago não abriu o checkout." };
  }
  return { ok: true as const, url: String(url), total };
}

async function announce(name: string, lines: OrderLine[], targetId: number) {
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) return;
  const names = lines.map((line) => `${line.qty}x ${line.name}`).join(", ");
  await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `**${name}** comprou **${names}**. Parabéns! Entregue ao passaporte ${targetId}.`
    })
  });
}

async function deliverToGame(order: { targetId: number; lines: OrderLine[] }, paymentId: string) {
  const url = process.env.GAME_DELIVER_URL;
  const secret = process.env.GAME_DELIVER_SECRET;
  if (!url || !secret) return { ok: false, message: "Entrega no jogo ainda não configurada." };
  const expanded = order.lines.flatMap((line) => Array.from({ length: line.qty }, () => ({
    id: line.id,
    name: line.name,
    category: line.category,
    purchaseType: line.purchaseType,
    amount: line.amount,
    action: line.action,
    actionParams: line.actionParams
  })));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cordova-secret": secret
    },
    body: JSON.stringify({ targetId: order.targetId, paymentId, lines: expanded })
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok && data.ok !== false, message: String(data.message || "Falha ao entregar no jogo.") };
}

export async function confirmPayment(paymentId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token || !paymentId) return "ignore" as const;
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) return "ignore" as const;
  const payment = await response.json();
  if (payment.status !== "approved" || !payment.external_reference) return "ignore" as const;
  const db = await getDb();
  let orderId: ObjectId;
  try {
    orderId = new ObjectId(String(payment.external_reference));
  } catch {
    return "ignore" as const;
  }
  const claimed = await db.collection("orders").findOneAndUpdate(
    { _id: orderId, status: "pending" },
    { $set: { status: "delivering", mpPaymentId: String(payment.id) } }
  );
  const order = claimed && typeof claimed === "object" && "value" in claimed ? claimed.value : claimed;
  if (!order) return "ignore" as const;
  const expected = Math.round(Number(order.total) * 100) / 100;
  const paid = Math.round(Number(payment.transaction_amount) * 100) / 100;
  if (Math.abs(expected - paid) > 0.05) {
    await db.collection("orders").updateOne({ _id: orderId }, { $set: { status: "pending" } });
    return "ignore" as const;
  }
  const delivery = await deliverToGame(order as { targetId: number; lines: OrderLine[] }, String(payment.id));
  if (!delivery.ok) {
    const blocked = /já tem dono|já está na fila/i.test(delivery.message);
    await db.collection("orders").updateOne({ _id: orderId }, { $set: { status: blocked ? "conflict" : "pending", lastError: delivery.message } });
    return blocked ? "ok" as const : "retry" as const;
  }
  await db.collection("orders").updateOne({ _id: orderId }, { $set: { status: "delivered", announced: true } });
  await announce(String(order.name || "Cidadão"), order.lines as OrderLine[], Number(order.targetId));
  return "ok" as const;
}
