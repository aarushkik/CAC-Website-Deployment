"use client";

import Image from "next/image";

type MascotSize = "sm" | "md" | "lg" | "xl";
type MascotVariant = "hero" | "notes" | "sweeping" | "thinking" | "scanning" | "warning" | "celebrating";

interface MascotProps {
  size?: MascotSize;
  variant?: MascotVariant;
  className?: string;
}

const sizes: Record<MascotSize, { px: number; cls: string }> = {
  sm: { px: 64, cls: "h-16 w-16" },
  md: { px: 96, cls: "h-24 w-24" },
  lg: { px: 140, cls: "h-[140px] w-[140px]" },
  xl: { px: 200, cls: "h-[200px] w-[200px]" },
};

// Maps all variants cleanly to the original transparent orange hamster assets
const variants: Record<MascotVariant, string> = {
  hero: "/mascot/hero.png",
  notes: "/mascot/thinking.png",      // Laptop/logging context
  sweeping: "/mascot/scanning.png",    // Empty search/sweep context
  thinking: "/mascot/thinking.png",
  scanning: "/mascot/scanning.png",
  warning: "/mascot/warning.png",
  celebrating: "/mascot/celebrating.png",
};

/**
 * Minimal mascot component — loads different transparent orange hamster sticker variants.
 * Stationary (no bouncing) and completely transparent.
 */
export function Mascot({ size = "md", variant = "hero", className = "" }: MascotProps) {
  const s = sizes[size];
  const srcPath = variants[variant];

  return (
    <div className={`relative ${s.cls} shrink-0 ${className}`}>
      <Image
        src={srcPath}
        alt={`RepairBuddy mascot ${variant}`}
        width={s.px}
        height={s.px}
        className="object-contain"
        priority
      />
    </div>
  );
}
