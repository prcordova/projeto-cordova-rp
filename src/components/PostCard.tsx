import type { ReactNode } from "react";
import type { FeedPost } from "@/lib/news";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export function PostCard({ post, menu }: { post: FeedPost; menu?: ReactNode }) {
  return (
    <article className="flex h-[28rem] min-w-0 flex-col overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
      <div className="relative h-40 shrink-0 bg-zinc-950">
        {post.image ? <img src={post.image} alt="" className="h-full w-full object-cover" /> : null}
        {menu ? <div className="absolute right-3 top-3">{menu}</div> : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        <p className="truncate text-xs font-bold text-yellow-400">{formatDate(post.createdAt)} · {post.authorName}</p>
        <h2 className="line-clamp-2 break-words text-lg font-extrabold [overflow-wrap:anywhere]">{post.title}</h2>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-sm leading-snug text-white/75 [overflow-wrap:anywhere]">
          {post.body}
        </div>
        {post.links.length ? (
          <ul className="flex max-h-16 flex-wrap gap-2 overflow-x-hidden overflow-y-auto">
            {post.links.map((link) => (
              <li key={`${link.href}-${link.label}`} className="max-w-full">
                <a href={link.href} target="_blank" rel="noreferrer" className="block max-w-full truncate rounded-lg border border-yellow-400/40 px-3 py-1 text-sm font-bold text-yellow-400">{link.label}</a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
