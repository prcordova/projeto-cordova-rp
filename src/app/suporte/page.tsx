import { DISCORD_INVITE, FIVEM_CONNECT, FIVEM_JOIN } from "@/lib/connect";

export default function SuportePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Suporte</h1>
      <p className="max-w-2xl text-white/75">Dúvidas de conta, pagamento e whitelist ficam no Discord. Dentro da cidade, os chamados abrem no F5.</p>
      <div className="flex flex-wrap items-center gap-3">
        <a href={FIVEM_CONNECT} className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">Conectar {FIVEM_JOIN}</a>
        <a href={DISCORD_INVITE} className="rounded-xl border border-yellow-400 px-4 py-3 font-bold text-yellow-400" target="_blank" rel="noreferrer">Discord</a>
      </div>
    </div>
  );
}
