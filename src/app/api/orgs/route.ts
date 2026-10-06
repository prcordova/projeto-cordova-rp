import { NextResponse } from "next/server";
import { loadOrgs, loadRankings } from "@/lib/rankings";

export const dynamic = "force-dynamic";

export async function GET() {
  const direct = await loadOrgs();
  if (direct && direct.length) return NextResponse.json({ ok: true, orgs: direct });
  const payload = await loadRankings();
  const orgs = payload?.factions || [];
  if (orgs.length) return NextResponse.json({ ok: true, orgs });
  if (direct) return NextResponse.json({ ok: true, orgs: direct });
  return NextResponse.json({ ok: false, orgs: [] });
}
