import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { siteUrl } from "@/lib/payments";
import { setSession } from "@/lib/session";

function discordAvatar(profile: { id?: string; avatar?: string | null }) {
  const id = String(profile.id || "");
  if (profile.avatar) {
    const ext = profile.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${profile.avatar}.${ext}`;
  }
  const index = Number((BigInt(id || "0") >> BigInt(22)) % BigInt(6));
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export async function GET(request: Request) {
  const base = siteUrl() || "http://localhost:3000";
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const saved = jar.get("discord_state")?.value;
  jar.set("discord_state", "", { httpOnly: true, path: "/", maxAge: 0 });
  if (!code || !state || state !== saved) return fail(base, "O login expirou. Clique em Entrar com Discord de novo.");
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || "",
      client_secret: process.env.DISCORD_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: `${siteUrl()}/api/auth/discord/callback`
    })
  });
  const token = await tokenResponse.json();
  if (!token.access_token) return fail(base, "O Discord recusou o login. Confira DISCORD_CLIENT_ID e DISCORD_CLIENT_SECRET na Vercel.");
  const profileResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const profile = await profileResponse.json();
  const email = String(profile.email || "").toLowerCase();
  if (!email || !profile.verified) return fail(base, "Confirme o e-mail da sua conta Discord e tente de novo.");
  const name = String(profile.global_name || profile.username || "Cidadão");
  const avatar = discordAvatar(profile);
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ $or: [{ discordId: String(profile.id) }, { email }] });
    if (!user) {
      const inserted = await db.collection("users").insertOne({
        name,
        email,
        avatar,
        discordId: String(profile.id),
        emailVerified: true,
        createdAt: new Date()
      });
      await setSession(String(inserted.insertedId));
    } else {
      await db.collection("users").updateOne({ _id: user._id }, {
        $set: { discordId: String(profile.id), emailVerified: true, name, avatar }
      });
      await setSession(String(user._id));
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("discord callback", reason);
    if (reason.includes("MONGODB_URI")) return fail(base, "Banco não configurado: falta MONGODB_URI na Vercel.");
    if (reason.includes("AUTH_SECRET")) return fail(base, "Sessão não configurada: AUTH_SECRET falta ou tem menos de 16 caracteres.");
    return fail(base, "Não foi possível conectar ao banco. Libere o acesso da Vercel no MongoDB Atlas.");
  }
  return NextResponse.redirect(`${base}/conta`);
}

function fail(base: string, message: string) {
  return NextResponse.redirect(`${base}/entrar?aviso=${encodeURIComponent(message)}`);
}
