"use client";

import { useEffect, useRef, useState } from "react";

export type MenuDotItem = {
  id: string;
  label: string;
  danger?: boolean;
  onSelect: () => void;
};

export function MenuDots({ label = "Opções", items }: { label?: string; items: MenuDotItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-black/80 text-white"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((current) => !current);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>
      {open ? (
        <ul className="absolute right-0 z-40 mt-1 min-w-40 rounded-xl border border-yellow-400/50 bg-[#141414] p-1 shadow-xl" role="menu">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="menuitem"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-bold ${item.danger ? "text-red-300 hover:bg-red-500 hover:text-white" : "hover:bg-yellow-400 hover:text-black"}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
