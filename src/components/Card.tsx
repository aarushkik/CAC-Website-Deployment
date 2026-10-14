import type { ReactNode } from "react";

/** A white work surface with a soft shadow, used for most content blocks. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={`rounded-card border border-concrete-200 bg-white p-5 shadow-card sm:p-6 ${className}`}>
      {children}
    </Tag>
  );
}
