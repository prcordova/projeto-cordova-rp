"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { formatBrl } from "@/lib/products";
import type { PurchaseView } from "@/lib/purchase-view";

function when(value: string) {
  return new Date(value).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function PurchaseHistory({ purchases }: { purchases: PurchaseView[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!purchases.length) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/70">Nenhuma compra nesta conta.</p>;
  }

  return (
    <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      {purchases.map((purchase) => {
        const expanded = open === purchase.id;
        const badge = purchase.expiring
          ? (purchase.daysLeft && purchase.daysLeft > 1 ? `Vence em ${purchase.daysLeft} dias` : "Vence hoje")
          : undefined;
        return (
          <ProductCard
            key={purchase.id}
            product={purchase.product}
            priceLabel={formatBrl(purchase.paid)}
            accent={purchase.expiring ? "alert" : "default"}
            badge={badge}
            expanded={expanded}
            onToggle={() => setOpen(expanded ? null : purchase.id)}
            footer={<span className={`flex min-h-12 items-center justify-center rounded-xl border px-3 text-center text-sm font-semibold ${purchase.expiring ? "border-red-500 text-red-300" : "border-yellow-400 text-yellow-400"}`}>{expanded ? "Recolher" : "Ver detalhes"}</span>}
            details={(
              <dl className="space-y-1">
                <div><dt className="inline font-semibold text-white">Pago: </dt><dd className="inline">{formatBrl(purchase.paid)} · {purchase.qty} {purchase.qty > 1 ? "unidades" : "unidade"}</dd></div>
                <div><dt className="inline font-semibold text-white">Tipo: </dt><dd className="inline">{purchase.kindLabel}</dd></div>
                <div><dt className="inline font-semibold text-white">Categoria: </dt><dd className="inline">{purchase.categoryLabel}</dd></div>
                <div><dt className="inline font-semibold text-white">Situação: </dt><dd className="inline">{purchase.statusLabel}</dd></div>
                <div><dt className="inline font-semibold text-white">Data: </dt><dd className="inline">{when(purchase.createdAt)}</dd></div>
                <div><dt className="inline font-semibold text-white">Enviado para: </dt><dd className="inline">{purchase.targetName} · ID {purchase.targetId || "—"}</dd></div>
                {purchase.expiresAt ? <div><dt className="inline font-semibold text-white">Vencimento: </dt><dd className="inline">{when(purchase.expiresAt)}</dd></div> : <div><dt className="inline font-semibold text-white">Prazo: </dt><dd className="inline">{purchase.kindLabel}</dd></div>}
                <div><dt className="font-semibold text-white">Descrição</dt><dd className="break-words [overflow-wrap:anywhere]">{purchase.product.description}</dd></div>
              </dl>
            )}
          />
        );
      })}
    </div>
  );
}
