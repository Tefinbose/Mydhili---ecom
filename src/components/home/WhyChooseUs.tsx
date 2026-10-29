import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Gift,
  ArrowRight,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-why",
  display: "swap",
});

const benefits = [
  {
    icon: Sparkles,
    title: "Curated with Care",
    description:
      "Thoughtfully selected styles that celebrate Indian fashion and timeless beauty.",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    description:
      "Beautiful details and comfortable, quality-focused choices for your wardrobe.",
  },
  {
    icon: HeartHandshake,
    title: "A Personal Touch",
    description:
      "A welcoming boutique experience that makes discovering your favourite feel special.",
  },
  {
    icon: Gift,
    title: "Made for Every Moment",
    description:
      "Looks for everyday life, family gatherings, celebrations, and special occasions.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className={`${bricolage.variable} relative isolate overflow-hidden bg-[#380712] px-5 py-10 font-[family-name:var(--font-why)] text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14`}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-72 w-72 rounded-full bg-[#D4AF69]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Header: heading left, intro + link right */}
        <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF69]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">
                The Mydhili Difference
              </p>
            </div>

            <h2 className="text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
              Fashion that feels{" "}
              <span className="text-[#E6C47A]">like you.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:gap-8">
            <p className="max-w-md text-sm font-light leading-7 text-white/70">
              Getting dressed should feel effortless and meaningful. Discover
              styles that bring together comfort, confidence, and the beauty of
              Indian fashion.
            </p>

            <Link
              href="/shop"
              className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b border-[#D4AF69]/60 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C47A] transition hover:border-white hover:text-white"
            >
              Shop the Collection
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Benefits row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isFirst = index === 0;

            return (
              <div
                key={benefit.title}
                className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 sm:p-6 ${
                  isFirst
                    ? "bg-gradient-to-br from-[#E6C47A] via-[#D4AF69] to-[#B8893F] text-[#380712] shadow-[0_16px_40px_rgba(0,0,0,0.25)]"
                    : "border border-[#D4AF69]/20 bg-white/[0.04] hover:border-[#D4AF69]/60 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isFirst
                        ? "bg-[#380712] text-[#E6C47A]"
                        : "border border-[#D4AF69]/40 text-[#E6C47A] group-hover:border-[#D4AF69] group-hover:bg-[#D4AF69] group-hover:text-[#380712]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em]">
                    {benefit.title}
                  </h3>
                </div>

                <p
                  className={`mt-4 text-sm leading-6 ${
                    isFirst ? "text-[#380712]/80" : "font-light text-white/70"
                  }`}
                >
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}