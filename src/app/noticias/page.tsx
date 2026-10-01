import { news } from "@/lib/news";

export default function NoticiasPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Notícias</h1>
      {news.map((item) => (
        <article key={item.id} className="rounded-2xl border border-yellow-400/30 bg-black p-5">
          <p className="text-xs font-bold text-yellow-400">{item.date}</p>
          <h2 className="mt-1 text-xl font-bold">{item.title}</h2>
          <p className="mt-2 text-white/75">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
