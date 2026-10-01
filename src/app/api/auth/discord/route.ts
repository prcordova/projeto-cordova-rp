import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { siteUrl } from "@/lib/payments";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const base = siteUrl();
  if (!clientId || !base) {
    return NextResponse.json({ ok: false, message: "Login do Discord ainda não configurado." }, { status: 500 });
  }
  const state = randomBytes(16).toString("hex");
  const jar = await cookies();
  jar.set("discord_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600
  });
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "identify email",
    state,
    redirect_uri: `${base}/api/auth/discord/callback`
  });
  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}
