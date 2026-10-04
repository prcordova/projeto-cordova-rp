import { ShopBrowser } from "@/components/ShopBrowser";
import { defaultProducts } from "@/lib/catalog";

export default function LojaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Loja</h1>
        <p className="max-w-3xl text-white/70">Os itens são os da vipshop. Sem cadastro no banco, vale o config padrão da cidade. Produto novo no painel entra aqui e na loja do jogo. Só o que tem preço em reais vai para o Mercado Pago.</p>
      </div>
      <ShopBrowser initialProducts={defaultProducts} />
    </div>
  );
}
