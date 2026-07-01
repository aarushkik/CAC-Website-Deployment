import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "bg-workshop-100 text-workshop-900 border border-workshop-200 hover:bg-workshop-200",
  ghost: "text-brand-700 hover:bg-brand-50",
};

/** Large, high-contrast button used across the app. Renders as a link when `href` is set. */
export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
} & Partial<ComponentProps<"button">>) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
