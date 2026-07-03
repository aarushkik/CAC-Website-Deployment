"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getItem, items } from "@/lib/data";
import { Mascot } from "@/components/Mascot";
import {
  TagIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
  ShoppingBagIcon,
  ArrowRightCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

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

  const currentItem = getItem(itemId);
  const itemName = currentItem?.name || "replacement item";
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(itemName)}`;

  return (
    <div className="space-y-12 animate-fade-in max-w-3xl mx-auto pb-12">
      <PageHeader
        title="Repair vs Replace Calculator"
        intro="Enter estimated costs below to see if it makes financial sense to repair your item or buy a new one."
      />

      <div className="space-y-8">
        {/* Step 1: Selection & Input */}
        <Card className="animate-slide-up delay-100 bg-white border border-slate-200 shadow-md p-8 sm:p-10 space-y-10">
          
          <div className="space-y-4">
            <label className="block">
              <span className="font-black text-slate-900 text-lg flex items-center gap-2 mb-1">
                <TagIcon className="h-6 w-6 text-orange-500" />
                Select an item (Optional)
              </span>
              <span className="text-sm text-slate-500 font-medium block mb-4">
                Pick a common item to automatically fill in estimated costs.
              </span>
              <div className="relative">
                <select
                  value={itemId}
                  onChange={(e) => applyItemDefaults(e.target.value)}
                  className="w-full appearance-none bg-orange-50 border-2 border-orange-200 text-slate-800 font-bold rounded-full px-6 py-4 cursor-pointer hover:border-orange-300 hover:bg-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 shadow-sm"
                >
                  <option value="">Choose an item from our database…</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-orange-500">
                  <ArrowRightCircleIcon className="h-6 w-6 rotate-90" />
                </div>
              </div>
            </label>
          </div>

          <hr className="border-slate-100" />

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-2">
              <MoneyInput 
                label="Repair Cost" 
                subtitle="Cost of parts, tools, or hiring a pro."
                value={repairCost} 
                onChange={setRepairCost} 
                color="orange"
              />
            </div>
            <div className="space-y-2">
              <MoneyInput 
                label="Replacement Cost" 
                subtitle="Cost of buying a brand new item."
                value={replacementCost} 
                onChange={setReplacementCost} 
                color="slate"
              />
            </div>
          </div>
        </Card>

        {/* Step 2: Result Box (Bottom Placement) */}
        <div
          className={`animate-slide-up delay-150 transition-all duration-700 ${
            hasNumbers
              ? recommendRepair
                ? "border-2 border-emerald-300 bg-emerald-50 shadow-xl shadow-emerald-500/10 animate-bounce-in rounded-3xl"
                : "border-2 border-amber-300 bg-amber-50 shadow-xl shadow-amber-500/10 animate-bounce-in rounded-3xl"
              : "border-2 border-dashed border-slate-200 bg-slate-50 opacity-60 rounded-3xl"
          }`}
        >
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Recommendation Result</h2>
            
            {!hasNumbers ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="flex flex-col items-center space-y-3 opacity-70">
                  <Mascot size="sm" variant="thinking" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-200/50 px-4 py-1.5 rounded-full">Awaiting numbers</span>
                </div>
                <p className="text-sm text-slate-600 font-medium max-w-[240px]">
                  Enter both costs above to see our recommendation.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-inner mb-4 ${recommendRepair ? "bg-emerald-200 text-emerald-700" : "bg-amber-200 text-amber-700"}`}>
                  {recommendRepair ? <WrenchScrewdriverIcon className="h-8 w-8" /> : <ShoppingBagIcon className="h-8 w-8" />}
                </div>
                <p className={`text-3xl sm:text-4xl font-black tracking-tight ${recommendRepair ? "text-emerald-700" : "text-amber-700"}`}>
                  {recommendRepair ? "Repairing looks worth it 👍" : "Replacing may be smarter"}
                </p>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium max-w-lg mx-auto">
                  {recommendRepair
                    ? `You'd save about $${savings.toFixed(0)} by repairing instead of replacing.`
                    : savings === 0
                      ? "The costs are about the same. Consider sentimental value, effort, and landfill waste."
                      : `Replacing costs about $${Math.abs(savings).toFixed(0)} less, but repairing still keeps an item out of the landfill.`}
                </p>
              </div>
            )}

            {hasNumbers && (
              <div className="mt-8 pt-6 border-t-2 border-black/5 space-y-4">
                {recommendRepair ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-emerald-800 font-bold mb-3">Ready to start fixing?</p>
                    <Button href="/log" className="w-full sm:w-2/3 mx-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 rounded-2xl py-4">
                      <ClipboardDocumentCheckIcon className="h-6 w-6" />
                      Log this repair
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-amber-900 font-bold mb-3">Time to look for a replacement?</p>
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-2/3 mx-auto rounded-2xl bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30 text-white px-5 py-4 text-base font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingBagIcon className="h-6 w-6" />
                      Shop replacement on Amazon
                    </a>
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/50 border border-white p-4 shadow-sm">
                  <LightBulbIcon className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed font-medium text-left">
                    <strong>Tip:</strong> Repairs also save the massive environmental overhead (materials, energy, shipping) required to manufacture something completely new.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyInput({
  label,
  subtitle,
  value,
  onChange,
  color,
}: {
  label: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
  color: "orange" | "slate";
}) {
  const colorStyles = color === "orange" 
    ? "focus-within:border-orange-500 focus-within:ring-orange-500/20" 
    : "focus-within:border-slate-500 focus-within:ring-slate-500/20";
    
  const iconColor = color === "orange" ? "text-orange-500" : "text-slate-500";

  return (
    <label className="block">
      <span className="font-black text-slate-900 text-lg flex items-center gap-2 mb-1">
        <CurrencyDollarIcon className={`h-6 w-6 ${iconColor}`} />
        {label}
      </span>
      <span className="text-xs text-slate-500 font-medium block mb-3 h-4">
        {subtitle}
      </span>
      <div className={`flex items-center rounded-2xl border-2 border-slate-200 bg-slate-50 focus-within:ring-4 transition-all duration-300 shadow-inner group ${colorStyles}`}>
        <span className="pl-5 text-slate-400 font-black text-xl group-focus-within:text-slate-800 transition-colors">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full bg-transparent px-3 py-4 text-slate-800 font-bold text-lg focus:outline-none placeholder:font-normal placeholder:text-slate-400"
        />
      </div>
    </label>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading calculator…" />}>
      <CalculatorContent />
    </Suspense>
  );
}
