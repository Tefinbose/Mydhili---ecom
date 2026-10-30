"use client";

import { useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Play } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-film",
  display: "swap",
});

// Replace this with your own YouTube video ID.
const videoId = "ScMzIvxBSi4";

export default function FashionFilmsSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumb, setThumb] = useState<"maxresdefault" | "hqdefault" | "none">(
    "maxresdefault"
  );

  return (
    <section
      className={`${bricolage.variable} bg-[#FAF7F2] px-5 py-12 font-[family-name:var(--font-film)] text-[#380712] sm:px-8 sm:py-16 lg:flex lg:h-[calc(100svh-6.25rem)] lg:min-h-[520px] lg:max-h-[860px] lg:items-center lg:px-12 lg:py-6`}
    >
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-14">
        {/* Text */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#A27B35]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#946C2D] sm:text-xs">
              The Mydhili Experience
            </p>
          </div>

          <h2 className="text-[clamp(2rem,3.9vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            A world of{" "}
            <span className="text-[#A27B35]">timeless elegance.</span>
          </h2>

          <p className="mt-5 max-w-md text-sm font-light leading-7 text-stone-600 sm:text-base">
            Discover the beauty of Mydhili Collections through our latest
            fashion film and collection showcase.
          </p>

          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying}
            className="group relative mt-8 inline-flex h-12 items-center gap-4 overflow-hidden rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-7 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,175,105,0.5)] disabled:opacity-60 sm:h-14 sm:pl-8"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 opacity-0 blur-[2px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
            />
            <span className="relative">Watch the film</span>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] sm:h-11 sm:w-11">
              <Play size={15} className="ml-0.5 fill-current" />
            </span>
          </button>

          <div className="mt-8 flex items-center gap-4 border-t border-[#380712]/10 pt-6">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className="text-base font-medium tracking-[-0.01em] text-[#6E625D]">
              Style is personal. Elegance is timeless.
            </p>
          </div>
        </div>

        {/* Video */}
        <div className="relative mx-auto w-full lg:max-w-[calc((100svh-11rem)*1.7778)]">
          {/* Gold offset outline */}
          <div className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-[#D4AF69]/60 sm:translate-x-4 sm:translate-y-4" />

          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#380712] to-[#6D2636] shadow-[0_30px_80px_rgba(56,7,18,0.3)]">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Mydhili Collections Fashion Film"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label="Play Mydhili Collections fashion film"
                className="group absolute inset-0 flex h-full w-full items-center justify-center"
              >
                {thumb !== "none" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/${thumb}.jpg`}
                    alt=""
                    onError={() =>
                      setThumb(thumb === "maxresdefault" ? "hqdefault" : "none")
                    }
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#210309]/75 via-[#380712]/15 to-[#210309]/30" />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-[#D4AF69]/60" />

                {/* Play button with pulse */}
                <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#D4AF69]/30 [animation-duration:2.4s]" />
                  <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#E6C47A] to-[#B8893F] text-[#380712] shadow-[0_10px_40px_rgba(212,175,105,0.5)] transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                  </span>
                </span>

                {/* Caption chip */}
                <span className="absolute bottom-4 left-4 rounded-2xl border border-[#D4AF69]/40 bg-[#210309]/80 px-4 py-2.5 text-left backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-5 sm:py-3">
                  <span className="block text-[9px] font-medium uppercase tracking-[0.28em] text-[#D4AF69]">
                    Mydhili Collections
                  </span>
                  <span className="mt-0.5 block text-base font-medium tracking-[-0.02em] text-white sm:text-lg">
                    The Fashion Film
                  </span>
                </span>
              </button>
            )}0 
          </div>
        </div>
      </div>
    </section>
  );
}