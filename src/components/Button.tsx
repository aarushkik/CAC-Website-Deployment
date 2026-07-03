"use client";

import Link from "next/link";
import { useState, type ComponentProps, type ReactNode, type MouseEvent } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-black tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-amber-600 hover:-translate-y-1",
  secondary:
    "bg-white text-slate-800 border-2 border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 shadow-sm hover:shadow-md hover:-translate-y-1",
  ghost:
    "text-orange-600 hover:bg-orange-50 hover:text-orange-700",
};

function RippleSpan({ x, y }: { x: number; y: number }) {
  return (
    <span
      className="absolute rounded-full bg-white/40 pointer-events-none animate-[rippleBurst_0.7s_ease-out_forwards]"
      style={{
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
      }}
    />
  );
}

/** Large, high-contrast button with ripple burst on click. Renders as a link when `href` is set. */
export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  onClick,
  ...props
}: {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & Partial<ComponentProps<"button">>) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    onClick?.(e);
  }

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${classes} active:scale-90 active:shadow-none`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${classes} active:scale-90 active:shadow-none`} onClick={handleClick} {...props}>
      {ripples.map((r) => (
        <RippleSpan key={r.id} x={r.x} y={r.y} />
      ))}
      {children}
    </button>
  );
}
