import { ShopBrowser } from "@/components/ShopBrowser";
import { loadCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export default async function LojaPage() {
  const products = await loadCatalog();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Loja</h1>
        <p className="max-w-3xl text-white/70">Os itens são os da vipshop. Sem cadastro no banco, vale o config padrão da cidade. Produto novo no painel entra aqui e na loja do jogo. Só o que tem preço em reais vai para o Mercado Pago.</p>
      </div>
      <ShopBrowser products={products} />
    </div>
  );
}
