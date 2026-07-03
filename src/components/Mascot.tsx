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
  sm: { px: 48, cls: "h-12 w-12" },
  md: { px: 80, cls: "h-20 w-20" },
  lg: { px: 112, cls: "h-28 w-28" },
  xl: { px: 160, cls: "h-40 w-40" },
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
