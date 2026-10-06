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
  name: z.string().trim().min(2).max(40, "O nome do card aceita no máximo 40 caracteres."),
  category: z.enum(["vips", "others", "crp", "vehicles", "mansions", "weapons", "organizacao"]),
  price: z.number().min(0).max(100000).nullable(),
  crpPrice: z.number().min(0).max(1000000).nullable(),
  image: z.string().trim().max(400).refine((value) => /^https?:\/\//i.test(value) || value.startsWith("/"), "Use um link https ou um caminho que comece com /imagens/."),
  description: z.string().trim().min(4).max(160, "A descrição do card aceita no máximo 160 caracteres."),
  benefits: z.array(z.string().trim().min(1).max(48, "Cada benefício aceita no máximo 48 caracteres.")).max(6),
  action: z.enum(["spawn", "daritem", "iniciaraluguelcarro", "iniciaraluguelcasa", "iniciaraluguelvip", "vipwipe", "darcrp", "grupo", "resetchar"]),
  actionParams: z.object({
    spawn: z.string().trim().max(48).optional(),
    item: z.string().trim().max(60).optional(),
    amount: z.number().int().positive().max(1000000).optional(),
    days: z.number().int().min(1).max(3650).nullable().optional(),
    group: z.string().trim().max(48).optional(),
    bank: z.number().int().min(0).max(100000000).optional()
  }),
  placeKind: z.enum(["faccao", "garagem", "cabeleireiro", "afk", "pvp", "outro"]).optional(),
  location: z.string().trim().max(120).optional(),
  availability: z.enum(["venda", "dono", "ocupada"]).optional(),
  owner: z.string().trim().max(80).optional()
}).superRefine((data, ctx) => {
  if (data.category !== "organizacao") return;
  if (!data.placeKind) ctx.addIssue({ code: "custom", message: "Escolha se é organização ou blip.", path: ["placeKind"] });
  if (!data.location) ctx.addIssue({ code: "custom", message: "Informe a localização.", path: ["location"] });
  if (!data.availability) ctx.addIssue({ code: "custom", message: "Informe se está à venda, com dono ou ocupada.", path: ["availability"] });
  if (data.availability === "venda" && !(data.crpPrice && data.crpPrice > 0)) {
    ctx.addIssue({ code: "custom", message: "Uma organização à venda precisa do preço em CRP.", path: ["crpPrice"] });
  }
  if (data.availability === "dono" && !data.owner) {
    ctx.addIssue({ code: "custom", message: "Informe o nome do dono.", path: ["owner"] });
  }
});

export const postSchema = z.object({
  id: z.string().trim().regex(/^[A-Za-z0-9_-]{2,40}$/, "ID só com letras, números, _ ou -."),
  title: z.string().trim().min(2).max(80, "O título aceita no máximo 80 caracteres."),
  image: z.string().trim().max(400).refine((value) => value === "" || /^https?:\/\//i.test(value) || value.startsWith("/"), "Use um link https ou um caminho que comece com /."),
  body: z.string().trim().min(4).max(4000, "O texto aceita no máximo 4000 caracteres."),
  links: z.array(z.object({
    label: z.string().trim().min(1).max(40),
    href: z.string().trim().url("O link precisa ser um endereço http ou https.").max(400)
  })).max(6)
});

export const checkoutSchema = z.object({
  targetId: z.number().int().positive(),
  items: z.array(z.object({
    id: z.string().min(1),
    qty: z.number().int().min(1).max(5)
  })).min(1).max(12)
});
