"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, LogOut } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin portal error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[#D4AF69]/30 bg-white p-8 text-center shadow-[0_20px_50px_rgba(56,7,18,0.08)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertCircle size={28} />
        </div>

        <h2 className="mt-5 font-serif text-2xl font-bold text-[#380712]">
          Unable to Load Admin Panel
        </h2>

        <p className="mt-2 text-sm text-stone-600">
          A server error occurred while retrieving admin resources.
        </p>

        {error?.message && (
          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Error Details
            </p>
            <p className="mt-1 font-mono text-xs text-rose-700 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#380712] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5DFC0] shadow-md transition hover:bg-[#520A1A]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 transition hover:bg-stone-50"
          >
            <Home size={14} />
            Storefront
          </Link>

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut size={14} />
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
}
