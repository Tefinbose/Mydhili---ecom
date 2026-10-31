"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
};

type WishlistContextType = {
  items: WishlistItem[];
  itemCount: number;
  isLoaded: boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (idOrSlug: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (idOrSlug: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "mydhili-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Safely restore wishlist from localStorage on mount and sanitize data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Sanitize: filter out legacy string IDs or corrupted items
          const validItems = parsed.filter(
            (item): item is WishlistItem =>
              typeof item === "object" &&
              item !== null &&
              typeof item.productId === "string" &&
              typeof item.name === "string"
          );
          setItems(validItems);
        }
      }
    } catch (error) {
      console.error("Wishlist loading error:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync state to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save wishlist to storage:", error);
      }
    }
  }, [items, isLoaded]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some(
        (saved) =>
          saved.productId === item.productId ||
          (Boolean(saved.slug) && saved.slug === item.slug)
      )
        ? prev
        : [...prev, item]
    );
  }, []);

  const removeFromWishlist = useCallback((idOrSlug: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => item.productId !== idOrSlug && item.slug !== idOrSlug
      )
    );
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some(
        (saved) =>
          saved.productId === item.productId ||
          (Boolean(saved.slug) && saved.slug === item.slug)
      );
      if (exists) {
        return prev.filter(
          (saved) =>
            saved.productId !== item.productId &&
            (!saved.slug || saved.slug !== item.slug)
        );
      }
      return [...prev, item];
    });
  }, []);

  const isInWishlist = useCallback(
    (idOrSlug: string) =>
      items.some(
        (item) => item.productId === idOrSlug || item.slug === idOrSlug
      ),
    [items]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      isLoaded,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [
      items,
      isLoaded,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}
