import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setSession } from "@/lib/session";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "E-mail ou senha inválidos." }, { status: 400 });
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: parsed.data.email.toLowerCase() });
    const hash = typeof user?.passwordHash === "string" ? user.passwordHash : "";
    if (!user || !hash || !(await bcrypt.compare(parsed.data.password, hash))) {
      return NextResponse.json({ ok: false, message: "E-mail ou senha inválidos." }, { status: 401 });
    }
    await setSession(String(user._id));
    return NextResponse.json({ ok: true, message: "Login feito." });
  } catch {
    return NextResponse.json({ ok: false, message: "Banco de dados ainda não configurado." }, { status: 500 });
  }
}
