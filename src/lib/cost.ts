import type { Item, RepairOutcome } from "./types";

/**
 * Fix-or-replace math for the calculator. A common rule of thumb is that a
 * repair costing more than half the price of a new item is a closer call;
 * below that, repairing is the clear win.
 */

export type CostVerdict = "repair" | "lean-repair" | "even" | "replace";

export interface CostComparison {
  repairCost: number;
  replacementCost: number;
  /** Positive when repairing is cheaper. */
  savings: number;
  /** Repair cost as a share of the replacement cost (0.25 = 25%). */
  ratio: number;
  verdict: CostVerdict;
}

/** Returns null until both costs are usable numbers. */
export function compareCosts(repairCost: number | undefined, replacementCost: number | undefined): CostComparison | null {
  if (repairCost === undefined || replacementCost === undefined) return null;
  if (!Number.isFinite(repairCost) || !Number.isFinite(replacementCost)) return null;
  if (repairCost < 0 || replacementCost <= 0) return null;

  const savings = replacementCost - repairCost;
  const ratio = repairCost / replacementCost;
  // Within $2 or 3%, call it even.
  const evenThreshold = Math.max(2, replacementCost * 0.03);

  let verdict: CostVerdict;
  if (Math.abs(savings) <= evenThreshold) verdict = "even";
  else if (savings < 0) verdict = "replace";
  else if (ratio <= 0.5) verdict = "repair";
  else verdict = "lean-repair";

  return { repairCost, replacementCost, savings, ratio, verdict };
}

/**
 * Suggested "money saved" and "waste avoided" when logging a catalog item:
 * the replacement price minus what the repair cost (DIY or pro), and the
 * item's weight. Undefined when we don't have the numbers.
 */
export function logEstimates(
  item: Item | undefined,
  outcome: RepairOutcome,
): { saved?: number; waste?: number } {
  if (!item) return {};
  if (outcome === "attempted") return { saved: 0, waste: 0 };
  const repair = outcome === "referred-to-pro" ? item.estimatedProCost : item.estimatedRepairCost;
  const replace = item.estimatedReplacementCost;
  return {
    saved: repair !== undefined && replace !== undefined ? Math.max(0, replace - repair) : undefined,
    waste: item.estimatedWeightLbs,
  };
}
