import { SignJWT, jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "cordova_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) throw new Error("AUTH_SECRET ausente");
  return new TextEncoder().encode(value);
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  };
}

export async function setSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, cookieOptions(60 * 60 * 24 * 14));
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", cookieOptions(0));
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.sub) });
    if (!user || typeof user.email !== "string") return null;
    return {
      id: String(user._id),
      email: user.email,
      name: String(user.name || "Cidadão"),
      avatar: typeof user.avatar === "string" ? user.avatar : null,
      emailVerified: Boolean(user.emailVerified)
    };
  } catch {
    return null;
  }
}
