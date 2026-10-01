import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSession } from "@/lib/session";
import { hashToken } from "@/lib/tokens";
import { resetSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = resetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Link ou senha inválidos." }, { status: 400 });
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({
      resetTokenHash: hashToken(parsed.data.token),
      resetExpires: { $gt: new Date() }
    });
    if (!user) return NextResponse.json({ ok: false, message: "Link expirado ou já usado." }, { status: 400 });
    await db.collection("users").updateOne({ _id: user._id }, {
      $set: { passwordHash: await bcrypt.hash(parsed.data.password, 10), emailVerified: true },
      $unset: { resetTokenHash: "", resetExpires: "" }
    });
    await setSession(String(user._id));
    return NextResponse.json({ ok: true, message: "Senha atualizada." });
  } catch {
    return NextResponse.json({ ok: false, message: "Banco de dados ainda não configurado." }, { status: 500 });
  }
}
