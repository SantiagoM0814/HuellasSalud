import { Product } from "../../../helper/typesHS";
import { CartItemProps } from "../types/cart.types";
import styles from "../styles/cart.module.css";

export const CartItem = ({ item, onRemove, onUpdateQty }: CartItemProps) => {
    return (
        <>
            <aside>
                <span>
                    <ProductImg product={item.product} />
                </span>
                <div>
                    <span>{item.product.name}</span>
                    <span>{item.product.price} x {item.quantity}</span>
                </div>
            </aside>
            <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQty(item.product.idProduct, item.quantity - 1)}>
                    ➖
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.product.idProduct, item.quantity + 1)}>
                    ➕
                </button>
                <button
                    onClick={() => onRemove(item.product.idProduct)}
                    className="text-red-500"
                >
                    🗑
                </button>
            </div>
        </>
    );
}

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