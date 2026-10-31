"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PackageSearch,
  ShoppingBag,
  Heart,
  Headphones,
  ShieldAlert,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AccountPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleTrackOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrderResult(null);

    const cleanId = orderId.trim();
    if (!cleanId) {
      setError("Please enter your Order ID.");
      return;
    }

    setLoading(true);
    try {
      // Find order via api
      const res = await fetch(`/api/orders`);
      if (!res.ok) {
        throw new Error("Unable to search orders at this time.");
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const found = data.orders.find(
          (o: any) =>
            o._id === cleanId ||
            (o.orderNumber &&
              o.orderNumber.toLowerCase() === cleanId.toLowerCase()) ||
            (o.customer?.email &&
              email &&
              o.customer.email.toLowerCase() === email.trim().toLowerCase())
        );

        if (found) {
          setOrderResult(found);
        } else {
          setError(
            "No matching order found. Please verify your Order ID and try again, or contact our support team."
          );
        }
      } else {
        setError("Unable to find order details.");
      }
    } catch {
      setError("Could not complete order lookup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#380712] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
            Mydhili Boutique
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#380712] sm:text-4xl mt-2">
            Customer Portal & Order Tracking
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto mt-2">
            Track your boutique shipments, review your saved items, or connect with our personal styling team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Tracking Card */}
          <div className="md:col-span-2 rounded-2xl border border-[#E7DECE] bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E7DECE] text-[#380712]">
                <PackageSearch size={20} />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#380712]">
                  Track an Order
                </h2>
                <p className="text-xs text-stone-500">
                  Enter your order details to check live fulfillment status.
                </p>
              </div>
            </div>

            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Order ID or Reference Number
                </label>
                <input
                  id="orderId"
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 6724..."
                  className="w-full h-11 px-3.5 text-sm rounded-lg border border-stone-200 bg-white text-[#380712] outline-none transition focus:border-[#380712] focus:ring-1 focus:ring-[#380712]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Billing Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full h-11 px-3.5 text-sm rounded-lg border border-stone-200 bg-white text-[#380712] outline-none transition focus:border-[#380712] focus:ring-1 focus:ring-[#380712]"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#380712] px-4 text-sm font-semibold text-[#FAF7F2] shadow-sm transition hover:bg-[#27040B] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#D4AF69]" />
                    <span>Searching Order...</span>
                  </>
                ) : (
                  <span>Track Status</span>
                )}
              </button>
            </form>

            {/* Order Result Display */}
            {orderResult && (
              <div className="mt-6 border-t border-stone-100 pt-6">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Order Found</span>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs space-y-2 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-mono font-medium">{orderResult._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <span className="uppercase font-semibold text-[#380712]">
                      {orderResult.orderStatus || "Processing"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total:</span>
                    <span className="font-semibold">
                      ₹{orderResult.total?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Staff Access */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="rounded-2xl border border-[#E7DECE] bg-white p-6 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#380712]">
                Quick Access
              </h3>

              <Link
                href="/cart"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-[#FAF7F2] transition hover:bg-[#F2ECE1] text-xs font-semibold text-[#380712]"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="text-[#9A6B35]" />
                  <span>Shopping Bag</span>
                </div>
                <ArrowRight size={14} className="text-stone-400" />
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-[#FAF7F2] transition hover:bg-[#F2ECE1] text-xs font-semibold text-[#380712]"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={16} className="text-[#9A6B35]" />
                  <span>My Wishlist</span>
                </div>
                <ArrowRight size={14} className="text-stone-400" />
              </Link>

              <Link
                href="/contact"
                className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-[#FAF7F2] transition hover:bg-[#F2ECE1] text-xs font-semibold text-[#380712]"
              >
                <div className="flex items-center gap-2.5">
                  <Headphones size={16} className="text-[#9A6B35]" />
                  <span>Boutique Support</span>
                </div>
                <ArrowRight size={14} className="text-stone-400" />
              </Link>
            </div>

            {/* Admin Staff Access Card */}
            <div className="rounded-2xl border border-[#D4AF69]/40 bg-gradient-to-br from-[#380712] to-[#22040A] p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 text-[#E6C47A] text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldAlert size={15} />
                <span>Boutique Staff</span>
              </div>
              <h4 className="font-serif text-base font-bold mb-1">
                Store Operations
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Manage inventory, products, customer orders, and store settings.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#380712] transition hover:bg-white"
              >
                <span>Admin Sign In</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
