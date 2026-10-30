
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  IndianRupee,
  Eye,
  AlertCircle,
} from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
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
  createdAt: string;
};

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed"];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("ORDERS PAGE ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = async (
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: string
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          [field]: value,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update order");
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, [field]: value }
            : order
        )
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update order"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderReference =
        order.orderNumber || order._id.slice(-8).toUpperCase();

      const searchText = [
        orderReference,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pendingCount = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const paidRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Store management
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#380712]">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View and manage your boutique orders.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8DED2] bg-white px-4 py-3 text-sm font-semibold text-[#380712] hover:bg-[#F8F0E7] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh orders
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total orders</p>
              <ShoppingBag className="text-[#9A6B35]" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {orders.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pending orders</p>
              <Clock className="text-amber-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Delivered orders</p>
              <CheckCircle2 className="text-green-600" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {deliveredCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Paid revenue</p>
              <IndianRupee className="text-[#9A6B35]" size={21} />
            </div>
            <p className="mt-3 text-2xl font-bold text-[#380712]">
              {formatPrice(paidRevenue)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#EDE4D9] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#F0E9E0] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#380712]">
                All orders
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredOrders.length} order(s) found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search orders or customers..."
                  className="w-full rounded-lg border border-[#E8DED2] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#9A6B35] sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[#E8DED2] bg-white px-3 py-2.5 text-sm capitalize outline-none focus:border-[#9A6B35]"
              >
                <option value="all">All statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={20} />
              <div>
                <p className="font-semibold">Could not load orders</p>
                <p>{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center text-sm text-gray-500">
              Loading orders...
            </div>
          ) : !error && filteredOrders.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F0E7]">
                <ShoppingBag size={28} className="text-[#9A6B35]" />
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-[#380712]">
                {orders.length === 0
                  ? "No orders yet"
                  : "No matching orders"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {orders.length === 0
                  ? "Orders will appear here when customers complete checkout."
                  : "Try changing your search or order status filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-[#FBF8F4] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Order status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E9E0]">
                  {filteredOrders.map((order) => {
                    const reference =
                      order.orderNumber ||
                      `#${order._id.slice(-8).toUpperCase()}`;

                    return (
                      <tr key={order._id} className="hover:bg-[#FFFCF8]">
                        <td className="px-5 py-4 font-semibold text-[#380712]">
                          {reference}
                          <p className="mt-1 text-xs font-normal text-gray-400">
                            {order.items?.length || 0} item(s)
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {order.customer?.name || "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.customer?.email || order.customer?.phone || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-[#380712]">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-5 py-4">
                          <p className="mb-2 text-xs uppercase text-gray-500">
                            {order.paymentMethod === "cod"
                              ? "Cash on delivery"
                              : "Online"}
                          </p>
                          <select
                            value={order.paymentStatus}
                            disabled={updatingId === order._id}
                            onChange={(event) =>
                              updateOrder(
                                order._id,
                                "paymentStatus",
                                event.target.value
                              )
                            }
                            className="rounded-md border border-[#E8DED2] bg-white px-2 py-1.5 text-xs capitalize disabled:opacity-50"
                          >
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <div className="mb-2">
                            <StatusBadge status={order.orderStatus} />
                          </div>
                          <select
                            value={order.orderStatus}
                            disabled={updatingId === order._id}
                            onChange={(event) =>
                              updateOrder(
                                order._id,
                                "orderStatus",
                                event.target.value
                              )
                            }
                            className="rounded-md border border-[#E8DED2] bg-white px-2 py-1.5 text-xs capitalize disabled:opacity-50"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E8DED2] px-3 py-2 text-xs font-semibold text-[#380712] hover:bg-[#F8F0E7]"
                          >
                            <Eye size={15} />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
