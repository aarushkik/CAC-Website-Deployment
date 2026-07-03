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
import { Mascot } from "@/components/Mascot";
import {
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  GlobeAmericasIcon,
  BriefcaseIcon,
  PlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

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
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Your impact"
        intro="Every repair adds up — for your wallet and for the environment."
      />

      {!loaded ? (
        <div className="text-center py-12 text-slate-400 animate-pulse font-medium">Loading…</div>
      ) : entries.length === 0 ? (
        <Card className="text-center py-10 border-dashed border-white/5 bg-dark-850/20 max-w-lg mx-auto animate-scale-in flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center space-y-2 opacity-50">
            <Mascot size="sm" variant="thinking" />
            <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-500">No impact stats logged</span>
          </div>
          <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
            No stats recorded yet. Log your first repair to calculate saved money, waste avoided, and pro referrals.
          </p>
          <Button href="/log" className="w-full sm:w-auto">
            <PlusIcon className="h-5 w-5" />
            Log your first repair
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up delay-100">
            <StatCard 
              label="Money saved" 
              value={`$${totals.totalMoneySaved.toFixed(0)}`} 
              tone="safe" 
              icon={CurrencyDollarIcon} 
            />
            <StatCard 
              label="Repairs completed" 
              value={totals.totalRepairs.toString()} 
              tone="brand" 
              icon={WrenchScrewdriverIcon} 
            />
            <StatCard
              label="Waste avoided"
              value={`${totals.totalWasteAvoidedLbs.toFixed(0)} lbs`}
              tone="workshop"
              icon={GlobeAmericasIcon}
            />
            <StatCard 
              label="Sent to a pro" 
              value={totals.referredToPro.toString()} 
              tone="caution" 
              icon={BriefcaseIcon} 
            />
          </div>

          <Card className="mt-6 animate-slide-up delay-150">
            <h2 className="text-lg font-bold text-white mb-4">Money saved over time</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v}`} fontSize={11} fontWeight={600} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#111118", 
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "0.75rem",
                      color: "#f1f5f9"
                    }}
                    itemStyle={{ color: "#f59e0b" }}
                    labelStyle={{ color: "#94a3b8" }}
                    formatter={(v: number) => [`$${v}`, "Saved"]} 
                  />
                  <Bar dataKey="saved" fill="#ea580c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="mt-6 flex flex-wrap gap-4 animate-fade-in delay-200">
            <Button href="/log" variant="secondary" className="w-full sm:w-auto">
              <PlusIcon className="h-5 w-5 text-accent-400" />
              Add another repair
            </Button>
            <Button href="/choose-item" variant="ghost" className="w-full sm:w-auto">
              <span>Start a new repair</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

const toneClasses: Record<string, { card: string; text: string; iconBg: string }> = {
  safe: {
    card: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 shadow-glow-safe",
    text: "text-emerald-300",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  brand: {
    card: "border-accent-500/20 bg-accent-500/5 text-accent-400 shadow-glow",
    text: "text-accent-300",
    iconBg: "bg-accent-500/10 text-accent-400",
  },
  workshop: {
    card: "border-blue-500/20 bg-blue-500/5 text-blue-400 shadow-glow-safe shadow-blue-500/5",
    text: "text-blue-300",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  caution: {
    card: "border-amber-500/20 bg-amber-500/5 text-amber-400 shadow-glow-caution",
    text: "text-amber-300",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
};

function StatCard({ 
  label, 
  value, 
  tone, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  tone: string;
  icon: any;
}) {
  const styles = toneClasses[tone] || toneClasses.brand;
  return (
    <div className={`rounded-card-lg border p-6 flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.02] ${styles.card}`}>
      <div>
        <p className="text-3xl font-black tracking-tight">{value}</p>
        <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 ${styles.iconBg}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
