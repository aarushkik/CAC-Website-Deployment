import type { RepairLogEntry } from "./types";

/** Aggregated numbers for the Impact Dashboard. */
export interface ImpactTotals {
  totalMoneySaved: number;
  totalRepairs: number;
  totalWasteAvoidedLbs: number;
  /** Repairs where the user was referred to a professional (still a win). */
  referredToPro: number;
}

/** Sums up repair log entries into dashboard totals. */
export function computeImpact(entries: RepairLogEntry[]): ImpactTotals {
  return entries.reduce<ImpactTotals>(
    (totals, entry) => {
      totals.totalMoneySaved += entry.moneySaved || 0;
      totals.totalWasteAvoidedLbs += entry.wasteAvoidedLbs || 0;
      if (entry.outcome === "referred-to-pro") {
        totals.referredToPro += 1;
      } else {
        totals.totalRepairs += 1;
      }
      return totals;
    },
    {
      totalMoneySaved: 0,
      totalRepairs: 0,
      totalWasteAvoidedLbs: 0,
      referredToPro: 0,
    },
  );
}

/** Groups money saved by month label (e.g. "Jan") for the chart. */
export function moneySavedByMonth(
  entries: RepairLogEntry[],
): { month: string; saved: number }[] {
  const buckets = new Map<string, number>();
  const oldestFirst = [...entries].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  for (const entry of oldestFirst) {
    const date = new Date(entry.date);
    const key = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
    buckets.set(key, (buckets.get(key) ?? 0) + (entry.moneySaved || 0));
  }
  return Array.from(buckets, ([month, saved]) => ({ month, saved }));
}

/** Money saved and number of repairs per category, biggest first, for the dashboard bars. */
export function byCategory(
  entries: RepairLogEntry[],
): { categoryId: string; count: number; saved: number }[] {
  const buckets = new Map<string, { count: number; saved: number }>();
  for (const entry of entries) {
    const key = entry.categoryId ?? "other";
    const bucket = buckets.get(key) ?? { count: 0, saved: 0 };
    bucket.count += 1;
    bucket.saved += entry.moneySaved || 0;
    buckets.set(key, bucket);
  }
  return Array.from(buckets, ([categoryId, b]) => ({ categoryId, ...b })).sort(
    (a, b) => b.count - a.count,
  );
}

/** What a repair of this item is worth if the estimates are right. */
export function estimateSavings(item: {
  estimatedRepairCost?: number;
  estimatedReplacementCost?: number;
}): number {
  const saved = (item.estimatedReplacementCost ?? 0) - (item.estimatedRepairCost ?? 0);
  return saved > 0 ? saved : 0;
}

/** Goals the dashboard counts up to. */
export const MILESTONES = [
  { id: "first", label: "First fix", detail: "Log 1 repair", reached: (t: ImpactTotals) => t.totalRepairs >= 1 },
  { id: "five", label: "Handy", detail: "Log 5 repairs", reached: (t: ImpactTotals) => t.totalRepairs >= 5 },
  { id: "hundred", label: "$100 saved", detail: "Save $100 in total", reached: (t: ImpactTotals) => t.totalMoneySaved >= 100 },
  { id: "landfill", label: "25 lbs diverted", detail: "Keep 25 lbs out of the landfill", reached: (t: ImpactTotals) => t.totalWasteAvoidedLbs >= 25 },
  { id: "pro", label: "Knew my limits", detail: "Take 1 unsafe repair to a pro", reached: (t: ImpactTotals) => t.referredToPro >= 1 },
];
