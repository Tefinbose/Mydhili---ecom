export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#380712] antialiased">
      {/* Top golden progress shimmer */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-transparent via-[#D4AF69] to-transparent animate-pulse" />

      {/* Hero Banner Skeleton */}
      <section className="relative flex min-h-[400px] items-center justify-center overflow-hidden bg-[#24040B] px-5 py-14 text-center sm:min-h-[460px] sm:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#D4AF69]/10 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          {/* Breadcrumb Skeleton */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="h-3 w-12 rounded bg-white/20 animate-pulse" />
            <span className="text-[#D4AF69]/40">/</span>
            <div className="h-3 w-16 rounded bg-white/20 animate-pulse" />
            <span className="text-[#D4AF69]/40">/</span>
            <div className="h-3 w-24 rounded bg-white/30 animate-pulse" />
          </div>

          {/* Subtitle Badge */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <div className="h-3 w-44 rounded bg-[#E6C47A]/30 animate-pulse" />
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          {/* Title Skeleton */}
          <div className="h-12 w-64 rounded-xl bg-white/20 animate-pulse sm:h-16 sm:w-80" />

          {/* Description Skeleton */}
          <div className="mx-auto mt-5 flex max-w-md flex-col items-center gap-2">
            <div className="h-3.5 w-full rounded bg-white/15 animate-pulse" />
            <div className="h-3.5 w-3/4 rounded bg-white/15 animate-pulse" />
          </div>

          {/* Category Pills Skeleton */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full border border-white/20 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-b border-[#E9DFD2] pb-4">
          <div className="h-4 w-32 rounded bg-[#E8DFD3] animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-[#E8DFD3] animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#EDE4D8] animate-pulse">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <div className="h-4 w-3/4 rounded bg-[#E8DFD3] animate-pulse" />
              <div className="h-3.5 w-1/3 rounded bg-[#E8DFD3] animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
