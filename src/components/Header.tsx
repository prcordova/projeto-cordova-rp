"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export function Header() {
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((data) => {
      setName(data.user?.name || null);
    }).catch(() => setName(null));
  }, []);

  return (
    <header className="border-b border-yellow-400/30 bg-black/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-wide text-yellow-400">CORDOVA RP</Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <Link href="/">Início</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/noticias">Notícias</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/suporte">Suporte</Link>
          <Link href="/carrinho">Carrinho ({count})</Link>
          <Link href={name ? "/conta" : "/entrar"} className="text-yellow-400">{name || "Entrar"}</Link>
        </nav>
      </div>
    </header>
  );
}
