"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowUpRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const quickLinks = [
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Kurtis", href: "/categories/kurtis" },
  { label: "Ethnic Wear", href: "/categories/ethnic-wear" },
  { label: "Dresses", href: "/categories/dresses" },
];

export default function WishlistPage() {
  const { items, itemCount, isLoaded, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function triggerToast(message: string) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  function handleMoveToCart(item: WishlistItem) {
    addToCart({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
    });
    triggerToast(`Added "${item.name}" to your shopping bag.`);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#380712]">
      {/* Toast Notification */}
      {toastMessage && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#D4AF69]/40 bg-[#380712] px-5 py-3.5 text-xs text-[#FAF7F2] shadow-2xl transition"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E6C47A] text-[#380712]">
            <Check size={14} strokeWidth={2.5} />
          </span>
          <span>{toastMessage}</span>
          <Link
            href="/cart"
            className="ml-2 font-semibold uppercase tracking-wider text-[#E6C47A] underline underline-offset-4 hover:text-white"
          >
            View Bag
          </Link>
        </aside>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-12 text-center text-white sm:py-16">
        <div className="relative mx-auto max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">
            Personal Collection
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-5xl text-[#FAF7F2]">
            My Wishlist
          </h1>
          <p className="mt-2.5 text-xs font-light text-[#F5DFC0]/80 sm:text-sm">
            {isLoaded
              ? itemCount === 0
                ? "Your saved items will appear here."
                : `${itemCount} saved ${itemCount === 1 ? "piece" : "pieces"} waiting for you.`
              : "Loading your saved favourites..."}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {!isLoaded ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-stone-100" />
                <div className="mt-4 h-4 w-3/4 rounded bg-stone-100" />
                <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
                <div className="mt-5 h-10 w-full rounded-xl bg-stone-100" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty State
          <div className="mx-auto max-w-xl rounded-3xl border border-[#E9DFD2] bg-white px-6 py-14 text-center shadow-sm sm:px-12 sm:py-16">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]">
              <Heart size={36} strokeWidth={1.3} />
            </span>

            <h2 className="mt-6 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2.5 max-w-md text-xs font-light leading-relaxed text-stone-500 sm:text-sm">
              Discover something beautiful from our handwoven sarees, kurtis, and festive ensembles, and tap the heart icon to save it here.
            </p>

            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#380712] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5DFC0] shadow-sm transition hover:bg-[#520A1A]"
              >
                <span>Explore Store</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Quick Category Suggestions */}
            <div className="mt-10 border-t border-stone-100 pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                Popular Categories
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-stone-200 bg-[#FAF7F2] px-4 py-1.5 text-xs text-stone-700 transition hover:border-[#380712] hover:text-[#380712]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Populated Wishlist Grid
          <div>
            {/* Toolbar Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <p className="text-sm font-semibold text-[#380712]">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"} in your wishlist
                </p>
                <p className="text-xs text-stone-500">
                  Items remain saved on this device until you remove them.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  <span>Continue shopping</span>
                  <ArrowUpRight size={13} />
                </Link>

                {showClearConfirm ? (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-1">
                    <span className="px-2 text-[11px] font-medium text-red-700">
                      Clear all items?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearWishlist();
                        setShowClearConfirm(false);
                      }}
                      className="rounded bg-red-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-800"
                    >
                      Yes, clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="rounded border border-stone-200 bg-white px-2 py-1 text-[11px] text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-500 transition hover:border-red-200 hover:text-red-700"
                  >
                    <Trash2 size={13} />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                      <Link
                        href={`/products/${item.slug}`}
                        className="block h-full w-full"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      {/* Remove from wishlist button */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.productId)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-stone-500 shadow-sm backdrop-blur-sm transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="p-4">
                      {item.category && (
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A6B35]">
                          {item.category}
                        </p>
                      )}

                      <Link href={`/products/${item.slug}`}>
                        <h3 className="mt-1 line-clamp-1 font-serif text-base font-semibold text-[#380712] transition hover:text-[#9A6B35]">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-serif text-base font-bold text-[#380712]">
                          ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move to bag button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#380712] px-4 text-xs font-semibold uppercase tracking-wider text-[#F5DFC0] shadow-sm transition hover:bg-[#520A1A] active:scale-[0.99]"
                    >
                      <ShoppingBag size={14} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}