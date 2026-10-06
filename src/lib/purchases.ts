import { categoryLabels, type Product, type ShopCategory } from "./catalog";
import { loadCatalog } from "./catalog-server";
import { cityIdentity } from "./city";
import { getDb } from "./db";
import type { PurchaseView } from "./purchase-view";

const week = 7 * 24 * 60 * 60 * 1000;
const fallbackImage = "/imagens/loja.png";

const statusLabels: Record<string, string> = {
  pending: "Aguardando pagamento",
  delivering: "Entregando",
  delivered: "Entregue",
  expired: "Pagamento não concluído"
};

type RawLine = {
  id?: unknown;
  name?: unknown;
  category?: unknown;
  purchaseType?: unknown;
  qty?: unknown;
  price?: unknown;
  action?: unknown;
  actionParams?: unknown;
  image?: unknown;
  description?: unknown;
  benefits?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function daysOf(line: RawLine, product?: Product) {
  const params = line.actionParams && typeof line.actionParams === "object" ? line.actionParams as Record<string, unknown> : {};
  const productDays = product?.actionParams?.days;
  const stored = Number(params.days ?? productDays);
  if (Number.isFinite(stored) && stored > 0) return stored;
  const purchaseType = text(line.purchaseType) || product?.purchaseType || "";
  const category = text(line.category) || product?.category || "";
  const action = text(line.action) || product?.action || "";
  if (purchaseType === "weekly") return 7;
  if (purchaseType === "monthly" || category === "mansions" || category === "vips" || action === "iniciaraluguelcasa" || action === "iniciaraluguelvip") return 30;
  return 0;
}

function kindOf(line: RawLine, product?: Product) {
  const params = line.actionParams && typeof line.actionParams === "object" ? line.actionParams as Record<string, unknown> : {};
  const purchaseType = text(line.purchaseType) || product?.purchaseType || "";
  const category = text(line.category) || product?.category || "";
  const action = text(line.action) || product?.action || "";
  if (action === "orgowner" || params.term === "season") return "Venda única";
  if (purchaseType === "permanent" || action === "vipwipe") return "Até o wipe";
  if (purchaseType === "weekly") return "Aluguel semanal";
  if (purchaseType === "monthly" || category === "mansions" || action === "iniciaraluguelcasa" || action === "iniciaraluguelvip") return "Aluguel mensal";
  if (action === "blipcredit") return "Crédito de blip";
  if (category === "crp" || action === "darcrp") return "CRP";
  if (action === "resetchar") return "Uso único";
  return "Compra";
}

function expires(line: RawLine, product: Product | undefined, createdAt: Date) {
  const params = line.actionParams && typeof line.actionParams === "object" ? line.actionParams as Record<string, unknown> : {};
  const action = text(line.action) || product?.action || "";
  const purchaseType = text(line.purchaseType) || product?.purchaseType || "";
  const category = text(line.category) || product?.category || "";
  if (action === "orgowner" || params.term === "season" || purchaseType === "permanent" || action === "vipwipe") return null;
  if (action === "blipcredit" || action === "darcrp" || action === "resetchar" || category === "crp" || category === "weapons") return null;
  const days = daysOf(line, product);
  if (!days) return null;
  return new Date(createdAt.getTime() + days * 24 * 60 * 60 * 1000);
}

function asCategory(value: string): ShopCategory {
  if (value === "vips" || value === "others" || value === "crp" || value === "vehicles" || value === "mansions" || value === "weapons" || value === "organizacao") return value;
  return "others";
}

export async function loadPurchases(userId: string): Promise<PurchaseView[]> {
  const db = await getDb();
  const orders = await db.collection("orders").find({
    userId,
    status: { $in: ["delivered", "delivering", "conflict"] }
  }).sort({ createdAt: -1 }).limit(80).toArray();
  const catalog = await loadCatalog();
  const byId = new Map(catalog.map((item) => [item.id.toLocaleLowerCase("pt-BR"), item]));
  const missing = new Set<number>();
  for (const order of orders) {
    const targetId = Number(order.targetId);
    if (targetId > 0 && !text(order.targetName)) missing.add(targetId);
  }
  const names = new Map<number, string>();
  await Promise.all([...missing].map(async (id) => {
    const found = await cityIdentity({ user: id });
    if (found.state === "ok" && found.identity.name) names.set(id, found.identity.name);
  }));

  const now = Date.now();
  const purchases: PurchaseView[] = [];
  for (const order of orders) {
    const createdAt = order.createdAt instanceof Date ? order.createdAt : new Date(String(order.createdAt || Date.now()));
    const targetId = Number(order.targetId) || 0;
    const targetName = text(order.targetName) || names.get(targetId) || (targetId ? `Passaporte ${targetId}` : "Passaporte não informado");
    const status = text(order.status) || "pending";
    const lines = Array.isArray(order.lines) ? order.lines as RawLine[] : [];
    lines.forEach((line, index) => {
      const id = text(line.id);
      const catalogProduct = byId.get(id.toLocaleLowerCase("pt-BR"));
      const category = asCategory(text(line.category) || catalogProduct?.category || "others");
      const qty = Math.max(1, Number(line.qty) || 1);
      const price = Number(line.price) || 0;
      const paid = Math.round(price * qty * 100) / 100;
      const kindLabel = kindOf(line, catalogProduct);
      const expiry = status === "delivered" ? expires(line, catalogProduct, createdAt) : null;
      const daysLeft = expiry ? Math.ceil((expiry.getTime() - now) / (24 * 60 * 60 * 1000)) : null;
      const expiring = Boolean(expiry && expiry.getTime() - now > 0 && expiry.getTime() - now <= week);
      const benefits = Array.isArray(line.benefits) ? line.benefits.filter((item): item is string => typeof item === "string") : catalogProduct?.benefits || [];
      const product: Product = {
        id: id || `${String(order._id)}-${index}`,
        name: text(line.name) || catalogProduct?.name || "Produto",
        category,
        price: paid,
        crpPrice: null,
        image: text(line.image) || catalogProduct?.image || (category === "organizacao" ? "/imagens/organizacoes.png" : fallbackImage),
        description: text(line.description) || catalogProduct?.description || "Compra registrada nesta conta.",
        benefits: benefits.length ? benefits : [kindLabel],
        purchaseType: text(line.purchaseType) || catalogProduct?.purchaseType,
        sellOnline: false,
        source: "db"
      };
      purchases.push({
        id: `${String(order._id)}-${index}`,
        createdAt: createdAt.toISOString(),
        expiresAt: expiry ? expiry.toISOString() : null,
        expiring,
        daysLeft: expiring ? daysLeft : null,
        status,
        statusLabel: statusLabels[status] || "Registrada",
        kindLabel,
        qty,
        paid,
        targetId,
        targetName,
        categoryLabel: categoryLabels[category],
        product
      });
    });
  }

  return purchases.sort((a, b) => {
    if (a.expiring !== b.expiring) return a.expiring ? -1 : 1;
    if (a.expiring && b.expiring) return String(a.expiresAt).localeCompare(String(b.expiresAt));
    return b.createdAt.localeCompare(a.createdAt);
  });
}
