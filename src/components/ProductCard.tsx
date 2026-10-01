"use client";

import { formatBrl, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  return (
    <article className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-yellow-400/35 bg-black">
      <img src={product.image} alt="" className="h-40 w-full shrink-0 object-cover" />
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 min-h-14 text-lg font-bold">{product.name}</h2>
          <strong className="shrink-0 text-yellow-400">{formatBrl(product.price)}</strong>
        </div>
        <p className="mt-2 line-clamp-3 min-h-16 text-sm text-white/75">{product.description}</p>
        <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-hidden text-sm text-white/80">
          {product.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}
        </ul>
        <button
          type="button"
          className="mt-4 w-full shrink-0 rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black"
          onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image })}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
