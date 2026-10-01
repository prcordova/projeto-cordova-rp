"use client";

import { formatBrl, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  return (
    <article className="overflow-hidden rounded-2xl border border-yellow-400/35 bg-black">
      <img src={product.image} alt="" className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <strong className="text-yellow-400">{formatBrl(product.price)}</strong>
        </div>
        <p className="text-sm text-white/75">{product.description}</p>
        <ul className="space-y-1 text-sm text-white/80">
          {product.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}
        </ul>
        <button
          type="button"
          className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black"
          onClick={() => add({ id: product.id, name: product.name, price: product.price, image: product.image })}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
