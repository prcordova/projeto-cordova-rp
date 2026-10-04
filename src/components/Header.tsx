"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

type Account = { name: string; avatar: string | null; admin: boolean };

const links = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/ranking", label: "Ranking" },
  { href: "/organizacoes", label: "Organizações" },
  { href: "/noticias", label: "Notícias" }
];

export function Header() {
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const setOpen = useCart((state) => state.setOpen);
  const [account, setAccount] = useState<Account | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((data) => {
      if (!data.user?.name) {
        setAccount(null);
        return;
      }
      setAccount({ name: data.user.name, avatar: data.user.avatar || null, admin: Boolean(data.user.admin) });
    }).catch(() => setAccount(null));
  }, []);

  return (
    <header className="border-b border-yellow-400/30 bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="mr-auto text-lg font-extrabold tracking-wide text-yellow-400" onClick={() => setMenu(false)}>CORDOVA RP</Link>
        <nav className="hidden items-center gap-4 text-sm font-semibold md:flex">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          {account?.admin ? <Link href="/admin" className="text-yellow-400">Painel</Link> : null}
        </nav>
        <button type="button" className="relative rounded-xl border border-yellow-400/50 p-2" aria-label="Abrir carrinho" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6 5 3H2" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-400 px-1 text-xs font-bold text-black">{count}</span>
        </button>
        <Link href={account ? "/conta" : "/entrar"} className="flex items-center gap-2 text-sm font-semibold text-yellow-400" onClick={() => setMenu(false)}>
          {account ? (
            <>
              {account.avatar ? (
                <img src={account.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-xs font-bold text-black">{account.name.slice(0, 1).toUpperCase()}</span>
              )}
              <span className="hidden max-w-32 truncate sm:inline">{account.name}</span>
            </>
          ) : "Entrar"}
        </Link>
        <button type="button" className="rounded-xl border border-yellow-400/50 px-3 py-2 text-sm font-semibold md:hidden" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
          {menu ? "Fechar" : "Menu"}
        </button>
      </div>
      {menu ? (
        <nav className="flex flex-col gap-1 border-t border-yellow-400/20 px-4 py-3 text-sm font-semibold md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-2 py-2" onClick={() => setMenu(false)}>{link.label}</Link>
          ))}
          {account?.admin ? <Link href="/admin" className="rounded-lg px-2 py-2 text-yellow-400" onClick={() => setMenu(false)}>Painel</Link> : null}
        </nav>
      ) : null}
    </header>
  );
}
