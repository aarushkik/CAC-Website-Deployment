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
import { PageHeader } from "@/components/PageHeader";
import { computeImpact, moneySavedByMonth, type ImpactTotals } from "@/lib/impact";
import { getRepairLog } from "@/lib/storage";
import type { RepairLogEntry } from "@/lib/types";

export default function DashboardPage() {
  const [entries, setEntries] = useState<RepairLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getRepairLog());
    setLoaded(true);
  }, []);

  const totals: ImpactTotals = computeImpact(entries);
  const chartData = moneySavedByMonth(entries);

  return (
    <div>
      <PageHeader
        title="Your impact"
        intro="Every repair adds up — for your wallet and for Southwest Washington."
      />

      {!loaded ? (
        <p className="text-workshop-800">Loading…</p>
      ) : entries.length === 0 ? (
        <Card>
          <p className="text-workshop-800">
            No data yet. Log a repair to see your money saved, repairs completed, and waste avoided.
          </p>
          <Button href="/log" className="mt-4">
            Log your first repair
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Money saved" value={`$${totals.totalMoneySaved.toFixed(0)}`} tone="safe" />
            <StatCard label="Repairs completed" value={totals.totalRepairs.toString()} tone="brand" />
            <StatCard
              label="Waste avoided"
              value={`${totals.totalWasteAvoidedLbs.toFixed(0)} lbs`}
              tone="workshop"
            />
            <StatCard label="Sent to a pro" value={totals.referredToPro.toString()} tone="caution" />
          </div>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold text-workshop-900">Money saved over time</h2>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6d9c6" />
                  <XAxis dataKey="month" stroke="#463b2e" />
                  <YAxis stroke="#463b2e" tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: number) => [`$${v}`, "Saved"]} />
                  <Bar dataKey="saved" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/log" variant="secondary">
              Add another repair
            </Button>
            <Button href="/choose-item" variant="ghost">
              Start a new repair →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const toneClasses: Record<string, string> = {
  safe: "border-safe/30 bg-safe/5 text-safe",
  brand: "border-brand-100 bg-brand-50 text-brand-700",
  workshop: "border-workshop-200 bg-workshop-100 text-workshop-900",
  caution: "border-caution/30 bg-caution/5 text-caution",
};

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-card border p-6 ${toneClasses[tone]}`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-medium text-workshop-800">{label}</p>
    </div>
  );
}
