"use client";

import { Mascot } from "./Mascot";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

/**
 * Loading state component used as Suspense fallback and during async operations.
 * Features the small mascot with a pulsing glow animation.
 */
export function LoadingSpinner({ text = "Loading…", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 -m-3 rounded-full bg-accent-500/10 animate-ping-slow" />
        <Mascot size="md" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-400 flex items-center gap-2">
        <span className="loading-text-shimmer">{text}</span>
        <span className="flex gap-0.5">
          <span className="h-1 w-1 rounded-full bg-accent-500 typing-dot" />
          <span className="h-1 w-1 rounded-full bg-accent-500 typing-dot" />
          <span className="h-1 w-1 rounded-full bg-accent-500 typing-dot" />
        </span>
      </p>
    </div>
  );
}
