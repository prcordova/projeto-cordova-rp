import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/noticias", label: "Notícias" },
  { href: "/loja", label: "Loja" },
  { href: "/organizacoes", label: "Organizações" },
  { href: "/ranking", label: "Ranking" },
  { href: "/sobre", label: "Sobre" },
  { href: "/suporte", label: "Suporte" },
  { href: "/carrinho", label: "Carrinho" }
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-yellow-400/30 bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm">
        <strong className="text-yellow-400">Cordova RP</strong>
        <nav className="flex flex-wrap gap-4">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          <a href="https://discord.com/invite/HVPkjSCcWZ" target="_blank" rel="noreferrer">Discord</a>
          <a href="https://instagram.com/cidadecordova.rp" target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </div>
    </footer>
  );
}
