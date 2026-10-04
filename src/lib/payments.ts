import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { findProduct } from "./catalog-server";

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
};

export async function createCheckout(input: {
  userId: string;
  email: string;
  name: string;
  targetId: number;
  items: { id: string; qty: number }[];
}) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const base = siteUrl();
  if (!token) return { ok: false as const, message: "Mercado Pago ainda não está configurado." };
  if (!base) return { ok: false as const, message: "Defina NEXT_PUBLIC_SITE_URL com o endereço HTTPS da Vercel." };

  const lines: OrderLine[] = [];
  for (const item of input.items) {
    const product = await findProduct(item.id);
    if (!product || !product.sellOnline || product.price === null) return { ok: false as const, message: "Item inválido." };
    lines.push({
      id: product.id,
      name: product.name,
      category: product.category,
      purchaseType: product.purchaseType,
      amount: product.amount ?? product.actionParams?.amount,
      qty: item.qty,
      price: product.price,
      action: product.source === "db" ? product.action : undefined,
      actionParams: product.source === "db" ? product.actionParams : undefined
    });
  }
  const total = Math.round(lines.reduce((sum, line) => sum + line.price * line.qty, 0) * 100) / 100;
  const db = await getDb();
  const inserted = await db.collection("orders").insertOne({
    userId: input.userId,
    email: input.email,
    name: input.name,
    targetId: input.targetId,
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
    await db.collection("orders").updateOne({ _id: orderId }, { $set: { status: "pending", lastError: delivery.message } });
    return "retry" as const;
  }
  await db.collection("orders").updateOne({ _id: orderId }, { $set: { status: "delivered", announced: true } });
  await announce(String(order.name || "Cidadão"), order.lines as OrderLine[], Number(order.targetId));
  return "ok" as const;
}
