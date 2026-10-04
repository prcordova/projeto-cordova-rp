"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DISCORD_INVITE, FIVEM_CONNECT } from "@/lib/connect";
import { useCart } from "@/store/cart";

type Account = { name: string; avatar: string | null; admin: boolean };

export function Header() {
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const setOpen = useCart((state) => state.setOpen);
  const [account, setAccount] = useState<Account | null>(null);

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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-wide text-yellow-400">CORDOVA RP</Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <Link href="/">Início</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/ranking">Ranking</Link>
          <Link href="/organizacoes">Organizações</Link>
          <Link href="/noticias">Notícias</Link>
          {account?.admin ? <Link href="/admin" className="text-yellow-400">Painel</Link> : null}
          <span className="flex items-center gap-2">
            <a href={FIVEM_CONNECT} className="rounded-xl bg-yellow-400 px-3 py-2 text-black">Conectar</a>
            <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="rounded-xl border border-yellow-400 px-3 py-2 text-yellow-400">Discord</a>
          </span>
          <button type="button" className="relative rounded-xl border border-yellow-400/50 p-2" aria-label="Abrir carrinho" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-400 px-1 text-xs font-bold text-black">{count}</span>
          </button>
          <Link href={account ? "/conta" : "/entrar"} className="flex items-center gap-2 text-yellow-400">
            {account ? (
              <>
                {account.avatar ? (
                  <img src={account.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-xs font-bold text-black">{account.name.slice(0, 1).toUpperCase()}</span>
                )}
                <span className="max-w-32 truncate">{account.name}</span>
              </>
            ) : "Entrar"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
