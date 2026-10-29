"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LoadingScreenProps = {
  /** Message to display beneath the logo */
  message?: string;
  /** Whether the loader occupies full screen fixed overlay or fills relative container */
  fullScreen?: boolean;
  /** Theme style: "royal-maroon" (signature opulent deep burgundy & gold) or "cream-ivory" (daylight boutique luxury) */
  theme?: "royal-maroon" | "cream-ivory";
  /** Optional callback fired when simulated progress hits 100% */
  onComplete?: () => void;
  /** Duration in ms for the progress animation (defaults to 2400ms) */
  duration?: number;
};

const PHRASES = [
  "Curating timeless elegance",
  "A little tradition, a lot of elegance",
  "Weaving royal craftsmanship",
  "Preparing your boutique experience",
];

export default function LoadingScreen({
  message,
  fullScreen = true,
  theme = "royal-maroon",
  onComplete,
  duration = 2400,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 300);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 1800);

    return () => clearInterval(phraseInterval);
  }, []);

  const isMaroon = theme === "royal-maroon";

  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-[100] flex min-h-screen w-full items-center justify-center overflow-hidden"
          : "relative flex min-h-[460px] w-full items-center justify-center overflow-hidden rounded-2xl"
      } ${
        isMaroon
          ? "bg-[#1f0308] text-[#FAF7F2]"
          : "bg-[#FAF7F2] text-[#380712]"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Mydhili Boutique"
    >
      {/* Background radial gradient spotlight */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isMaroon
            ? "bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,rgba(92,16,33,0.85)_0%,rgba(31,3,8,0.98)_70%,#100104_100%)]"
            : "bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,rgba(245,223,192,0.6)_0%,rgba(250,247,242,0.95)_70%,#F3ECE1_100%)]"
        }`}
      />

      {/* Ambient golden aura behind the emblem */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`h-72 w-72 rounded-full blur-3xl animate-ambient-glow sm:h-96 sm:w-96 ${
            isMaroon
              ? "bg-[#D4AF69]/25"
              : "bg-[#D4AF69]/20"
          }`}
        />
      </div>

      {/* Floating golden sparkle stars */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <span className="absolute left-[18%] top-[25%] text-sm text-[#D4AF69] animate-sparkle-1">
          ✦
        </span>
        <span className="absolute right-[22%] top-[28%] text-xs text-[#F5DFC0] animate-sparkle-2">
          ✧
        </span>
        <span className="absolute bottom-[30%] left-[24%] text-xs text-[#D4AF69] animate-sparkle-3">
          ✧
        </span>
        <span className="absolute bottom-[26%] right-[20%] text-sm text-[#D4AF69] animate-sparkle-1">
          ✦
        </span>
      </div>

      {/* Main loading content card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Animated concentric luxury halo rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating dashed mandala ring */}
          <svg
            className="absolute h-56 w-56 animate-spin-slow sm:h-64 sm:w-64"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle
              cx="100"
              cy="100"
              r="94"
              stroke={isMaroon ? "rgba(212, 175, 105, 0.3)" : "rgba(154, 107, 53, 0.3)"}
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            <circle
              cx="100"
              cy="6"
              r="2.5"
              fill="#D4AF69"
            />
            <circle
              cx="100"
              cy="194"
              r="2.5"
              fill="#D4AF69"
            />
            <circle
              cx="6"
              cy="100"
              r="2.5"
              fill="#D4AF69"
            />
            <circle
              cx="194"
              cy="100"
              r="2.5"
              fill="#D4AF69"
            />
          </svg>

          {/* Inner counter-rotating thin golden ring */}
          <svg
            className="absolute h-48 w-48 animate-spin-reverse-slow sm:h-52 sm:w-52"
            viewBox="0 0 160 160"
            fill="none"
          >
            <circle
              cx="80"
              cy="80"
              r="76"
              stroke={isMaroon ? "rgba(212, 175, 105, 0.45)" : "rgba(154, 107, 53, 0.45)"}
              strokeWidth="0.75"
              strokeDasharray="16 28"
            />
          </svg>

          {/* Logo container with circular golden glance & breathing pulse */}
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full p-2 sm:h-44 sm:w-44">
            <div className="relative flex items-center justify-center animate-luxury-pulse">
              <Image
                src="/logo/logo.png"
                alt="Mydhili Boutique Logo"
                width={759}
                height={566}
                priority
                className="h-28 w-auto object-contain sm:h-36"
              />

              {/* Pure Circular Golden Glance / Lens Flare */}
              <div className="pointer-events-none absolute -inset-6 overflow-hidden rounded-full">
                <div className="absolute left-1/2 top-1/2 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.75)_0%,rgba(245,223,192,0.45)_35%,rgba(212,175,105,0.18)_55%,transparent_75%)] blur-[4px] animate-gold-circle-glance" />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline & dynamic phrase */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#D4AF69]">✦</span>
            <span
              className={`text-[11px] font-semibold uppercase tracking-[0.3em] transition-opacity duration-500 sm:text-xs ${
                isMaroon ? "text-[#F5DFC0]" : "text-[#9A6B35]"
              }`}
            >
              {message || PHRASES[phraseIndex]}
            </span>
            <span className="text-xs text-[#D4AF69]">✦</span>
          </div>

          <p
            className={`mt-1.5 text-[9px] uppercase tracking-[0.22em] ${
              isMaroon ? "text-[#FAF7F2]/60" : "text-[#380712]/60"
            }`}
          >
            Mydhili Boutique
          </p>
        </div>

        {/* Golden hairline progress track */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div
            className={`relative h-[2px] w-48 overflow-hidden rounded-full sm:w-64 ${
              isMaroon ? "bg-white/10" : "bg-[#380712]/10"
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B88939] via-[#E8CD8A] to-[#D4AF69] shadow-[0_0_12px_rgba(212,175,105,0.8)] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Discreet luxury percentage indicator */}
          <span
            className={`font-mono text-[10px] tracking-widest ${
              isMaroon ? "text-[#D4AF69]/80" : "text-[#9A6B35]"
            }`}
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
