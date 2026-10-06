import { PurchaseHistory } from "@/components/PurchaseHistory";
import { loadPurchases } from "@/lib/purchases";
import { readSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MinhasComprasPage() {
  const user = await readSession();
  if (!user) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">Minhas compras</h1>
        <p className="text-white/70">Entre na conta para ver o histórico. <Link href="/entrar" className="font-semibold text-yellow-400">Entrar</Link></p>
      </div>
    );
  }
  let purchases: Awaited<ReturnType<typeof loadPurchases>> = [];
  try {
    purchases = await loadPurchases(user.id);
  } catch {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">Minhas compras</h1>
        <p className="text-white/70">Não foi possível carregar o histórico agora.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Minhas compras</h1>
        <p className="max-w-3xl text-white/70">O mesmo card da loja. Clique para ver o valor, o tipo, a descrição e o passaporte que recebeu. O que vence em até 7 dias fica na frente, com borda vermelha.</p>
      </div>
      <PurchaseHistory purchases={purchases} />
    </div>
  );
}
