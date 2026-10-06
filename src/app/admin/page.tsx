import { AdminDesk } from "@/components/AdminDesk";
import { can } from "@/lib/roles";
import { readSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await readSession();
  if (!user) {
    return <p>Entre com o Discord para abrir o painel. <Link href="/api/auth/discord" className="text-yellow-400">Entrar com Discord</Link></p>;
  }
  const products = can(user, "products");
  const posts = can(user, "posts");
  if (!products && !posts) {
    return (
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-extrabold">Painel</h1>
        <p className="text-white/75">Esta conta não publica na loja nem nas notícias. O acesso de admin sai de DISCORD_ADMIN_IDS na Vercel.</p>
        {user.discordId ? <p className="text-sm text-yellow-400">Discord desta conta: {user.discordId}</p> : <p className="text-sm text-white/70">Esta sessão não tem Discord vinculado. Entre de novo por Entrar com Discord.</p>}
      </div>
    );
  }
  return <AdminDesk products={products} posts={posts} />;
}
