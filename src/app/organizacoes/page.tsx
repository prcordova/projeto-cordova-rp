import Link from "next/link";
import { RankBoards } from "@/components/RankBoards";
import { loadRankings } from "@/lib/rankings";

export const dynamic = "force-dynamic";

export default async function OrganizacoesPage() {
  const payload = await loadRankings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">O ranking das facções é o mesmo do menu ESC: o caixa de cada organização, do maior para o menor. O painel da sua facção continua abrindo dentro da cidade.</p>
      </div>
      <RankBoards payload={payload} only="factions" />
      <p className="text-sm text-white/60">Os outros quadros estão na página de <Link href="/ranking" className="text-yellow-400">ranking</Link>.</p>
    </div>
  );
}
