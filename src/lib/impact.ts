import type { Category, RepairLogEntry } from "./types";

/**
 * Pounds of trash the average American throws away per day (EPA, "Facts and
 * Figures about Materials, Waste and Recycling", 2018 data). Used to turn
 * "pounds kept out of the landfill" into something people can picture.
 */
export const EPA_TRASH_LBS_PER_PERSON_PER_DAY = 4.9;

/** Aggregated numbers for the Impact Dashboard. */
export interface ImpactTotals {
  totalMoneySaved: number;
  totalWasteAvoidedLbs: number;
  /** Repairs marked "Fixed it". */
  repairsFixed: number;
  /** Repairs that were tried but not finished. */
  repairsAttempted: number;
  /** Repairs where the user was referred to a professional (still a win). */
  referredToPro: number;
  totalEntries: number;
}

/** Sums up repair log entries into dashboard totals. */
export function computeImpact(entries: RepairLogEntry[]): ImpactTotals {
  return entries.reduce<ImpactTotals>(
    (totals, entry) => {
      totals.totalMoneySaved += entry.moneySaved || 0;
      totals.totalWasteAvoidedLbs += entry.wasteAvoidedLbs || 0;
      totals.totalEntries += 1;
      if (entry.outcome === "fixed") totals.repairsFixed += 1;
      else if (entry.outcome === "attempted") totals.repairsAttempted += 1;
      else totals.referredToPro += 1;
      return totals;
    },
    {
      totalMoneySaved: 0,
      totalWasteAvoidedLbs: 0,
      repairsFixed: 0,
      repairsAttempted: 0,
      referredToPro: 0,
      totalEntries: 0,
    },
  );
}

/** Days of one person's trash that the waste avoided adds up to. */
export function trashDaysEquivalent(pounds: number): number {
  return pounds / EPA_TRASH_LBS_PER_PERSON_PER_DAY;
}

/** One month on the dashboard chart. */
export interface MonthBucket {
  /** "2026-09" */
  key: string;
  /** "Sep" (plus a year when the chart spans more than one year) */
  label: string;
  /** "September 2026" */
  longLabel: string;
  saved: number;
  waste: number;
  repairs: number;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

/**
 * Money saved, waste avoided, and repairs per month, oldest first. Months
 * with no repairs are included so the timeline is honest, and the range
 * runs up to the current month.
 */
export function monthlyImpact(
  entries: RepairLogEntry[],
  options: { now?: Date; maxMonths?: number; minMonths?: number } = {},
): MonthBucket[] {
  const { now = new Date(), maxMonths = 12, minMonths = 6 } = options;
  const dated = entries
    .map((entry) => ({ entry, date: new Date(entry.date) }))
    .filter(({ date }) => !Number.isNaN(date.getTime()));
  if (dated.length === 0) return [];

  const times = dated.map(({ date }) => date.getTime());
  const latest = new Date(Math.max(now.getTime(), ...times));
  const end = new Date(latest.getFullYear(), latest.getMonth(), 1);
  const earliest = new Date(Math.min(...times));
  let start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);

  const monthsBetween = (a: Date, b: Date) =>
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
  if (monthsBetween(start, end) > maxMonths) start = addMonths(end, -(maxMonths - 1));
  if (monthsBetween(start, end) < minMonths) start = addMonths(end, -(minMonths - 1));

  const spansYears = start.getFullYear() !== end.getFullYear();
  const buckets = new Map<string, MonthBucket>();
  for (let month = start; month <= end; month = addMonths(month, 1)) {
    const short = month.toLocaleString("en-US", { month: "short" });
    buckets.set(monthKey(month), {
      key: monthKey(month),
      label: spansYears ? `${short} '${String(month.getFullYear()).slice(2)}` : short,
      longLabel: month.toLocaleString("en-US", { month: "long", year: "numeric" }),
      saved: 0,
      waste: 0,
      repairs: 0,
    });
  }

  for (const { entry, date } of dated) {
    const bucket = buckets.get(monthKey(date));
    if (!bucket) continue; // older than the window
    bucket.saved += entry.moneySaved || 0;
    bucket.waste += entry.wasteAvoidedLbs || 0;
    bucket.repairs += 1;
  }

  return [...buckets.values()].map((bucket) => ({
    ...bucket,
    saved: Math.round(bucket.saved * 100) / 100,
    waste: Math.round(bucket.waste * 10) / 10,
  }));
}

/** Repairs grouped by category, most common first. */
export interface CategoryImpact {
  id: string;
  name: string;
  icon: string;
  count: number;
  saved: number;
}

export function categoryBreakdown(
  entries: RepairLogEntry[],
  categories: Category[],
): CategoryImpact[] {
  const byId = new Map<string, CategoryImpact>();
  for (const entry of entries) {
    const category = categories.find((c) => c.id === entry.categoryId);
    const id = category?.id ?? "other";
    const current = byId.get(id) ?? {
      id,
      name: category?.name ?? "Other",
      icon: category?.icon ?? "🧰",
      count: 0,
      saved: 0,
    };
    current.count += 1;
    current.saved += entry.moneySaved || 0;
    byId.set(id, current);
  }
  return [...byId.values()].sort((a, b) => b.count - a.count || b.saved - a.saved);
}

/** A goal shown on the dashboard. */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  /** 0 to 1 */
  progress: number;
}

export function milestones(totals: ImpactTotals): Milestone[] {
  const goal = (
    id: string,
    title: string,
    description: string,
    value: number,
    target: number,
  ): Milestone => ({
    id,
    title,
    description,
    achieved: value >= target,
    progress: Math.min(1, target > 0 ? value / target : 0),
  });

  return [
    goal("first-fix", "First fix", "Log a repair you finished.", totals.repairsFixed, 1),
    goal(
      "safe-call",
      "Knew when to call a pro",
      "Send a risky repair to a professional.",
      totals.referredToPro,
      1,
    ),
    goal("five-fixes", "Five fixes", "Finish five repairs.", totals.repairsFixed, 5),
    goal("saved-100", "$100 saved", "Save $100 by repairing.", totals.totalMoneySaved, 100),
    goal(
      "waste-50",
      "50 lbs kept out of the landfill",
      "Keep 50 pounds of stuff in use.",
      totals.totalWasteAvoidedLbs,
      50,
    ),
    goal("saved-500", "$500 saved", "Save $500 by repairing.", totals.totalMoneySaved, 500),
  ];
}
