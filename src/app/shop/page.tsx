import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import ShopProducts from "@/components/shop/ShopProducts";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Explore sarees, kurtis, ethnic wear, dresses, blouses, and accessories at Mydhili Collections.",
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-shop",
  display: "swap",
});

const quickLinks = [
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Kurtis", href: "/categories/kurtis" },
  { label: "Ethnic Wear", href: "/categories/ethnic-wear" },
  { label: "Dresses", href: "/categories/dresses" },
  { label: "Blouses", href: "/categories/blouses" },
  { label: "Accessories", href: "/categories/accessories" },
];

export default function ShopPage() {
  return (
    <div className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-shop)] text-[#380712]`}>
      <section className="relative overflow-hidden bg-[#380712] px-5 py-12 text-center text-white sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">The Mydhili Edit</p>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            Shop all <span className="text-[#E6C47A]">collections.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-7 text-white/75 sm:text-base">
            Discover timeless Indian elegance, thoughtfully selected styles, and pieces for every occasion.
          </p>

          <nav aria-label="Browse by category" className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[#D4AF69]/40 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF69] hover:bg-[#D4AF69] hover:text-[#380712]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <ShopProducts />
    </div>
  );
}