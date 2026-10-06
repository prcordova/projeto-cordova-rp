import { OrgBrowser } from "@/components/OrgBrowser";

export default function OrganizacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">A venda é única e o cargo de dono vale até o final da season. O preço de cada organização é o do card. Clique no card ou em Ver detalhes para ver o que ela faz, onde fica, os cargos e o que vem na compra.</p>
      </div>
      <OrgBrowser />
    </div>
  );
}
