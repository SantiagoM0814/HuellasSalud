import { useContext } from "react";
import { AuthContext, Invoice, Product } from "../../helper/typesHS";
import { CartContext, CartItemProps } from "../Cart/types/cart.types";
import styles from "./styles/cart.module.css";
import { formatCurrencyCOP } from "../../helper/formatter";
import { useInvoiceRegister } from "../Invoices/invoiceRegisterService";
import axiosInstance from "../../context/axiosInstance";
import { toast } from "react-toastify";

export const CartItem = ({ item, onRemove, onUpdateQty }: CartItemProps) => {
  return (
    <>
      <section className={styles.productItem}>
        <aside className={styles.productInfo}>
          <span className={styles.imgProduct}>
            <ProductImg product={item.product} />
          </span>
          <div className={styles.productDetails}>
            <span className={styles.productName}>{item.product.name}</span>
            <span className={styles.productQty}>{formatCurrencyCOP(item.product.price)} x {item.quantity}</span>
          </div>
        </aside>
        <aside className={styles.sectionQty}>
          <div className={styles.btnActions}></div>
          <button className={styles.btnMinus} onClick={() => onUpdateQty(item.product.idProduct, item.quantity - 1)}>
            <i className="fa-solid fa-square-minus"></i>
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button className={styles.btnPlus} onClick={() => onUpdateQty(item.product.idProduct, item.quantity + 1)}>
            <i className="fa-solid fa-square-plus"></i>
          </button>
          <div className={styles.btnCartItem}>
            <button
              title="Eliminar"
              onClick={() => onRemove(item.product.idProduct)}
              className={styles.deleteProduct}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </aside>
      </section>
    </>
  );
}

export const CartList = () => {
  const { items, setCart } = useContext(CartContext);

  const handleRemove = (id: string) => {
    setCart(items.filter((i) => i.product.idProduct !== id));
  };

  const handleUpdateQty = (id: string, newQty: number) => {
    const product = items.find((i) => i.product.idProduct === id)?.product;
    if (!product) return;

    if (newQty <= 0) return handleRemove(id);

    if (newQty > product.quantityAvailable) return;

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

export const CartSummary = () => {
  const { items, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const { handleCreateInvoiceSubmit, loading } = useInvoiceRegister({
    setModalInvoice: undefined,
    setInvoicesData: undefined,
    invoiceSelected: undefined
  });

  if (items.length === 0) return null;

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const handlePurchase = async () => {
    try {
      toast.info("Procesando compra... ⌛");

      // 🧾 Armar los datos de la factura (igual que haces en tu modal)
      const invoiceData = {
        idClient: user?.documentNumber,
        typeInvoice: "PRODUCTO",
        total: total,
        itemInvoice: items.map(i => ({
          idProduct: i.product.idProduct,
          idService: null,
          idPet: null,
          quantity: i.quantity,
          unitPrice: i.product.price,
          subTotal: i.product.price * i.quantity,
        })),
      };

      // ✅ Crear la factura usando tu hook
      await handleCreateInvoiceSubmit(invoiceData as unknown as Invoice);

      // 🔄 Disminuir stock de productos
      // await Promise.all(
      //   items.map((i) =>
      //     axiosInstance.put(`/product/update-stock/${i.product.idProduct}`, {
      //       quantity: i.quantity
      //     })
      //   )
      // );

      // 🧹 Limpiar carrito
      clearCart();

      toast.success("Compra completada 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la compra ❌");
    }
  };


  return (
    <div className="flex justify-between items-center p-4 border-t mt-2">
      <p className="font-bold text-lg">Total: {formatCurrencyCOP(total)}</p>
      <button onClick={() => clearCart()}>Limpiar Carrito</button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePurchase}>
        Ir a pagar
      </button>
    </div>
  );
};

export const ProductImg = ({ product }: { product: Product }) => {
  if (product.mediaFile) {
    return (<img src={`data:${product.mediaFile.contentType};base64,${product.mediaFile.attachment}`} alt={product.category} />);
  }

  const initials = product.name.charAt(0).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37AFC', '#FFA07A'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div className={`${styles.imgDefault}`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}