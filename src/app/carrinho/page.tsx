"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export default function CarrinhoPage() {
  const setOpen = useCart((state) => state.setOpen);
  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Carrinho</h1>
      <p className="max-w-2xl text-white/70">Os itens ficam no painel da direita. Informe o ID do jogador na cidade e finalize a compra para o Mercado Pago entregar no servidor.</p>
      <button type="button" className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black" onClick={() => setOpen(true)}>Abrir carrinho</button>
    </div>
  );
}
