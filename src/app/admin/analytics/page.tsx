"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Truck,
  CreditCard,
  ArrowUpRight,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface DailyTrendItem {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface TopProductItem {
  name: string;
  slug: string;
  image: string;
  quantity: number;
  revenue: number;
}

interface CategoryItem {
  name: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  period: string;
  kpis: {
    totalRevenue: number;
    totalOrdersCount: number;
    averageOrderValue: number;
    totalUnitsSold: number;
    fulfillmentRate: number;
    uniqueCustomersCount: number;
    activeCatalogProducts: number;
  };
  dailyTrend: DailyTrendItem[];
  orderStatuses: {
    counts: Record<string, number>;
    total: number;
  };
  paymentBreakdown: {
    cod: number;
    online: number;
    paid: number;
  };
  topProducts: TopProductItem[];
  categoryDistribution: CategoryItem[];
}

const statusMeta: Record<string, { label: string; dot: string; bar: string }> = {
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-sky-500",
    bar: "bg-sky-500",
  },
  processing: {
    label: "Processing",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
  },
  pending: {
    label: "Pending",
    dot: "bg-stone-400",
    bar: "bg-stone-400",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-rose-500",
    bar: "bg-rose-400",
  },
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DailyTrendItem | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        cache: "no-store",
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load analytics");
      }
      setData(result.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxRevenue = data?.dailyTrend
    ? Math.max(...data.dailyTrend.map((d) => d.revenue), 1000)
    : 1000;

  const peakDay = data?.dailyTrend?.reduce((prev, curr) =>
    curr.revenue > (prev?.revenue || 0) ? curr : prev,
    data.dailyTrend[0]
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Authentic Clean Dashboard Header */}
        <header className="flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span>Admin</span>
              <span>/</span>
              <span className="text-stone-800">Analytics</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              Sales volume, order fulfillment velocity, and inventory demand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Segmented Period Switcher */}
            <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-xs">
              {(
                [
                  { key: "7d", label: "7 days" },
                  { key: "30d", label: "30 days" },
                  { key: "90d", label: "90 days" },
                  { key: "all", label: "All time" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setPeriod(tab.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    period === tab.key
                      ? "bg-white text-stone-900 shadow-xs font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              title="Refresh data"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 shadow-xs transition hover:bg-stone-50 hover:text-stone-900 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin text-stone-900" : ""}
              />
            </button>

            {/* Live Store link */}
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 shadow-xs transition hover:bg-stone-50 hover:text-stone-900"
            >
              <span>View storefront</span>
              <ExternalLink size={12} className="text-stone-400" />
            </Link>
          </div>
        </header>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span className="flex-1">{error}</span>
            <button
              onClick={fetchAnalytics}
              className="font-semibold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Professional KPI Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Sales */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-stone-300">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Total Sales
              </span>
              <DollarSign size={16} className="text-stone-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              ₹{data?.kpis.totalRevenue.toLocaleString("en-IN") || 0}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Net revenue excl. cancellations
            </p>
          </div>

          {/* Total Orders */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-stone-300">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Orders
              </span>
              <ShoppingBag size={16} className="text-stone-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              {data?.kpis.totalOrdersCount || 0}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Customer orders received
            </p>
          </div>

          {/* Average Order Value (AOV) */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-stone-300">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Average Order Value
              </span>
              <TrendingUp size={16} className="text-stone-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              ₹{data?.kpis.averageOrderValue.toLocaleString("en-IN") || 0}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Average spend per transaction
            </p>
          </div>

          {/* Units Sold */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition hover:border-stone-300">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Units Sold
              </span>
              <Package size={16} className="text-stone-400" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              {data?.kpis.totalUnitsSold || 0}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Total attire pieces dispatched
            </p>
          </div>
        </div>

        {/* Revenue Trajectory Bar Chart */}
        <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Revenue trajectory
              </h2>
              <p className="mt-0.5 text-xs text-stone-500">
                Daily order volume and gross revenue across {period === "all" ? "entire history" : `last ${period.replace("d", " days")}`}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {peakDay && peakDay.revenue > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600">
                  <span className="text-stone-400">Peak:</span>
                  <span className="font-semibold text-stone-900">
                    ₹{peakDay.revenue.toLocaleString("en-IN")}
                  </span>
                  <span className="text-stone-400">({peakDay.label})</span>
                </div>
              )}

              {hoveredDay && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#380712]/20 bg-[#380712] px-3 py-1 text-xs text-white">
                  <span>{hoveredDay.label}:</span>
                  <span className="font-semibold text-[#F5DFC0]">
                    ₹{hoveredDay.revenue.toLocaleString("en-IN")}
                  </span>
                  <span className="text-white/70">
                    ({hoveredDay.orders} {hoveredDay.orders === 1 ? "order" : "orders"})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Chart Display */}
          <div className="mt-6">
            {data?.dailyTrend && data.dailyTrend.length > 0 ? (
              <div className="relative">
                {/* Horizontal guide lines */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between h-48 border-b border-stone-200 text-[10px] text-stone-400">
                  <div className="border-b border-dashed border-stone-100 w-full" />
                  <div className="border-b border-dashed border-stone-100 w-full" />
                  <div className="border-b border-dashed border-stone-100 w-full" />
                </div>

                {/* Bars */}
                <div className="relative flex h-48 w-full items-end gap-1 sm:gap-2">
                  {data.dailyTrend.map((item, idx) => {
                    const heightPercent =
                      maxRevenue > 0
                        ? Math.max(Math.round((item.revenue / maxRevenue) * 100), 4)
                        : 4;
                    const hasSales = item.revenue > 0;

                    return (
                      <div
                        key={item.date || idx}
                        onMouseEnter={() => setHoveredDay(item)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="group relative flex flex-1 flex-col items-center h-full justify-end cursor-pointer"
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-11 z-20 hidden flex-col items-center rounded-lg bg-stone-900 px-2.5 py-1 text-[10px] text-white shadow-md group-hover:flex">
                          <span className="font-semibold text-[#F5DFC0]">
                            ₹{item.revenue.toLocaleString("en-IN")}
                          </span>
                          <span className="text-stone-300 text-[9px]">
                            {item.orders} {item.orders === 1 ? "order" : "orders"}
                          </span>
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-sm transition-all duration-150 ${
                            hasSales
                              ? "bg-[#380712] group-hover:bg-[#8B2635]"
                              : "bg-stone-200 group-hover:bg-stone-300"
                          }`}
                        />

                        {/* X-axis label (sampled on mobile) */}
                        <span className="mt-2 text-[10px] text-stone-400 truncate max-w-[45px] text-center hidden sm:inline">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center text-xs text-stone-400">
                No orders recorded for this timeframe.
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
              <span>₹0</span>
              <span>Upper: ₹{maxRevenue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </section>

        {/* 2-Column Section: Status & Payments */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Fulfillment Status */}
          <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Fulfillment status
                </h2>
                <p className="text-xs text-stone-500">
                  Breakdown across {data?.orderStatuses.total || 0} customer orders
                </p>
              </div>
              <Truck size={18} className="text-stone-400" />
            </div>

            {/* Segmented bar */}
            <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
              {Object.entries(data?.orderStatuses.counts || {}).map(
                ([status, count]) => {
                  if (count === 0 || !data?.orderStatuses.total) return null;
                  const pct = (count / data.orderStatuses.total) * 100;
                  const meta = statusMeta[status] || statusMeta.pending;
                  return (
                    <div
                      key={status}
                      style={{ width: `${pct}%` }}
                      className={`${meta.bar}`}
                      title={`${meta.label}: ${count} (${Math.round(pct)}%)`}
                    />
                  );
                }
              )}
            </div>

            {/* Status list */}
            <div className="mt-5 space-y-2">
              {Object.entries(data?.orderStatuses.counts || {}).map(
                ([status, count]) => {
                  const meta = statusMeta[status] || statusMeta.pending;
                  const total = data?.orderStatuses.total || 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <div
                      key={status}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs transition hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                        <span className="font-medium text-stone-700">
                          {meta.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-stone-900">
                          {count}
                        </span>
                        <span className="w-10 text-right text-stone-400">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* Payment Method & Collection */}
          <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Payment channels
                </h2>
                <p className="text-xs text-stone-500">
                  Online payments vs Cash on Delivery (COD)
                </p>
              </div>
              <CreditCard size={18} className="text-stone-400" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                <span className="text-[11px] font-medium text-stone-500">
                  Online Payments
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                  {data?.paymentBreakdown.online || 0}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  UPI, Cards &amp; NetBanking
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                <span className="text-[11px] font-medium text-stone-500">
                  Cash on Delivery (COD)
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                  {data?.paymentBreakdown.cod || 0}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  Doorstep settlement
                </p>
              </div>
            </div>

            {/* Catalog collection distribution */}
            <div className="mt-6 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-medium text-stone-700">
                  Catalog collection distribution
                </span>
                <span className="text-stone-400">
                  {data?.kpis.activeCatalogProducts || 0} active products
                </span>
              </div>

              <div className="space-y-3">
                {data?.categoryDistribution && data.categoryDistribution.length > 0 ? (
                  data.categoryDistribution.slice(0, 4).map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">{cat.name}</span>
                        <span className="font-medium text-stone-900">
                          {cat.count} items ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div
                          style={{ width: `${cat.percentage}%` }}
                          className="h-full rounded-full bg-[#380712]"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No categories active.</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Top Performing Products Table */}
        <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                Top products by units sold
              </h2>
              <p className="mt-0.5 text-xs text-stone-500">
                Best-performing apparel pieces by sales volume and revenue.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-stone-900"
            >
              <span>View catalog</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {data?.topProducts && data.topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 text-center font-medium">Units sold</th>
                    <th className="pb-3 text-right font-medium">Revenue</th>
                    <th className="pb-3 pr-2 text-right font-medium">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.topProducts.map((prod, i) => (
                    <tr key={`${prod.name}-${i}`} className="hover:bg-stone-50/70">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            {prod.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[9px] text-stone-400">
                                None
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-900 line-clamp-1">
                              {prod.name}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              Rank #{i + 1}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-medium text-stone-700">
                        {prod.quantity}
                      </td>
                      <td className="py-3 text-right font-semibold text-stone-900">
                        ₹{prod.revenue.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {prod.slug ? (
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900"
                          >
                            <span>Store</span>
                            <ExternalLink size={11} />
                          </Link>
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center text-xs text-stone-500">
              <ShoppingBag size={20} className="mx-auto text-stone-400 mb-2" />
              No sales recorded for this timeframe yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
