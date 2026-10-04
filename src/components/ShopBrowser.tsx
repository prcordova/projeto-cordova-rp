"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopSelect } from "@/components/ShopSelect";
import type { Product, ShopCategory } from "@/lib/catalog";

const tabs: { id: "all" | ShopCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "mansions", label: "Mansões" },
  { id: "weapons", label: "Armas" },
  { id: "vips", label: "VIPs" },
  { id: "vehicles", label: "Veículos" },
  { id: "others", label: "Outros" },
  { id: "crp", label: "CRP" }
];

const sorts = [
  { value: "bestsellers", label: "Mais vendidos" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "name-asc", label: "Nome A-Z" },
  { value: "name-desc", label: "Nome Z-A" }
];

const featured = ["Spotify", "Diamante"];

function itemPrice(product: Product) {
  if (product.price && product.price > 0) return product.price;
  if (product.crpPrice && product.crpPrice > 0) return product.crpPrice;
  return 0;
}

export function ShopBrowser({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<(typeof tabs)[number]["id"]>("all");
  const [sort, setSort] = useState("bestsellers");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    const list = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!term) return true;
      return `${product.name} ${product.description}`.toLocaleLowerCase("pt-BR").includes(term);
    });
    const copy = [...list];
    if (sort === "price-asc") copy.sort((a, b) => itemPrice(a) - itemPrice(b));
    else if (sort === "price-desc") copy.sort((a, b) => itemPrice(b) - itemPrice(a));
    else if (sort === "name-asc") copy.sort((a, b) => a.name.localeCompare(b.name, "pt"));
    else if (sort === "name-desc") copy.sort((a, b) => b.name.localeCompare(a.name, "pt"));
    else {
      copy.sort((a, b) => {
        const ra = featured.indexOf(a.id);
        const rb = featured.indexOf(b.id);
        return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
      });
    }
    return copy;
  }, [products, category, sort, query]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold ${category === tab.id ? "border-yellow-400 bg-yellow-400 text-black" : "border-yellow-400/40 text-white"}`}
            onClick={() => setCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="min-w-64 flex-1 text-sm font-semibold">
          Buscar
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar um produto pelo nome"
            className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Ordenar por
          <div className="mt-1">
            <ShopSelect value={sort} options={sorts} onChange={setSort} />
          </div>
        </label>
      </div>
      {visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhum produto nesta aba.</p>
      )}
    </div>
  );
}
