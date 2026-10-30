"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Minus, Plus, RefreshCw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-product", display: "swap" });

type ProductVariant = { sku?: string; size?: string; color?: string; stock?: number };
type Product = {
  _id: string; name: string; slug: string; description?: string; shortDescription?: string;
  category?: { name: string; slug: string } | string | null; price: number; compareAtPrice?: number;
  images?: string[]; variants?: ProductVariant[]; isFeatured?: boolean;
};
type CartItem = {
  productId: string; slug: string; name: string; price: number; image: string;
  quantity: number; size: string; color: string; sku: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85";
const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A6B35]";
const iconBtn = "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 active:scale-95";
const goldBtn = "group relative flex h-14 flex-1 items-center justify-between rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-7 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

function OptionGroup({ title, value, placeholder, values, isAvailable, onSelect, round }: {
  title: string; value: string; placeholder: string; values: string[];
  isAvailable: (v: string) => boolean; onSelect: (v: string) => void; round?: boolean;
}) {
  return (
    <div className="border-b border-[#E9DFD2] py-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs font-light text-stone-500">{value || placeholder}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v} type="button" disabled={!isAvailable(v)} onClick={() => onSelect(v)}
            className={`${round ? "px-5" : "min-w-12 px-4"} rounded-full border py-2.5 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:line-through disabled:opacity-35 ${value === v ? "border-[#380712] bg-[#380712] text-[#E6C47A]" : "border-[#E3D7CA] bg-white hover:border-[#D4AF69]"}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function Perk({ icon: Icon, title, children }: { icon: typeof Truck; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#E9DFD2] bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]"><Icon size={18} strokeWidth={1.5} /></span>
      <div className="text-xs font-light leading-5 text-stone-500"><p className="text-sm font-semibold text-[#380712]">{title}</p>{children}</div>
    </div>
  );
}

export default function ProductDetails({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlist = isInWishlist(product._id);

  const images = useMemo(() => {
    const valid = (product.images || []).filter((i) => typeof i === "string" && i.trim().length > 0);
    return valid.length ? valid : [fallbackImage];
  }, [product.images]);

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const sizes = useMemo(() => Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => Boolean(s)))), [variants]);
  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c)))), [variants]);
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const first = variants.find((v) => (v.stock ?? 0) > 0);
    setSelectedSize(first?.size || "");
    setSelectedColor(first?.color || "");
    setActiveImage(0);
    setQuantity(1);
    setNotice("");
  }, [product._id]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return variants.find((v) => (!hasSizes || v.size === selectedSize) && (!hasColors || v.color === selectedColor));
  }, [variants, hasVariants, hasSizes, hasColors, selectedSize, selectedColor]);

  const stock = hasVariants ? selectedVariant?.stock ?? 0 : Number.POSITIVE_INFINITY;
  const outOfStock = hasVariants && (!selectedVariant || !Number.isFinite(stock) || stock <= 0);
  const lowStock = hasVariants && !outOfStock && stock <= 5;
  const categoryName = typeof product.category === "object" && product.category ? product.category.name : typeof product.category === "string" ? product.category : "";
  const hasDiscount = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const discount = hasDiscount ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0;

  // A size/colour is available if some in-stock variant matches it (and the other chosen option)
  const isAvailable = (key: "size" | "color", value: string) => {
    const other = key === "size" ? "color" : "size";
    const otherSelected = key === "size" ? selectedColor : selectedSize;
    const hasOther = key === "size" ? hasColors : hasSizes;
    return variants.some((v) => v[key] === value && (!hasOther || !otherSelected || v[other] === otherSelected) && (v.stock ?? 0) > 0);
  };

  const pick = (set: (v: string) => void) => (v: string) => { set(v); setQuantity(1); setNotice(""); };

  function handleWishlist() {
    toggleWishlist({ productId: product._id, slug: product.slug, name: product.name, price: product.price, image: images[0] });
    setNotice(wishlist ? "Removed from your wishlist." : "Added to your wishlist.");
  }

  function addToCart() {
    if (outOfStock) return setNotice("Please select an available size and color.");
    if (hasVariants && !selectedVariant) return setNotice("Please select your product options.");
    if (quantity < 1 || (hasVariants && quantity > stock)) return setNotice("Please select a valid quantity.");

    try {
      const rawCart = localStorage.getItem("mydhili-cart");
      const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];
      if (!Array.isArray(cart)) throw new Error("Invalid cart data");

      const size = selectedVariant?.size || "";
      const color = selectedVariant?.color || "";
      const sku = selectedVariant?.sku || "";
      const index = cart.findIndex((i) => i.productId === product._id && i.size === size && i.color === color);
      const existing = index >= 0 ? cart[index].quantity : 0;

      if (hasVariants && existing + quantity > stock) return setNotice(`Only ${stock} item(s) are currently available.`);

      if (index >= 0) cart[index] = { ...cart[index], quantity: existing + quantity };
      else cart.push({ productId: product._id, slug: product.slug, name: product.name, price: product.price, image: images[0], quantity, size, color, sku });

      localStorage.setItem("mydhili-cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("mydhili-cart-updated"));
      setNotice("Added to your shopping bag.");
    } catch (error) {
      console.error("Unable to update shopping cart:", error);
      setNotice("Unable to update your bag. Please try again.");
    }
  }

  return (
    <section className={`${bricolage.variable} mx-auto max-w-7xl px-4 py-8 font-[family-name:var(--font-product)] text-[#380712] sm:px-6 sm:py-10 lg:px-8`}>
      <Link href="/shop" className="group mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#380712]">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#380712] to-[#6D2636] shadow-[0_24px_60px_rgba(56,7,18,0.12)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[activeImage] || images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
              {hasDiscount && <span className="rounded-full bg-[#D4AF69] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]">Save {discount}%</span>}
              {product.isFeatured && <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm">Featured</span>}
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`} aria-pressed={activeImage === index}
                  className={`aspect-[3/4] overflow-hidden rounded-xl border-2 bg-[#F0E7DC] transition-all duration-300 ${activeImage === index ? "border-[#380712]" : "border-transparent opacity-70 hover:border-[#D4AF69] hover:opacity-100"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${product.name}, image ${index + 1}`} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="border-b border-[#E9DFD2] pb-6">
            {categoryName && (
              <div className="mb-3 flex items-center gap-3"><span className="h-px w-8 bg-[#A27B35]" /><p className={eyebrow}>{categoryName}</p></div>
            )}
            <h1 className="text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em]">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-sm font-light leading-7 text-stone-600">{product.shortDescription}</p>}

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-semibold tracking-[-0.03em]">{formatPrice(product.price)}</span>
              {hasDiscount && <span className="text-base text-stone-400 line-through">{formatPrice(product.compareAtPrice!)}</span>}
            </div>
            <p className="mt-2 text-xs font-light text-stone-500">Prices in Indian Rupees</p>
          </div>

          {hasSizes && <OptionGroup title="Select size" value={selectedSize} placeholder="Choose a size" values={sizes} isAvailable={(v) => isAvailable("size", v)} onSelect={pick(setSelectedSize)} />}
          {hasColors && <OptionGroup round title="Select colour" value={selectedColor} placeholder="Choose a colour" values={colors} isAvailable={(v) => isAvailable("color", v)} onSelect={pick(setSelectedColor)} />}

          {/* Quantity + actions */}
          <div className="border-b border-[#E9DFD2] py-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Quantity</h2>
              {hasVariants && (
                <span className={`text-xs ${lowStock ? "font-medium text-[#B45309]" : "font-light text-stone-500"}`}>
                  {outOfStock ? "Select an available option" : lowStock ? `Only ${stock} left` : `${stock} available`}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex h-14 items-center rounded-full border border-[#380712]/15 bg-white p-1">
                <button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))} disabled={quantity <= 1} aria-label="Decrease quantity" className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#380712] hover:text-[#E6C47A] disabled:pointer-events-none disabled:opacity-30">
                  <Minus size={15} strokeWidth={2} />
                </button>
                <span className="min-w-9 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                <button type="button" onClick={() => setQuantity((v) => Math.min(hasVariants ? Math.max(1, stock) : 99, v + 1))} disabled={hasVariants && (outOfStock || quantity >= stock)} aria-label="Increase quantity" className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#380712] hover:text-[#E6C47A] disabled:pointer-events-none disabled:opacity-30">
                  <Plus size={15} strokeWidth={2} />
                </button>
              </div>

              <button type="button" onClick={addToCart} disabled={outOfStock} className={goldBtn}>
                <span className="inline-flex items-center gap-2.5"><ShoppingBag size={16} />{outOfStock ? "Unavailable" : "Add to bag"}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]"><ArrowRight size={17} /></span>
              </button>

              <button type="button" onClick={handleWishlist} aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wishlist} className={`${iconBtn} h-14 w-14 ${wishlist ? "border-[#380712] bg-[#380712] text-[#E6C47A]" : "border-[#380712]/20 bg-white hover:border-[#380712]"}`}>
                <Heart size={19} fill={wishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {notice && (
              <p role="status" aria-live="polite" className="mt-4 rounded-2xl border border-[#D4AF69]/40 bg-[#FAF3E8] px-4 py-3 text-sm">
                {notice}
                {notice === "Added to your shopping bag." && <Link href="/cart" className="ml-2 font-semibold underline underline-offset-4">View bag</Link>}
                {notice.includes("wishlist") && <Link href="/wishlist" className="ml-2 font-semibold underline underline-offset-4">View wishlist</Link>}
              </p>
            )}
          </div>

          {/* Perks */}
          <div className="grid gap-3 py-5 sm:grid-cols-3">
            <Perk icon={Truck} title="Delivery">Shipping options and charges are confirmed at checkout.</Perk>
            <Perk icon={RefreshCw} title="Returns">Easy request process. <Link href="/faq" className="font-medium text-[#9A6B35] underline underline-offset-2">See FAQ</Link></Perk>
            <Perk icon={ShieldCheck} title="Support">
              Need help choosing?{" "}
              <a href="https://www.instagram.com/mydhilicollections2010/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-medium text-[#9A6B35] hover:text-[#380712]">Message us <ArrowUpRight size={12} /></a>
            </Perk>
          </div>

          {product.description && (
            <div className="rounded-3xl border border-[#E9DFD2] bg-white p-6">
              <h2 className="text-lg font-semibold tracking-[-0.02em]">Product details</h2>
              <p className="mt-3 whitespace-pre-line text-sm font-light leading-7 text-stone-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}