
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type OrderDetails = {
  orderNumber: string;
  total: number;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: string;
  orderStatus: string;
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberFromUrl = searchParams.get("orderNumber");
  const paymentPending = searchParams.get("payment") === "pending";

  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("mydhili-last-order");

    if (!storedOrder) return;

    try {
      const parsed = JSON.parse(storedOrder) as OrderDetails;

      if (parsed.orderNumber === orderNumberFromUrl) {
        setOrder(parsed);
      }
    } catch {
      setOrder(null);
    }
  }, [orderNumberFromUrl]);

  if (!orderNumberFromUrl) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#380712]">
          No order was selected
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-[#380712] px-6 py-3 text-white"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <section className="rounded-3xl border border-[#eadfdc] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border border-[#D4AF69]/60 shadow-md">
          <Image
            src="/logo/logo.png"
            alt="Mydhili Boutique"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9a6b35]">
          Mydhili Boutique
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#380712]">
          {paymentPending ? "Order created" : "Thank you for your order!"}
        </h1>

        <p className="mt-4 leading-7 text-gray-600">
          {paymentPending
            ? "Your order has been created, but your online payment has not been completed. Please complete payment before we confirm it."
            : "We've received your order. Keep your order number for future reference."}
        </p>

        <div className="mt-8 rounded-2xl bg-[#faf7f2] p-5 text-left">
          <p className="text-sm text-gray-500">Order number</p>
          <p className="mt-1 break-all text-lg font-semibold text-[#380712]">
            {orderNumberFromUrl}
          </p>

          {order && (
            <>
              <div className="mt-5 flex justify-between gap-4 text-sm">
                <span className="text-gray-600">Order total</span>
                <span className="font-semibold text-[#380712]">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-gray-600">Payment method</span>
                <span className="font-medium">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-gray-600">Payment status</span>
                <span className="font-medium">
                  {order.paymentStatus.replaceAll("_", " ")}
                </span>
              </div>
            </>
          )}
        </div>

        {!order && (
          <p className="mt-4 text-sm text-gray-500">
            Order details are not available in this browser session. Your order number is shown above.
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-[#380712] px-7 py-3 font-medium text-white transition hover:bg-[#541321]"
          >
            Continue shopping
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#d8c4bd] px-7 py-3 font-medium text-[#380712] transition hover:bg-[#faf7f2]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="px-5 py-20 text-center text-gray-600">
          Loading order details...
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
