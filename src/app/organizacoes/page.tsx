import { OrgBrowser } from "@/components/OrgBrowser";

export default function OrganizacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">As organizações do /orgs já aparecem aqui. Quem está no jogo como dono, líder, chefe ou diretor vira o proprietário e a venda fecha. Sem esse cargo, o card continua à venda. Blips continuam sendo cadastrados no painel.</p>
      </div>
      <OrgBrowser />
    </div>
  );
}
