"use client";

import { useRef, useState, type ReactNode } from "react";
import { formatBrl, formatCrp, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

const maxTilt = 14;

export function ProductCard({
  product,
  menu,
  footer
}: {
  product: Product;
  menu?: ReactNode;
  footer?: ReactNode;
}) {
  const add = useCart((state) => state.add);
  const card = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");
  const [moving, setMoving] = useState(false);
  const price = product.sellOnline && product.price !== null ? formatBrl(product.price) : product.crpPrice ? formatCrp(product.crpPrice) : "Na cidade";

  function move(event: React.MouseEvent<HTMLElement>) {
    const rect = card.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setMoving(true);
    setTilt(`perspective(800px) rotateX(${(py * maxTilt).toFixed(2)}deg) rotateY(${(px * -maxTilt).toFixed(2)}deg)`);
  }

  function leave() {
    setMoving(false);
    setTilt("perspective(800px) rotateX(0deg) rotateY(0deg)");
  }

  return (
    <article
      ref={card}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`relative flex h-[29rem] flex-col overflow-hidden rounded-2xl border border-yellow-400/35 bg-[#1b1b1b] ${moving ? "z-10" : ""}`}
      style={{ transform: tilt, transition: moving ? "none" : "transform 0.4s ease", transformStyle: "preserve-3d" }}
    >
      <header className="relative h-36 shrink-0 px-2.5 pt-2.5">
        <img src={product.image} alt="" className="h-full w-full rounded-xl bg-black object-contain" />
        {menu ? <div className="absolute right-4 top-4">{menu}</div> : null}
      </header>
      <main className="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-extrabold">{product.name}</h2>
          <strong className="shrink-0 text-sm text-yellow-400">{price}</strong>
        </div>
        <p className="line-clamp-3 min-h-[3.9rem] text-sm leading-snug text-white/75">{product.description}</p>
        <ul className="min-h-[4.5rem] space-y-1 text-sm text-white/80">
          {product.benefits.slice(0, 3).map((benefit) => <li key={benefit} className="truncate">• {benefit}</li>)}
        </ul>
      </main>
      <footer className="mt-auto p-3 pt-2">
        {footer ?? (product.sellOnline && product.price !== null ? (
          <button
            type="button"
            className="w-full rounded-xl border border-yellow-400 bg-black px-4 py-3 font-bold text-yellow-400"
            onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image })}
          >
            Adicionar ao carrinho
          </button>
        ) : (
          <p className="flex min-h-12 items-center justify-center rounded-xl border border-yellow-400/30 px-3 text-center text-sm font-semibold text-yellow-400">Comprado na vipshop, com CRP.</p>
        ))}
      </footer>
    </article>
  );
}
