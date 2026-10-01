import Link from "next/link";

const cards = [
  { href: "/loja", title: "Loja", description: "Adquira VIP e benefícios.", image: "/imagens/loja.png" },
  { href: "/sobre#organizacoes", title: "Organizações", description: "Facções e empresas da cidade.", image: "/imagens/organizacoes.png" },
  { href: "/noticias", title: "Ranking e avisos", description: "Notícias importantes da cidade.", image: "/imagens/ranking.png" },
  { href: "/noticias", title: "Recompensa diária", description: "Entre todo dia e resgate no jogo.", image: "/imagens/recompensa.png" },
  { href: "/sobre", title: "Mapa", description: "Conecte e abra o mapa com M.", image: "/imagens/mapa.png" },
  { href: "/suporte", title: "Suporte", description: "Dúvidas e chamados.", image: "/imagens/configuracoes.png" },
  { href: "https://discord.com/invite/HVPkjSCcWZ", title: "Discord", description: "Entre na comunidade.", image: "/imagens/discord.png", external: true },
  { href: "https://instagram.com/cidadecordova.rp", title: "Instagram", description: "Siga a cidade.", image: "/imagens/instagram.png", external: true }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-yellow-400/40 bg-black p-6">
        <p className="text-sm font-bold tracking-widest text-yellow-400">CIDADE CORDOVA RP</p>
        <h1 className="mt-2 text-3xl font-extrabold">Roleplay, economia e facções.</h1>
        <p className="mt-3 max-w-2xl text-white/75">Abra o FiveM, aperte F8 e cole o comando abaixo. A whitelist fica no Discord.</p>
        <p className="mt-4 inline-block rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">connect 45.146.81.194</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const className = "block overflow-hidden rounded-2xl border border-yellow-400/30 bg-black";
          const inner = (
            <>
              <img src={card.image} alt="" className="h-36 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-bold">{card.title}</h2>
                <p className="text-sm text-white/70">{card.description}</p>
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
