import { NextResponse } from "next/server";
import { cityBlipTypes, citySetBlipPrice } from "@/lib/city";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await readSession();
  if (!user?.admin) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const types = await cityBlipTypes();
  if (!types) return NextResponse.json({ ok: false, message: "A cidade não respondeu." }, { status: 502 });
  return NextResponse.json({ ok: true, types });
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user?.admin) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id || "");
  const price = Number(body?.price);
  if (!id || !Number.isFinite(price)) {
    return NextResponse.json({ ok: false, message: "Informe o tipo e o preço." }, { status: 400 });
  }
  const result = await citySetBlipPrice(id, price);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
