"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatMoney, formatWeight } from "@/lib/format";
import { computeImpact } from "@/lib/impact";
import { useRepairLog } from "@/lib/useRepairLog";

/** A one-line reminder of your impact, shown only once you've logged repairs. */
export function ImpactTeaser() {
  const { entries, ready } = useRepairLog();
  if (!ready || entries.length === 0) return null;

  const totals = computeImpact(entries);
  return (
    <Link
      href="/dashboard"
      className="group mt-6 flex flex-col gap-3 rounded-card border border-safe/25 bg-safe-soft px-5 py-4 text-safe-ink transition-colors hover:border-safe/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-base">
        <strong className="font-display text-xl font-extrabold tabular">{formatMoney(totals.totalMoneySaved)}</strong>{" "}
        saved and{" "}
        <strong className="font-display text-xl font-extrabold tabular">
          {formatWeight(totals.totalWasteAvoidedLbs)}
        </strong>{" "}
        kept out of the landfill across {totals.totalEntries}{" "}
        {totals.totalEntries === 1 ? "repair" : "repairs"}.
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-bold">
        See your impact
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
