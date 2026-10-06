"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { ProductCard } from "@/components/ProductCard";
import { ShopSelect } from "@/components/ShopSelect";
import { formatBrl, formatCrp, offerDuration, type Product, type ShopCategory } from "@/lib/catalog";
import { useCart } from "@/store/cart";

const tabs: { id: "all" | ShopCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "mansions", label: "Mansões" },
  { id: "weapons", label: "Armas" },
  { id: "vips", label: "VIPs" },
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

export function ShopBrowser({ initialProducts }: { initialProducts: Product[] }) {
  const add = useCart((state) => state.add);
  const [products, setProducts] = useState(initialProducts);
  const [category, setCategory] = useState<(typeof tabs)[number]["id"]>("all");
  const [sort, setSort] = useState("bestsellers");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const closeDetails = useCallback(() => setSelected(null), []);

  useEffect(() => {
    let cancel = false;
    fetch("/api/store")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel && Array.isArray(data.items) && data.items.length) setProducts(data.items);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    const list = products.filter((product) => {
      if (product.category === "organizacao") return false;
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
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="w-full min-w-0 flex-1 text-sm font-semibold">
          Buscar
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar um produto pelo nome"
            className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal"
          />
        </label>
        <label className="w-full text-sm font-semibold sm:w-auto">
          Ordenar por
          <div className="mt-1">
            <ShopSelect value={sort} options={sorts} onChange={setSort} />
          </div>
        </label>
      </div>
      {visible.length ? (
        <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => {
            const price = product.sellOnline && product.price !== null ? formatBrl(product.price) : product.crpPrice ? formatCrp(product.crpPrice) : "";
            return (
              <ProductCard
                key={product.id}
                product={product}
                onToggle={() => setSelected(product)}
                footer={
                  <div className="space-y-2">
                    <button type="button" className="w-full rounded-xl border border-yellow-400/40 px-4 py-2 text-sm font-bold text-yellow-400" onClick={() => setSelected(product)}>Ver detalhes</button>
                    {product.sellOnline && product.price !== null ? (
                      <button
                        type="button"
                        className="w-full rounded-xl border border-yellow-400 bg-black px-4 py-3 font-bold text-yellow-400"
                        onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image, description: product.description, duration: offerDuration(product) })}
                      >
                        Adicionar ao carrinho
                      </button>
                    ) : (
                      <p className="flex min-h-12 items-center justify-center rounded-xl border border-yellow-400/30 px-3 text-center text-sm font-semibold text-yellow-400">{price ? `Na vipshop por ${price}` : "Comprado na vipshop, com CRP."}</p>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhum produto nesta aba.</p>
      )}
      {selected ? <ProductDetails product={selected} onClose={closeDetails} /> : null}
    </div>
  );
}

function ProductDetails({ product, onClose }: { product: Product; onClose: () => void }) {
  const price = product.sellOnline && product.price !== null ? formatBrl(product.price) : product.crpPrice ? formatCrp(product.crpPrice) : "";
  return (
    <Modal title={product.name} onClose={onClose} wide>
      <div className="space-y-4 text-sm leading-relaxed text-white/85">
        {price ? <p className="font-bold text-yellow-400">{price}</p> : null}
        <section>
          <h3 className="mb-1 font-extrabold text-yellow-400">Descrição</h3>
          <p>{product.description}</p>
        </section>
        {product.benefits.length ? (
          <section>
            <h3 className="mb-1 font-extrabold text-yellow-400">O que inclui</h3>
            <ul className="list-disc space-y-1 pl-5">{product.benefits.map((line) => <li key={line}>{line}</li>)}</ul>
          </section>
        ) : null}
        <section>
          <h3 className="mb-1 font-extrabold text-yellow-400">Prazo</h3>
          <p>{offerDuration(product)}</p>
        </section>
      </div>
    </Modal>
  );
}
