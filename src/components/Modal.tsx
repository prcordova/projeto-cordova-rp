"use client";

import { useEffect } from "react";

export function Modal({
  title,
  onClose,
  children,
  wide = false
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-yellow-400/45 bg-black p-5 shadow-2xl ${wide ? "max-w-3xl" : "max-w-xl"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button type="button" className="rounded-lg border border-yellow-400/40 px-3 py-1 text-sm" onClick={onClose}>Fechar</button>
        </header>
        {children}
      </div>
    </div>
  );
}
