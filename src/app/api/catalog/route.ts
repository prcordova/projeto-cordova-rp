import { NextResponse } from "next/server";
import { loadDbProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await loadDbProducts();
    if (!items.length) {
      return NextResponse.json({ source: "config", items: [] });
    }
    return NextResponse.json({
      source: "db",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        detailedDescription: item.description,
        image: item.image,
        benefits: item.benefits,
        price: item.crpPrice || 0,
        crpprice: item.crpPrice || 0,
        crpPrice: item.crpPrice,
        brlPrice: item.price,
        moneyOnly: Boolean(item.price && item.price > 0 && !item.crpPrice),
        amount: item.amount ?? item.actionParams?.amount,
        action: item.action,
        actionParams: item.actionParams || {},
        purchaseType: item.purchaseType
      }))
    });
  } catch {
    return NextResponse.json({ source: "config", items: [] });
  }
}
