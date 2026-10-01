import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { tokenSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = tokenSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Link inválido." }, { status: 400 });
  try {
    const db = await getDb();
    const result = await db.collection("users").updateOne({
      verifyTokenHash: hashToken(parsed.data.token),
      verifyExpires: { $gt: new Date() }
    }, {
      $set: { emailVerified: true },
      $unset: { verifyTokenHash: "", verifyExpires: "" }
    });
    if (!result.matchedCount) return NextResponse.json({ ok: false, message: "Link expirado ou já usado." }, { status: 400 });
    return NextResponse.json({ ok: true, message: "E-mail confirmado. Já pode comprar." });
  } catch {
    return NextResponse.json({ ok: false, message: "Banco de dados ainda não configurado." }, { status: 500 });
  }
}
