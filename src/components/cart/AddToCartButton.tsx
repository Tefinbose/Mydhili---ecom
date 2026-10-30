"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  stock?: number;
  quantity?: number;
};

export default function AddToCartButton({
  productId,
  slug,
  name,
  image,
  price,
  size,
  color,
  stock,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addToCart, isLoaded } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = typeof stock === "number" && stock <= 0;

  function handleAddToCart() {
    if (!isLoaded || isOutOfStock) return;

    addToCart({
      productId,
      slug,
      name,
      image,
      price,
      size,
      color,
      stock,
      quantity,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!isLoaded || isOutOfStock}
      className="flex w-full items-center justify-center gap-3 bg-[#380712] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#5a1020] disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {isOutOfStock ? (
        "Out of Stock"
      ) : added ? (
        <>
          <Check size={17} />
          Added to Bag
        </>
      ) : (
        <>
          <ShoppingBag size={17} />
          {isLoaded ? "Add to Bag" : "Loading Cart..."}
        </>
      )}
    </button>
  );
}