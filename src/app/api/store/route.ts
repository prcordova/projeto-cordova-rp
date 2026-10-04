import { NextResponse } from "next/server";
import { loadCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await loadCatalog();
  return NextResponse.json({ items });
}
