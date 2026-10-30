import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowRight,
  Banknote,
  Check,
  House,
  PackageCheck,
  PhoneCall,
  ShoppingBag,
  Truck,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-success",
  display: "swap",
});

type OrderSuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export const instant = false;

const steps = [
  { icon: PhoneCall, title: "We'll contact you", text: "We'll confirm your order details." },
  { icon: PackageCheck, title: "We prepare it", text: "Checked and packed with care." },
  { icon: Truck, title: "On its way", text: "Estimated 1–4 days within India." },
];

const label = "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6B35]";

const goldBtn =
  "group inline-flex h-14 items-center justify-between gap-4 rounded-full " +
  "bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-7 pr-1.5 " +
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] " +
  "shadow-[0_10px_30px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5";

const outlineBtn =
  "inline-flex h-14 items-center justify-center gap-2.5 rounded-full " +
  "border border-[#380712]/25 px-7 text-[12px] font-semibold uppercase " +
  "tracking-[0.14em] text-[#380712] transition-all duration-300 " +
  "hover:border-[#380712] hover:bg-[#380712] hover:text-white";

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { order: orderNumber } = await searchParams;

  return (
    <main
      className={`${bricolage.variable} flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-12 font-[family-name:var(--font-success)] text-[#380712]`}
    >
      <style>{`
        @keyframes pop { 0% { transform: scale(.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .pop { animation: pop .6s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .pop { animation: none; } }
      `}</style>

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E9DFD2] bg-white shadow-[0_30px_80px_rgba(56,7,18,0.1)]">
        {/* Header */}
        <div className="relative overflow-hidden bg-[#380712] px-6 pb-12 pt-10 text-center sm:px-12">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF69]/15 blur-3xl" />

          <span className="pop relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#E6C47A] to-[#B8893F] text-[#380712] shadow-[0_10px_40px_rgba(212,175,105,0.5)]">
            <Check size={38} strokeWidth={2.5} />
          </span>

          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">
              Thank you for shopping with us
            </p>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1 className="mt-4 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
            Order <span className="text-[#E6C47A]">confirmed.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-7 text-white/75">
            Your order has been successfully placed. We appreciate your trust
            in Mydhili Collections.
          </p>
        </div>

        <div className="px-6 pb-8 sm:px-12 sm:pb-10">
          {/* Order details */}
          <div className="-mt-7 grid overflow-hidden rounded-2xl border border-[#E9DFD2] bg-[#FAF7F2] shadow-[0_16px_40px_rgba(56,7,18,0.08)] sm:grid-cols-2">
            {orderNumber && (
              <div className="px-5 py-5 text-center sm:text-left">
                <p className={label}>Your order number</p>
                <p className="mt-1.5 break-all text-xl font-semibold tracking-[0.04em]">
                  {orderNumber}
                </p>
              </div>
            )}

            <div
              className={`flex items-center justify-center gap-3 px-5 py-5 sm:justify-start ${
                orderNumber
                  ? "border-t border-[#E9DFD2] sm:border-l sm:border-t-0"
                  : "sm:col-span-2"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#9A6B35]">
                <Banknote size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className={label}>Payment method</p>
                <p className="mt-0.5 text-sm font-semibold">Cash on Delivery</p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <p className="mb-4 mt-8 text-sm font-semibold">What happens next</p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-[#E9DFD2] p-4">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs font-light leading-5 text-stone-500">{text}</p>
              </li>
            ))}
          </ol>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/shop" className={goldBtn}>
              <span className="inline-flex items-center gap-2.5">
                <ShoppingBag size={16} />
                Continue shopping
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                <ArrowRight size={17} />
              </span>
            </Link>

            <Link href="/" className={outlineBtn}>
              <House size={16} />
              Back to home
            </Link>
          </div>

          <p className="mt-6 text-center text-sm font-light text-stone-500">
            Questions about your order?{" "}
            <Link href="/contact" className="font-medium text-[#380712] underline decoration-[#B99A61] underline-offset-4">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}