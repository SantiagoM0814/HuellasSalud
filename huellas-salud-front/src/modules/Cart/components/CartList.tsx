import { useContext } from "react";
import { CartContext } from "../types/cart.types";
import { CartItem } from "./CartItem"

export const CartList: React.FC = () => {
  const { items, setCart } = useContext(CartContext);

  const handleRemove = (id: string) => {
    setCart(items.filter((i) => i.product.idProduct !== id));
  };

  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) return handleRemove(id);
    setCart(
      items.map((i) =>
        i.product.idProduct === id ? { ...i, quantity: newQty } : i
      )
    );
  };

  if (items.length === 0)
    return <p className="text-center p-4">🛒 Tu carrito está vacío</p>;

  return (
    <div>
      {items.map((item) => (
        <CartItem
          key={item.product.idProduct}
          item={item}
          onRemove={handleRemove}
          onUpdateQty={handleUpdateQty}
        />
      ))}
    </div>
  );
};
