import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/payments";
import { readSession } from "@/lib/session";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await readSession();
  if (!user) return NextResponse.json({ ok: false, message: "Entre na conta para comprar." }, { status: 401 });
  if (!user.emailVerified) return NextResponse.json({ ok: false, message: "Confirme o e-mail antes de comprar." }, { status: 403 });
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Informe o passaporte e os itens do carrinho." }, { status: 400 });
  if (!parsed.data.acceptedTerms) return NextResponse.json({ ok: false, message: "Aceite os termos da loja para finalizar a compra." }, { status: 400 });
  try {
    const result = await createCheckout({
      userId: user.id,
      email: user.email,
      name: user.name,
      discordId: user.discordId,
      targetId: parsed.data.targetId,
      items: parsed.data.items
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível gravar o pedido." }, { status: 500 });
  }
}
