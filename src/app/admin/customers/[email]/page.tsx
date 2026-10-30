
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  ShoppingBag,
  IndianRupee,
  CalendarDays,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type Customer = {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
};

type Order = {
  _id: string;
  orderNumber?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
  }[];
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
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  createdAt: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-purple-50 text-purple-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
    paid: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function CustomerDetailsPage() {
  const params = useParams<{ email: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const email = decodeURIComponent(params.email);

      const response = await fetch(
        `/api/admin/customers/${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load customer");
      }

      setCustomer(data.customer);
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("CUSTOMER DETAILS PAGE ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [params.email]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7F2]">
        <p className="text-sm text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto text-red-500" size={30} />
          <h2 className="mt-4 font-serif text-2xl font-bold text-[#380712]">
            Unable to load customer
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {error || "Customer information could not be found."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={fetchCustomer}
              className="inline-flex items-center gap-2 rounded-lg bg-[#380712] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={15} />
              Try again
            </button>
            <button
              onClick={() => router.push("/admin/customers")}
              className="rounded-lg border border-[#E8DED2] px-4 py-2.5 text-sm font-semibold text-[#380712]"
            >
              Back to customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/customers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9A6B35] hover:text-[#380712]"
        >
          <ArrowLeft size={17} />
          Back to customers
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
            Customer management
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#380712]">
            Customer details
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View customer information and purchase history.
          </p>
        </div>

        {/* Customer profile */}
        <div className="mb-6 rounded-xl border border-[#EDE4D9] bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F8F0E7] text-[#9A6B35]">
              <UserRound size={30} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-2xl font-bold text-[#380712]">
                {customer.name}
              </h2>

              <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-2">
                  <Mail size={15} className="text-[#9A6B35]" />
                  {customer.email}
                </span>

                <span className="flex items-center gap-2">
                  <Phone size={15} className="text-[#9A6B35]" />
                  {customer.phone || "Phone not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total orders</p>
              <ShoppingBag size={21} className="text-[#9A6B35]" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {customer.totalOrders}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total spending</p>
              <IndianRupee size={21} className="text-[#9A6B35]" />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#380712]">
              {formatPrice(customer.totalSpent)}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Last order</p>
              <CalendarDays size={21} className="text-[#9A6B35]" />
            </div>
            <p className="mt-3 text-lg font-bold text-[#380712]">
              {formatDate(customer.lastOrderDate)}
            </p>
          </div>
        </div>

        {/* Order history */}
        <div className="overflow-hidden rounded-xl border border-[#EDE4D9] bg-white">
          <div className="border-b border-[#F0E9E0] p-5">
            <h2 className="font-serif text-xl font-bold text-[#380712]">
              Order history
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All orders placed by this customer.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No order history available.
            </div>
          ) : (
            <div className="divide-y divide-[#F0E9E0]">
              {orders.map((order) => (
                <div key={order._id} className="p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <p className="font-semibold text-[#380712]">
                        {order.orderNumber ||
                          `#${order._id.slice(-8).toUpperCase()}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={order.orderStatus} />
                      <StatusBadge status={order.paymentStatus} />
                      <span className="text-sm font-bold text-[#380712]">
                        {formatPrice(order.total)}
                      </span>

                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="rounded-lg border border-[#E8DED2] px-3 py-2 text-xs font-semibold text-[#380712] hover:bg-[#F8F0E7]"
                      >
                        View order
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center gap-3"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg border border-[#EDE4D9] object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F8F0E7]">
                            <ShoppingBag
                              size={20}
                              className="text-[#9A6B35]"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.size ? ` · Size: ${item.size}` : ""}
                            {item.color ? ` · Color: ${item.color}` : ""}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-[#380712]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {order.shippingAddress && (
                    <div className="mt-4 flex items-start gap-2 border-t border-[#F0E9E0] pt-3 text-xs text-gray-500">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-[#9A6B35]"
                      />
                      <span>
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                        {order.shippingAddress.landmark
                          ? `, ${order.shippingAddress.landmark}`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
