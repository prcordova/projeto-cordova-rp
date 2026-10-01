"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) => set((state) => {
        const current = state.lines.find((item) => item.id === line.id);
        if (current) {
          return {
            lines: state.lines.map((item) => item.id === line.id ? { ...item, qty: Math.min(5, item.qty + 1) } : item)
          };
        }
        return { lines: [...state.lines, { ...line, qty: 1 }] };
      }),
      remove: (id) => set((state) => ({ lines: state.lines.filter((item) => item.id !== id) })),
      clear: () => set({ lines: [] })
    }),
    { name: "cordova-cart" }
  )
);
