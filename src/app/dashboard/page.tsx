"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CommunityImpact } from "@/components/CommunityImpact";
import { Icon, type IconName } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { RepairWall } from "@/components/RepairWall";
import { getCategory } from "@/lib/data";
import { demoEntries, isDemoEntry } from "@/lib/demo";
import {
  MILESTONES,
  byCategory,
  computeImpact,
  moneySavedByMonth,
  type ImpactTotals,
} from "@/lib/impact";
import { getRepairLog, replaceRepairLog } from "@/lib/storage";
import type { RepairLogEntry } from "@/lib/types";

export default function DashboardPage() {
  const [entries, setEntries] = useState<RepairLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [shared, setShared] = useState("");

  useEffect(() => {
    setEntries(getRepairLog());
    setLoaded(true);
  }, []);

  const totals: ImpactTotals = computeImpact(entries);
  const chartData = moneySavedByMonth(entries);
  const categories = byCategory(entries);
  const mostRepairs = Math.max(1, ...categories.map((c) => c.count));
  const hasDemo = entries.some(isDemoEntry);

  function loadDemo() {
    const real = entries.filter((e) => !isDemoEntry(e));
    setEntries(replaceRepairLog([...demoEntries(), ...real]));
  }

  function removeDemo() {
    setEntries(replaceRepairLog(entries.filter((e) => !isDemoEntry(e))));
  }

  /** Opens the phone's share sheet, or copies the text on a laptop. */
  async function share() {
    const text =
      `I've fixed ${totals.totalRepairs} ${totals.totalRepairs === 1 ? "thing" : "things"} instead of replacing them: ` +
      `$${totals.totalMoneySaved.toFixed(0)} saved and ${totals.totalWasteAvoidedLbs.toFixed(0)} lbs kept out of the landfill. #FixIt`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My FixIt impact", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShared("Copied. Paste it anywhere.");
    } catch {
      setShared("");
    }
  }

  return (
    <div>
      <PageHeader
        title="Your impact"
        intro="Every repair adds up, for your wallet and for the landfill."
      />

      <div className="mb-6 [&>section]:mt-0">
        <CommunityImpact />
      </div>

      {!loaded ? (
        <p className="text-workshop-800">Loading…</p>
      ) : entries.length === 0 ? (
        <Card className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-workshop-100 text-workshop-600">
            <Icon name="chart" />
          </span>
          <p className="mt-3 text-lg font-semibold text-workshop-900">Nothing to show yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-workshop-800">
            Log a repair and this page fills in with money saved, repairs done and waste kept out
            of the landfill.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button href="/log">Log your first repair</Button>
            <Button variant="secondary" onClick={loadDemo}>
              See it with example data
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {hasDemo && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-card border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-workshop-900">
              <span>
                <strong>Example data is loaded.</strong> These repairs are made up, to show how the
                page looks.
              </span>
              <button type="button" onClick={removeDemo} className="font-bold text-brand-700 underline">
                Remove example data
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard icon="dollar" label="Money saved" value={`$${totals.totalMoneySaved.toFixed(0)}`} tone="safe" />
            <StatCard icon="wrench" label="Repairs done" value={totals.totalRepairs.toString()} tone="brand" />
            <StatCard
              icon="trash"
              label="Kept out of the landfill"
              value={`${totals.totalWasteAvoidedLbs.toFixed(0)} lbs`}
              tone="workshop"
            />
            <StatCard icon="pin" label="Taken to a pro" value={totals.referredToPro.toString()} tone="caution" />
          </div>

          <RepairWall entries={entries} />

          <div className="mt-5 grid gap-5 lg:grid-cols-[3fr,2fr]">
            <Card>
              <h2 className="text-lg font-semibold text-workshop-900">Money saved by month</h2>
              <div className="mt-4 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#8a7558" strokeOpacity={0.25} vertical={false} />
                    <XAxis dataKey="month" stroke="#8a7558" tickLine={false} fontSize={12} />
                    <YAxis stroke="#8a7558" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip cursor={{ fill: "#8a7558", fillOpacity: 0.12 }} formatter={(v: number) => [`$${v}`, "Saved"]} />
                    <Bar dataKey="saved" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-workshop-900">What you fix most</h2>
              <ul className="mt-4 space-y-3">
                {categories.map((c) => {
                  const category = getCategory(c.categoryId);
                  return (
                    <li key={c.categoryId}>
                      <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-medium text-workshop-900">
                          {category ? category.name : "Other"}
                        </span>
                        <span className="text-workshop-800">
                          {c.count} · ${c.saved.toFixed(0)}
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-workshop-100">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${(c.count / mostRepairs) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card className="mt-5">
            <h2 className="text-lg font-semibold text-workshop-900">Milestones</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {MILESTONES.map((m) => {
                const reached = m.reached(totals);
                return (
                  <li
                    key={m.id}
                    className={`rounded-card border p-3 text-center ${
                      reached ? "border-safe/40 bg-safe/10" : "border-dashed border-workshop-300 bg-workshop-50"
                    }`}
                  >
                    <span
                      className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                        reached ? "bg-safe text-white" : "bg-workshop-200 text-workshop-500"
                      }`}
                    >
                      <Icon name={reached ? "check" : "star"} size={18} />
                    </span>
                    <p className={`mt-2 text-sm font-bold ${reached ? "text-workshop-900" : "text-workshop-600"}`}>
                      {m.label}
                    </p>
                    <p className="text-xs text-workshop-600">{reached ? "Reached" : m.detail}</p>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={share}>
              <Icon name="share" size={18} />
              Share my impact
            </Button>
            <Button href="/log" variant="secondary">
              Add another repair
            </Button>
            {!hasDemo && (
              <Button variant="ghost" onClick={loadDemo}>
                Add example data
              </Button>
            )}
            <span className="text-sm text-workshop-800" role="status">
              {shared}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const toneClasses: Record<string, string> = {
  safe: "bg-safe/10 text-safe",
  brand: "bg-brand-50 text-brand-700",
  workshop: "bg-workshop-100 text-workshop-800",
  caution: "bg-caution/10 text-caution",
};

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="animate-rise rounded-card border border-workshop-200 bg-surface p-4 shadow-card sm:p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-3 text-2xl font-extrabold text-workshop-900 sm:text-3xl">{value}</p>
      <p className="text-sm text-workshop-800">{label}</p>
    </div>
  );
}
