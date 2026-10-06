import { OrgBrowser } from "@/components/OrgBrowser";
import { loadRankings } from "@/lib/rankings";

export const dynamic = "force-dynamic";

export default async function OrganizacoesPage() {
  const payload = await loadRankings();
  const factions = payload?.factions || [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">As organizações do /orgs já aparecem aqui. Quem está no jogo como dono, líder, chefe ou diretor vira o proprietário e a venda fecha. Sem esse cargo, o card continua à venda. Blips continuam sendo cadastrados no painel.</p>
      </div>
      {factions.length ? null : <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">A cidade não devolveu a lista de organizações. Os blips cadastrados no painel continuam abaixo.</p>}
      <OrgBrowser factions={factions} />
    </div>
  );
}
