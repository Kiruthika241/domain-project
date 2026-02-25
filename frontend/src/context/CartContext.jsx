// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("furnshop_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("furnshop_cart", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      // dedupe by id — if same id exists, just increment qty if desired,
      // here we prevent duplicate full items
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const value = useMemo(() => ({ cartItems, addToCart, removeFromCart, clearCart }), [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
