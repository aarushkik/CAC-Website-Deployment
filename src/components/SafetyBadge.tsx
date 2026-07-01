import type { SafetyLevel } from "@/lib/types";

const styles: Record<SafetyLevel, { bg: string; label: string; dot: string }> = {
  green: { bg: "bg-safe/10 text-safe border-safe/30", label: "Green — beginner safe", dot: "bg-safe" },
  yellow: {
    bg: "bg-caution/10 text-caution border-caution/30",
    label: "Yellow — caution",
    dot: "bg-caution",
  },
  red: { bg: "bg-danger/10 text-danger border-danger/30", label: "Red — get a pro", dot: "bg-danger" },
};

/** Colored pill that communicates a safety level. Includes text, not color alone (accessibility). */
export function SafetyBadge({ level }: { level: SafetyLevel }) {
  const s = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${s.bg}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  );
}
