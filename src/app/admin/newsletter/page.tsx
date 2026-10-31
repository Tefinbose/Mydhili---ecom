"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Download,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  source: string;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState("");

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/admin/newsletter?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load newsletter subscribers.");
      }

      setSubscribers(data.subscribers || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscribers();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchSubscribers]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ["Email", "Status", "Source", "Date Subscribed"];
    const rows = subscribers.map((s) => [
      s.email,
      s.status,
      s.source || "website_footer",
      new Date(s.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `mydhili_newsletter_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessBanner(`Exported ${subscribers.length} subscriber(s) to CSV`);
    setTimeout(() => setSuccessBanner(""), 3500);
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const nextStatus = subscriber.status === "active" ? "unsubscribed" : "active";

    try {
      setActionLoadingId(subscriber.id);
      const res = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subscriber.id, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to update status.");
      }

      setSubscribers((prev) =>
        prev.map((s) => (s.id === subscriber.id ? { ...s, status: nextStatus } : s))
      );
      setStats((prev) => ({
        ...prev,
        active: nextStatus === "active" ? prev.active + 1 : prev.active - 1,
        unsubscribed: nextStatus === "unsubscribed" ? prev.unsubscribed + 1 : prev.unsubscribed - 1,
      }));
      setSuccessBanner(`Subscriber marked as ${nextStatus}`);
      setTimeout(() => setSuccessBanner(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete "${email}" from the subscriber list?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete subscriber.");
      }

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      setSuccessBanner(`Removed ${email} from subscriber list`);
      setTimeout(() => setSuccessBanner(""), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting subscriber.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#A27B35]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
                Mailing List
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#380712] sm:text-4xl">
              Newsletter Subscribers
            </h1>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              Manage customer email subscriptions, track subscriber growth, and export email lists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchSubscribers}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF69]/40 bg-white px-4 py-2.5 text-xs font-semibold text-[#380712] shadow-sm transition hover:bg-[#FAF3E8] disabled:opacity-60"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#9A6B35]" : "text-[#9A6B35]"} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[#380712] px-5 py-2.5 text-xs font-semibold text-[#F5DFC0] shadow-md transition hover:bg-[#520A1A] disabled:opacity-50"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {successBanner && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
            {successBanner}
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
            {error}
          </div>
        )}

        {/* 4 Luxury Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm transition hover:border-[#D4AF69]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9A6B35]">
              Total Subscribers
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-[#380712]">
              {stats.total.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">All registered emails</p>
          </div>

          <div className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm transition hover:border-[#D4AF69]">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Active Subscribers
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-emerald-700">
              {stats.active.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">Receiving boutique newsletters</p>
          </div>

          <div className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm transition hover:border-[#D4AF69]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9A6B35]">
              New This Month
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-[#380712]">
              {stats.thisMonth.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">Current calendar month</p>
          </div>

          <div className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm transition hover:border-[#D4AF69]">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Unsubscribed
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-stone-600">
              {stats.unsubscribed.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-400">Opted out from emails</p>
          </div>
        </div>

        {/* Subscriber Registry Table Section */}
        <section className="overflow-hidden rounded-3xl border border-[#EDE4D9] bg-white shadow-sm">
          {/* Header & Filter Bar */}
          <div className="flex flex-col gap-4 border-b border-[#EEE7DE] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-[#380712]">
                Subscriber Registry
              </h2>
              <span className="rounded-full bg-[#FAF7F2] px-2.5 py-0.5 text-xs text-stone-500">
                {subscribers.length} records
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email..."
                  className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF7F2] py-2 pl-9 pr-4 text-xs text-[#380712] outline-none transition focus:border-[#D4AF69] sm:w-64"
                />
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-[#E8DFD3] bg-[#FAF7F2] p-1">
                {(["all", "active", "unsubscribed"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition ${
                      statusFilter === filter
                        ? "bg-[#380712] text-[#F5DFC0] shadow-sm"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="border-b border-[#EEE7DE] bg-[#FAF7F2]/60 text-[11px] font-semibold uppercase tracking-wider text-[#9A6B35]">
                <tr>
                  <th scope="col" className="px-6 py-4">Subscriber Email</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Source</th>
                  <th scope="col" className="px-6 py-4">Subscribed Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1]">
                {loading && subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-xs text-stone-400">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="font-serif text-lg font-bold text-[#380712]">
                        {search ? "No matching subscribers" : "No subscribers yet"}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        {search
                          ? "Try clearing your search query."
                          : "Subscribers will appear here once visitors submit the newsletter form on the storefront."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => {
                    const isCopied = copiedId === sub.id;
                    const isBusy = actionLoadingId === sub.id;

                    return (
                      <tr key={sub.id} className="transition hover:bg-[#FAF7F2]/50">
                        <td className="px-6 py-4 font-medium text-[#380712]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{sub.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(sub.email, sub.id)}
                              className="rounded p-1 text-stone-400 transition hover:bg-[#FAF3E8] hover:text-[#9A6B35]"
                              title="Copy email"
                            >
                              {isCopied ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                              sub.status === "active"
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border border-stone-200 bg-stone-100 text-stone-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                sub.status === "active" ? "bg-emerald-500" : "bg-stone-400"
                              }`}
                            />
                            {sub.status === "active" ? "Subscribed" : "Unsubscribed"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md border border-[#EDE4D9] bg-[#FAF7F2] px-2 py-0.5 text-[11px] font-mono text-stone-600">
                            {sub.source || "website_footer"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-stone-500">
                          {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleStatus(sub)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                                sub.status === "active"
                                  ? "border border-[#E8DFD3] bg-white text-stone-600 hover:bg-[#FAF7F2] hover:text-[#380712]"
                                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {sub.status === "active" ? "Unsubscribe" : "Activate"}
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleDelete(sub.id, sub.email)}
                              className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-50 hover:text-rose-600"
                              title="Delete subscriber"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
