import { NextResponse } from "next/server";
import { absoluteImage, loadDbProducts } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
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
        image: absoluteImage(item.image, origin),
        benefits: item.benefits,
        price: item.crpPrice || 0,
        crpprice: item.crpPrice || 0,
        crpPrice: item.crpPrice,
        brlPrice: item.price,
        moneyOnly: Boolean(item.price && item.price > 0 && !item.crpPrice),
        amount: item.amount ?? item.actionParams?.amount,
        action: item.action,
        actionParams: item.actionParams || {},
        purchaseType: item.purchaseType,
        placeKind: item.placeKind,
        location: item.location,
        availability: item.availability,
        owner: item.owner
      }))
    });
  } catch {
    return NextResponse.json({ source: "config", items: [] });
  }
}
