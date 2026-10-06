import { NextResponse } from "next/server";
import { cityBlipTypes } from "@/lib/city";

export const dynamic = "force-dynamic";

export async function GET() {
  const types = await cityBlipTypes();
  if (!types) return NextResponse.json({ ok: false, types: [] });
  return NextResponse.json({ ok: true, types });
}
