import { useContext } from "react";
import { CartContext } from "../types/cart.types";

export const CartSummary: React.FC = () => {
  const { items } = useContext(CartContext);

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="flex justify-between items-center p-4 border-t mt-2">
      <p className="font-bold text-lg">Total: ${total.toFixed(2)}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Ir a pagar
      </button>
    </div>
  );
};
