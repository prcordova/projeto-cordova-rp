import { CartView } from "@/components/CartView";

export default function CarrinhoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">Carrinho</h1>
      <CartView />
    </div>
  );
}
