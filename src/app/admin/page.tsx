import { AdminPanel } from "@/components/AdminPanel";
import { readSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await readSession();
  if (!user) {
    return <p>Entre com o Discord para abrir o painel. <Link href="/api/auth/discord" className="text-yellow-400">Entrar com Discord</Link></p>;
  }
  if (!user.admin) {
    return (
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-extrabold">Painel</h1>
        <p className="text-white/75">Esta conta não administra a loja. O acesso sai de DISCORD_ADMIN_IDS na Vercel, comparado com o Discord usado no login.</p>
        {user.discordId ? <p className="text-sm text-yellow-400">Discord desta conta: {user.discordId}</p> : <p className="text-sm text-white/70">Esta sessão não tem Discord vinculado. Entre de novo por Entrar com Discord.</p>}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold">Painel da loja</h1>
        <p className="max-w-3xl text-white/70">Os produtos aparecem como na loja. Os três pontos abrem editar ou excluir. A imagem pode ser um link ou um arquivo enviado para a pasta pública.</p>
      </div>
      <AdminPanel />
    </div>
  );
}
