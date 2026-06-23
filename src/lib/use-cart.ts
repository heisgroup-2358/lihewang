"use client";

import { useState, useCallback } from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image?: string;
};

const STORAGE_KEY = "lihewang-cart";

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      const next = existing
        ? prev.map((i) =>
            i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i,
          )
        : [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((i) => i.slug !== slug);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      const next = prev.map((i) => (i.slug === slug ? { ...i, quantity } : i));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    });
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount: items.length };
}
