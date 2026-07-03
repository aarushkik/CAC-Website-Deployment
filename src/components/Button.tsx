import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 text-base font-bold transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 shadow-sm",
  ghost: "text-orange-600 hover:bg-orange-50",
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

