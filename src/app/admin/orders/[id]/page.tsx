
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Package,
  MapPin,
  User,
  CreditCard,
  RefreshCw,
  Truck,
} from "lucide-react";
import InvoiceButton from "@/components/admin/InvoiceButton";

interface OrderItem {
  productId: string;
  name: string;
  slug?: string;
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
  updatedAt?: string;
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
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed"];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load order details.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  async function updateOrderStatus(
    field: "orderStatus" | "paymentStatus",
    value: string
  ) {
    if (!order) return;

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          [field]: value,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update order.");
      }

      setOrder((current) =>
        current
          ? {
              ...current,
              [field]: value,
            }
          : current
      );

      setSuccess(
        field === "orderStatus"
          ? "Order status updated successfully."
          : "Payment status updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update order."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 animate-spin text-[#380712]" />
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-8 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOrder}
            className="mt-5 rounded-lg bg-[#380712] px-5 py-2.5 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const displayOrderNumber =
    order.orderNumber || order._id.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/admin/orders"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#380712]"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </Link>

            <h1 className="text-2xl font-bold text-[#380712] sm:text-3xl">
              Order #{displayOrderNumber}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchOrder}
              disabled={loading || updating}
              className="inline-flex items-center gap-2 rounded-lg border border-[#380712]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#380712] hover:bg-[#FAF7F2] disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <InvoiceButton orderId={order._id} />
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Status Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <div className="mt-3">
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
              <Package className="text-[#9A6B35]" size={28} />
            </div>
          </div>

          <div className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <div className="mt-3">
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>
              <CreditCard className="text-[#9A6B35]" size={28} />
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Products */}
            <section className="overflow-hidden rounded-xl border border-[#D4AF69]/30 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 p-5">
                <Package className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Ordered Products
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#FAF7F2]">
                          <Package className="text-[#9A6B35]" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-medium text-[#380712]">
                          {item.name}
                        </h3>

                        {item.sku && (
                          <p className="mt-1 text-xs text-gray-500">
                            SKU: {item.sku}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                          {item.size ? `Size: ${item.size}` : ""}
                          {item.size && item.color ? " · " : ""}
                          {item.color ? `Color: ${item.color}` : ""}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-[#380712]">
                        {money(item.price * item.quantity)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {money(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-100 bg-[#FAF7F2]/60 p-5">
                <div className="ml-auto max-w-sm space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{money(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping Charge</span>
                    <span>{money(order.shippingCharge)}</span>
                  </div>

                  <div className="flex justify-between border-t border-[#D4AF69]/50 pt-4 text-lg font-bold text-[#380712]">
                    <span>Total Amount</span>
                    <span>{money(order.total)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Shipping Address
                </h2>
              </div>

              <p className="font-semibold text-[#380712]">
                {order.customer.name}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {order.shippingAddress.address}
                {order.shippingAddress.landmark && (
                  <>
                    <br />
                    {order.shippingAddress.landmark}
                  </>
                )}
                <br />
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
                <br />
                PIN: {order.shippingAddress.pincode}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <section className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <User className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Customer Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400">Customer Name</p>
                  <p className="mt-1 text-sm font-medium text-[#380712]">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="mt-1 break-all text-sm text-gray-700">
                    {order.customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone Number</p>
                  <p className="mt-1 text-sm text-gray-700">
                    {order.customer.phone}
                  </p>
                </div>

                <Link
                  href={`/admin/customers/${encodeURIComponent(
                    order.customer.email
                  )}`}
                  className="inline-flex text-sm font-medium text-[#9A6B35] hover:underline"
                >
                  View Customer Profile
                </Link>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <CreditCard className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400">Payment Method</p>
                  <p className="mt-1 text-sm font-medium capitalize text-[#380712]">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Payment Status</p>
                  <div className="mt-2">
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500">
                    Update Payment Status
                  </label>

                  <select
                    value={order.paymentStatus}
                    disabled={updating}
                    onChange={(e) =>
                      updateOrderStatus("paymentStatus", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9A6B35] disabled:opacity-50"
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Order Fulfilment */}
            <section className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Truck className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Order Fulfilment
                </h2>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">
                  Update Order Status
                </label>

                <select
                  value={order.orderStatus}
                  disabled={updating}
                  onChange={(e) =>
                    updateOrderStatus("orderStatus", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#9A6B35] disabled:opacity-50"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                {updating && (
                  <p className="mt-2 text-xs text-gray-500">
                    Updating order...
                  </p>
                )}
              </div>
            </section>

            {/* Invoice */}
            <section className="rounded-xl border border-[#D4AF69]/30 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <FileText className="text-[#9A6B35]" size={20} />
                <h2 className="font-semibold text-[#380712]">
                  Order Invoice
                </h2>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-500">
                View, print or save a PDF copy of this customer's invoice.
              </p>

              <InvoiceButton orderId={order._id} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
