"use client";

import { useEffect, useRef, useState } from "react";

export function ShopSelect({
  value,
  options,
  onChange
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={root} className="relative w-full min-w-0 sm:min-w-52">
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-[#1a1408] px-3 py-2 text-left text-sm font-bold ${open ? "border-yellow-400" : "border-yellow-400/50"}`}
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        <span>{current?.label}</span>
        <span className="text-yellow-400">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <ul className="absolute z-30 mt-1 w-full rounded-xl border border-yellow-400/50 bg-[#141414] p-1 shadow-xl">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-bold ${option.value === value ? "bg-yellow-400 text-black" : "hover:bg-yellow-400 hover:text-black"}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
