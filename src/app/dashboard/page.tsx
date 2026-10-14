"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Award, FlaskConical, Recycle, ShieldCheck, Wallet, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/Toast";
import { categories, getCategory } from "@/lib/data";
import { formatDate, formatMoney, formatWeight } from "@/lib/format";
import {
  categoryBreakdown,
  computeImpact,
  milestones,
  monthlyImpact,
  trashDaysEquivalent,
} from "@/lib/impact";
import { isSampleEntry, sampleEntries } from "@/lib/sample";
import { saveRepairLog } from "@/lib/storage";
import { useRepairLog } from "@/lib/useRepairLog";

const SavingsChart = dynamic(() => import("@/components/SavingsChart"), {
  ssr: false,
  loading: () => <div className="h-full animate-pulse rounded-lg bg-concrete-100" />,
});

export default function DashboardPage() {
  const { entries, ready } = useRepairLog();
  const toast = useToast();

  function loadSamples() {
    try {
      saveRepairLog(sampleEntries());
      toast({ message: "Added 8 sample repairs. You can remove them from the repair log." });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't add samples.", tone: "error" });
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Impact"
        title="Your repair impact"
        intro="Every repair adds up — for your wallet, and for what ends up in Southwest Washington's landfills."
      />

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-36 animate-pulse rounded-card bg-white/70" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card className="mx-auto max-w-2xl text-center">
          <Wrench className="mx-auto h-10 w-10 text-brand-600" aria-hidden="true" />
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Nothing to count yet</h2>
          <p className="mt-2 text-ink-soft">
            Log a repair to see the money you&apos;ve saved, the pounds you&apos;ve kept out of the
            landfill, and the milestones you&apos;re working toward.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button href="/log">Log your first repair</Button>
            <Button variant="secondary" onClick={loadSamples}>
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Try it with sample repairs
            </Button>
          </div>
        </Card>
      ) : (
        <Dashboard entries={entries} />
      )}
    </div>
  );
}

function Dashboard({ entries }: { entries: ReturnType<typeof useRepairLog>["entries"] }) {
  const totals = computeImpact(entries);
  const months = monthlyImpact(entries);
  const byCategory = categoryBreakdown(entries, categories);
  const goals = milestones(totals);
  const trashDays = trashDaysEquivalent(totals.totalWasteAvoidedLbs);
  const maxCategoryCount = Math.max(...byCategory.map((c) => c.count), 1);
  const hasSamples = entries.some(isSampleEntry);

  return (
    <div className="space-y-6">
      {hasSamples && (
        <p className="rounded-lg border border-concrete-300 bg-white px-4 py-2.5 text-sm text-ink-soft">
          Some of these numbers come from sample repairs.{" "}
          <Link href="/log" className="link">
            Remove them in your repair log
          </Link>{" "}
          when you&apos;re ready.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<Wallet className="h-5 w-5" aria-hidden="true" />}
          label="Money saved"
          value={formatMoney(totals.totalMoneySaved)}
          detail="by repairing instead of buying new"
          accent="text-safe-ink"
        />
        <StatTile
          icon={<Recycle className="h-5 w-5" aria-hidden="true" />}
          label="Kept out of the landfill"
          value={formatWeight(totals.totalWasteAvoidedLbs)}
          detail={
            trashDays >= 1
              ? `about ${Math.round(trashDays)} ${Math.round(trashDays) === 1 ? "day" : "days"} of one person's trash*`
              : "every pound counts"
          }
          accent="text-brand-700"
        />
        <StatTile
          icon={<Wrench className="h-5 w-5" aria-hidden="true" />}
          label="Repairs fixed"
          value={String(totals.repairsFixed)}
          detail={
            totals.repairsAttempted
              ? `plus ${totals.repairsAttempted} you tried`
              : "fixed with your own hands"
          }
          accent="text-ink"
        />
        <StatTile
          icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
          label="Sent to a pro"
          value={String(totals.referredToPro)}
          detail="knowing when to call one counts too"
          accent="text-ink"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card>
          <h2 className="font-display text-2xl font-extrabold text-ink">Money saved by month</h2>
          <div className="mt-4 h-64 w-full" aria-hidden="true">
            <SavingsChart data={months} />
          </div>
          <table className="sr-only">
            <caption>Money saved by month</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Saved</th>
                <th scope="col">Repairs</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr key={month.key}>
                  <th scope="row">{month.longLabel}</th>
                  <td>{formatMoney(month.saved)}</td>
                  <td>{month.repairs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-extrabold text-ink">What you fix</h2>
          <ul className="mt-4 space-y-3">
            {byCategory.map((category) => (
              <li key={category.id}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    <span aria-hidden="true">{category.icon}</span>
                    {category.name}
                  </span>
                  <span className="text-ink-muted tabular">
                    {category.count} · {formatMoney(category.saved)}
                  </span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-concrete-100" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-2xl font-extrabold text-ink">Milestones</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className={`flex gap-3 rounded-lg border p-3 ${
                goal.achieved ? "border-safe/30 bg-safe-soft/60" : "border-concrete-200 bg-concrete-50"
              }`}
            >
              <Award
                className={`h-6 w-6 flex-none ${goal.achieved ? "text-safe" : "text-concrete-400"}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {goal.title}
                  <span className="sr-only">{goal.achieved ? " (earned)" : " (not yet)"}</span>
                </p>
                <p className="text-sm text-ink-muted">{goal.achieved ? "Earned" : goal.description}</p>
                {!goal.achieved && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-concrete-200" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${goal.progress * 100}%` }} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold text-ink">Recent repairs</h2>
          <Link href="/log" className="link inline-flex items-center gap-1 text-sm">
            Full repair log
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-concrete-200">
          {entries.slice(0, 5).map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-xl" aria-hidden="true">
                  {getCategory(entry.categoryId)?.icon ?? "🧰"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{entry.itemName}</p>
                  <p className="text-sm text-ink-muted">{formatDate(entry.date)}</p>
                </div>
              </div>
              <span className="whitespace-nowrap font-semibold text-safe-ink tabular">
                {entry.moneySaved > 0 ? `+${formatMoney(entry.moneySaved)}` : "—"}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button href="/log">Log another repair</Button>
        <Button href="/choose-item" variant="secondary">
          Start a new repair
        </Button>
      </div>

      <p className="text-xs text-ink-muted">
        *Based on the EPA&apos;s estimate that each American throws away about 4.9 pounds of trash a day.
        Money saved compares each repair with the cost of replacing the item.
      </p>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="rounded-card border border-concrete-200 bg-white p-5 shadow-card">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
        {icon}
        {label}
      </p>
      <p className={`mt-2 font-display text-5xl font-extrabold leading-none tabular ${accent}`}>{value}</p>
      <p className="mt-2 text-sm text-ink-soft">{detail}</p>
    </div>
  );
}
