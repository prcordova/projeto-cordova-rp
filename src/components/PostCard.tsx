import type { ReactNode } from "react";
import type { FeedPost } from "@/lib/news";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export function PostCard({ post, menu }: { post: FeedPost; menu?: ReactNode }) {
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
      {post.image ? <img src={post.image} alt="" className="max-h-80 w-full object-cover" /> : null}
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-bold text-yellow-400">{formatDate(post.createdAt)} · {post.authorName}</p>
          {menu}
        </div>
        <h2 className="break-words text-xl font-extrabold [overflow-wrap:anywhere] sm:text-2xl">{post.title}</h2>
        <div className="max-h-72 overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-white/80 [overflow-wrap:anywhere] sm:text-base">
          {post.body}
        </div>
        {post.links.length ? (
          <ul className="flex flex-wrap gap-2">
            {post.links.map((link) => (
              <li key={`${link.href}-${link.label}`} className="max-w-full">
                <a href={link.href} target="_blank" rel="noreferrer" className="block max-w-full truncate rounded-lg border border-yellow-400/40 px-3 py-1.5 text-sm font-bold text-yellow-400">{link.label}</a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
