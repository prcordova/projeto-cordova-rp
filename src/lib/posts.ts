import { getDb } from "./db";
import { defaultPosts, type FeedPost, type PostLink } from "./news";

function asLinks(value: unknown): PostLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { label?: unknown; href?: unknown };
    if (typeof row.label !== "string" || typeof row.href !== "string") return [];
    return [{ label: row.label, href: row.href }];
  });
}

function fromDb(row: Record<string, unknown>): FeedPost | null {
  const id = typeof row.id === "string" ? row.id : "";
  const title = typeof row.title === "string" ? row.title : "";
  if (!id || !title) return null;
  const created = row.createdAt instanceof Date ? row.createdAt.toISOString() : typeof row.createdAt === "string" ? row.createdAt : new Date().toISOString();
  return {
    id,
    title,
    image: typeof row.image === "string" ? row.image : "",
    body: typeof row.body === "string" ? row.body : "",
    links: asLinks(row.links),
    authorId: typeof row.authorId === "string" ? row.authorId : null,
    authorName: typeof row.authorName === "string" ? row.authorName : "Cordova RP",
    createdAt: created,
    source: "db"
  };
}

export async function loadPosts() {
  try {
    const db = await getDb();
    const rows = await db.collection("posts").find({}).toArray();
    const stored = rows.map((row) => ({ post: fromDb(row as Record<string, unknown>), active: (row as { active?: boolean }).active !== false }));
    const known = new Set(stored.flatMap((item) => item.post ? [item.post.id] : []));
    const visible = stored.flatMap((item) => item.active && item.post ? [item.post] : []);
    const defaults = defaultPosts.filter((item) => !known.has(item.id));
    return [...visible, ...defaults].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return defaultPosts;
  }
}
