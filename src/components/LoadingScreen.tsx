"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Keep it visible for 1.2s to show the animated shimmer, then fade out
    const timer = setTimeout(() => {
      setFading(true);
      const closeTimer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(closeTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center animate-scale-in">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Repair<span className="text-gradient-shimmer">Buddy</span>
        </h1>
      </div>
    </div>
  );
}
