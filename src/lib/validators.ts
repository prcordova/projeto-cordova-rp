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

export const checkoutSchema = z.object({
  targetId: z.number().int().positive(),
  items: z.array(z.object({
    id: z.string().min(1),
    qty: z.number().int().min(1).max(5)
  })).min(1).max(12)
});
