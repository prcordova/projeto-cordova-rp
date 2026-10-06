import { NextResponse } from "next/server";
import { loadPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await loadPosts();
  return NextResponse.json({ posts });
}
