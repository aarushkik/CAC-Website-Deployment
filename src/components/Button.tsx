import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-card px-5 py-3 text-base font-bold transition duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[3px_3px_0_0_rgb(var(--w-900))] hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary:
    "bg-surface text-workshop-900 border-2 border-workshop-900 shadow-[3px_3px_0_0_rgb(var(--w-300))] hover:bg-workshop-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "bg-danger text-white shadow-card hover:brightness-95",
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
