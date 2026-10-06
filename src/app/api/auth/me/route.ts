import { NextResponse } from "next/server";
import { can } from "@/lib/roles";
import { readSession } from "@/lib/session";

export async function GET() {
  const user = await readSession();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      name: user.name,
      avatar: user.avatar,
      admin: user.admin,
      posts: can(user, "posts")
    }
  });
}
