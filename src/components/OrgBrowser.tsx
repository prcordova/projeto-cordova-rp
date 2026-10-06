"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { availabilityOptions, formatBrl, formatCrp, offerDuration, orgSalePrice, placeKinds, type Availability, type PlaceKind, type Product } from "@/lib/catalog";
import type { RankEntry } from "@/lib/rankings";
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

function sameOrg(product: Product, name: string) {
  const key = name.toLocaleLowerCase("pt-BR");
  return product.id.toLocaleLowerCase("pt-BR") === key || product.name.toLocaleLowerCase("pt-BR") === key;
}

export function OrgBrowser() {
  const add = useCart((state) => state.add);
  const cartLines = useCart((state) => state.lines);
  const [products, setProducts] = useState<Product[]>([]);
  const [blips, setBlips] = useState<Product[]>([]);
  const [factions, setFactions] = useState<RankEntry[]>([]);
  const [rankDown, setRankDown] = useState(false);
  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<(typeof kinds)[number]["id"]>("todas");
  const [status, setStatus] = useState<(typeof statuses)[number]["id"]>("todas");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancel = false;
    fetch("/api/blips")
      .then((response) => response.json())
      .then((data) => {
        if (cancel || !Array.isArray(data.types)) return;
        setBlips(data.types.flatMap((type: { id: string; label: string; price: number | string }) => {
          const price = Number(type.price);
          const kind = placeKinds.some((item) => item.id === type.id) ? type.id as PlaceKind : "outro";
          const product: Product = {
            id: type.id,
            name: type.label || type.id,
            category: "organizacao",
            price: Number.isFinite(price) ? price : null,
            crpPrice: null,
            image: "/imagens/organizacoes.png",
            description: "Ponto da organização. Quem recebe precisa ser dono. Depois do pagamento, use /resgatartoken na cidade.",
            benefits: [],
            placeKind: kind,
            location: "Na cidade",
            availability: "venda",
            sellOnline: price > 0,
            source: "config"
          };
          return [product];
        }));
      })
      .catch(() => undefined);
    fetch("/api/store")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel && Array.isArray(data.items)) setProducts(data.items.filter((item: Product) => item.category === "organizacao"));
      })
      .catch(() => undefined);
    fetch("/api/orgs")
      .then((response) => response.json())
      .then((data) => {
        if (cancel) return;
        if (data.ok && Array.isArray(data.orgs)) setFactions(data.orgs);
        else setRankDown(true);
      })
      .catch(() => {
        if (!cancel) setRankDown(true);
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  const catalog = useMemo(() => {
    const used = new Set<string>();
    const fromGame = factions.flatMap((entry) => {
      const name = entry.name || "";
      if (!name) return [];
      const overlay = products.find((item) => item.category === "organizacao" && (!item.placeKind || item.placeKind === "faccao") && sameOrg(item, name));
      if (overlay) used.add(overlay.id);
      const owner = entry.owner || entry.sub || "";
      const product: Product = {
        id: overlay?.id || name,
        name: overlay?.name || name,
        category: "organizacao",
        price: orgSalePrice,
        crpPrice: null,
        image: overlay?.image || "/imagens/organizacoes.png",
        description: "Venda única por R$ 1.000,00. O cargo de dono vale até o final da season.",
        benefits: ["Venda única", "Até o final da season"],
        placeKind: "faccao",
        location: overlay?.location || "Na cidade",
        availability: owner ? "dono" : "venda",
        owner: owner || undefined,
        sellOnline: !owner,
        source: overlay?.source || "config"
      };
      return [product];
    });
    const rest = products.filter((item) => item.category === "organizacao" && (!item.placeKind || item.placeKind === "faccao") && !used.has(item.id) && !fromGame.some((org) => sameOrg(item, org.name)));
    const points = blips.filter((item) => !fromGame.some((org) => org.id === item.id) && !rest.some((org) => org.id === item.id));
    return [...fromGame, ...rest, ...points];
  }, [products, factions, blips]);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return catalog.filter((product) => {
      const blip = product.placeKind && product.placeKind !== "faccao";
      if (kind === "faccoes" && blip) return false;
      if (kind === "blips" && !blip) return false;
      if (status !== "todas" && (product.availability || "venda") !== status) return false;
      if (!term) return true;
      return `${product.name} ${product.location || ""} ${product.owner || ""} ${product.description}`.toLocaleLowerCase("pt-BR").includes(term);
    });
  }, [catalog, kind, status, query]);

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
      {rankDown ? <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">A cidade não respondeu. A lista com todas as organizações, vaga ou dono, volta quando o servidor estiver no ar.</p> : null}
      {!ready ? <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Carregando organizações...</p> : null}
      {ready && visible.length ? (
        <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => {
            const availability = product.availability || "venda";
            const lines = product.placeKind === "faccao"
              ? ["Venda única", "Até o final da season", product.location || "Na cidade"]
              : [product.location || "Sem localização", kindLabel(product), ...product.benefits].slice(0, 3);
            const shown = { ...product, benefits: lines };
            const note = "flex min-h-12 items-center justify-center rounded-xl border border-yellow-400/30 px-3 text-center text-sm font-semibold text-yellow-400";
            const inCart = cartLines.some((line) => line.id === product.id);
            let footer = <p className={note}>À venda{product.crpPrice ? ` por ${formatCrp(product.crpPrice)}` : ""}</p>;
            if (availability === "dono") footer = <p className={note}>Dono: {product.owner || "não informado"}</p>;
            else if (availability === "ocupada") footer = <p className={note}>Ocupada</p>;
            else if (product.sellOnline && product.price) {
              footer = (
                <button
                  type="button"
                  className="w-full rounded-xl border border-yellow-400 bg-black px-4 py-3 font-bold text-yellow-400 disabled:opacity-60"
                  disabled={inCart}
                  onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image, description: product.description, duration: offerDuration(product) })}
                >
                  {inCart ? "No carrinho" : `Comprar ${formatBrl(product.price)}`}
                </button>
              );
            }
            return (
              <ProductCard
                key={product.id}
                product={shown}
                badge={statusLabel(product)}
                priceLabel={product.placeKind === "faccao" ? formatBrl(orgSalePrice) : product.crpPrice ? formatCrp(product.crpPrice) : undefined}
                footer={footer}
              />
            );
          })}
        </div>
      ) : ready && !rankDown ? (
        <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhuma organização ou blip neste filtro. No painel, a categoria Organização publica o card aqui.</p>
      ) : null}
    </div>
  );
}
