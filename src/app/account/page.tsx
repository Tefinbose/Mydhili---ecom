"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  AlertCircle, ArrowRight, Check, CheckCircle2, ChevronDown, Copy, CreditCard, Headphones,
  Heart, Loader2, MapPin, MessageCircle, PackageSearch, Printer, RotateCcw, ShieldCheck,
  ShoppingBag, Truck,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-account", display: "swap" });

interface OrderItem { productId?: string; name: string; slug?: string; price: number; quantity: number; size?: string; color?: string; image?: string; sku?: string }
interface OrderCustomer { name: string; email: string; phone: string }
interface OrderAddress { address: string; city: string; state: string; pincode: string; landmark?: string }
interface OrderDetails {
  id: string; _id?: string; orderNumber: string; createdAt: string; updatedAt?: string;
  orderStatus: string; paymentStatus: string; paymentMethod: string; trackingNumber?: string | null;
  subtotal: number; shippingFee: number; total: number; customer: OrderCustomer;
  shippingAddress?: OrderAddress | null; items: OrderItem[]; notes?: string;
}

const statusSteps = [
  { key: "pending", label: "Order placed", desc: "Awaiting boutique review" },
  { key: "processing", label: "Confirmed & packing", desc: "Handpicking your pieces" },
  { key: "shipped", label: "Dispatched", desc: "Handed over to courier" },
  { key: "delivered", label: "Delivered", desc: "Package handed over" },
];

const shortcuts = [
  { icon: ShoppingBag, label: "Shopping bag", href: "/cart" },
  { icon: Heart, label: "My wishlist", href: "/wishlist" },
  { icon: Headphones, label: "Boutique support", href: "/contact" },
];

const badgeColors: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-800",
  shipped: "bg-sky-100 text-sky-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const INSTAGRAM_URL = "https://www.instagram.com/mydhilicollections2010/";
const card = "rounded-3xl border border-[#E9DFD2] bg-white p-6 shadow-[0_10px_30px_rgba(56,7,18,0.05)] sm:p-7";
const inputCls = "w-full rounded-xl border border-[#E5DDD2] bg-[#FFFEFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#D4AF69] focus:ring-4 focus:ring-[#D4AF69]/20";
const labelCls = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em]";
const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A6B35]";
const goldBtn = "group flex h-14 w-full items-center justify-between rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.3)] transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60";
const toolBtn = "inline-flex h-10 items-center gap-2 rounded-full border border-[#380712]/20 bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:border-[#380712] hover:bg-[#380712] hover:text-[#E6C47A]";
const chip = "rounded-full border border-[#E9DFD2] bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-medium text-[#380712]/80";

const formatPrice = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getStatusStepIndex(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped") return 2;
  if (s === "processing" || s === "confirmed") return 1;
  return 0;
}

function Heading({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF3E8] text-[#9A6B35]"><Icon size={18} strokeWidth={1.5} /></span>
      <h3 className="text-base font-semibold tracking-[-0.02em]">{children}</h3>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-center justify-between gap-4"><span className="font-light text-stone-500">{label}</span><span className="font-semibold">{children}</span></div>;
}

export default function AccountPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const currentOrder: OrderDetails | null = orders[selectedOrderIndex] || null;
  const currentStepIdx = currentOrder ? getStatusStepIndex(currentOrder.orderStatus) : 0;
  const status = (currentOrder?.orderStatus || "").toLowerCase();
  const isCancelled = status === "cancelled";

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrders([]);
    setSelectedOrderIndex(0);

    const cleanQuery = orderQuery.trim();
    const cleanContact = emailOrPhone.trim();

    if (!cleanQuery && !cleanContact) {
      setError("Please provide an Order ID, email address, or phone number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: cleanQuery, emailOrPhone: cleanContact }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "No matching order found. Please verify your reference number and try again.");
      }

      const list: OrderDetails[] = Array.isArray(data.orders) ? data.orders : data.order ? [data.order] : [];
      if (list.length === 0) throw new Error("No matching order found. Please check your reference and try again.");

      setOrders(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to find order details. Please verify your details or contact our team.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyTracking(tracking: string) {
    if (!tracking) return;
    try {
      await navigator.clipboard.writeText(tracking);
      setCopiedTracking(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedTracking(false), 2500);
    } catch {
      setError("Unable to copy. Please select the tracking number and copy it manually.");
    }
  }

  function handleResetSearch() {
    setOrders([]);
    setOrderQuery("");
    setEmailOrPhone("");
    setError("");
  }

  return (
    <div className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-account)] text-[#380712]`}>
      {/* Header */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-14 text-center text-white print:hidden sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">Mydhili Collections</p>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>
          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">Track your <span className="text-[#E6C47A]">order.</span></h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-7 text-white/75 sm:text-base">Follow your shipment, review order details, or reach our team for help.</p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative z-10 mx-auto -mt-8 max-w-6xl print:mt-0">
          {/* Search */}
          {!currentOrder && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className={`${card} shadow-[0_30px_80px_rgba(56,7,18,0.1)]`}>
                <Heading icon={PackageSearch}>Find your order</Heading>
                <p className="mb-6 text-sm font-light leading-6 text-stone-500">Enter your order number (for example MYD-...) or the email or phone number used at checkout.</p>

                <form onSubmit={handleTrackOrder} className="space-y-5">
                  <div>
                    <label htmlFor="orderQuery" className={labelCls}>Order reference number</label>
                    <input id="orderQuery" value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} placeholder="e.g. MYD-20261102-1234" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="emailOrPhone" className={labelCls}>Email or phone number (optional)</label>
                    <input id="emailOrPhone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="you@example.com or 10-digit mobile" className={inputCls} />
                    <p className="mt-2 text-[11px] font-light text-stone-400">Search by order number alone, or add your email or phone to find matching orders.</p>
                  </div>

                  {error && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className={goldBtn}>
                    {loading ? "Locating order..." : "View order details"}
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={2} />}
                    </span>
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className={card}>
                  <p className={`${eyebrow} mb-4`}>Quick shortcuts</p>
                  <div className="space-y-2.5">
                    {shortcuts.map(({ icon: Icon, label, href }) => (
                      <Link key={href} href={href} className="group flex items-center justify-between rounded-2xl border border-[#E9DFD2] bg-[#FAF7F2] p-3.5 text-sm font-semibold transition-all duration-300 hover:border-[#D4AF69]">
                        <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#9A6B35]"><Icon size={16} strokeWidth={1.6} /></span>{label}</span>
                        <ArrowRight size={15} className="text-stone-400 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-[#380712] p-6 text-white shadow-[0_24px_60px_rgba(56,7,18,0.2)] sm:p-7">
                  <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#D4AF69]/15 blur-3xl" />
                  <div className="relative">
                    <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E6C47A]"><ShieldCheck size={15} /> Mydhili assurance</p>
                    <h4 className="text-lg font-semibold tracking-[-0.02em]">Quality checked before dispatch</h4>
                    <p className="mt-2 text-sm font-light leading-6 text-white/70">Every piece is checked before it leaves us. Need styling help? Reach out directly.</p>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:border-[#E6C47A] hover:text-[#E6C47A]">
                      <MessageCircle size={14} /> Message on Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order view */}
          {currentOrder && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E9DFD2] bg-white p-4 shadow-[0_16px_40px_rgba(56,7,18,0.08)] sm:flex-row sm:items-center sm:px-5 print:hidden">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4EC] text-[#2F6B3C]"><CheckCircle2 size={20} /></span>
                  <div>
                    <p className="text-xs font-light text-stone-500">Viewing order</p>
                    <p className="break-all text-base font-semibold tracking-[0.02em]">{currentOrder.orderNumber}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {orders.length > 1 && (
                    <label className="relative">
                      <span className="sr-only">Choose order</span>
                      <select value={selectedOrderIndex} onChange={(e) => setSelectedOrderIndex(Number(e.target.value))} className="h-10 cursor-pointer appearance-none rounded-full border border-[#380712]/20 bg-white pl-4 pr-10 text-xs font-semibold outline-none focus:border-[#D4AF69] focus:ring-4 focus:ring-[#D4AF69]/20">
                        {orders.map((o, idx) => <option key={o.id || idx} value={idx}>#{o.orderNumber} ({formatPrice(o.total)})</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9A6B35]" />
                    </label>
                  )}
                  <button type="button" onClick={handleResetSearch} className={toolBtn}><RotateCcw size={14} /> Track another</button>
                  <button type="button" onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#380712] shadow-[0_8px_20px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5"><Printer size={14} /> Print</button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                <div className="space-y-6">
                  {/* Status */}
                  <div className={card}>
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-[#E9DFD2] pb-5">
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.025em]">Order status</h3>
                        <p className="mt-1 text-xs font-light text-stone-500">Placed on {formatDate(currentOrder.createdAt)}</p>
                      </div>
                      <span className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeColors[status] || "bg-amber-100 text-amber-900"}`}>{currentOrder.orderStatus}</span>
                    </div>

                    {!isCancelled ? (
                      <ol className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
                        <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[18px] hidden h-px bg-[#E9DFD2] sm:block" />
                        <span aria-hidden="true" className="absolute left-[12.5%] top-[18px] hidden h-px bg-[#D4AF69] transition-all duration-700 sm:block" style={{ width: `${(currentStepIdx / 3) * 75}%` }} />
                        {statusSteps.map((step, idx) => {
                          const done = idx <= currentStepIdx;
                          return (
                            <li key={step.key} className="relative flex flex-col items-center text-center" aria-current={idx === currentStepIdx ? "step" : undefined}>
                              <span className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-[#380712] text-[#E6C47A]" : "border border-[#E9DFD2] bg-white text-stone-400"} ${idx === currentStepIdx ? "ring-4 ring-[#D4AF69]/30" : ""}`}>
                                {done ? <Check size={16} strokeWidth={2.5} /> : idx + 1}
                              </span>
                              <span className={`mt-3 text-sm font-semibold ${done ? "" : "text-stone-400"}`}>{step.label}</span>
                              <span className="mt-0.5 text-[11px] font-light leading-4 text-stone-500">{step.desc}</span>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                        <p className="font-semibold">This order has been cancelled.</p>
                        <p className="mt-1 font-light">If you have any questions, please contact our boutique support.</p>
                      </div>
                    )}

                    {currentOrder.trackingNumber && (
                      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E9DFD2] bg-[#FAF7F2] p-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9A6B35]"><Truck size={18} strokeWidth={1.5} /></span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">Courier tracking number</p>
                            <p className="break-all text-sm font-light text-stone-600">{currentOrder.trackingNumber}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleCopyTracking(currentOrder.trackingNumber!)} className={`${toolBtn} shrink-0 print:hidden`}>
                          {copiedTracking ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className={card}>
                    <h3 className="mb-5 text-xl font-semibold tracking-[-0.025em]">Ordered pieces <span className="text-[#A27B35]">({currentOrder.items?.length || 0})</span></h3>
                    <div className="divide-y divide-[#E9DFD2]">
                      {currentOrder.items?.length ? currentOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#380712] to-[#6D2636]">
                              {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="flex h-full items-center justify-center text-[#E6C47A]/70"><ShoppingBag size={20} strokeWidth={1.3} /></span>
                              )}
                            </div>
                            <div className="min-w-0">
                              {item.slug ? <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-medium transition-colors hover:text-[#9A6B35] sm:text-base">{item.name}</Link> : <p className="line-clamp-2 text-sm font-medium sm:text-base">{item.name}</p>}
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                {item.size && <span className={chip}>Size: {item.size}</span>}
                                {item.color && <span className={chip}>Colour: {item.color}</span>}
                                <span className="text-xs font-light text-stone-500">Qty {item.quantity} × {formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="shrink-0 text-sm font-semibold sm:text-base">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                        </div>
                      )) : <p className="text-sm font-light text-stone-500">No item breakdown available for this record.</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className={card}>
                    <Heading icon={MapPin}>Delivery details</Heading>
                    <p className="text-sm font-semibold">{currentOrder.customer?.name || "Customer"}</p>
                    {currentOrder.customer?.phone && <p className="mt-0.5 text-sm font-light text-stone-500">{currentOrder.customer.phone}</p>}
                    {currentOrder.customer?.email && <p className="break-all text-sm font-light text-stone-500">{currentOrder.customer.email}</p>}
                    {currentOrder.shippingAddress ? (
                      <div className="mt-4 border-t border-[#E9DFD2] pt-4 text-sm font-light leading-7 text-stone-600">
                        <p>{currentOrder.shippingAddress.address}</p>
                        {currentOrder.shippingAddress.landmark && <p>Near: {currentOrder.shippingAddress.landmark}</p>}
                        <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm font-light text-stone-400">Delivery address recorded at checkout.</p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className={card}>
                    <Heading icon={CreditCard}>Payment summary</Heading>
                    <div className="space-y-3 border-b border-[#E9DFD2] pb-4 text-sm">
                      <Row label="Subtotal">{formatPrice(currentOrder.subtotal)}</Row>
                      <Row label="Shipping">{currentOrder.shippingFee === 0 ? "Free" : formatPrice(currentOrder.shippingFee)}</Row>
                      <Row label="Method"><span className={chip}>{currentOrder.paymentMethod === "online" ? "Online prepaid" : "Cash on Delivery"}</span></Row>
                      <Row label="Status"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${currentOrder.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{currentOrder.paymentStatus}</span></Row>
                    </div>
                    <div className="flex items-baseline justify-between pt-4">
                      <span className="text-sm font-medium">{currentOrder.paymentStatus === "paid" ? "Total paid" : "Total"}</span>
                      <span className="text-2xl font-semibold tracking-[-0.03em] text-[#A27B35]">{formatPrice(currentOrder.total)}</span>
                    </div>
                  </div>

                  {/* Help */}
                  <div className="relative overflow-hidden rounded-3xl bg-[#380712] p-6 text-white shadow-[0_24px_60px_rgba(56,7,18,0.2)] print:hidden sm:p-7">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#D4AF69]/15 blur-3xl" />
                    <div className="relative">
                      <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E6C47A]"><Headphones size={15} /> Need help with this order?</p>
                      <h4 className="text-lg font-semibold tracking-[-0.02em]">Talk to our team</h4>
                      <p className="mt-2 text-sm font-light leading-6 text-white/70">Questions about delivery or dispatch? Message us with your order number.</p>
                      <a href={`https://wa.me/?text=${encodeURIComponent(`Hello Mydhili Collections, I have an enquiry regarding my order #${currentOrder.orderNumber}.`)}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] text-xs font-semibold uppercase tracking-[0.12em] text-[#380712] transition-all duration-300 hover:-translate-y-0.5">
                        <MessageCircle size={15} /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}