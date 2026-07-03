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
    <div key={pathname} className={`animate-page-enter ${className}`}>
      {children}
    </div>
  );
}
