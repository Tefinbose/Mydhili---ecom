
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

type ProductVariant = {
  sku?: string;
  size?: string;
  color?: string;
  stock?: number;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: { name: string; slug: string } | string | null;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  variants?: ProductVariant[];
  isFeatured?: boolean;
};

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  sku: string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductDetails({
  product,
}: {
  product: Product;
}) {
  const images = useMemo(() => {
    const validImages = (product.images || []).filter(
      (image) => typeof image === "string" && image.trim().length > 0
    );

    return validImages.length ? validImages : [fallbackImage];
  }, [product.images]);

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const hasSizes = variants.some((variant) => Boolean(variant.size));
  const hasColors = variants.some((variant) => Boolean(variant.color));

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.size)
            .filter((size): size is string => Boolean(size))
        )
      ),
    [variants]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.color)
            .filter((color): color is string => Boolean(color))
        )
      ),
    [variants]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const firstAvailable = variants.find(
      (variant) => (variant.stock ?? 0) > 0
    );

    if (firstAvailable) {
      setSelectedSize(firstAvailable.size || "");
      setSelectedColor(firstAvailable.color || "");
    }
  }, [product._id]); // Initialize when the displayed product changes.

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;

    return variants.find((variant) => {
      const sizeMatches = !hasSizes || variant.size === selectedSize;
      const colorMatches = !hasColors || variant.color === selectedColor;

      return sizeMatches && colorMatches;
    });
  }, [
    variants,
    hasVariants,
    hasSizes,
    hasColors,
    selectedSize,
    selectedColor,
  ]);

  const stock = hasVariants
    ? selectedVariant?.stock ?? 0
    : Number.POSITIVE_INFINITY;

  const outOfStock =
    hasVariants &&
    (!selectedVariant || !Number.isFinite(stock) || stock <= 0);

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : typeof product.category === "string"
        ? product.category
        : "";

  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  function addToCart() {
    if (outOfStock) {
      setNotice("Please select an available size and color.");
      return;
    }

    if (hasVariants && !selectedVariant) {
      setNotice("Please select your product options.");
      return;
    }

    if (quantity < 1 || (hasVariants && quantity > stock)) {
      setNotice("Please select a valid quantity.");
      return;
    }

    try {
      const rawCart = localStorage.getItem("mydhili-cart");
      const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];

      if (!Array.isArray(cart)) {
        throw new Error("Invalid cart data");
      }

      const size = selectedVariant?.size || "";
      const color = selectedVariant?.color || "";
      const sku = selectedVariant?.sku || "";

      const existingIndex = cart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === size &&
          item.color === color
      );

      const existingQuantity =
        existingIndex >= 0 ? cart[existingIndex].quantity : 0;

      if (hasVariants && existingQuantity + quantity > stock) {
        setNotice(`Only ${stock} item(s) are currently available.`);
        return;
      }

      if (existingIndex >= 0) {
        cart[existingIndex] = {
          ...cart[existingIndex],
          quantity: existingQuantity + quantity,
        };
      } else {
        cart.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: images[0],
          quantity,
          size,
          color,
          sku,
        });
      }

      localStorage.setItem("mydhili-cart", JSON.stringify(cart));

      window.dispatchEvent(new Event("mydhili-cart-updated"));
      setNotice("Added to your shopping bag.");
    } catch (error) {
      console.error("Unable to update shopping cart:", error);
      setNotice("Unable to update your bag. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link
        href="/shop"
        className="mb-7 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#380712]"
      >
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
        {/* Product image gallery */}
        <div className="min-w-0">
          <div className="relative overflow-hidden bg-[#F0E7DC]">
            <div className="aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImage] || images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {product.isFeatured && (
              <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#380712]">
                Featured collection
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`aspect-[3/4] overflow-hidden border-2 bg-[#F0E7DC] ${
                    activeImage === index
                      ? "border-[#380712]"
                      : "border-transparent hover:border-[#D4AF69]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${product.name}, image ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information and purchase controls */}
        <div className="flex flex-col pt-1 lg:py-4">
          <div className="border-b border-[#E8DED2] pb-6">
            {categoryName && (
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#9A6B35]">
                {categoryName}
              </p>
            )}

            <h1 className="font-serif text-3xl leading-tight text-[#380712] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 text-sm leading-7 text-stone-600">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-medium text-[#380712]">
                {formatPrice(product.price)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span className="bg-[#EFE1C9] px-2 py-1 text-xs font-semibold text-[#805523]">
                    {Math.round(
                      ((product.compareAtPrice! - product.price) /
                        product.compareAtPrice!) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-stone-500">
              <Check size={14} className="text-[#9A6B35]" />
              Prices displayed in Indian Rupees
            </p>
          </div>

          {/* Size selection */}
          {hasSizes && (
            <div className="border-b border-[#E8DED2] py-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#380712]">
                  Select size
                </h2>
                <span className="text-xs text-stone-500">
                  {selectedSize || "Choose a size"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const available = variants.some(
                    (variant) =>
                      variant.size === size &&
                      (!hasColors || !selectedColor ||
                        variant.color === selectedColor) &&
                      (variant.stock ?? 0) > 0
                  );

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                        setNotice("");
                      }}
                      className={`min-w-12 border px-4 py-3 text-sm transition ${
                        selectedSize === size
                          ? "border-[#380712] bg-[#380712] text-white"
                          : "border-[#E3D7CA] text-stone-700 hover:border-[#9A6B35]"
                      } disabled:cursor-not-allowed disabled:opacity-35`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color selection */}
          {hasColors && (
            <div className="border-b border-[#E8DED2] py-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#380712]">
                  Select color
                </h2>
                <span className="text-xs text-stone-500">
                  {selectedColor || "Choose a color"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const available = variants.some(
                    (variant) =>
                      variant.color === color &&
                      (!hasSizes || !selectedSize ||
                        variant.size === selectedSize) &&
                      (variant.stock ?? 0) > 0
                  );

                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSelectedColor(color);
                        setQuantity(1);
                        setNotice("");
                      }}
                      className={`border px-4 py-2.5 text-sm transition ${
                        selectedColor === color
                          ? "border-[#380712] bg-[#F0E7DC] text-[#380712]"
                          : "border-[#E3D7CA] bg-white text-stone-600 hover:border-[#9A6B35]"
                      } disabled:cursor-not-allowed disabled:opacity-35`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and cart */}
          <div className="border-b border-[#E8DED2] py-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#380712]">
                Quantity
              </h2>
              {hasVariants && (
                <span className="text-xs text-stone-500">
                  {outOfStock
                    ? "Select an available option"
                    : `${stock} available`}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex h-12 items-center border border-[#E3D7CA] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center text-[#380712] disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>

                <span className="min-w-9 text-center text-sm">{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(
                        hasVariants ? Math.max(1, stock) : 99,
                        value + 1
                      )
                    )
                  }
                  disabled={hasVariants && (outOfStock || quantity >= stock)}
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-[#380712] disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={addToCart}
                disabled={outOfStock}
                className="flex h-12 flex-1 items-center justify-center gap-2 bg-[#380712] px-5 text-sm font-medium text-white transition hover:bg-[#581020] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag size={17} />
                {outOfStock ? "Unavailable" : "Add to Bag"}
              </button>

              <button
                type="button"
                onClick={() => setWishlist((value) => !value)}
                aria-label={
                  wishlist ? "Remove from wishlist" : "Add to wishlist"
                }
                aria-pressed={wishlist}
                className={`flex h-12 w-12 items-center justify-center border transition ${
                  wishlist
                    ? "border-[#380712] bg-[#F0E7DC] text-[#380712]"
                    : "border-[#E3D7CA] bg-white text-[#380712] hover:border-[#9A6B35]"
                }`}
              >
                <Heart size={19} fill={wishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {notice && (
              <p
                role="status"
                aria-live="polite"
                className="mt-4 border border-[#E8DED2] bg-white px-4 py-3 text-sm text-[#380712]"
              >
                {notice}
                {notice === "Added to your shopping bag." && (
                  <Link
                    href="/cart"
                    className="ml-2 font-semibold underline underline-offset-4"
                  >
                    View bag
                  </Link>
                )}
              </p>
            )}
          </div>

          {/* Boutique service information */}
          <div className="grid gap-4 py-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Truck size={20} className="mt-0.5 shrink-0 text-[#9A6B35]" />
              <div>
                <p className="text-sm font-medium text-[#380712]">
                  Delivery information
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Shipping options and charges are confirmed at checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#9A6B35]"
              />
              <div>
                <p className="text-sm font-medium text-[#380712]">
                  Boutique support
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Need help with your selection? Contact our boutique.
                </p>
                <a
                  href="https://www.instagram.com/mydhilicollections2010/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-semibold text-[#9A6B35] hover:text-[#380712]"
                >
                  Message us ↗
                </a>
              </div>
            </div>
          </div>

          {/* Product description */}
          {product.description && (
            <div className="border-t border-[#E8DED2] pt-6">
              <h2 className="font-serif text-xl text-[#380712]">
                Product Details
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
