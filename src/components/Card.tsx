import type { ReactNode } from "react";

/** A clean white card with soft shadow, used for most content blocks. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`plate rounded-card border-2 border-workshop-200 bg-surface p-5 shadow-card sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
