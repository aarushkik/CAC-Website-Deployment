import type { SafetyLevel } from "@/lib/types";

const styles: Record<SafetyLevel, { bg: string; label: string; dot: string; glow: string }> = {
  green: {
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Green — Beginner Safe",
    dot: "bg-emerald-500",
    glow: "shadow-glow-safe",
  },
  yellow: {
    bg: "bg-caution/10 text-caution border-caution/20",
    label: "Yellow — Caution Recommended",
    dot: "bg-caution",
    glow: "shadow-glow-caution",
  },
  red: {
    bg: "bg-danger/10 text-danger border-danger/20",
    label: "Red — Get a Professional",
    dot: "bg-danger",
    glow: "shadow-glow-danger",
  },
};

/** Colored pill that communicates a safety level. Includes text, not color alone (accessibility). */
export function SafetyBadge({ level }: { level: SafetyLevel }) {
  const s = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm animate-scale-in ${s.bg}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot} animate-pulse ${s.glow}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}

