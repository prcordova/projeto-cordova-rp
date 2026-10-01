import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/payments";
import { newToken } from "@/lib/tokens";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Preencha nome, e-mail e uma senha de 8 caracteres." }, { status: 400 });
  }
  try {
    const db = await getDb();
    const email = parsed.data.email.toLowerCase();
    const exists = await db.collection("users").findOne({ email });
    if (exists) return NextResponse.json({ ok: false, message: "Esse e-mail já está em uso." }, { status: 409 });
    const { token, hash } = newToken();
    await db.collection("users").insertOne({
      name: parsed.data.name,
      email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      emailVerified: false,
      verifyTokenHash: hash,
      verifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date()
    });
    const link = `${siteUrl()}/verificar?token=${token}`;
    const sent = siteUrl() ? await sendMail(email, "Confirme seu e-mail — Cordova RP", `<p>Confirme sua conta da Cordova RP:</p><p><a href="${link}">${link}</a></p>`) : false;
    return NextResponse.json({
      ok: true,
      message: sent ? "Enviamos o link de confirmação para o seu e-mail." : "Conta criada. Configure o Resend e o endereço do site para enviar a confirmação."
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Banco de dados ainda não configurado." }, { status: 500 });
  }
}
