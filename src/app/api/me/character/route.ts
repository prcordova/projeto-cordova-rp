import { NextResponse } from "next/server";
import { cityIdentity } from "@/lib/city";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await readSession();
  if (!user?.discordId) return NextResponse.json({ ok: true, name: null });
  const found = await cityIdentity({ discord: user.discordId });
  if (found.state !== "ok") return NextResponse.json({ ok: true, name: null });
  return NextResponse.json({ ok: true, name: found.identity.name, userId: found.identity.userId });
}
