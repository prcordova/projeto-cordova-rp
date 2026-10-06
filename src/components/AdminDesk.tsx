"use client";

import { useState } from "react";
import { AdminPanel } from "@/components/AdminPanel";
import { NewsPanel } from "@/components/NewsPanel";

export function AdminDesk({ products, posts }: { products: boolean; posts: boolean }) {
  const [tab, setTab] = useState(products ? "loja" : "noticias");
  const button = (id: "loja" | "noticias", label: string) => (
    <button
      type="button"
      className={`rounded-xl border px-4 py-2 text-sm font-bold ${tab === id ? "border-yellow-400 bg-yellow-400 text-black" : "border-yellow-400/40 text-white"}`}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {products ? button("loja", "Loja") : null}
        {posts ? button("noticias", "Notícias") : null}
      </div>
      {tab === "loja" && products ? (
        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold">Painel da loja</h1>
            <p className="max-w-3xl text-white/70">Os produtos aparecem como na loja. Nome, descrição e benefícios têm limite para caber no card.</p>
          </div>
          <AdminPanel />
        </section>
      ) : null}
      {tab === "noticias" && posts ? (
        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold">Notícias</h1>
            <p className="max-w-3xl text-white/70">O botão de criar fica aqui em cima. O feed é uma coluna, um post por vez. Só o autor edita o próprio post.</p>
          </div>
          <NewsPanel />
        </section>
      ) : null}
    </div>
  );
}
