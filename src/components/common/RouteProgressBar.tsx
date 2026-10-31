"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname changes, complete the progress bar smoothly
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept same-origin link clicks for immediate responsive feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      try {
        const url = new URL(target.href, window.location.href);
        if (
          url.origin === window.location.origin &&
          url.pathname + url.search !== window.location.pathname + window.location.search
        ) {
          setLoading(true);
          setProgress(22);
          setTimeout(() => setProgress(68), 120);
          setTimeout(() => setProgress(88), 380);
        }
      } catch {
        // Ignore invalid URL parse
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => document.removeEventListener("click", handleLinkClick, { capture: true });
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100000] h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Loading page"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-[#9A6B35] via-[#E8CD8A] to-[#D4AF69] shadow-[0_0_14px_rgba(212,175,105,0.9)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "width 0.15s ease-out, opacity 0.35s ease-out 0.15s"
              : "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
