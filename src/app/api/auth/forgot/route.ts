import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/payments";
import { newToken } from "@/lib/tokens";
import { emailSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = emailSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Informe um e-mail válido." }, { status: 400 });
  const message = "Se a conta existir, enviamos o link para criar uma nova senha.";
  try {
    const db = await getDb();
    const email = parsed.data.email.toLowerCase();
    const user = await db.collection("users").findOne({ email });
    if (user && siteUrl()) {
      const { token, hash } = newToken();
      await db.collection("users").updateOne({ _id: user._id }, {
        $set: { resetTokenHash: hash, resetExpires: new Date(Date.now() + 60 * 60 * 1000) }
      });
      const link = `${siteUrl()}/redefinir?token=${token}`;
      await sendMail(email, "Nova senha — Cordova RP", `<p>Crie uma nova senha:</p><p><a href="${link}">${link}</a></p>`);
    }
    return NextResponse.json({ ok: true, message });
  } catch {
    return NextResponse.json({ ok: true, message });
  }
}
