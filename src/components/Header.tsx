"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";

type Account = { name: string; avatar: string | null; admin: boolean; posts: boolean };

const links = [
  { href: "/noticias", label: "Notícias" },
  { href: "/loja", label: "Loja" },
  { href: "/organizacoes", label: "Organizações" },
  { href: "/ranking", label: "Ranking" }
];

const itemClass = "block w-full rounded-lg px-3 py-2 text-left text-sm font-bold hover:bg-yellow-400 hover:text-black";

export function Header() {
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const setOpen = useCart((state) => state.setOpen);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountMenu, setAccountMenu] = useState(false);
  const accountRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((data) => {
      if (!data.user?.name) {
        setAccount(null);
        return;
      }
      setAccount({ name: data.user.name, avatar: data.user.avatar || null, admin: Boolean(data.user.admin), posts: Boolean(data.user.posts) });
    }).catch(() => setAccount(null));
  }, []);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!accountRoot.current?.contains(event.target as Node)) setAccountMenu(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  function logout() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/logout";
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-yellow-400/30 bg-black/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-wide text-yellow-400" aria-label="Início" onClick={() => setAccountMenu(false)}>CORDOVA RP</Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 text-sm font-semibold md:flex">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="ml-auto flex items-center gap-3">
        <button type="button" className="relative rounded-lg border border-yellow-400/50 p-1" aria-label="Abrir carrinho" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6 5 3H2" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-yellow-400 px-0.5 text-[10px] font-bold leading-none text-black">{count}</span>
        </button>
        <div ref={accountRoot} className="relative">
          {account ? (
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-yellow-400"
              aria-haspopup="menu"
              aria-expanded={accountMenu}
              aria-label="Abrir menu da conta"
              onClick={() => setAccountMenu((open) => !open)}
            >
              <span className="hidden max-w-32 truncate md:inline">{account.name}</span>
              {account.avatar ? (
                <img src={account.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-xs font-bold text-black">{account.name.slice(0, 1).toUpperCase()}</span>
              )}
            </button>
          ) : (
            <>
              <Link href="/entrar" className="hidden text-sm font-semibold text-yellow-400 md:inline">Entrar</Link>
              <button
                type="button"
                className="text-sm font-semibold text-yellow-400 md:hidden"
                aria-haspopup="menu"
                aria-expanded={accountMenu}
                aria-label="Abrir menu"
                onClick={() => setAccountMenu((open) => !open)}
              >
                Entrar
              </button>
            </>
          )}
          {accountMenu ? (
            <ul className="absolute right-0 z-40 mt-2 min-w-44 rounded-xl border border-yellow-400/50 bg-[#141414] p-1 shadow-xl" role="menu">
              {links.map((link) => (
                <li key={link.href} className="md:hidden">
                  <Link href={link.href} role="menuitem" className={itemClass} onClick={() => setAccountMenu(false)}>{link.label}</Link>
                </li>
              ))}
              {account ? (
                <>
                  <li className="mx-2 my-1 border-t border-yellow-400/30 md:hidden" role="separator" />
                  <li>
                    <Link href="/conta" role="menuitem" className={itemClass} onClick={() => setAccountMenu(false)}>Conta</Link>
                  </li>
                  {account.admin || account.posts ? (
                    <li>
                      <Link href="/admin" role="menuitem" className={itemClass} onClick={() => setAccountMenu(false)}>Painel</Link>
                    </li>
                  ) : null}
                  <li>
                    <button type="button" role="menuitem" className={itemClass} onClick={logout}>Sair</button>
                  </li>
                </>
              ) : (
                <li className="md:hidden">
                  <Link href="/entrar" role="menuitem" className={itemClass} onClick={() => setAccountMenu(false)}>Entrar</Link>
                </li>
              )}
            </ul>
          ) : null}
        </div>
        </div>
      </div>
    </header>
  );
}
