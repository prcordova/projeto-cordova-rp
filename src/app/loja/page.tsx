import { ProductCard } from "@/components/ProductCard";
import { loadCatalog } from "@/lib/catalog-server";
import { categoryLabels, type ShopCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const order: ShopCategory[] = ["vips", "crp", "others", "vehicles", "mansions", "weapons"];

export default async function LojaPage() {
  const products = await loadCatalog();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Loja</h1>
        <p className="max-w-3xl text-white/70">Os itens são os da vipshop. Sem cadastro no banco, vale o config padrão da cidade. Produto novo no painel entra aqui e na loja do jogo. Só o que tem preço em reais vai para o Mercado Pago.</p>
      </div>
      {order.map((category) => {
        const items = products.filter((product) => product.category === category);
        if (!items.length) return null;
        return (
          <section key={category} className="space-y-4">
            <h2 className="text-2xl font-extrabold text-yellow-400">{categoryLabels[category]}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
