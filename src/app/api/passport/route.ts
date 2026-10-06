import { NextResponse } from "next/server";
import { cityIdentity } from "@/lib/city";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, exists: false, message: "Informe o ID do jogador na cidade." }, { status: 400 });
  }
  const found = await cityIdentity({ user: id });
  if (found.state === "offline") {
    return NextResponse.json({ ok: false, exists: false, message: "A cidade não respondeu. O ID só pode ser conferido com o servidor no ar." });
  }
  if (found.state !== "ok") {
    return NextResponse.json({ ok: true, exists: false, message: "Esse passaporte não existe na cidade." });
  }
  return NextResponse.json({ ok: true, exists: true, userId: found.identity.userId, name: found.identity.name || `Passaporte ${found.identity.userId}` });
}
