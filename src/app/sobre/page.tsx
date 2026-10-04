import { DISCORD_INVITE, FIVEM_CONNECT, FIVEM_JOIN } from "@/lib/connect";

export default function SobrePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-yellow-400/40 bg-black p-6">
        <p className="text-sm font-bold tracking-widest text-yellow-400">CIDADE CORDOVA RP</p>
        <h1 className="mt-2 text-3xl font-extrabold">Sobre a cidade</h1>
        <p className="mt-3 max-w-3xl text-white/75">
          Cordova RP é uma cidade de roleplay no FiveM, com economia, facções, empregos e loja. A entrada é por {FIVEM_JOIN}. A whitelist é feita no Discord da cidade.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href={FIVEM_CONNECT} className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">Conectar {FIVEM_JOIN}</a>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="rounded-xl border border-yellow-400 px-4 py-3 font-bold text-yellow-400">Discord</a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-yellow-400/30 bg-black p-5">
          <h2 className="text-xl font-bold">Como entrar</h2>
          <p className="mt-2 text-white/75">Instale o FiveM, entre no Discord e peça a whitelist. O botão Conectar abre o jogo no servidor. Se o navegador não abrir o FiveM, aperte F8 e use <strong className="text-yellow-400">connect dq877j</strong>.</p>
        </article>
        <article className="rounded-2xl border border-yellow-400/30 bg-black p-5">
          <h2 className="text-xl font-bold">Dentro do jogo</h2>
          <p className="mt-2 text-white/75">O menu ESC reúne loja, organizações, ranking, recompensa diária e mapa. O mapa também abre com M. Chamados de suporte abrem no F5.</p>
        </article>
        <article id="organizacoes" className="overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
          <img src="/imagens/organizacoes.png" alt="" className="h-40 w-full object-cover" />
          <div className="p-5">
            <h2 className="text-xl font-bold">Organizações</h2>
            <p className="mt-2 text-white/75">Facções, polícia, hospital e mecânica usam o painel de organização, aberto pelo menu ESC.</p>
          </div>
        </article>
        <article className="overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
          <img src="/imagens/loja.png" alt="" className="h-40 w-full object-cover" />
          <div className="p-5">
            <h2 className="text-xl font-bold">Economia e loja</h2>
            <p className="mt-2 text-white/75">A loja deste site lista o catálogo da vipshop. O que tem preço em reais passa pelo Mercado Pago e cai no ID do carrinho. Veículos, mansões e armas em CRP continuam na loja de dentro da cidade. Sem produto cadastrado no banco, vale o config padrão.</p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-yellow-400/30 bg-black p-5">
        <h2 className="text-xl font-bold">Comunidade</h2>
        <p className="mt-2 text-white/75">Regras, whitelist e avisos ficam no Discord. A cidade também está no Instagram e no YouTube.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <a className="rounded-xl bg-yellow-400 px-4 py-3 text-black" href="https://discord.com/invite/HVPkjSCcWZ" target="_blank" rel="noreferrer">Discord</a>
          <a className="rounded-xl border border-yellow-400 px-4 py-3" href="https://instagram.com/cidadecordova.rp" target="_blank" rel="noreferrer">Instagram</a>
          <a className="rounded-xl border border-yellow-400 px-4 py-3" href="https://youtube.com/@CordovaRP" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </section>
    </div>
  );
}
