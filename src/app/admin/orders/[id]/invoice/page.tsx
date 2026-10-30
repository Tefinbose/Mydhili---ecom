
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  sku?: string;
  size?: string;
  color?: string;
}

interface OrderData {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  paymentMethod: "cod" | "online";
  paymentStatus: string;
  orderStatus: string;
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

export default function InvoicePage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load invoice.");
        }

        setOrder(data.order);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    if (orderId) loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7F2] text-[#380712]">
        Loading invoice...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-10 text-center text-red-700">
        {error || "Order not found."}
      </div>
    );
  }

  const invoiceNumber = order.orderNumber || order._id.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold text-[#380712]">
            Order Invoice
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Invoice #{invoiceNumber}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-[#380712]/20 px-5 py-2.5 text-sm font-medium text-[#380712]"
          >
            Back
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-lg bg-[#380712] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5A1724]"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="invoice-sheet mx-auto max-w-4xl bg-white p-8 shadow-sm sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#D4AF69] pb-8">
          <div>
            <h2 className="font-serif text-4xl font-bold tracking-wide text-[#380712]">
              MYDHILI
            </h2>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#9A6B35]">
              Boutique
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Thank you for shopping with us.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h3 className="text-2xl font-semibold uppercase tracking-widest text-[#380712]">
              Invoice
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Invoice No: <strong>#{invoiceNumber}</strong>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Date:{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        <div className="grid gap-8 py-8 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9A6B35]">
              Bill To
            </h4>
            <p className="font-semibold text-[#380712]">
              {order.customer.name}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {order.customer.email}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {order.customer.phone}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9A6B35]">
              Ship To
            </h4>
            <p className="font-semibold text-[#380712]">
              {order.customer.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {order.shippingAddress.address}
              {order.shippingAddress.landmark
                ? `, ${order.shippingAddress.landmark}`
                : ""}
              <br />
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}
              <br />
              PIN: {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-[#D4AF69] bg-[#FAF7F2] text-xs uppercase tracking-wider text-[#380712]">
                <th className="px-3 py-4">Product</th>
                <th className="px-3 py-4 text-center">Qty</th>
                <th className="px-3 py-4 text-right">Price</th>
                <th className="px-3 py-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.productId}-${index}`} className="border-b border-gray-100">
                  <td className="px-3 py-5">
                    <p className="font-medium text-[#380712]">
                      {item.name}
                    </p>
                    {item.sku && (
                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {item.sku}
                      </p>
                    )}
                    {(item.size || item.color) && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.size ? `Size: ${item.size}` : ""}
                        {item.size && item.color ? " | " : ""}
                        {item.color ? `Color: ${item.color}` : ""}
                      </p>
                    )}
                  </td>

                  <td className="px-3 py-5 text-center text-sm text-gray-600">
                    {item.quantity}
                  </td>

                  <td className="px-3 py-5 text-right text-sm text-gray-600">
                    {money(item.price)}
                  </td>

                  <td className="px-3 py-5 text-right text-sm font-medium text-[#380712]">
                    {money(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-8 max-w-sm space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping Charge</span>
            <span>{money(order.shippingCharge)}</span>
          </div>

          <div className="flex justify-between border-t border-[#D4AF69] pt-4 text-lg font-bold text-[#380712]">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A6B35]">
              Payment Method
            </p>
            <p className="mt-2 text-sm font-medium text-[#380712]">
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Payment Status: {order.paymentStatus}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A6B35]">
              Order Status
            </p>
            <p className="mt-2 text-sm font-medium capitalize text-[#380712]">
              {order.orderStatus}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-[#D4AF69] pt-8 text-center">
          <p className="font-serif text-xl italic text-[#380712]">
            Thank you for choosing Mydhili Boutique.
          </p>
          <p className="mt-2 text-xs tracking-wide text-gray-400">
            We appreciate your business.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .invoice-sheet,
          .invoice-sheet * {
            visibility: visible;
          }

          .invoice-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
