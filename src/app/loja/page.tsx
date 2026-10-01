import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function LojaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Loja</h1>
        <p className="text-white/70">Os preços saem daqui. O pagamento abre no Mercado Pago.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
