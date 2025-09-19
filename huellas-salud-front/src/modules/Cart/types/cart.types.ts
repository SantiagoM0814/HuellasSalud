import { createContext } from "react";
import { Product } from "../../../helper/typesHS";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    setCart: (cart: CartItem[]) => void;
    total: number;
}

export const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
    setCart: () => {},
    total: 0,
});

export interface CartItemProps {
    item: CartItem,
    onRemove: (id: string) => void;
    onUpdateQty: (id: string, newQty: number) =>  void;
}

