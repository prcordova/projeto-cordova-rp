"use client";

import { formatBrl, formatCrp, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  const price = product.sellOnline && product.price !== null ? formatBrl(product.price) : product.crpPrice ? formatCrp(product.crpPrice) : "Na cidade";
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-yellow-400/35 bg-black">
      <img src={product.image} alt="" className="h-40 w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <strong className="shrink-0 text-yellow-400">{price}</strong>
        </div>
        <p className="mt-2 text-sm text-white/75">{product.description}</p>
        <ul className="mt-3 space-y-1 text-sm text-white/80">
          {product.benefits.slice(0, 6).map((benefit) => <li key={benefit}>• {benefit}</li>)}
        </ul>
        {product.sellOnline && product.price !== null ? (
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black"
            onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image })}
          >
            Adicionar ao carrinho
          </button>
        ) : (
          <p className="mt-4 text-sm font-semibold text-yellow-400">Este item é comprado na vipshop da cidade, com CRP.</p>
        )}
      </div>
    </article>
  );
}
