import Link from "next/link";
import { DISCORD_INVITE, FIVEM_CONNECT, SERVER_IP } from "@/lib/connect";

const cards = [
  { href: "/loja", title: "Loja", description: "VIPs, CRP, armas e mansões da vipshop. O pagamento no site entrega no passaporte.", image: "/imagens/loja.png" },
  { href: "/organizacoes", title: "Organizações", description: "Ranking das facções, o mesmo caixa que aparece no menu ESC.", image: "/imagens/organizacoes.png" },
  { href: "/ranking", title: "Ranking", description: "Ricos, online, drift, PvP e corridas, como no jogo.", image: "/imagens/ranking.png" },
  { href: "/noticias", title: "Recompensa diária", description: "Entre todo dia e resgate a recompensa dentro do jogo.", image: "/imagens/recompensa.png" },
  { href: "/sobre", title: "Mapa", description: "Conecte na cidade e abra o mapa com M, ou pelo menu ESC.", image: "/imagens/mapa.png" },
  { href: "/suporte", title: "Suporte", description: "Dúvidas de conta e pagamento ficam no Discord. Chamados da cidade abrem no F5.", image: "/imagens/configuracoes.png" },
  { href: "https://instagram.com/cidadecordova.rp", title: "Instagram", description: "Acompanhe a cidade fora do servidor.", image: "/imagens/instagram.png", external: true }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-yellow-400/40 bg-black p-6 sm:p-10">
        <p className="text-sm font-bold tracking-widest text-yellow-400">CIDADE CORDOVA RP</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">Uma cidade de roleplay, com economia, facções e vida própria.</h1>
        <p className="mt-5 max-w-3xl text-lg text-white/75">
          Cordova RP roda no FiveM. A whitelist abre no Discord, a conexão entra direto no servidor e a loja deste site cobra no Mercado Pago. Quando o pagamento confirma, o produto cai no passaporte informado no carrinho.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={FIVEM_CONNECT} className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">Conectar {SERVER_IP}</a>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="rounded-xl border border-yellow-400 px-4 py-3 font-bold text-yellow-400">Discord</a>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        {cards.map((card) => {
          const className = "group relative block overflow-hidden rounded-2xl border border-yellow-400/30 bg-black";
          const inner = (
            <>
              <img src={card.image} alt="" className="h-44 w-full object-cover lg:absolute lg:inset-0 lg:h-full" />
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black from-15% via-black/80 via-45% to-transparent lg:block" />
              <div className="relative p-5 lg:flex lg:min-h-48 lg:max-w-xl lg:flex-col lg:justify-center">
                <h2 className="text-2xl font-extrabold">{card.title}</h2>
                <p className="mt-2 text-white/75">{card.description}</p>
              </div>
            </>
          );
          return card.external
            ? <a key={card.title} href={card.href} target="_blank" rel="noreferrer" className={className}>{inner}</a>
            : <Link key={card.title} href={card.href} className={className}>{inner}</Link>;
        })}
      </section>
    </div>
  );
}
