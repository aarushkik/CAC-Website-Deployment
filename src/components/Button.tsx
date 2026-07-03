"use client";

import Link from "next/link";
import { useState, type ComponentProps, type ReactNode, type MouseEvent } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black tracking-wide border-4 border-black transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:opacity-50 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
  secondary:
    "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
  ghost:
    "border-transparent text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-black/10",
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
