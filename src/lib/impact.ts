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
  for (const entry of entries) {
    const date = new Date(entry.date);
    const key = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
    buckets.set(key, (buckets.get(key) ?? 0) + (entry.moneySaved || 0));
  }
  return Array.from(buckets, ([month, saved]) => ({ month, saved }));
}
