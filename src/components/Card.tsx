import type { ReactNode } from "react";

/** A glassmorphic card used for content blocks in the dark-themed RepairBuddy. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card-lg border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-accent-500/25 hover:shadow-md hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

