import type { Metadata } from "next";
import Link from "next/link";
import { storeTermSections } from "@/lib/store-terms";

export const metadata: Metadata = {
  title: "Termos da loja · Cordova RP",
  description: "Regras de compra da loja Cordova RP: sem reembolso, conferência de ID e prazos dos produtos."
};

export default function TermosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Termos da loja</h1>
        <p className="max-w-3xl text-white/70">Estas regras valem para o carrinho deste site e para a vipshop dentro da cidade. O pagamento só abre depois do aceite.</p>
      </div>
      <div className="space-y-4">
        {storeTermSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-yellow-400/30 bg-black p-5">
            <h2 className="text-xl font-bold text-yellow-400">{section.title}</h2>
            <p className="mt-2 text-white/75">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="text-sm text-white/60">
        Dúvida sobre um pagamento já feito fica no <Link href="/suporte" className="font-semibold text-yellow-400">suporte</Link>. A conferência do ID acontece antes de abrir o Mercado Pago.
      </p>
    </div>
  );
}
