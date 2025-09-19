import { useEffect, useState, ReactNode } from "react";
import { CartContext, CartItem } from "../types/cart.types";
import { Product } from "../../../helper/typesHS";


export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem("shoppingCart");
            if (!storedCart) return;
            const parsed = JSON.parse(storedCart) as CartItem[];
            if (Array.isArray(parsed)) setItems(parsed);
        } catch (err) {
            console.warn("No se pudo cargar el carrito desde el localStorage:", err);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("shoppingCart", JSON.stringify(items));
        } catch (err) {
            console.warn("No se pudo guardar el carrito en localStorage:", err);
        }
    }, [items])

    const addItem = (product: Product, quantity: number = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product.idProduct === product.idProduct);
            if (existing) {
                return prev.map((i) =>
                    i.product.idProduct === product.idProduct ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((i) => i.product.idProduct !== productId));
    };


    const clearCart = () => setItems([]);

    const setCart = (cart: CartItem[]) => setItems(cart);

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, setCart, total }}>
            {children}
        </CartContext.Provider>
    );
}