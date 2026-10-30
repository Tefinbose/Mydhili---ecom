import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, Heart, Search, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved favourites at Mydhili Collections.",
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-wishlist",
  display: "swap",
});

const steps = [
  { icon: Search, title: "Browse", text: "Explore our latest collections." },
  { icon: Heart, title: "Tap the heart", text: "Save the pieces you love." },
  { icon: ShoppingBag, title: "Come back", text: "Find them here when ready." },
];

const quickLinks = [
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Kurtis", href: "/categories/kurtis" },
  { label: "Ethnic Wear", href: "/categories/ethnic-wear" },
];

const goldBtn =
  "group inline-flex h-14 items-center gap-4 rounded-full " +
  "bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 " +
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] " +
  "shadow-[0_10px_30px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5";

export default function WishlistPage() {
  return (
    <div
      className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-wishlist)] text-[#380712]`}
    >
      {/* Header */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-14 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">
              Your Favourites
            </p>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            My <span className="text-[#E6C47A]">wishlist.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-7 text-white/75 sm:text-base">
            Keep the styles you love close at hand.
          </p>
        </div>
      </section>

      {/* Empty state card, overlapping the header */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="relative z-10 mx-auto -mt-8 max-w-3xl rounded-3xl border border-[#E9DFD2] bg-white px-6 py-12 text-center shadow-[0_30px_80px_rgba(56,7,18,0.1)] sm:px-12 sm:py-14">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]">
            <Heart size={36} strokeWidth={1.3} />
          </span>

          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            Your wishlist is ready for{" "}
            <span className="text-[#A27B35]">your favourites.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-7 text-stone-600">
            Browse our collections and save your favourite pieces to build your
            personal wishlist.
          </p>

          {/* How it works */}
          <ol className="mt-9 grid gap-3 text-left sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                className="rounded-2xl border border-[#E9DFD2] bg-[#FAF7F2] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9A6B35]">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#A27B35]">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs font-light leading-5 text-stone-500">
                  {text}
                </p>
              </li>
            ))}
          </ol>

          <Link href="/shop" className={`${goldBtn} mt-9`}>
            Explore Collection
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]">
              <ArrowRight size={17} strokeWidth={2} />
            </span>
          </Link>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 border-t border-[#380712]/10 pt-6">
            <span className="mr-1 text-[10px] font-medium uppercase tracking-[0.22em] text-stone-400">
              Popular
            </span>
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#D4AF69]/40 px-4 py-2 text-xs font-medium transition-all duration-300 hover:border-[#D4AF69] hover:bg-[#D4AF69]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}