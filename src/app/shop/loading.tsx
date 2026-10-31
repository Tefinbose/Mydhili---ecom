export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#380712] antialiased">
      {/* Top golden progress shimmer */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-transparent via-[#D4AF69] to-transparent animate-pulse" />

      {/* Shop Header Skeleton */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-12 text-center text-white sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <div className="h-3 w-28 rounded bg-[#E6C47A]/30 animate-pulse" />
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <div className="h-10 w-64 rounded-xl bg-white/20 animate-pulse sm:h-14 sm:w-80" />

          <div className="mx-auto mt-4 flex max-w-md flex-col items-center gap-2">
            <div className="h-3.5 w-full rounded bg-white/15 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-white/15 animate-pulse" />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full border border-[#D4AF69]/30 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop Products Skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E9DFD2] pb-6">
          <div className="h-10 w-full max-w-xs rounded-xl bg-[#EDE4D8] animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-28 rounded-xl bg-[#EDE4D8] animate-pulse" />
            <div className="h-10 w-32 rounded-xl bg-[#EDE4D8] animate-pulse" />
          </div>
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
