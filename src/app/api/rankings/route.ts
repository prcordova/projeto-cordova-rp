import { NextResponse } from "next/server";
import { loadRankings } from "@/lib/rankings";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await loadRankings();
  return NextResponse.json({ payload });
}
