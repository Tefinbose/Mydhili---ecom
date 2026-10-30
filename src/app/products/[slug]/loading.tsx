import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#380712] antialiased">
      {/* Subtle top golden loading progress shimmer */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-transparent via-[#D4AF69] to-transparent animate-pulse" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-stone-500">
          <Link href="/shop" className="group inline-flex items-center gap-2 transition hover:text-[#380712]">
            <ArrowLeft size={16} />
            Collection
          </Link>
          <span className="text-[#D4AF69]">/</span>
          <div className="h-4 w-32 rounded bg-[#E8DFD3] animate-pulse" />
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery Skeleton */}
          <section className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#E9DFD2] bg-gradient-to-br from-[#EDE4D8] via-[#F4EDE4] to-[#E5DACD] animate-pulse shadow-[0_20px_50px_rgba(56,7,18,0.06)]">
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Thumbnail row skeleton */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl border border-[#E9DFD2] bg-[#EDE4D8] animate-pulse"
                />
              ))}
            </div>
          </section>

          {/* Information Skeleton */}
          <section className="flex min-w-0 flex-col">
            {/* Category eyebrow */}
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A27B35]/50" />
              <div className="h-3 w-28 rounded-full bg-[#E8DFD3] animate-pulse" />
            </div>

            {/* Title Skeleton */}
            <div className="h-10 w-4/5 rounded-lg bg-[#E2D6C7] animate-pulse sm:h-12" />
            <div className="mt-2 h-7 w-2/3 rounded-lg bg-[#E2D6C7]/70 animate-pulse" />

            {/* Subtitle / Short description skeleton */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-[#E8DFD3] animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-[#E8DFD3] animate-pulse" />
            </div>

            {/* Price & Stock Badge Skeleton */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-9 w-32 rounded-lg bg-[#E2D6C7] animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-[#E8DFD3] animate-pulse" />
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-[#D4AF69]/40 via-[#E9DFD2] to-transparent" />

            {/* Purchase Options Skeleton (Size/Color & CTA) */}
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-[#E8DFD3] animate-pulse" />
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-12 rounded-xl bg-[#EDE4D8] animate-pulse" />
                ))}
              </div>

              {/* Action buttons skeleton */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="h-13 flex-1 rounded-full bg-[#380712]/20 animate-pulse" />
                <div className="h-13 w-13 rounded-full bg-[#EDE4D8] animate-pulse" />
              </div>
            </div>

            {/* Perks Cards Skeleton */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-[#E9DFD2] bg-white p-4">
                  <div className="mb-3 h-10 w-10 rounded-full bg-[#FAF3E8] animate-pulse" />
                  <div className="h-4 w-16 rounded bg-[#EDE4D8] animate-pulse" />
                  <div className="mt-2 h-3 w-full rounded bg-[#EDE4D8]/70 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Details skeleton */}
            <div className="mt-8 rounded-3xl border border-[#E9DFD2] bg-white p-6">
              <div className="h-5 w-32 rounded bg-[#E8DFD3] animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-3.5 w-full rounded bg-[#EDE4D8] animate-pulse" />
                <div className="h-3.5 w-11/12 rounded bg-[#EDE4D8] animate-pulse" />
                <div className="h-3.5 w-4/5 rounded bg-[#EDE4D8] animate-pulse" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
