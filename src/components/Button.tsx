"use client";

import Link from "next/link";
import { useState, type ComponentProps, type ReactNode, type MouseEvent } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-2xl px-6 py-3.5 text-sm font-black tracking-wide border transition-all duration-300 focus:outline-none disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 shadow-sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white border-[#FF7A00]/40 shadow-[0_4px_12px_rgba(255,122,0,0.2)] hover:shadow-[0_8px_20px_rgba(255,122,0,0.3)]",
  secondary:
    "bg-white/95 backdrop-blur-sm text-slate-800 border-slate-200 hover:bg-slate-50",
  ghost:
    "border-transparent text-orange-600 hover:bg-orange-50/30",
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
      <Link href={href} className={`${classes} active:scale-[0.98] active:shadow-none`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${classes} active:scale-[0.98] active:shadow-none`} onClick={handleClick} {...props}>
      {ripples.map((r) => (
        <RippleSpan key={r.id} x={r.x} y={r.y} />
      ))}
      {children}
    </button>
  );
}
