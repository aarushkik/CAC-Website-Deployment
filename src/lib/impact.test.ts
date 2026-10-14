import { describe, expect, it } from "vitest";
import { compareCosts } from "./cost";
import { categories } from "./data";
import {
  categoryBreakdown,
  computeImpact,
  milestones,
  monthlyImpact,
  trashDaysEquivalent,
} from "./impact";
import type { RepairLogEntry } from "./types";

function entry(partial: Partial<RepairLogEntry>): RepairLogEntry {
  return {
    id: Math.random().toString(36).slice(2),
    date: new Date(2026, 8, 15, 12).toISOString(),
    itemName: "Thing",
    outcome: "fixed",
    moneySaved: 0,
    wasteAvoidedLbs: 0,
    ...partial,
  };
}

describe("computeImpact", () => {
  it("counts fixed, attempted, and pro referrals separately", () => {
    const totals = computeImpact([
      entry({ outcome: "fixed", moneySaved: 20, wasteAvoidedLbs: 2 }),
      entry({ outcome: "attempted", moneySaved: 5 }),
      entry({ outcome: "referred-to-pro", wasteAvoidedLbs: 1.5 }),
    ]);
    expect(totals).toMatchObject({
      repairsFixed: 1,
      repairsAttempted: 1,
      referredToPro: 1,
      totalEntries: 3,
      totalMoneySaved: 25,
      totalWasteAvoidedLbs: 3.5,
    });
  });
});

describe("monthlyImpact", () => {
  const now = new Date(2026, 9, 11); // Oct 11, 2026

  it("runs oldest to newest, fills empty months, and ends this month", () => {
    const months = monthlyImpact(
      [
        entry({ date: new Date(2026, 9, 2).toISOString(), moneySaved: 40 }),
        entry({ date: new Date(2026, 6, 20).toISOString(), moneySaved: 10 }),
      ],
      { now },
    );
    expect(months.map((m) => m.key)).toEqual([
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
    ]);
    expect(months.find((m) => m.key === "2026-07")?.saved).toBe(10);
    expect(months.find((m) => m.key === "2026-08")?.saved).toBe(0);
    expect(months.at(-1)?.saved).toBe(40);
  });

  it("caps the chart at twelve months and labels years when it spans them", () => {
    const months = monthlyImpact([entry({ date: new Date(2024, 0, 5).toISOString() })], { now });
    expect(months).toHaveLength(12);
    expect(months[0].label).toMatch(/'25$/);
  });

  it("is empty with no entries", () => {
    expect(monthlyImpact([], { now })).toEqual([]);
  });
});

describe("categoryBreakdown", () => {
  it("groups by category, most common first, with unknowns as Other", () => {
    const rows = categoryBreakdown(
      [
        entry({ categoryId: "bikes", moneySaved: 10 }),
        entry({ categoryId: "bikes", moneySaved: 5 }),
        entry({ categoryId: "clothing" }),
        entry({ categoryId: undefined }),
      ],
      categories,
    );
    expect(rows[0]).toMatchObject({ id: "bikes", count: 2, saved: 15 });
    expect(rows.map((r) => r.id)).toContain("other");
  });
});

describe("milestones", () => {
  it("tracks progress toward each goal", () => {
    const goals = milestones(computeImpact([entry({ outcome: "fixed", moneySaved: 50 })]));
    expect(goals.find((g) => g.id === "first-fix")?.achieved).toBe(true);
    expect(goals.find((g) => g.id === "saved-100")?.progress).toBe(0.5);
  });
});

describe("trashDaysEquivalent", () => {
  it("uses 4.9 pounds per person per day", () => {
    expect(trashDaysEquivalent(49)).toBeCloseTo(10);
  });
});

describe("compareCosts", () => {
  it.each([
    [10, 100, "repair"],
    [70, 100, "lean-repair"],
    [99, 100, "even"],
    [130, 100, "replace"],
  ] as const)("repair $%s vs replace $%s -> %s", (repair, replace, verdict) => {
    expect(compareCosts(repair, replace)?.verdict).toBe(verdict);
  });

  it("waits for usable numbers", () => {
    expect(compareCosts(undefined, 100)).toBeNull();
    expect(compareCosts(10, 0)).toBeNull();
    expect(compareCosts(-5, 100)).toBeNull();
  });

  it("treats a free repair as the clear win", () => {
    expect(compareCosts(0, 30)).toMatchObject({ verdict: "repair", savings: 30 });
  });
});
