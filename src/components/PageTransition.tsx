"use client";

import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content with a fade-slide-in animation on mount.
 * Uses key={pathname} to trigger transitions dynamically on route change.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="relative w-full">
      {/* Staggered transition curtain overlays */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 curtain curtain-1 bg-[#1A2B4C]" />
        <div className="absolute inset-0 curtain curtain-2 bg-[#FF7A00]" />
        <div className="absolute inset-0 curtain curtain-3 bg-[#080b11]" />
      </div>
      <div className={`animate-page-shoot-up ${className}`}>
        {children}
      </div>
    </div>
  );
}
