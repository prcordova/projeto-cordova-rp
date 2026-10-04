import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
});

export const emailSchema = z.object({
  email: z.string().trim().email()
});

export const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(72)
});

export const tokenSchema = z.object({
  token: z.string().min(20)
});

export const productSchema = z.object({
  id: z.string().trim().regex(/^[A-Za-z0-9_-]{2,40}$/, "ID só com letras, números, _ ou -."),
  name: z.string().trim().min(2).max(80),
  category: z.enum(["vips", "others", "crp", "vehicles", "mansions", "weapons"]),
  price: z.number().min(0).max(100000).nullable(),
  crpPrice: z.number().min(0).max(1000000).nullable(),
  image: z.string().trim().max(400).refine((value) => /^https?:\/\//i.test(value) || value.startsWith("/"), "Use um link https ou um caminho que comece com /imagens/."),
  description: z.string().trim().min(4).max(800),
  benefits: z.array(z.string().trim().min(1).max(160)).max(20),
  action: z.enum(["spawn", "daritem", "iniciaraluguelcarro", "iniciaraluguelcasa", "iniciaraluguelvip", "vipwipe", "darcrp", "grupo", "resetchar"]),
  actionParams: z.object({
    spawn: z.string().trim().max(48).optional(),
    item: z.string().trim().max(60).optional(),
    amount: z.number().int().positive().max(1000000).optional(),
    days: z.number().int().min(1).max(3650).nullable().optional(),
    group: z.string().trim().max(48).optional(),
    bank: z.number().int().min(0).max(100000000).optional()
  })
});

export const checkoutSchema = z.object({
  targetId: z.number().int().positive(),
  items: z.array(z.object({
    id: z.string().min(1),
    qty: z.number().int().min(1).max(5)
  })).min(1).max(12)
});
