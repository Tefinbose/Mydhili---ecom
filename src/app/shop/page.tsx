
import type { Metadata } from "next";
import ShopProducts from "@/components/shop/ShopProducts";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Explore sarees, kurtis, ethnic wear, dresses, blouses, and accessories at Mydhili Collections.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="border-b border-[#E8DED2] bg-[#380712] px-4 py-14 text-center text-white sm:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF69]">
          The Mydhili Edit
        </p>

        <h1 className="font-serif text-4xl font-medium sm:text-5xl md:text-6xl">
          Shop All Collections
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
          Discover timeless Indian elegance, thoughtfully selected styles,
          and pieces for every occasion.
        </p>
      </section>

      <ShopProducts />
    </div>
  );
}
