
import type { Metadata } from "next";
import CartContent from "@/components/cart/CartContent";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description:
    "Review your selected styles and prepare your order at Mydhili Collections.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="bg-[#380712] px-4 py-12 text-center text-white sm:py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF69]">
          Your Selection
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Your Shopping Bag
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/75">
          Your favourite pieces, collected in one place.
        </p>
      </section>

      <CartContent />
    </div>
  );
}
