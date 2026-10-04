"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { actionByValue, shopActions, type ShopAction } from "@/lib/actions";
import { categoryLabels, type Product, type ShopCategory } from "@/lib/catalog";

const empty = {
  id: "",
  name: "",
  category: "others" as ShopCategory,
  price: "",
  image: "",
  description: "",
  benefits: "",
  action: "darcrp" as ShopAction,
  spawn: "",
  item: "",
  amount: "",
  days: "",
  group: "",
  bank: ""
};

export function AdminPanel() {
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const action = useMemo(() => actionByValue(form.action), [form.action]);

  async function reload() {
    const response = await fetch("/api/admin/products");
    const data = await response.json();
    if (data.ok) setItems(data.items || []);
  }

  useEffect(() => {
    reload().catch(() => setMessage("Não foi possível ler os produtos cadastrados."));
  }, []);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id,
        name: form.name,
        category: form.category,
        price: form.price === "" ? null : Number(form.price.replace(",", ".")),
        image: form.image,
        description: form.description,
        benefits: form.benefits.split("\n").map((line) => line.trim()).filter(Boolean),
        action: form.action,
        actionParams: {
          spawn: form.spawn || undefined,
          item: form.item || undefined,
          amount: form.amount ? Number(form.amount) : undefined,
          days: form.days ? Number(form.days) : null,
          group: form.group || undefined,
          bank: form.bank ? Number(form.bank) : undefined
        }
      })
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message || "Não foi possível salvar.");
    if (data.ok) {
      setForm(empty);
      reload().catch(() => undefined);
    }
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json();
    setMessage(data.message || "");
    if (data.ok) reload().catch(() => undefined);
  }

  const fields = action?.fields || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-yellow-400/35 bg-black p-5">
        <label className="block text-sm font-semibold">ID do produto
          <input required value={form.id} onChange={(event) => set("id", event.target.value)} placeholder="vip_natal" className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">Nome
          <input required value={form.name} onChange={(event) => set("name", event.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">Categoria
          <select value={form.category} onChange={(event) => set("category", event.target.value as ShopCategory)} className="mt-1 w-full rounded-xl border border-yellow-400/50 bg-zinc-950 px-3 py-3 font-normal">
            {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">Preço em reais
          <input value={form.price} onChange={(event) => set("price", event.target.value)} inputMode="decimal" placeholder="Deixe vazio para vender só na cidade" className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">Imagem
          <input required type="url" value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">Descrição
          <textarea required value={form.description} onChange={(event) => set("description", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">Benefícios, um por linha
          <textarea value={form.benefits} onChange={(event) => set("benefits", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold">O que a venda confirmada faz
          <select value={form.action} onChange={(event) => set("action", event.target.value as ShopAction)} className="mt-1 w-full rounded-xl border border-yellow-400/50 bg-zinc-950 px-3 py-3 font-normal text-yellow-100">
            {shopActions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        {action ? <p className="text-sm text-white/70">{action.command}</p> : null}
        {fields.includes("spawn") ? <input required value={form.spawn} onChange={(event) => set("spawn", event.target.value)} placeholder="Spawn do veículo, ex. skyr34" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        {fields.includes("item") ? <input required value={form.item} onChange={(event) => set("item", event.target.value)} placeholder="Nome do item no inventário" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        {fields.includes("amount") ? <input required value={form.amount} onChange={(event) => set("amount", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Quantidade" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        {fields.includes("group") ? <input required value={form.group} onChange={(event) => set("group", event.target.value)} placeholder="Grupo, ex. Diamante ou MansaoFazenda" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        {fields.includes("days") ? <input required={form.action === "iniciaraluguelcarro"} value={form.days} onChange={(event) => set("days", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Dias. Vazio no grupo deixa sem prazo." className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        {fields.includes("bank") ? <input value={form.bank} onChange={(event) => set("bank", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Bônus no banco, opcional" className="w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3" /> : null}
        <button disabled={loading} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">{loading ? "Salvando..." : "Cadastrar produto"}</button>
        {message ? <p className="text-sm text-yellow-100">{message}</p> : null}
      </form>
      <aside className="space-y-3">
        <h2 className="text-lg font-bold">Cadastrados no banco</h2>
        {items.length ? items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-yellow-400/30 bg-black p-4">
            <strong className="block">{item.name}</strong>
            <p className="text-sm text-white/70">{item.id} · {item.action}</p>
            <button type="button" className="mt-3 text-sm font-semibold text-yellow-400" onClick={() => remove(item.id)}>Retirar</button>
          </article>
        )) : <p className="text-sm text-white/70">Nenhum produto no banco. A loja está usando o config da vipshop.</p>}
      </aside>
    </div>
  );
}
