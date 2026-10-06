"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBrl, offerDuration, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

type PassportState =
  | { state: "empty" }
  | { state: "checking" }
  | { state: "found"; name: string; orgs: { id: string }[] }
  | { state: "missing"; message: string }
  | { state: "offline"; message: string };

async function lookupPassport(id: string): Promise<PassportState> {
  const response = await fetch(`/api/passport?id=${id}`);
  const data = await response.json().catch(() => ({}));
  if (data.exists && data.name) {
    return {
      state: "found",
      name: String(data.name),
      orgs: Array.isArray(data.orgs) ? data.orgs.map((org: { id?: string }) => ({ id: String(org.id || "") })).filter((org: { id: string }) => org.id) : []
    };
  }
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
  const [passport, setPassport] = useState<PassportState>({ state: "empty" });
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [blipIds, setBlipIds] = useState<string[]>([]);
  const [mine, setMine] = useState<number | null>(null);
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

  useEffect(() => {
    if (!open) return;
    fetch("/api/store")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.items)) setCatalog(data.items);
      })
      .catch(() => undefined);
    fetch("/api/blips")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.types)) setBlipIds(data.types.map((type: { id?: string }) => String(type.id || "")));
      })
      .catch(() => undefined);
    fetch("/api/me/character")
      .then((response) => response.json())
      .then((data) => setMine(data?.userId ? Number(data.userId) : null))
      .catch(() => setMine(null));
  }, [open]);

  function kindOf(line: { id: string; kind?: "org" | "blip" }) {
    if (line.kind === "blip" || blipIds.includes(line.id)) return "blip" as const;
    if (line.kind === "org") return "org" as const;
    const product = catalog.find((item) => item.id === line.id);
    if (product?.category === "organizacao" && product.placeKind && product.placeKind !== "faccao") return "blip" as const;
    if (product?.category === "organizacao") return "org" as const;
    return "item" as const;
  }

  async function pay() {
    if (!lines.length) return;
    if (!/^\d+$/.test(targetId)) {
      setMessage("Informe o ID do jogador na cidade.");
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
    const owner = holder.orgs.length > 0;
    const hasBlip = lines.some((line) => kindOf(line) === "blip");
    const hasOrg = lines.some((line) => kindOf(line) === "org");
    if (hasBlip && !owner) {
      setLoading(false);
      setMessage("O passaporte que recebe o blip precisa ser dono de uma organização.");
      return;
    }
    if (hasOrg && !mine) {
      setLoading(false);
      setMessage("Sua conta Discord não está ligada a um passaporte. Entre na cidade com o Discord vinculado.");
      return;
    }
    if (hasOrg && mine && Number(targetId) !== mine) {
      setLoading(false);
      setMessage("Organização só pode ser comprada no seu próprio passaporte.");
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

  const ownerNames = passport.state === "found" ? passport.orgs.map((org) => org.id).join(", ") : "";
  const passportText = passport.state === "checking"
    ? "Conferindo o passaporte na cidade..."
    : passport.state === "found"
      ? `Entrega para ${passport.name}. ${ownerNames ? `Dono de ${ownerNames}.` : "Não é dono de organização."}`
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
        <div className="page-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {lines.length ? lines.map((line) => {
            const product = catalog.find((item) => item.id === line.id);
            const description = line.description || product?.description || "";
            const duration = line.duration || (product ? offerDuration(product) : "");
            const kind = kindOf(line);
            const warning = passport.state !== "found"
              ? ""
              : kind === "blip" && passport.orgs.length === 0
                ? "Blip só para quem é dono de uma organização."
                : kind === "org" && mine && Number(targetId) !== mine
                  ? "Organização só no seu passaporte."
                  : "";
            return (
              <div key={line.id} className="rounded-xl border border-yellow-400/30 bg-black p-3">
                <div className="flex items-center gap-3">
                  <img src={line.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate">{line.name}</strong>
                    <p className="text-sm text-white/70">{line.qty} × {formatBrl(line.price)}</p>
                  </div>
                  <button type="button" className="shrink-0 rounded-lg border border-yellow-400 px-3 py-2 text-sm font-semibold text-yellow-400" onClick={() => removeOne(line.id)}>
                    Remover
                  </button>
                </div>
                {description ? <p className="mt-2 text-xs leading-snug text-white/70">{description}</p> : null}
                {duration ? <p className="mt-1 text-xs font-semibold text-yellow-400">Duração: {duration}</p> : null}
                {warning ? <p className="mt-1 text-xs text-red-300">{warning}</p> : null}
              </div>
            );
          }) : <p className="text-sm text-white/70">Nenhum item escolhido.</p>}
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
          <p className="text-xs text-white/60">Ao clicar em Finalizar compra você aceita os termos deste pedido.</p>
          <button type="button" disabled={loading || !lines.length} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black disabled:opacity-60" onClick={pay}>
            {loading ? "Conferindo ID..." : "Finalizar compra"}
          </button>
          {message ? <p className="text-sm text-yellow-200">{message}</p> : null}
        </div>
      </aside>
    </>
  );
}
