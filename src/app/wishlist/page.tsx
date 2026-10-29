
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved favourites at Mydhili Collections.",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="bg-[#380712] px-4 py-12 text-center text-white sm:py-16">
        <Heart className="mx-auto mb-4 text-[#D4AF69]" size={30} />
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF69]">
          Your Favourites
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          My Wishlist
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/75">
          Keep the styles you love close at hand.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-white text-[#9A6B35]">
          <Heart size={30} />
        </div>

        <h2 className="mt-6 font-serif text-2xl text-[#380712]">
          Your wishlist is ready for your favourites
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500">
          Browse our collections and save your favourite pieces to build your
          personal wishlist.
        </p>

        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 bg-[#380712] px-6 py-3 text-sm text-white transition hover:bg-[#581020]"
        >
          <ShoppingBag size={17} />
          Explore Collection
        </Link>
      </section>
    </div>
  );
}
