"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { actionByValue, shopActions, type ShopAction } from "@/lib/actions";
import { availabilityOptions, categoryLabels, placeKinds, type Availability, type PlaceKind, type Product, type ShopCategory } from "@/lib/catalog";
import { MenuDots } from "@/components/MenuDots";
import { Modal } from "@/components/Modal";
import { ProductCard } from "@/components/ProductCard";

const empty = {
  id: "",
  name: "",
  category: "others" as ShopCategory,
  price: "",
  crpPrice: "",
  image: "",
  description: "",
  benefits: "",
  action: "darcrp" as ShopAction,
  spawn: "",
  item: "",
  amount: "",
  days: "",
  group: "",
  bank: "",
  placeKind: "faccao" as PlaceKind,
  location: "",
  availability: "venda" as Availability,
  owner: ""
};

export function AdminPanel() {
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const action = useMemo(() => actionByValue(form.action), [form.action]);

  async function reload() {
    const response = await fetch("/api/admin/products");
    const data = await response.json();
    if (data.ok) setItems(data.items || []);
    else setMessage(data.message || "Não foi possível ler os produtos.");
  }

  useEffect(() => {
    reload().catch(() => setMessage("Não foi possível ler os produtos cadastrados."));
  }, []);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startNew() {
    setEditing(null);
    setForm(empty);
    setMessage("");
    setOpen(true);
  }

  function edit(product: Product) {
    const params = product.actionParams || {};
    setEditing(product);
    setMessage("");
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price ? String(product.price) : "",
      crpPrice: product.crpPrice ? String(product.crpPrice) : "",
      image: product.image,
      description: product.description,
      benefits: product.benefits.join("\n"),
      action: product.action || "grupo",
      spawn: params.spawn || "",
      item: params.item || "",
      amount: params.amount ? String(params.amount) : product.amount ? String(product.amount) : "",
      days: params.days ? String(params.days) : "",
      group: params.group || "",
      bank: params.bank ? String(params.bank) : "",
      placeKind: product.placeKind || "faccao",
      location: product.location || "",
      availability: product.availability || "venda",
      owner: product.owner || ""
    });
    setOpen(true);
  }

  async function upload(file: File) {
    setUploading(true);
    setMessage("");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);
    if (!data.ok) {
      setMessage(data.message || "Não foi possível enviar a imagem.");
      return;
    }
    set("image", data.image);
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
        crpPrice: form.crpPrice === "" ? null : Number(form.crpPrice.replace(",", ".")),
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
        },
        placeKind: form.category === "organizacao" ? form.placeKind : undefined,
        location: form.category === "organizacao" ? form.location : undefined,
        availability: form.category === "organizacao" ? form.availability : undefined,
        owner: form.category === "organizacao" && form.availability === "dono" ? form.owner : undefined
      })
    });
    const data = await response.json();
    setLoading(false);
    setMessage(data.message || "Não foi possível salvar.");
    if (data.ok) {
      setOpen(false);
      setEditing(null);
      setForm(empty);
      reload().catch(() => undefined);
    }
  }

  async function remove(product: Product) {
    if (product.source !== "db") {
      setMessage("Este item ainda é o padrão do config. Edite e salve para substituir. Não há cópia no banco para apagar.");
      return;
    }
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, { method: "DELETE" });
    const data = await response.json();
    setMessage(data.message || "");
    if (data.ok) reload().catch(() => undefined);
  }

  const fields = (action?.fields || []) as readonly string[];
  const input = "mt-1 w-full rounded-xl border border-white/15 bg-zinc-950 px-3 py-3 font-normal";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/70">{items.length} produtos. O card é o mesmo da loja.</p>
        <button type="button" className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black" onClick={startNew}>Novo produto</button>
      </div>
      {message && !open ? <p className="text-sm text-yellow-100">{message}</p> : null}
      <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            menu={(
              <MenuDots
                items={[
                  { id: "edit", label: "Editar", onSelect: () => edit(item) },
                  { id: "delete", label: item.source === "db" ? "Excluir" : "Excluir padrão", danger: true, onSelect: () => remove(item) }
                ]}
              />
            )}
            footer={(
              <p className="flex min-h-12 items-center justify-center rounded-xl border border-yellow-400/30 px-3 text-center text-sm font-semibold text-yellow-400">
                {item.source === "db" ? "Substituído no site" : "Padrão do config"}
              </p>
            )}
          />
        ))}
      </div>
      {open ? (
        <Modal title={editing ? `Editar ${editing.name}` : "Novo produto"} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-3">
            <label className="block text-sm font-semibold">ID do produto
              <input required value={form.id} onChange={(event) => set("id", event.target.value)} placeholder="vip_natal" className={input} readOnly={Boolean(editing)} />
            </label>
            <label className="block text-sm font-semibold">Nome
              <input required maxLength={40} value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Até 40 caracteres" className={input} />
            </label>
            <label className="block text-sm font-semibold">Categoria
              <select value={form.category} onChange={(event) => {
                const category = event.target.value as ShopCategory;
                set("category", category);
                if (category === "organizacao" && form.action === "darcrp") set("action", "grupo");
              }} className={`${input} border-yellow-400/50`}>
                {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {form.category === "organizacao" ? (
              <>
                <p className="text-sm text-white/70">Este cadastro aparece na página Organizações, fora da loja. Vale para facção e para blip de garagem, cabeleireiro, AFK ou PVP.</p>
                <label className="block text-sm font-semibold">Tipo
                  <select value={form.placeKind} onChange={(event) => set("placeKind", event.target.value as PlaceKind)} className={`${input} border-yellow-400/50`}>
                    {placeKinds.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold">Localização
                  <input required value={form.location} onChange={(event) => set("location", event.target.value)} placeholder="Ex.: Sandy Shores, ao lado do posto" className={input} />
                </label>
                <label className="block text-sm font-semibold">Situação
                  <select value={form.availability} onChange={(event) => set("availability", event.target.value as Availability)} className={`${input} border-yellow-400/50`}>
                    {availabilityOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
                {form.availability === "dono" ? (
                  <label className="block text-sm font-semibold">Dono
                    <input required value={form.owner} onChange={(event) => set("owner", event.target.value)} placeholder="Nome de quem já comprou" className={input} />
                  </label>
                ) : null}
              </>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Preço em reais
                <input value={form.price} onChange={(event) => set("price", event.target.value)} inputMode="decimal" placeholder="Vazio vende só com CRP" className={input} />
              </label>
              <label className="block text-sm font-semibold">Preço em CRP
                <input value={form.crpPrice} onChange={(event) => set("crpPrice", event.target.value)} inputMode="decimal" placeholder="Vazio se for só em reais" className={input} />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Imagem
                <input required value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="https://... ou /imagens/arquivo.png" className={input} />
              </label>
              <label className="block text-sm font-semibold text-white/80">Ou envie um arquivo para public/imagens
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="mt-1 block w-full text-sm"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) upload(file).catch(() => setMessage("Não foi possível enviar a imagem."));
                  }}
                />
              </label>
              {uploading ? <p className="text-sm text-white/70">Enviando imagem...</p> : null}
              {form.image ? <img src={form.image} alt="" className="h-28 w-full rounded-xl bg-zinc-950 object-contain" /> : null}
            </div>
            <label className="block text-sm font-semibold">Descrição
              <textarea required maxLength={160} value={form.description} onChange={(event) => set("description", event.target.value)} placeholder="Até 160 caracteres, em até 3 linhas no card" className={`${input} min-h-24`} />
            </label>
            <label className="block text-sm font-semibold">Benefícios, um por linha
              <textarea value={form.benefits} onChange={(event) => set("benefits", event.target.value)} placeholder="Até 6 linhas, 48 caracteres cada. O card mostra 3." className={`${input} min-h-24`} />
            </label>
            <label className="block text-sm font-semibold">O que a venda confirmada faz
              <select value={form.action} onChange={(event) => set("action", event.target.value as ShopAction)} className={`${input} border-yellow-400/50 text-yellow-100`}>
                {shopActions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            {action ? <p className="text-sm text-white/70">{action.command}</p> : null}
            {fields.includes("spawn") ? <input required value={form.spawn} onChange={(event) => set("spawn", event.target.value)} placeholder="Spawn do veículo, ex. skyr34" className={input} /> : null}
            {fields.includes("item") ? <input required value={form.item} onChange={(event) => set("item", event.target.value)} placeholder="Nome do item no inventário" className={input} /> : null}
            {fields.includes("amount") ? <input required value={form.amount} onChange={(event) => set("amount", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Quantidade" className={input} /> : null}
            {fields.includes("group") ? <input required value={form.group} onChange={(event) => set("group", event.target.value)} placeholder="Grupo, ex. Diamante ou MansaoFazenda" className={input} /> : null}
            {fields.includes("days") ? <input required={form.action === "iniciaraluguelcarro"} value={form.days} onChange={(event) => set("days", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Dias. Vazio no grupo deixa sem prazo." className={input} /> : null}
            {fields.includes("bank") ? <input value={form.bank} onChange={(event) => set("bank", event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Bônus no banco, opcional" className={input} /> : null}
            {editing?.source === "config" ? <p className="text-sm text-white/70">Este item ainda é o padrão do config. Salvar passa a imagem, o nome, o texto e o preço para a vipshop. A entrega na cidade continua a que esse item já tem.</p> : null}
            <button disabled={loading || uploading} className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black">{loading ? "Salvando..." : "Salvar"}</button>
            {message ? <p className="text-sm text-yellow-100">{message}</p> : null}
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
