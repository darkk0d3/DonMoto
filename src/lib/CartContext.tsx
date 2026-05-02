import { createContext, useContext, useState, ReactNode } from "react";
import {
  CartItem,
  getCart,
  addToCart as storeAdd,
  removeFromCart as storeRemove,
  clearCart as storeClear,
} from "./store";

interface CartContextType {
  cart: CartItem[];
  addItem: (product: { id: string; name: string; price: number; image: string }) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addItem = (product: { id: string; name: string; price: number; image: string }) => {
    setCart(storeAdd(product));
  };

  const removeItem = (productId: string) => {
    setCart(storeRemove(productId));
  };

  const clearCart = () => {
    storeClear();
    setCart([]);
  };

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, itemCount, total, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
