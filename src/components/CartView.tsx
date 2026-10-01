"use client";

import { useState } from "react";
import { formatBrl } from "@/lib/products";
import { useCart } from "@/store/cart";

export function CartView() {
  const lines = useCart((state) => state.lines);
  const remove = useCart((state) => state.remove);
  const clear = useCart((state) => state.clear);
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);

  async function pay() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId: Number(targetId),
        items: lines.map((line) => ({ id: line.id, qty: line.qty }))
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!data.ok) {
      setMessage(data.message || "Não foi possível abrir o pagamento.");
      return;
    }
    clear();
    window.location.href = data.url;
  }

  if (!lines.length) {
    return <p className="text-white/70">O carrinho está vazio.</p>;
  }

  return (
    <div className="space-y-4">
      {lines.map((line) => (
        <div key={line.id} className="flex items-center justify-between gap-4 rounded-xl border border-yellow-400/30 p-4">
          <div>
            <strong>{line.name}</strong>
            <p className="text-sm text-white/70">{line.qty} × {formatBrl(line.price)}</p>
          </div>
          <button type="button" className="text-sm text-yellow-400" onClick={() => remove(line.id)}>Remover</button>
        </div>
      ))}
      <p className="text-right text-xl font-bold text-yellow-400">{formatBrl(total)}</p>
      <label className="block text-sm">
        Passaporte de quem recebe
        <input
          className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-3"
          inputMode="numeric"
          value={targetId}
          onChange={(event) => setTargetId(event.target.value)}
        />
      </label>
      <button type="button" disabled={loading} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black disabled:opacity-60" onClick={pay}>
        {loading ? "Abrindo Mercado Pago..." : "Pagar"}
      </button>
      {message ? <p className="text-sm text-yellow-200">{message}</p> : null}
      <p className="text-sm text-white/60">O cartão e o PIX são preenchidos no Mercado Pago. A entrega no jogo acontece depois da confirmação.</p>
    </div>
  );
}
