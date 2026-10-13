"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { getItem, items } from "@/lib/data";

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialItem = getItem(searchParams.get("item") ?? "");

  const [itemId, setItemId] = useState(initialItem?.id ?? "");
  const [repairCost, setRepairCost] = useState(
    initialItem?.estimatedRepairCost?.toString() ?? "",
  );
  const [replacementCost, setReplacementCost] = useState(
    initialItem?.estimatedReplacementCost?.toString() ?? "",
  );

  function applyItemDefaults(id: string) {
    setItemId(id);
    const item = getItem(id);
    if (item) {
      setRepairCost(item.estimatedRepairCost?.toString() ?? "");
      setReplacementCost(item.estimatedReplacementCost?.toString() ?? "");
    }
  }

  const repair = parseFloat(repairCost);
  const replace = parseFloat(replacementCost);
  const hasNumbers = !Number.isNaN(repair) && !Number.isNaN(replace) && replace > 0;
  const savings = hasNumbers ? replace - repair : 0;
  // A common rule of thumb: a repair is clearly worth it under half the price of a new one.
  const share = hasNumbers ? repair / replace : 0;
  const verdict = !hasNumbers ? null : share <= 0.5 ? "repair" : share < 1 ? "close" : "replace";
  const selected = getItem(itemId);
  const dangerous = selected?.dangerous === true;
  const logLink = selected ? `/log?item=${selected.id}&outcome=fixed` : "/log";

  return (
    <div>
      <PageHeader
        title="Fix or replace?"
        intro="Compare what a repair costs versus buying a replacement. Numbers are estimates — adjust them to match your situation."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <label className="block">
            <span className="font-medium text-workshop-900">Start from a common item (optional)</span>
            <select
              value={itemId}
              onChange={(e) => applyItemDefaults(e.target.value)}
              className="input mt-2"
            >
              <option value="">Choose an item…</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MoneyInput label="Repair cost" value={repairCost} onChange={setRepairCost} />
            <MoneyInput label="Replacement cost" value={replacementCost} onChange={setReplacementCost} />
          </div>
        </Card>

        <Card
          className={
            verdict === "repair"
              ? "border-safe/40 bg-safe/5"
              : verdict
                ? "border-caution/40 bg-caution/5"
                : ""
          }
        >
          <p className="eyebrow">Recommendation</p>
          {!verdict ? (
            <p className="mt-2 text-workshop-800">Enter both costs to see a recommendation.</p>
          ) : (
            <div className="mt-1" aria-live="polite">
              <p className="text-2xl font-extrabold text-workshop-900">
                {verdict === "repair"
                  ? "Repair it"
                  : verdict === "close"
                    ? "It's a close call"
                    : "Replacing costs less"}
              </p>
              <p className="mt-2 text-workshop-800">
                {verdict === "repair"
                  ? `The repair is ${Math.round(share * 100)}% of the price of a new one. You keep about $${savings.toFixed(0)}.`
                  : verdict === "close"
                    ? `You would still save about $${savings.toFixed(0)}, but the repair is ${Math.round(share * 100)}% of the price of a new one. Think about how long the fix will last.`
                    : savings === 0
                      ? "The costs are the same. Repairing still keeps the item out of the landfill."
                      : `A new one is about $${Math.abs(savings).toFixed(0)} cheaper than the repair. Repairing still keeps the item out of the landfill.`}
              </p>

              <div className="mt-5 space-y-3">
                <CostBar label="Repair" amount={repair} max={Math.max(repair, replace)} colour="bg-safe" />
                <CostBar label="Replace" amount={replace} max={Math.max(repair, replace)} colour="bg-workshop-500" />
              </div>

              {dangerous ? (
                <p className="mt-5 rounded-card border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                  <strong>{selected!.name}</strong> is not a do-it-yourself repair. The repair cost
                  here is what a professional might charge.
                </p>
              ) : (
                verdict !== "replace" && (
                  <Button href={logLink} className="mt-5">
                    I fixed it, log the savings
                  </Button>
                )
              )}
            </div>
          )}
          <p className="mt-6 text-xs text-workshop-800">
            Rule of thumb used here: a repair under half the price of a new one is clearly worth
            it. The starting numbers are rough estimates.
          </p>
        </Card>
      </div>
    </div>
  );
}

function CostBar({
  label,
  amount,
  max,
  colour,
}: {
  label: string;
  amount: number;
  max: number;
  colour: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-workshop-900">
        <span>{label}</span>
        <span>${amount.toFixed(0)}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colour}`}
          style={{ width: `${max > 0 ? Math.max(2, (amount / max) * 100) : 0}%` }}
        />
      </div>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-medium text-workshop-900">{label}</span>
      <div className="mt-2 flex items-center rounded-card border border-workshop-200 bg-surface focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        <span className="pl-4 text-workshop-800">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent px-2 py-3 text-base text-workshop-900 focus:outline-none"
        />
      </div>
    </label>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <CalculatorContent />
    </Suspense>
  );
}
