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
  open: boolean;
  targetId: string;
  setOpen: (open: boolean) => void;
  setTargetId: (targetId: string) => void;
  add: (line: Omit<CartLine, "qty">) => void;
  removeOne: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      targetId: "",
      setOpen: (open) => set({ open }),
      setTargetId: (targetId) => set({ targetId }),
      add: (line) => set((state) => {
        const current = state.lines.find((item) => item.id === line.id);
        const lines = current
          ? state.lines.map((item) => item.id === line.id ? { ...item, qty: Math.min(5, item.qty + 1) } : item)
          : [...state.lines, { ...line, qty: 1 }];
        return { lines, open: true };
      }),
      removeOne: (id) => set((state) => ({
        lines: state.lines.flatMap((item) => {
          if (item.id !== id) return [item];
          if (item.qty <= 1) return [];
          return [{ ...item, qty: item.qty - 1 }];
        })
      })),
      clear: () => set({ lines: [] })
    }),
    {
      name: "cordova-cart",
      partialize: (state) => ({ lines: state.lines, targetId: state.targetId })
    }
  )
);
