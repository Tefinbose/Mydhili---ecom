import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-promo",
  display: "swap",
});

// Replace with your own photos, e.g. "/promo/banner.jpg"
const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=2000&q=90";
const ARCH_IMAGE =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=90";

const quickLinks = [
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Kurtis", href: "/categories/kurtis" },
  { label: "Ethnic Wear", href: "/categories/ethnic-wear" },
];

export default function PromoBanner() {
  return (
    <section
      className={`${bricolage.variable} bg-[#FAF7F2] px-5 py-8 font-[family-name:var(--font-promo)] sm:px-8 sm:py-10 lg:px-10 lg:py-12`}
    >
      <div className="group/banner relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#380712] shadow-[0_24px_60px_rgba(56,7,18,0.2)]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out group-hover/banner:scale-105"
          style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#210309]/95 via-[#380712]/88 to-[#380712]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#210309]/50 via-transparent to-transparent" />

        {/* Inner frame */}
        <div className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-[#D4AF69]/30 sm:inset-5" />

        <div className="relative grid min-h-[400px] items-center gap-8 px-7 py-10 sm:px-12 sm:py-12 lg:min-h-[460px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:px-14 lg:py-14">
          {/* Text */}
          <div className="max-w-2xl text-white">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF69]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">
                A Little Something Special
              </p>
            </div>

            <h2 className="text-[clamp(2.2rem,5vw,4.3rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Make room for
              <br />
              <span className="text-[#E6C47A]">something beautiful.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm font-light leading-7 text-white/75 sm:text-base sm:leading-8">
              From everyday favourites to statement pieces for your special
              moments, discover styles that feel personal, timeless, and
              uniquely yours.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group relative inline-flex h-12 items-center gap-4 overflow-hidden rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-7 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,175,105,0.5)] sm:h-14 sm:pl-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 opacity-0 blur-[2px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />
                <span className="relative">Find Your Favourite</span>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg] sm:h-11 sm:w-11">
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </Link>

              <Link
                href="/about"
                className="inline-flex h-12 items-center rounded-full border border-white/35 bg-white/5 px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#E6C47A] hover:text-[#E6C47A] sm:h-14 sm:px-8"
              >
                Our Story
              </Link>
            </div>

            {/* Quick category chips */}
            <div className="mt-10 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-6">
              <span className="mr-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">
                Popular
              </span>
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group/chip inline-flex items-center gap-1.5 rounded-full border border-[#D4AF69]/30 px-4 py-2 text-xs font-medium text-white/85 transition-all duration-300 hover:border-[#D4AF69] hover:bg-[#D4AF69] hover:text-[#380712]"
                >
                  {item.label}
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Arch image (desktop) */}
          <div className="relative hidden h-full min-h-[380px] lg:block">
            <div className="absolute right-[8%] top-1/2 aspect-[3/4] h-[100%] max-h-[420px] -translate-y-1/2">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] border border-[#D4AF69]/50" />

              <div className="relative h-full w-full overflow-hidden rounded-t-[999px] bg-[#6D2636] shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover/banner:scale-105"
                  style={{ backgroundImage: `url('${ARCH_IMAGE}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#210309]/50 via-transparent to-transparent" />
              </div>

              {/* Floating label */}
              <div className="animate-float-slow absolute -left-12 bottom-12 rounded-2xl border border-[#D4AF69]/40 bg-[#210309]/85 px-5 py-3.5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#D4AF69]">
                  Mydhili Collections
                </p>
                <p className="mt-1 text-lg font-medium tracking-[-0.02em] text-white">
                  Timeless elegance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[#D4AF69] to-transparent" />
      </div>
    </section>
  );
}