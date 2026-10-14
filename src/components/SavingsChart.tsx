"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/format";
import type { MonthBucket } from "@/lib/impact";

// Tokens from tailwind.config.ts (Recharts needs raw colors).
const BRAND = "#1d4f91";
const GRID = "#e1e5df";
const MUTED = "#56605c";

/** Money saved per month. Loaded on demand so the charting library stays off other pages. */
export default function SavingsChart({ data }: { data: MonthBucket[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" stroke={MUTED} tickLine={false} axisLine={{ stroke: GRID }} fontSize={12} />
        <YAxis
          stroke={MUTED}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={56}
          allowDecimals={false}
          tickFormatter={(value: number) => formatMoney(value)}
        />
        <Tooltip
          cursor={{ fill: "rgba(29, 79, 145, 0.06)" }}
          formatter={(value: number) => [formatMoney(value), "Saved"]}
          labelFormatter={(_label, payload) => payload?.[0]?.payload?.longLabel ?? ""}
          contentStyle={{ borderRadius: 8, borderColor: GRID, fontSize: 13 }}
        />
        <Bar dataKey="saved" fill={BRAND} radius={[5, 5, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
