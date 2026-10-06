import { NewsFeed } from "@/components/NewsFeed";
import { defaultPosts } from "@/lib/news";

export default function NoticiasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Notícias</h1>
        <p className="max-w-3xl text-white/70">Avisos da cidade. O texto longo rola dentro do card.</p>
      </div>
      <NewsFeed initial={defaultPosts} />
    </div>
  );
}
