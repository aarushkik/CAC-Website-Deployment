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
  const hasNumbers = !Number.isNaN(repair) && !Number.isNaN(replace);
  const savings = hasNumbers ? replace - repair : 0;
  const recommendRepair = hasNumbers && savings > 0;

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
              className="mt-2 w-full rounded-card border border-workshop-200 bg-white px-4 py-3 text-workshop-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
            hasNumbers ? (recommendRepair ? "border-safe/40 bg-safe/5" : "border-caution/40 bg-caution/5") : ""
          }
        >
          <h2 className="text-lg font-semibold text-workshop-900">Recommendation</h2>
          {!hasNumbers ? (
            <p className="mt-2 text-workshop-800">Enter both costs to see a recommendation.</p>
          ) : (
            <div className="mt-2">
              <p className="text-2xl font-bold text-workshop-900">
                {recommendRepair ? "Repairing looks worth it 👍" : "Replacing may be smarter"}
              </p>
              <p className="mt-2 text-workshop-800">
                {recommendRepair
                  ? `You'd save about $${savings.toFixed(0)} by repairing instead of replacing.`
                  : savings === 0
                    ? "The costs are about the same. Consider effort, sentimental value, and waste."
                    : `Replacing costs about $${Math.abs(savings).toFixed(0)} less, but repairing still keeps an item out of the landfill.`}
              </p>
              {recommendRepair && (
                <Button href="/log" className="mt-4">
                  Log this repair
                </Button>
              )}
            </div>
          )}
          <p className="mt-6 text-xs text-workshop-800">
            Tip: repairs also save the environmental cost of making something new.
          </p>
        </Card>
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
      <div className="mt-2 flex items-center rounded-card border border-workshop-200 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        <span className="pl-4 text-workshop-800">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent px-2 py-3 text-workshop-900 focus:outline-none"
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
