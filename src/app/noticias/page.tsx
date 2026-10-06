import { PostCard } from "@/components/PostCard";
import { loadPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const posts = await loadPosts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Notícias</h1>
        <p className="max-w-3xl text-white/70">Avisos da cidade. O texto longo rola dentro do card.</p>
      </div>
      {posts.length ? (
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhuma notícia publicada.</p>
      )}
    </div>
  );
}
