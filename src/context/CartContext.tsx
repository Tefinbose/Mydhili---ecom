"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  stock?: number;
};

type AddCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoaded: boolean;
  addToCart: (item: AddCartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "mydhili-shopping-cart";

export function getCartItemKey(item: {
  productId: string;
  size?: string;
  color?: string;
}) {
  return `${item.productId}__${item.size ?? ""}__${item.color ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart remains usable for the current session if storage is unavailable.
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((newItem: AddCartItem) => {
    const quantity = Math.max(1, Math.floor(newItem.quantity ?? 1));

    setItems((currentItems) => {
      const key = getCartItemKey(newItem);
      const existing = currentItems.find(
        (item) => getCartItemKey(item) === key
      );

      if (existing) {
        return currentItems.map((item) => {
          if (getCartItemKey(item) !== key) return item;

          const nextQuantity = item.quantity + quantity;
          return {
            ...item,
            quantity:
              typeof item.stock === "number"
                ? Math.min(nextQuantity, item.stock)
                : nextQuantity,
          };
        });
      }

      const safeQuantity =
        typeof newItem.stock === "number"
          ? Math.min(quantity, newItem.stock)
          : quantity;

      return [...currentItems, { ...newItem, quantity: safeQuantity }];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) =>
        current.filter((item) => getCartItemKey(item) !== key)
      );
      return;
    }

    setItems((current) =>
      current.map((item) => {
        if (getCartItemKey(item) !== key) return item;

        return {
          ...item,
          quantity:
            typeof item.stock === "number"
              ? Math.min(Math.floor(quantity), item.stock)
              : Math.floor(quantity),
        };
      })
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setItems((current) =>
      current.filter((item) => getCartItemKey(item) !== key)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isLoaded,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isLoaded,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}