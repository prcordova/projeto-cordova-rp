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
  if (!code || !state || state !== saved) return NextResponse.redirect(`${base}/entrar`);
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
  if (!token.access_token) return NextResponse.redirect(`${base}/entrar`);
  const profileResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const profile = await profileResponse.json();
  const email = String(profile.email || "").toLowerCase();
  if (!email || !profile.verified) return NextResponse.redirect(`${base}/entrar`);
  const db = await getDb();
  const name = String(profile.global_name || profile.username || "Cidadão");
  const avatar = discordAvatar(profile);
  let user = await db.collection("users").findOne({ $or: [{ discordId: String(profile.id) }, { email }] });
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
  return NextResponse.redirect(`${base}/conta`);
}
