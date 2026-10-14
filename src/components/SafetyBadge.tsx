import type { SafetyLevel } from "@/lib/types";

const styles: Record<SafetyLevel, { classes: string; dot: string; label: string; typical: string }> = {
  green: {
    classes: "bg-safe-soft text-safe-ink border-safe/30",
    dot: "bg-safe",
    label: "Green · beginner safe",
    typical: "Usually beginner safe",
  },
  yellow: {
    classes: "bg-caution-soft text-caution-ink border-caution/60",
    dot: "bg-caution ring-1 ring-caution-ink/40",
    label: "Yellow · use caution",
    typical: "Usually needs caution",
  },
  red: {
    classes: "bg-danger-soft text-danger-ink border-danger/30",
    dot: "bg-danger",
    label: "Red · get a pro",
    typical: "Get a pro",
  },
};

/**
 * Colored pill that communicates a safety level. Always includes text, not
 * color alone. `typical` labels an item's baseline before the safety check.
 */
export function SafetyBadge({ level, typical = false }: { level: SafetyLevel; typical?: boolean }) {
  const style = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold ${style.classes}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden="true" />
      {typical ? style.typical : style.label}
    </span>
  );
}
