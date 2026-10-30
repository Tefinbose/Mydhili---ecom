
"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  sku?: string;
  size?: string;
  color?: string;
  stock?: number;
}

interface ProductPurchaseOptionsProps {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variants: ProductVariant[];
}

export default function ProductPurchaseOptions({
  productId,
  slug,
  name,
  image,
  price,
  variants,
}: ProductPurchaseOptionsProps) {
  const { addToCart, isLoaded } = useCart();

  const availableVariants = useMemo(
    () => variants.filter((variant) => (variant.stock ?? 0) > 0),
    [variants]
  );

  const sizes = useMemo(
    () => [...new Set(availableVariants.map((v) => v.size).filter(Boolean))] as string[],
    [availableVariants]
  );

  const colors = useMemo(
    () => [...new Set(availableVariants.map((v) => v.color).filter(Boolean))] as string[],
    [availableVariants]
  );

  const [selectedSize, setSelectedSize] = useState(
    availableVariants[0]?.size ?? ""
  );
  const [selectedColor, setSelectedColor] = useState(
    availableVariants[0]?.color ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return undefined;

    return availableVariants.find(
      (variant) =>
        (variant.size ?? "") === selectedSize &&
        (variant.color ?? "") === selectedColor
    );
  }, [variants, availableVariants, selectedSize, selectedColor]);

  const stock = variants.length
    ? selectedVariant?.stock ?? 0
    : undefined;

  const canAdd =
    isLoaded &&
    (variants.length === 0 || Boolean(selectedVariant)) &&
    (stock === undefined || stock > 0);

  function handleAddToCart() {
    if (!canAdd) return;

    addToCart({
      productId,
      slug,
      name,
      image,
      price,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      stock,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  function changeSize(size: string) {
    setSelectedSize(size);

    // If the current colour is unavailable in the new size,
    // select the first available matching colour.
    const matchingVariants = availableVariants.filter(
      (variant) => (variant.size ?? "") === size
    );

    if (
      !matchingVariants.some(
        (variant) => (variant.color ?? "") === selectedColor
      )
    ) {
      setSelectedColor(matchingVariants[0]?.color ?? "");
    }

    setQuantity(1);
  }

  function changeColor(color: string) {
    setSelectedColor(color);

    const matchingVariants = availableVariants.filter(
      (variant) => (variant.color ?? "") === color
    );

    if (
      !matchingVariants.some(
        (variant) => (variant.size ?? "") === selectedSize
      )
    ) {
      setSelectedSize(matchingVariants[0]?.size ?? "");
    }

    setQuantity(1);
  }

  const maxQuantity = stock ?? 99;

  return (
    <div className="mt-8 space-y-7">
      {/* Size selection */}
      {sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Select size</h2>
            <span className="text-xs text-neutral-500">
              {selectedSize || "Choose a size"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => changeSize(size)}
                  className={`min-w-12 border px-4 py-2.5 text-sm transition ${
                    isSelected
                      ? "border-[#380712] bg-[#380712] text-white"
                      : "border-[#D8C9B7] bg-white text-[#380712] hover:border-[#9A6B35]"
                  }`}
                  aria-pressed={isSelected}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colour selection */}
      {colors.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Select colour</h2>
            <span className="text-xs text-neutral-500">
              {selectedColor || "Choose a colour"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              const isAvailable = availableVariants.some(
                (variant) =>
                  (variant.color ?? "") === color &&
                  (variant.size ?? "") === selectedSize
              );

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => changeColor(color)}
                  disabled={!isAvailable}
                  className={`border px-4 py-2.5 text-sm transition ${
                    isSelected
                      ? "border-[#380712] bg-[#380712] text-white"
                      : "border-[#D8C9B7] bg-white text-[#380712] hover:border-[#9A6B35]"
                  } disabled:cursor-not-allowed disabled:opacity-35`}
                  aria-pressed={isSelected}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      <div>
        {variants.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Available for purchase
          </p>
        ) : selectedVariant ? (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            {stock} available in stock
          </p>
        ) : (
          <p className="text-sm text-red-700">
            {availableVariants.length === 0
              ? "Currently out of stock"
              : "This size and colour combination is unavailable"}
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Quantity</h2>

        <div className="inline-flex h-12 items-center border border-[#D8C9B7] bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex h-full w-12 items-center justify-center text-[#380712] transition hover:bg-[#FAF7F2] disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>

          <span className="min-w-10 text-center text-sm">{quantity}</span>

          <button
            type="button"
            onClick={() =>
              setQuantity((q) => Math.min(maxQuantity, q + 1))
            }
            disabled={quantity >= maxQuantity}
            className="flex h-full w-12 items-center justify-center text-[#380712] transition hover:bg-[#FAF7F2] disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canAdd}
        className="flex min-h-14 w-full items-center justify-center gap-3 bg-[#380712] px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition hover:bg-[#520D1D] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to bag
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Add to shopping bag
          </>
        )}
      </button>
    </div>
  );
}
