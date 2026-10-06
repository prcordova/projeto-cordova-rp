"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { availabilityOptions, formatCrp, placeKinds, type Availability, type Product } from "@/lib/catalog";
import { useCart } from "@/store/cart";

const kinds = [
  { id: "todas", label: "Todas" },
  { id: "faccoes", label: "Organizações" },
  { id: "blips", label: "Blips" }
] as const;

const statuses = [{ id: "todas", label: "Todas" }, ...availabilityOptions] as const;

function kindLabel(product: Product) {
  return placeKinds.find((item) => item.id === product.placeKind)?.label || "Organização";
}

function statusLabel(product: Product) {
  return availabilityOptions.find((item) => item.id === product.availability)?.label || "À venda";
}

export function OrgBrowser() {
  const add = useCart((state) => state.add);
  const [products, setProducts] = useState<Product[]>([]);
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("todas");
  const [status, setStatus] = useState<(typeof statuses)[number]["id"]>("todas");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancel = false;
    fetch("/api/store")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel && Array.isArray(data.items)) setProducts(data.items.filter((item: Product) => item.category === "organizacao"));
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const blip = product.placeKind && product.placeKind !== "faccao";
      if (kind === "faccoes" && blip) return false;
      if (kind === "blips" && !blip) return false;
      if (status !== "todas" && (product.availability || "venda") !== status) return false;
      if (!term) return true;
      return `${product.name} ${product.location || ""} ${product.owner || ""} ${product.description}`.toLocaleLowerCase("pt-BR").includes(term);
    });
  }, [products, kind, status, query]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {kinds.map((tab) => (
          <button key={tab.id} type="button" className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold ${kind === tab.id ? "border-yellow-400 bg-yellow-400 text-black" : "border-yellow-400/40 text-white"}`} onClick={() => setKind(tab.id)}>{tab.label}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="w-full min-w-0 flex-1 text-sm font-semibold">
          Buscar
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, local ou dono" className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" />
        </label>
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {statuses.map((tab) => (
            <button key={tab.id} type="button" className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-bold ${status === tab.id ? "border-yellow-400 bg-yellow-400 text-black" : "border-yellow-400/40 text-white"}`} onClick={() => setStatus(tab.id as Availability | "todas")}>{tab.label}</button>
          ))}
        </div>
      </div>
      {visible.length ? (
        <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => {
            const availability = product.availability || "venda";
            const lines = [product.location || "Sem localização", kindLabel(product), ...product.benefits].slice(0, 3);
            const shown = { ...product, benefits: lines };
            const note = "flex min-h-12 items-center justify-center rounded-xl border border-yellow-400/30 px-3 text-center text-sm font-semibold text-yellow-400";
            let footer = <p className={note}>À venda{product.crpPrice ? ` por ${formatCrp(product.crpPrice)}` : ""}</p>;
            if (availability === "dono") footer = <p className={note}>Dono: {product.owner || "não informado"}</p>;
            else if (availability === "ocupada") footer = <p className={note}>Ocupada</p>;
            else if (product.sellOnline && product.price) {
              footer = (
                <button type="button" className="w-full rounded-xl border border-yellow-400 bg-black px-4 py-3 font-bold text-yellow-400" onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image })}>
                  Adicionar ao carrinho
                </button>
              );
            }
            return (
              <ProductCard
                key={product.id}
                product={shown}
                badge={statusLabel(product)}
                priceLabel={product.crpPrice ? formatCrp(product.crpPrice) : undefined}
                footer={footer}
              />
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhuma organização ou blip neste filtro. No painel, a categoria Organização publica o card aqui.</p>
      )}
    </div>
  );
}
