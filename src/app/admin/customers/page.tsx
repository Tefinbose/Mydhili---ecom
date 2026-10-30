
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Users,
  ShoppingBag,
  IndianRupee,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

type Customer = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
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
    month: "short",
    year: "numeric",
  });
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/customers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load customers");
      }

      setCustomers(
        Array.isArray(data.customers) ? data.customers : []
      );
    } catch (err) {
      console.error("CUSTOMERS PAGE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [customers, search]);

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.totalOrders,
    0
  );

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Store management
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#380712]">
              Customers
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your boutique customers and their purchase activity.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8DED2] bg-white px-4 py-3 text-sm font-semibold text-[#380712] hover:bg-[#F8F0E7] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh customers
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total customers
              </p>
              <Users size={21} className="text-[#9A6B35]" />
            </div>

            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {customers.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total orders
              </p>
              <ShoppingBag size={21} className="text-[#9A6B35]" />
            </div>

            <p className="mt-3 text-3xl font-bold text-[#380712]">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-xl border border-[#EDE4D9] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Customer spending
              </p>
              <IndianRupee size={21} className="text-[#9A6B35]" />
            </div>

            <p className="mt-3 text-2xl font-bold text-[#380712]">
              {formatPrice(totalRevenue)}
            </p>
          </div>

        </div>

        {/* Customer table */}
        <div className="overflow-hidden rounded-xl border border-[#EDE4D9] bg-white">

          {/* Table header */}
          <div className="flex flex-col gap-4 border-b border-[#F0E9E0] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#380712]">
                All customers
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredCustomers.length} customer(s) found
              </p>
            </div>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customers..."
                className="w-full rounded-lg border border-[#E8DED2] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#9A6B35] sm:w-72"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={20} />

              <div>
                <p className="font-semibold">
                  Could not load customers
                </p>

                <p>{error}</p>

                <button
                  onClick={fetchCustomers}
                  className="mt-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="p-16 text-center text-sm text-gray-500">
              Loading customers...
            </div>
          ) : !error && filteredCustomers.length === 0 ? (

            /* Empty state */
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F0E7]">
                <Users
                  size={28}
                  className="text-[#9A6B35]"
                />
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-[#380712]">
                {customers.length === 0
                  ? "No customers yet"
                  : "No matching customers"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {customers.length === 0
                  ? "Customers will appear here after they place an order using your store."
                  : "Try searching with another name, email or phone number."}
              </p>
            </div>

          ) : (

            /* Customer list */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">

                <thead className="bg-[#FBF8F4] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Orders</th>
                    <th className="px-5 py-4">Total spent</th>
                    <th className="px-5 py-4">Last order</th>
                    <th className="px-5 py-4">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E9E0]">

                  {filteredCustomers.map((customer) => {
                    const detailsUrl = `/admin/customers/${encodeURIComponent(
                      customer.email
                    )}`;

                    return (
                      <tr
                        key={customer.id}
                        onClick={() => {
                          window.location.href = detailsUrl;
                        }}
                        className="cursor-pointer transition-colors hover:bg-[#FFFCF8]"
                      >

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F0E7] text-[#9A6B35]">
                              <UserRound size={19} />
                            </div>

                            <div>
                              <Link
                                href={detailsUrl}
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                                className="font-semibold text-[#380712] hover:text-[#9A6B35] hover:underline"
                              >
                                {customer.name || "Customer"}
                              </Link>

                              <p className="mt-1 text-xs text-gray-400">
                                Customer
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-gray-600">
                              <Mail
                                size={14}
                                className="text-[#9A6B35]"
                              />
                              {customer.email}
                            </p>

                            <p className="flex items-center gap-2 text-gray-500">
                              <Phone
                                size={14}
                                className="text-[#9A6B35]"
                              />
                              {customer.phone || "Not provided"}
                            </p>
                          </div>
                        </td>

                        {/* Orders */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#F8F0E7] px-3 py-1.5 font-semibold text-[#380712]">
                            {customer.totalOrders}
                          </span>
                        </td>

                        {/* Spending */}
                        <td className="px-5 py-4 font-semibold text-[#380712]">
                          {formatPrice(customer.totalSpent)}
                        </td>

                        {/* Last order */}
                        <td className="px-5 py-4 text-gray-600">
                          <span className="flex items-center gap-2">
                            <CalendarDays
                              size={15}
                              className="text-[#9A6B35]"
                            />
                            {formatDate(customer.lastOrderDate)}
                          </span>
                        </td>

                        {/* View details */}
                        <td className="px-5 py-4">
                          <Link
                            href={detailsUrl}
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E8DED2] px-3 py-2 text-xs font-semibold text-[#380712] transition-colors hover:border-[#9A6B35] hover:bg-[#F8F0E7]"
                          >
                            View details
                            <ChevronRight size={15} />
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
