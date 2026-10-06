"use client";

import { useEffect, useState } from "react";

type BlipType = { id: string; label: string; price: number };

export function BlipPrices() {
  const [types, setTypes] = useState<BlipType[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("Carregando preços da cidade.");

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/blips")
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        if (!data.ok || !Array.isArray(data.types)) {
          setMessage(data.message || "A cidade não respondeu.");
          return;
        }
        setTypes(data.types);
        setPrices(Object.fromEntries(data.types.map((type: BlipType) => [type.id, String(type.price)])));
        setMessage("O valor salvo aqui é o mesmo do site e da loja do jogo.");
      })
      .catch(() => {
        if (alive) setMessage("A cidade não respondeu.");
      });
    return () => {
      alive = false;
    };
  }, []);

  async function save(id: string) {
    setMessage("Salvando...");
    const response = await fetch("/api/admin/blips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price: Number(prices[id]) })
    });
    const data = await response.json().catch(() => ({}));
    setMessage(data.message || "Não foi possível salvar o preço.");
  }

  return (
    <div className="space-y-4">
      <p className="text-white/70">{message}</p>
      <div className="grid gap-3">
        {types.map((type) => (
          <div key={type.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-yellow-400/30 bg-black p-4">
            <div className="min-w-40 flex-1">
              <strong>{type.label}</strong>
              <p className="text-sm text-white/50">{type.id}</p>
            </div>
            <label className="text-sm text-white/70">
              R$
              <input
                className="ml-2 w-28 rounded-lg border border-yellow-400/40 bg-black px-3 py-2 text-white"
                inputMode="decimal"
                value={prices[type.id] || ""}
                onChange={(event) => setPrices((current) => ({ ...current, [type.id]: event.target.value }))}
              />
            </label>
            <button type="button" className="rounded-xl bg-yellow-400 px-4 py-2 font-bold text-black" onClick={() => save(type.id)}>
              Salvar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
