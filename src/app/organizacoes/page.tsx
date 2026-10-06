import { OrgBrowser } from "@/components/OrgBrowser";

export default function OrganizacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">Cada organização custa R$ 299,99. A venda é única e o cargo de dono vale até o final da season. Clique no card ou em Ver detalhes para ver o que a organização faz, os cargos e os comandos.</p>
      </div>
      <OrgBrowser />
    </div>
  );
}
