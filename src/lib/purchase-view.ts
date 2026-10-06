import type { Product } from "./catalog";

export type PurchaseView = {
  id: string;
  createdAt: string;
  expiresAt: string | null;
  expiring: boolean;
  daysLeft: number | null;
  status: string;
  statusLabel: string;
  kindLabel: string;
  qty: number;
  paid: number;
  targetId: number;
  targetName: string;
  categoryLabel: string;
  product: Product;
};
