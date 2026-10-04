import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

export const runtime = "nodejs";

const types: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif"
};

export async function POST(request: Request) {
  const user = await readSession();
  if (!user?.admin) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Envie uma imagem." }, { status: 400 });
  const extension = types[file.type];
  if (!extension) return NextResponse.json({ ok: false, message: "Use PNG, JPG, WEBP ou GIF." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ ok: false, message: "A imagem passa de 4 MB." }, { status: 400 });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const directory = path.join(process.cwd(), "public", "imagens");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, image: `/imagens/${name}` });
}
