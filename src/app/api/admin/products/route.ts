import { NextResponse } from "next/server";
import { actionByValue } from "@/lib/actions";
import { getDb } from "@/lib/db";
import { loadDbProducts } from "@/lib/catalog-server";
import { readSession } from "@/lib/session";
import { productSchema } from "@/lib/validators";

async function admin() {
  const user = await readSession();
  if (!user?.admin) return null;
  return user;
}

function paramsReady(action: string, params: { spawn?: string; item?: string; amount?: number; days?: number | null; group?: string }) {
  const spec = actionByValue(action);
  if (!spec) return "Ação inválida.";
  if (spec.fields.includes("spawn") && !params.spawn) return "Informe o spawn do veículo.";
  if (spec.fields.includes("item") && !params.item) return "Informe o nome do item.";
  if (spec.fields.includes("amount") && !params.amount) return "Informe a quantidade.";
  if (spec.fields.includes("group") && !params.group) return "Informe o grupo ou a permissão.";
  if (spec.fields.includes("days") && action === "iniciaraluguelcarro" && !params.days) return "Informe os dias do aluguel.";
  return "";
}

export async function GET() {
  if (!await admin()) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  try {
    const items = await loadDbProducts();
    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível ler os produtos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await admin()) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message || "Dados do produto inválidos." }, { status: 400 });
  const missing = paramsReady(parsed.data.action, parsed.data.actionParams);
  if (missing) return NextResponse.json({ ok: false, message: missing }, { status: 400 });
  try {
    const db = await getDb();
    const now = new Date();
    await db.collection("products").updateOne(
      { id: parsed.data.id },
      {
        $set: { ...parsed.data, active: true, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
    return NextResponse.json({ ok: true, message: "Produto salvo. A loja do site e a vipshop passam a usar este cadastro." });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível salvar o produto." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!await admin()) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ ok: false, message: "Produto ausente." }, { status: 400 });
  try {
    const db = await getDb();
    await db.collection("products").updateOne({ id }, { $set: { active: false, updatedAt: new Date() } });
    return NextResponse.json({ ok: true, message: "Produto retirado. O config padrão volta a valer para este item, se ele existir lá." });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível retirar o produto." }, { status: 500 });
  }
}
