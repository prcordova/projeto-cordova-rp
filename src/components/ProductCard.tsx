"use client";

import { useRef, useState, type ReactNode } from "react";
import { formatBrl, formatCrp, offerDuration, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";

const maxTilt = 14;

export function ProductCard({
  product,
  menu,
  footer,
  badge,
  priceLabel,
  accent = "default",
  expanded = false,
  onToggle,
  details
}: {
  product: Product;
  menu?: ReactNode;
  footer?: ReactNode;
  badge?: string;
  priceLabel?: string;
  accent?: "default" | "alert";
  expanded?: boolean;
  onToggle?: () => void;
  details?: ReactNode;
}) {
  const add = useCart((state) => state.add);
  const card = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");
  const [moving, setMoving] = useState(false);
  const price = priceLabel || (product.sellOnline && product.price !== null ? formatBrl(product.price) : product.crpPrice ? formatCrp(product.crpPrice) : "Na cidade");

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
      onClick={onToggle}
      onKeyDown={onToggle ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      } : undefined}
      role={onToggle ? "button" : undefined}
      tabIndex={onToggle ? 0 : undefined}
      aria-expanded={onToggle ? expanded : undefined}
      className={`relative flex min-w-0 flex-col rounded-2xl bg-[#1b1b1b] ${expanded ? "h-auto overflow-visible" : onToggle ? "h-[35rem] overflow-hidden" : "h-[31rem] overflow-hidden"} ${accent === "alert" ? "border-2 border-red-500" : "border border-yellow-400/35"} ${onToggle ? "cursor-pointer" : ""} ${moving ? "z-10" : ""}`}
      style={{ transform: tilt, transition: moving ? "none" : "transform 0.4s ease", transformStyle: "preserve-3d" }}
    >
      <header className="relative h-44 shrink-0">
        <img src={product.image} alt="" className="h-full w-full object-cover" />
        {badge ? <span className={`absolute left-4 top-4 rounded-lg px-2 py-1 text-xs font-bold ${accent === "alert" ? "bg-red-600 text-white" : "bg-yellow-400 text-black"}`}>{badge}</span> : null}
        {menu ? <div className="absolute right-4 top-4" onClick={(event) => event.stopPropagation()}>{menu}</div> : null}
      </header>
      <main className="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-extrabold">{product.name}</h2>
          <strong className="max-w-[40%] shrink-0 truncate text-sm text-yellow-400">{price}</strong>
        </div>
        <p className="line-clamp-2 min-h-[2.6rem] text-sm leading-snug text-white/75">{product.description}</p>
        <ul className="min-h-[4.5rem] space-y-1 text-sm text-white/80">
          {product.benefits.slice(0, 3).map((benefit) => <li key={benefit} className="truncate">• {benefit}</li>)}
        </ul>
        {expanded && details ? <div className="space-y-1 border-t border-white/10 pt-2 text-sm text-white/80">{details}</div> : null}
      </main>
      <footer className="mt-auto p-3 pt-2" onClick={(event) => event.stopPropagation()}>
        {footer ?? (product.sellOnline && product.price !== null ? (
          <button
            type="button"
            className="w-full rounded-xl border border-yellow-400 bg-black px-4 py-3 font-bold text-yellow-400"
            onClick={() => add({ id: product.id, name: product.name, price: product.price || 0, image: product.image, description: product.description, duration: offerDuration(product) })}
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
