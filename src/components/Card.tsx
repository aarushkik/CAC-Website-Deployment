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
      className={`rounded-card border border-workshop-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
