"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Sparkles, Play, RefreshCw, Sun, Moon, ArrowLeft } from "lucide-react";

export default function LoadingDemoPage() {
  const [theme, setTheme] = useState<"royal-maroon" | "cream-ivory">("royal-maroon");
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
  const [duration, setDuration] = useState(2500);
  const [customMsg, setCustomMsg] = useState("");

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setKey((prev) => prev + 1);
      setIsPlaying(true);
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#380712]">
      {/* If playing in fullscreen mode */}
      {isPlaying ? (
        <div className="relative">
          <LoadingScreen
            key={key}
            fullScreen
            theme={theme}
            duration={duration}
            message={customMsg || undefined}
            onComplete={() => {
              // Stay in preview or allow manual restart
            }}
          />

          {/* Floating control bar over preview */}
          <div className="fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-[#D4AF69]/40 bg-[#1f0308]/90 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-1.5 rounded-full bg-[#D4AF69] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#380712] transition hover:bg-[#E8CD8A]"
            >
              <RefreshCw size={13} className="animate-spin" />
              Replay
            </button>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === "royal-maroon" ? "cream-ivory" : "royal-maroon"))}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
            >
              {theme === "royal-maroon" ? <Sun size={13} /> : <Moon size={13} />}
              {theme === "royal-maroon" ? "Ivory Mode" : "Maroon Mode"}
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
            >
              Adjust Settings
            </button>

            <Link
              href="/"
              className="flex items-center gap-1 rounded-full border border-[#D4AF69]/30 px-3 py-1.5 text-xs font-medium text-[#F5DFC0] transition hover:text-white"
            >
              <ArrowLeft size={13} />
              Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#9A6B35] transition hover:text-[#380712]"
          >
            <ArrowLeft size={14} />
            Back to store
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="text-[#D4AF69]" size={20} />
            <h1 className="font-serif text-3xl text-[#380712]">Mydhili Boutique Loading Page</h1>
          </div>
          <p className="mt-2 text-sm text-stone-600">
            A bespoke royal animation crafted specifically for Mydhili Boutique using the high-resolution brand logo, concentric rotating mandala rings, metallic gold sweep, and progress tracking.
          </p>

          <div className="mt-8 rounded-2xl border border-[#D4AF69]/40 bg-white p-6 shadow-lg">
            <h2 className="font-serif text-xl text-[#380712]">Configure Animation</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A6B35]">
                  Color Theme
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("royal-maroon")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      theme === "royal-maroon"
                        ? "border-[#D4AF69] bg-[#220309] text-[#F5DFC0] shadow-md"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-[#D4AF69]" />
                    Royal Maroon & Gold (Signature)
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("cream-ivory")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      theme === "cream-ivory"
                        ? "border-[#9A6B35] bg-[#FAF7F2] text-[#380712] shadow-md"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-[#FAF7F2] border border-[#9A6B35]" />
                    Cream Ivory (Boutique Day)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A6B35]">
                  Animation Duration
                </label>
                <div className="mt-2 flex gap-2">
                  {[1500, 2500, 4000].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      onClick={() => setDuration(ms)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        duration === ms
                          ? "border-[#D4AF69] bg-[#380712] text-[#F5DFC0]"
                          : "border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {ms === 1500 ? "Fast (1.5s)" : ms === 2500 ? "Standard (2.5s)" : "Cinematic (4s)"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#9A6B35]">
                  Custom Subtitle Message (Optional)
                </label>
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="e.g. Preparing your festive order..."
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 focus:border-[#D4AF69] focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setKey((prev) => prev + 1);
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-2 rounded-full bg-[#380712] px-6 py-3 font-semibold uppercase tracking-widest text-[#F5DFC0] shadow-md transition hover:bg-[#520A1A]"
                >
                  <Play size={16} />
                  Launch Fullscreen Loading Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
