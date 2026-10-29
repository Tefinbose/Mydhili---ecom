
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
};

type AdminOrder = {
  _id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email?: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

type Summary = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  codOrders: number;
};

const statuses = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "DELIVERED":
    case "PAID":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
    case "CONFIRMED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    codOrders: 0,
  });

  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        status,
        search,
      });

      const response = await fetch(
        `/api/admin/orders?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load orders.");
      }

      setOrders(result.orders ?? []);
      setSummary(
        result.summary ?? {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          codOrders: 0,
        }
      );
      setTotalPages(Math.max(1, result.pagination?.totalPages ?? 1));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrders();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-[#faf7f2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#D4AF69]/60 shadow-sm">
              <Image
                src="/logo/logo1.jpeg"
                alt="Mydhili Boutique"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6b35]">
                MYDHILI BOUTIQUE
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-[#380712] sm:text-3xl">
                Orders
              </h1>
              <p className="text-xs text-gray-600 sm:text-sm">
                Manage customer purchases and track fulfilment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="rounded-xl border border-[#dfd0c7] bg-white px-5 py-3 text-sm font-medium text-[#380712] hover:bg-[#f7eee8] disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh orders"}
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total orders"
            value={String(summary.totalOrders)}
          />
          <SummaryCard
            title="Paid revenue"
            value={formatCurrency(summary.totalRevenue)}
          />
          <SummaryCard
            title="Pending orders"
            value={String(summary.pendingOrders)}
          />
          <SummaryCard
            title="COD orders"
            value={String(summary.codOrders)}
          />
        </section>

        <section className="mt-8 rounded-2xl border border-[#eadfdc] bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search order number, customer, email or phone..."
              className="min-w-0 flex-1 rounded-xl border border-[#e6d9d5] px-4 py-3 text-sm outline-none focus:border-[#9a6b35]"
            />

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[#e6d9d5] bg-white px-4 py-3 text-sm outline-none focus:border-[#9a6b35]"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All order statuses" : item}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {loading && orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-500">
              Loading orders...
            </div>
          ) : !loading && orders.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="font-semibold text-[#380712]">
                No orders found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Orders will appear here when customers complete checkout.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-2xl border border-[#eee4df] p-4 transition hover:border-[#d9c0b3] sm:p-5"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <p className="font-semibold text-[#380712]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Placed {formatDate(order.createdAt)}
                      </p>

                      <h3 className="mt-4 font-medium text-gray-900">
                        {order.customer.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.customer.phone}
                      </p>
                      {order.customer.email && (
                        <p className="mt-1 break-all text-sm text-gray-600">
                          {order.customer.email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(order.orderStatus)}`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(order.paymentStatus)}`}
                      >
                        {order.paymentStatus.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#eee4df] pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Items
                    </p>

                    <div className="mt-3 space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Qty: {item.quantity}
                              {item.size ? ` · Size: ${item.size}` : ""}
                              {item.color ? ` · Color: ${item.color}` : ""}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-gray-700">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-[#eee4df] pt-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Delivery address
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {order.shippingAddress.address}
                        {order.shippingAddress.landmark
                          ? `, ${order.shippingAddress.landmark}`
                          : ""}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-gray-500">
                        {order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#380712]">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Order status changes will be added next.
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#eee4df] pt-5 sm:flex-row sm:items-center">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-xl border border-[#dfd0c7] px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl bg-[#380712] px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eadfdc] bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-[#380712]">{value}</p>
    </div>
  );
}
