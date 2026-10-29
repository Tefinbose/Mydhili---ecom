
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
} from "lucide-react";

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

const CART_KEY = "mydhili-cart";

const fallbackImage =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function readCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export default function CartContent() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refreshCart = useCallback(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    refreshCart();
    setReady(true);

    const handleCartUpdate = () => refreshCart();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null) {
        refreshCart();
      }
    };

    window.addEventListener("mydhili-cart-updated", handleCartUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("mydhili-cart-updated", handleCartUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshCart]);

  const saveCart = (nextItems: CartItem[]) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
      setItems(nextItems);
      window.dispatchEvent(new Event("mydhili-cart-updated"));
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  };

  const updateQuantity = (product: CartItem, change: number) => {
    const nextQuantity = product.quantity + change;

    if (nextQuantity < 1 || nextQuantity > 99) return;

    saveCart(
      items.map((item) =>
        item.productId === product.productId &&
        item.size === product.size &&
        item.color === product.color
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  };

  const removeItem = (product: CartItem) => {
    saveCart(
      items.filter(
        (item) =>
          !(
            item.productId === product.productId &&
            item.size === product.size &&
            item.color === product.color
          )
      )
    );
  };

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  if (!ready) {
    return (
      <section
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        aria-label="Loading shopping bag"
      >
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-6 w-48 bg-[#EDE4D9]" />
          <div className="h-32 bg-[#EDE4D9]" />
          <div className="h-32 bg-[#EDE4D9]" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-xl border border-[#E8DED2] bg-white px-6 py-12 text-center sm:px-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EDE3] text-[#380712]">
            <ShoppingBag size={27} />
          </div>

          <h2 className="mt-6 font-serif text-3xl text-[#380712]">
            Your bag is waiting
          </h2>

          <p className="mt-3 text-sm leading-7 text-stone-500">
            You haven&apos;t added any pieces yet. Explore our collection and
            find something you love.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center justify-center gap-2 bg-[#380712] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#581020]"
          >
            Explore Collection
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A6B35]">
            Almost yours
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#380712] sm:text-3xl">
            Your Selected Pieces
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your bag
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#380712] transition hover:text-[#9A6B35]"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
        {/* Cart items */}
        <div className="min-w-0">
          <div className="hidden grid-cols-[minmax(0,1fr)_100px_110px] border-b border-[#DCCDBD] pb-3 text-xs font-semibold uppercase tracking-wider text-stone-500 sm:grid">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          <div className="divide-y divide-[#E8DED2]">
            {items.map((item, index) => {
              const itemKey = `${item.productId}-${item.size}-${item.color}-${index}`;

              return (
                <article
                  key={itemKey}
                  className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[120px_minmax(0,1fr)_100px_110px] sm:items-center sm:gap-5"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="block overflow-hidden bg-[#F0E7DC]"
                  >
                    <div className="aspect-[3/4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || fallbackImage}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-base leading-6 text-[#380712] hover:text-[#9A6B35] sm:text-lg"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-2 text-sm font-medium text-[#380712]">
                      {formatPrice(item.price)}
                    </p>

                    {(item.size || item.color) && (
                      <div className="mt-2 space-y-1 text-xs text-stone-500">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                    )}

                    {item.sku && (
                      <p className="mt-1 text-xs text-stone-400">
                        SKU: {item.sku}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-500 transition hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>

                  <div className="col-start-2 row-start-2 flex h-9 w-fit items-center border border-[#E3D7CA] bg-white sm:col-start-3 sm:row-start-1 sm:mx-auto">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, -1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-full w-8 items-center justify-center text-[#380712] disabled:opacity-30"
                    >
                      <Minus size={13} />
                    </button>

                    <span className="min-w-7 text-center text-xs">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item, 1)}
                      disabled={item.quantity >= 99}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-full w-8 items-center justify-center text-[#380712] disabled:opacity-30"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <p className="col-start-2 row-start-3 text-sm font-semibold text-[#380712] sm:col-start-4 sm:row-start-1 sm:text-right">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => saveCart([])}
            className="mt-5 text-xs text-stone-500 underline underline-offset-4 transition hover:text-red-700"
          >
            Clear shopping bag
          </button>
        </div>

        {/* Order summary */}
        <aside className="border border-[#E8DED2] bg-white p-5 sm:p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl text-[#380712]">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 border-b border-[#E8DED2] pb-5 text-sm">
            <div className="flex items-center justify-between gap-4 text-stone-600">
              <span>Subtotal ({totalQuantity} items)</span>
              <span className="font-medium text-[#380712]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 text-stone-600">
              <span>Shipping</span>
              <span className="text-right text-xs leading-5">
                Calculated at checkout
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-5">
            <span className="font-medium text-[#380712]">Estimated total</span>
            <span className="text-xl font-semibold text-[#380712]">
              {formatPrice(subtotal)}
            </span>
          </div>

          <p className="mb-5 text-xs leading-5 text-stone-500">
            Shipping charges and the final order amount will be confirmed
            during checkout.
          </p>

          <Link
            href="/checkout"
            className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#380712] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#581020]"
          >
            Proceed to Checkout
            <ArrowRight size={17} />
          </Link>

          <div className="mt-6 space-y-4 border-t border-[#E8DED2] pt-5">
            <div className="flex items-start gap-3">
              <Truck size={19} className="mt-0.5 shrink-0 text-[#9A6B35]" />
              <div>
                <p className="text-xs font-medium text-[#380712]">
                  Delivery details
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Enter your address at checkout to review delivery options.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#9A6B35]"
              />
              <div>
                <p className="text-xs font-medium text-[#380712]">
                  Secure order process
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Your final order will be validated before it is placed.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
