import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

export async function GET() {
  const user = await readSession();
  return NextResponse.json({ user });
}
