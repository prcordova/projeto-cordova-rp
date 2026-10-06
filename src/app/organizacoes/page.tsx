import Link from "next/link";
import { OrgBrowser } from "@/components/OrgBrowser";

export default function OrganizacoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Organizações</h1>
        <p className="max-w-3xl text-white/70">Facções e blips da cidade, no mesmo card da loja. Cada um mostra a localização, se está à venda em CRP, se já tem dono ou se está ocupado. O caixa das facções continua no <Link href="/ranking" className="text-yellow-400">ranking</Link>.</p>
      </div>
      <OrgBrowser />
    </div>
  );
}
