import { type ActionParams, type ShopAction } from "./actions";
import { defaultProducts, type Product, type ShopCategory } from "./catalog";
import { getDb } from "./db";

const fallbackImage = "http://45.146.81.195/imagens/default.png";

function asNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function fromDb(row: Record<string, unknown>): Product | null {
  const id = typeof row.id === "string" ? row.id : "";
  const name = typeof row.name === "string" ? row.name : "";
  const category = row.category;
  if (!id || !name || typeof category !== "string") return null;
  if (!["vips", "others", "crp", "vehicles", "mansions", "weapons"].includes(category)) return null;
  const price = asNumber(row.price);
  const params = row.actionParams && typeof row.actionParams === "object" ? row.actionParams as ActionParams : undefined;
  return {
    id,
    name,
    category: category as ShopCategory,
    price,
    crpPrice: asNumber(row.crpPrice),
    image: typeof row.image === "string" ? row.image : fallbackImage,
    description: typeof row.description === "string" ? row.description : "",
    benefits: Array.isArray(row.benefits) ? row.benefits.filter((item): item is string => typeof item === "string") : [],
    purchaseType: typeof row.purchaseType === "string" ? row.purchaseType : undefined,
    amount: asNumber(row.amount) ?? (params ? asNumber((params as { amount?: unknown }).amount) : null) ?? undefined,
    action: typeof row.action === "string" ? row.action as ShopAction : undefined,
    actionParams: params,
    sellOnline: price !== null && price > 0,
    source: "db"
  };
}

export async function loadDbProducts() {
  const db = await getDb();
  const rows = await db.collection("products").find({ active: { $ne: false } }).sort({ createdAt: 1 }).toArray();
  return rows.map((row) => fromDb(row as Record<string, unknown>)).filter((item): item is Product => Boolean(item));
}

export async function loadCatalog() {
  try {
    const extras = await loadDbProducts();
    if (!extras.length) return defaultProducts;
    const merged = new Map(defaultProducts.map((item) => [item.id, item]));
    for (const extra of extras) merged.set(extra.id, extra);
    return [...merged.values()];
  } catch {
    return defaultProducts;
  }
}

export async function findProduct(id: string) {
  const catalog = await loadCatalog();
  return catalog.find((item) => item.id === id);
}
