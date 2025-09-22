import { CartList, CartSummary } from "./CartComponents";
import styles from './styles/cart.module.css';

export default function Cart() {
  return (
    <div className={styles.cart}>
      <h2 className="text-2xl font-bold mb-4">🛒 Carrito de compras</h2>
      <CartList />
      <CartSummary />
    </div>
  );
}
