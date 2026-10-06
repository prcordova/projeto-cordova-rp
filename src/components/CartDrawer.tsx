"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatBrl } from "@/lib/products";
import { storeTermPoints } from "@/lib/store-terms";
import { useCart } from "@/store/cart";

type PassportState =
  | { state: "empty" }
  | { state: "checking" }
  | { state: "found"; name: string }
  | { state: "missing"; message: string }
  | { state: "offline"; message: string };

async function lookupPassport(id: string): Promise<PassportState> {
  const response = await fetch(`/api/passport?id=${id}`);
  const data = await response.json().catch(() => ({}));
  if (data.exists && data.name) return { state: "found", name: String(data.name) };
  if (data.ok === false) return { state: "offline", message: String(data.message || "A cidade não respondeu.") };
  return { state: "missing", message: String(data.message || "Esse passaporte não existe na cidade.") };
}

export function CartDrawer() {
  const router = useRouter();
  const lines = useCart((state) => state.lines);
  const open = useCart((state) => state.open);
  const setOpen = useCart((state) => state.setOpen);
  const removeOne = useCart((state) => state.removeOne);
  const clear = useCart((state) => state.clear);
  const targetId = useCart((state) => state.targetId);
  const setTargetId = useCart((state) => state.setTargetId);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [passport, setPassport] = useState<PassportState>({ state: "empty" });
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);

  useEffect(() => {
    if (!/^\d+$/.test(targetId)) {
      setPassport({ state: "empty" });
      return;
    }
    const id = targetId;
    setPassport({ state: "checking" });
    const timer = window.setTimeout(() => {
      lookupPassport(id).then((found) => {
        if (useCart.getState().targetId === id) setPassport(found);
      }).catch(() => {
        if (useCart.getState().targetId === id) setPassport({ state: "offline", message: "A cidade não respondeu." });
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [targetId]);

  async function pay() {
    if (!lines.length) return;
    if (!/^\d+$/.test(targetId)) {
      setMessage("Informe o ID do jogador na cidade.");
      return;
    }
    if (!accepted) {
      setMessage("Aceite os termos da loja para finalizar a compra.");
      return;
    }
    setLoading(true);
    setMessage("");
    const holder = await lookupPassport(targetId).catch(() => ({ state: "offline" as const, message: "A cidade não respondeu." }));
    setPassport(holder);
    if (holder.state !== "found") {
      setLoading(false);
      setMessage(holder.state === "missing" || holder.state === "offline" ? holder.message : "Informe o ID do jogador na cidade.");
      return;
    }
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId: Number(targetId),
        acceptedTerms: true,
        items: lines.map((line) => ({ id: line.id, qty: line.qty }))
      })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (response.status === 401) {
      const text = data.message || "Entre na conta para comprar.";
      setOpen(false);
      router.push(`/entrar?aviso=${encodeURIComponent(text)}`);
      return;
    }
    if (!data.ok) {
      setMessage(data.message || "Não foi possível abrir o pagamento.");
      return;
    }
    clear();
    setOpen(false);
    window.location.href = data.url;
  }

  if (!open) return null;

  const passportText = passport.state === "checking"
    ? "Conferindo o passaporte na cidade..."
    : passport.state === "found"
      ? `Entrega para ${passport.name}.`
      : passport.state === "missing" || passport.state === "offline"
        ? passport.message
        : "Digite o passaporte e confira o nome antes de pagar.";

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-black/70" aria-label="Fechar carrinho" onClick={() => setOpen(false)} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-yellow-400/40 bg-[#0c0c0c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-yellow-400/30 px-4 py-4">
          <h2 className="text-lg font-extrabold">Carrinho</h2>
          <button type="button" className="rounded-lg border border-yellow-400/40 px-3 py-1 text-sm" onClick={() => setOpen(false)}>Fechar</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {lines.length ? lines.map((line) => (
            <div key={line.id} className="flex items-center gap-3 rounded-xl border border-yellow-400/30 bg-black p-3">
              <img src={line.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <strong className="block truncate">{line.name}</strong>
                <p className="text-sm text-white/70">{line.qty} × {formatBrl(line.price)}</p>
              </div>
              <button type="button" className="shrink-0 rounded-lg border border-yellow-400 px-3 py-2 text-sm font-semibold text-yellow-400" onClick={() => removeOne(line.id)}>
                Remover
              </button>
            </div>
          )) : <p className="text-sm text-white/70">Nenhum item escolhido.</p>}
        </div>
        <div className="space-y-3 border-t border-yellow-400/30 p-4">
          <p className="text-right text-xl font-bold text-yellow-400">{formatBrl(total)}</p>
          <label className="block text-sm font-semibold">
            ID do jogador na cidade
            <input
              className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-3 font-normal"
              inputMode="numeric"
              placeholder="Passaporte que recebe o produto"
              value={targetId}
              onChange={(event) => setTargetId(event.target.value.replace(/\D/g, ""))}
            />
          </label>
          <p className={`text-sm ${passport.state === "found" ? "text-emerald-300" : passport.state === "missing" || passport.state === "offline" ? "text-red-300" : "text-white/60"}`}>{passportText}</p>
          <div className="max-h-28 space-y-1 overflow-y-auto text-xs text-white/70">
            {storeTermPoints.map((point) => <p key={point}>{point}</p>)}
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            <span>Li e aceito os <Link href="/termos" className="font-semibold text-yellow-400" onClick={() => setOpen(false)}>termos da loja</Link>.</span>
          </label>
          <button type="button" disabled={loading || !lines.length || !accepted} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black disabled:opacity-60" onClick={pay}>
            {loading ? "Conferindo ID..." : "Finalizar compra"}
          </button>
          {message ? <p className="text-sm text-yellow-200">{message}</p> : null}
        </div>
      </aside>
    </>
  );
}
