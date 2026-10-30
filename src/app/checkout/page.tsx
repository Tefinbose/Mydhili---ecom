"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole,
  MapPin, Package, ShoppingBag, Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-checkout", display: "swap" });

type CheckoutForm = {
  name: string; email: string; phone: string; address: string;
  city: string; state: string; pincode: string; landmark: string;
};

type FieldDef = {
  name: keyof CheckoutForm; label: string; placeholder: string;
  autoComplete?: string; type?: string; span?: boolean; optional?: boolean;
  textarea?: boolean; inputMode?: "numeric"; pattern?: string; maxLength?: number;
};

const initialForm: CheckoutForm = {
  name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", landmark: "",
};

const contactFields: FieldDef[] = [
  { name: "name", label: "Full name", placeholder: "Enter your full name", autoComplete: "name", span: true },
  { name: "email", label: "Email address", placeholder: "you@example.com", autoComplete: "email", type: "email" },
  { name: "phone", label: "Phone number", placeholder: "Enter phone number", autoComplete: "tel", type: "tel" },
];

const addressFields: FieldDef[] = [
  { name: "address", label: "House / street address", placeholder: "House number, street, area", autoComplete: "street-address", span: true, textarea: true },
  { name: "city", label: "City", placeholder: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", placeholder: "State", autoComplete: "address-level1" },
  { name: "pincode", label: "PIN code", placeholder: "6-digit PIN code", autoComplete: "postal-code", inputMode: "numeric", pattern: "[0-9]{6}", maxLength: 6 },
  { name: "landmark", label: "Landmark", placeholder: "Nearby landmark (optional)", optional: true },
];

const steps = ["Bag", "Checkout", "Confirmation"];
const inputCls = "w-full rounded-xl border border-[#E5DDD2] bg-[#FFFEFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#D4AF69] focus:ring-4 focus:ring-[#D4AF69]/20";
const labelCls = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#380712]";
const cardCls = "rounded-3xl border border-[#E9DFD2] bg-white p-6 shadow-[0_10px_30px_rgba(56,7,18,0.04)] md:p-8";
const goldBtn = "group relative flex h-14 w-full items-center justify-between rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60";

function formatPrice(value: unknown): string {
  const amount = Number(value);
  return `₹${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

function Section({ icon: Icon, title, sub, children }: { icon: typeof MapPin; title: string; sub: string; children: ReactNode }) {
  return (
    <section className={cardCls}>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]">
          <Icon size={20} strokeWidth={1.5} />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
          <p className="mt-0.5 text-xs font-light text-stone-500">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ f, value, onChange }: { f: FieldDef; value: string; onChange: (k: keyof CheckoutForm, v: string) => void }) {
  const common = {
    id: f.name, required: !f.optional, value, placeholder: f.placeholder,
    autoComplete: f.autoComplete, className: inputCls,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(f.name, e.target.value),
  };
  return (
    <div className={f.span ? "md:col-span-2" : ""}>
      <label htmlFor={f.name} className={labelCls}>{f.label}{!f.optional && " *"}</label>
      {f.textarea ? (
        <textarea rows={3} {...common} className={`${inputCls} resize-none`} />
      ) : (
        <input type={f.type} inputMode={f.inputMode} pattern={f.pattern} maxLength={f.maxLength} {...common} />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paymentMethod = "cod";
  const shippingCharge = 0;
  const total = Number(subtotal || 0) + shippingCharge;
  const wrap = `${bricolage.variable} font-[family-name:var(--font-checkout)] bg-[#FAF7F2] text-[#380712]`;

  const handleChange = (field: keyof CheckoutForm, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!items.length) return setError("Your shopping bag is empty.");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: {
            address: form.address, city: form.city, state: form.state,
            pincode: form.pincode, landmark: form.landmark,
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to place your order.");
      if (!data.orderNumber) throw new Error("Order was created, but the order number was not returned.");

      clearCart();
      router.push(`/order-success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className={`${wrap} flex min-h-screen items-center justify-center`}>
        <p className="animate-pulse text-sm font-light">Loading your checkout...</p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className={`${wrap} flex min-h-[70vh] items-center justify-center px-5 py-16`}>
        <div className={`${cardCls} max-w-md text-center`}>
          <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]">
            <ShoppingBag size={34} strokeWidth={1.3} />
          </span>
          <h1 className="text-3xl font-semibold tracking-[-0.03em]">Your bag is <span className="text-[#A27B35]">empty.</span></h1>
          <p className="mt-3 text-sm font-light text-stone-600">Add something beautiful to your bag before checking out.</p>
          <Link href="/shop" className="mt-7 inline-flex h-12 items-center rounded-full bg-[#380712] px-8 text-xs font-semibold uppercase tracking-[0.14em] text-[#E6C47A] transition hover:bg-[#5A1725]">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`${wrap} min-h-screen`}>
      {/* Top bar */}
      <div className="border-b border-[#E9DFD2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/cart" className="group flex items-center gap-2 text-sm transition hover:text-[#9A6B35]">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to bag
          </Link>
          <Link href="/" className="text-xl font-semibold tracking-[0.14em]">MYDHILI</Link>
          <span className="hidden items-center gap-2 text-xs font-light text-stone-500 sm:flex">
            <LockKeyhole size={15} /> Secure checkout
          </span>
          <span className="w-5 sm:hidden" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {/* Heading + steps */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A27B35]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#946C2D] sm:text-xs">Almost yours</p>
            </div>
            <h1 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              <span className="text-[#A27B35]">Check</span>out
            </h1>
          </div>
          <ol className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-3.5 py-2 ${i < 2 ? "bg-[#380712] text-[#E6C47A]" : "border border-[#380712]/15 bg-white text-[#380712]/50"}`}>{s}</span>
                {i < 2 && <span className="h-px w-4 bg-[#D4AF69]/60" />}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="space-y-6">
            <Section icon={MapPin} title="Contact information" sub="Your details for order updates.">
              <div className="grid gap-5 md:grid-cols-2">
                {contactFields.map((f) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} />)}
              </div>
            </Section>

            <Section icon={Truck} title="Delivery address" sub="Where should we deliver your order?">
              <div className="grid gap-5 md:grid-cols-2">
                {addressFields.map((f) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} />)}
              </div>
            </Section>

            <Section icon={CreditCard} title="Payment method" sub="Choose how you would like to pay.">
              <div className="flex items-center gap-4 rounded-2xl border border-[#D4AF69] bg-[#FCF8F1] p-5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#9A6B35]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9A6B35]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Cash on Delivery</p>
                  <p className="mt-0.5 text-xs font-light text-stone-500">Pay when your order arrives.</p>
                </div>
                <CheckCircle2 className="text-[#9A6B35]" size={20} />
              </div>
              <div className="mt-3 flex items-center gap-4 rounded-2xl border border-dashed border-[#D8CFC3] p-5 opacity-60">
                <CreditCard size={20} className="text-stone-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Online payment</p>
                  <p className="mt-0.5 text-xs font-light text-stone-500">Online payment will be available soon.</p>
                </div>
                <span className="rounded-full bg-[#FAF3E8] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9A6B35]">Soon</span>
              </div>
            </Section>

            {error && (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
            )}
          </div>

          {/* Summary */}
          <aside className="relative overflow-hidden rounded-3xl bg-[#380712] p-6 text-white shadow-[0_24px_60px_rgba(56,7,18,0.22)] md:p-8 lg:sticky lg:top-28">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF69]/15 blur-3xl" />
            <div className="relative">
              <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.025em]">
                <Package size={22} className="text-[#E6C47A]" strokeWidth={1.5} /> Order summary
              </h2>

              <div className="mt-6 max-h-[320px] space-y-4 overflow-y-auto pr-1 [scrollbar-color:#D4AF69_transparent] [scrollbar-width:thin]">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.size || ""}-${item.color || ""}-${index}`} className="flex gap-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#E6C47A]"><ShoppingBag size={20} /></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                      <p className="mt-1 text-xs font-light text-white/60">
                        {[item.size && `Size: ${item.size}`, item.color && `Colour: ${item.color}`, `Qty: ${item.quantity}`].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-[#E6C47A]">{formatPrice(Number(item.price) * Number(item.quantity))}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-white/75">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">{shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                  <span className="font-medium text-white">Total amount</span>
                  <span className="text-3xl font-semibold tracking-[-0.03em] text-[#E6C47A]">{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading || !items.length} className={`${goldBtn} mt-7`}>
                {loading ? "Placing order..." : "Place order"}
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight size={18} strokeWidth={2} />
                </span>
              </button>

              <p className="mt-4 text-center text-[11px] font-light leading-5 text-white/50">
                By placing your order, you agree to our terms and conditions.
              </p>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs font-light text-white/50">
                <LockKeyhole size={14} /> Your information is securely handled.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}