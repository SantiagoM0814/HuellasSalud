import { CartList } from "../components/CartList";
import { CartSummary } from "../components/CartSummary";

export default function CartPage() {
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🛒 Carrito de compras</h2>
      <CartList />
      <CartSummary />
    </div>
  );
}
