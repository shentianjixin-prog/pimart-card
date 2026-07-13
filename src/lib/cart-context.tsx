"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  priceJpy: number;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalCount: number;
  totalJpy: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "card-shop-cart";

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 50).filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return (
        typeof candidate.productId === "string" && candidate.productId.length > 0 &&
        typeof candidate.name === "string" &&
        typeof candidate.slug === "string" &&
        typeof candidate.image === "string" &&
        Number.isInteger(candidate.priceJpy) && Number(candidate.priceJpy) >= 0 &&
        Number.isInteger(candidate.stock) && Number(candidate.stock) > 0 &&
        Number.isInteger(candidate.quantity) && Number(candidate.quantity) > 0 &&
        Number(candidate.quantity) <= Number(candidate.stock)
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // SSR returns an empty cart; the browser initializer restores validated local data.
  // Cart-dependent UI uses useSyncExternalStore's server snapshot to avoid hydration drift.
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      if (!Number.isInteger(item.stock) || item.stock <= 0) return;
      const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          const nextQty = Math.min(existing.quantity + safeQuantity, item.stock);
          return prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: nextQty } : i
          );
        }
        return [...prev, { ...item, quantity: Math.min(safeQuantity, item.stock) }];
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, Math.min(Math.floor(Number(quantity) || 1), i.stock)) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const totalJpy = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.priceJpy, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalCount,
      totalJpy,
    }),
    [items, addItem, updateQuantity, removeItem, clear, totalCount, totalJpy]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
