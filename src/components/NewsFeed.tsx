"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { FeedPost } from "@/lib/news";

export function NewsFeed({ initial }: { initial: FeedPost[] }) {
  const [posts, setPosts] = useState(initial);

  useEffect(() => {
    let cancel = false;
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel && Array.isArray(data.posts)) setPosts(data.posts);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  if (!posts.length) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhuma notícia publicada.</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
