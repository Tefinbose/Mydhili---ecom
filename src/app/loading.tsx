import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center bg-[#FAF7F2] px-6 text-[#380712]">
      {/* Top hairline luxury progress shimmer */}
      <div className="fixed inset-x-0 top-0 z-[100] h-[3px] bg-[#380712] animate-pulse" />

      {/* Boutique emblem & subtle pulsing aura */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32">
          {/* Subtle rotating gold dashed circle */}
          <svg
            className="absolute h-36 w-36 animate-spin-slow sm:h-40 sm:w-40"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="rgba(154, 107, 53, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>

          {/* Logo */}
          <div className="relative flex items-center justify-center animate-pulse">
            <Image
              src="/logo/logo.png"
              alt="Mydhili Boutique Logo"
              width={160}
              height={120}
              priority
              className="h-16 w-auto object-contain sm:h-20"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-6 flex items-center justify-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9A6B35]">
            Mydhili Boutique
          </span>
        </div>

        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#380712]/50">
          Loading boutique experience...
        </p>
      </div>
    </div>
  );
}

