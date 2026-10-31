"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function InitialPreloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // If early head script marked the splash dismissed, hide immediately
    if (typeof document !== "undefined" && document.documentElement.classList.contains("splash-dismissed")) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof document !== "undefined") {
          document.documentElement.classList.add("splash-dismissed");
        }
        try {
          sessionStorage.setItem("mydhili_splash_seen", "true");
        } catch {}
      }, 700);
    }, 2200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          if (typeof document !== "undefined") {
            document.documentElement.classList.add("splash-dismissed");
          }
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="initial-preloader-root"
      onClick={() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          if (typeof document !== "undefined") {
            document.documentElement.classList.add("splash-dismissed");
          }
          try {
            sessionStorage.setItem("mydhili_splash_seen", "true");
          } catch {}
        }, 400);
      }}
      className={`fixed inset-0 z-[99999] transition-all duration-700 ease-in-out cursor-pointer select-none ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      title="Click anywhere to enter store immediately"
    >
      <LoadingScreen
        fullScreen
        theme="royal-maroon"
        duration={2000}
        onComplete={() => {
          setExiting(true);
          setTimeout(() => {
            setVisible(false);
            if (typeof document !== "undefined") {
              document.documentElement.classList.add("splash-dismissed");
            }
            try {
              sessionStorage.setItem("mydhili_splash_seen", "true");
            } catch {}
          }, 600);
        }}
      />
    </div>
  );
}
