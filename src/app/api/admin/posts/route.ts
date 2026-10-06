import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { defaultPosts, type FeedPost } from "@/lib/news";
import { loadPosts } from "@/lib/posts";
import { can } from "@/lib/roles";
import { readSession } from "@/lib/session";
import { postSchema } from "@/lib/validators";

async function author() {
  const user = await readSession();
  if (!can(user, "posts")) return null;
  return user;
}

function withMine(posts: FeedPost[], userId: string) {
  const defaults = new Set(defaultPosts.map((item) => item.id));
  return posts.map((post) => ({
    ...post,
    mine: post.source === "db" ? post.authorId === userId : defaults.has(post.id)
  }));
}

export async function GET() {
  const user = await author();
  if (!user) return NextResponse.json({ ok: false, message: "Sem acesso para publicar." }, { status: 403 });
  try {
    const posts = await loadPosts();
    return NextResponse.json({ ok: true, posts: withMine(posts, user.id) });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível ler as notícias." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await author();
  if (!user) return NextResponse.json({ ok: false, message: "Sem acesso para publicar." }, { status: 403 });
  const parsed = postSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message || "Dados da notícia inválidos." }, { status: 400 });
  try {
    const db = await getDb();
    const posts = db.collection("posts");
    const existing = await posts.findOne({ id: parsed.data.id });
    if (existing && existing.authorId !== user.id) {
      return NextResponse.json({ ok: false, message: "Só o autor deste post pode editá-lo." }, { status: 403 });
    }
    const now = new Date();
    await posts.updateOne(
      { id: parsed.data.id },
      {
        $set: {
          ...parsed.data,
          active: true,
          authorName: user.name,
          updatedAt: now
        },
        $setOnInsert: { authorId: user.id, createdAt: existing?.createdAt || now }
      },
      { upsert: true }
    );
    return NextResponse.json({ ok: true, message: "Notícia publicada." });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível salvar a notícia." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await author();
  if (!user) return NextResponse.json({ ok: false, message: "Sem acesso para publicar." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ ok: false, message: "Notícia ausente." }, { status: 400 });
  try {
    const db = await getDb();
    const posts = db.collection("posts");
    const existing = await posts.findOne({ id });
    if (existing && existing.authorId !== user.id) {
      return NextResponse.json({ ok: false, message: "Só o autor deste post pode retirá-lo." }, { status: 403 });
    }
    const now = new Date();
    await posts.updateOne(
      { id },
      {
        $set: { active: false, updatedAt: now },
        $setOnInsert: { authorId: user.id, authorName: user.name, title: id, body: "", image: "", links: [], createdAt: now }
      },
      { upsert: true }
    );
    return NextResponse.json({ ok: true, message: "Notícia retirada do feed." });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível retirar a notícia." }, { status: 500 });
  }
}
