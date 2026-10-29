"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function InitialPreloader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only show once per session to respect user browsing flow
    const hasSeen = sessionStorage.getItem("mydhili_splash_seen");
    if (hasSeen) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("mydhili_splash_seen", "true");
      }, 700);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      onClick={() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
      }}
      className={`fixed inset-0 z-[9999] transition-all duration-700 ease-in-out cursor-pointer ${
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
          setTimeout(() => setVisible(false), 600);
        }}
      />
    </div>
  );
}
