"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useId, useState } from "react";
import { ArrowRight, OctagonAlert, Recycle, ShieldX } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { compareCosts, type CostComparison } from "@/lib/cost";
import { categories, getItem, items } from "@/lib/data";
import { formatMoney, formatWeight, parseAmount } from "@/lib/format";
import type { Item } from "@/lib/types";

type RepairPath = "diy" | "pro";

/** DIY isn't an option for dangerous items, or when we only know a pro's price. */
function defaultPath(item: Item | undefined): RepairPath {
  if (!item) return "diy";
  if (item.dangerous || item.baseSafety === "red" || item.estimatedRepairCost === undefined) return "pro";
  return "diy";
}

function estimateFor(item: Item | undefined, path: RepairPath): string {
  const value = path === "pro" ? item?.estimatedProCost : item?.estimatedRepairCost;
  return value === undefined ? "" : String(value);
}

const calculatorItems = items.filter((i) => !i.generic && i.estimatedReplacementCost !== undefined);

function CalculatorContent() {
  const searchParams = useSearchParams();
  const initialItem = calculatorItems.find((i) => i.id === searchParams.get("item"));
  const initialPath: RepairPath =
    searchParams.get("path") === "pro" ? "pro" : defaultPath(initialItem);

  const [itemId, setItemId] = useState(initialItem?.id ?? "");
  const [path, setPath] = useState<RepairPath>(initialPath);
  const [repairCost, setRepairCost] = useState(estimateFor(initialItem, initialPath));
  const [replacementCost, setReplacementCost] = useState(
    initialItem?.estimatedReplacementCost?.toString() ?? "",
  );
  const [weight, setWeight] = useState(initialItem?.estimatedWeightLbs?.toString() ?? "");

  const item = getItem(itemId);
  const diyBlocked = Boolean(item && (item.dangerous || item.baseSafety === "red"));

  function chooseItem(id: string) {
    const next = getItem(id);
    const nextPath = defaultPath(next);
    setItemId(id);
    setPath(nextPath);
    setRepairCost(estimateFor(next, nextPath));
    setReplacementCost(next?.estimatedReplacementCost?.toString() ?? "");
    setWeight(next?.estimatedWeightLbs?.toString() ?? "");
  }

  function choosePath(next: RepairPath) {
    setPath(next);
    const estimate = estimateFor(item, next);
    if (estimate) setRepairCost(estimate);
  }

  const comparison = compareCosts(parseAmount(repairCost), parseAmount(replacementCost));
  const pounds = parseAmount(weight) ?? 0;
  const repairLabel = path === "pro" ? "Pro's repair quote" : "Parts and supplies";

  return (
    <div>
      <PageHeader
        eyebrow="Fix or replace"
        title="Is it worth fixing?"
        intro="Compare what a repair costs with buying new. Start from a common repair, then adjust the numbers to match your quotes."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card>
          <label htmlFor="calc-item" className="label">
            Start from a common repair <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <select
            id="calc-item"
            value={itemId}
            onChange={(event) => chooseItem(event.target.value)}
            className="input mt-1"
          >
            <option value="">Enter my own numbers</option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {calculatorItems
                  .filter((i) => i.categoryId === category.id)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>

          <fieldset className="mt-6">
            <legend className="label">Who&apos;s doing the repair?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["diy", "I'll fix it"],
                  ["pro", "A local pro"],
                ] as const
              ).map(([value, label]) => {
                const disabled = value === "diy" && diyBlocked;
                const checked = path === value;
                return (
                  <label
                    key={value}
                    className={`flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-brand-500 ${
                      disabled
                        ? "cursor-not-allowed border-concrete-200 bg-concrete-100 text-ink-muted line-through"
                        : checked
                          ? "cursor-pointer border-ink bg-ink text-white"
                          : "cursor-pointer border-concrete-300 bg-white text-ink-soft hover:bg-concrete-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="path"
                      value={value}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => choosePath(value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            {diyBlocked && (
              <p className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger-ink">
                <OctagonAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                This repair needs a professional, so it&apos;s priced as a pro repair.
              </p>
            )}
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MoneyInput label={repairLabel} value={repairCost} onChange={setRepairCost} />
            <MoneyInput label="Replacement cost" value={replacementCost} onChange={setReplacementCost} />
          </div>

          <div className="mt-4 sm:max-w-[50%] sm:pr-2">
            <NumberInput
              label="Weight"
              suffix="lbs"
              hint="For the landfill estimate"
              value={weight}
              onChange={setWeight}
            />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink-muted">
            Starting numbers are rough averages, not quotes. Prices in Southwest Washington vary — call a
            shop or two for real numbers.
          </p>
        </Card>

        <Verdict comparison={comparison} item={item} path={path} pounds={pounds} />
      </div>
    </div>
  );
}

const verdictCopy: Record<
  CostComparison["verdict"],
  { headline: (c: CostComparison) => string; detail: (c: CostComparison) => string; tone: string }
> = {
  repair: {
    headline: (c) => `Fix it — you'd save about ${formatMoney(c.savings)}`,
    detail: (c) =>
      `The repair costs ${Math.round(c.ratio * 100)}% of buying new. That's a clear win.`,
    tone: "border-safe/40",
  },
  "lean-repair": {
    headline: (c) => `Fixing still saves about ${formatMoney(c.savings)}`,
    detail: (c) =>
      `The repair costs ${Math.round(c.ratio * 100)}% of a new one. If the item is old or worn, a replacement may last longer — but the repair keeps it out of the landfill.`,
    tone: "border-caution/70",
  },
  even: {
    headline: () => "It's about even",
    detail: () =>
      "The costs are close. Repairing keeps something you already know works — and keeps it out of the landfill.",
    tone: "border-concrete-300",
  },
  replace: {
    headline: (c) => `Replacing costs about ${formatMoney(Math.abs(c.savings))} less`,
    detail: () =>
      "Buying new is cheaper here. If you replace it, take the old one to a repair event or recycler instead of the trash.",
    tone: "border-concrete-300",
  },
};

function Verdict({
  comparison,
  item,
  path,
  pounds,
}: {
  comparison: CostComparison | null;
  item: Item | undefined;
  path: RepairPath;
  pounds: number;
}) {
  if (item?.replaceOnly) {
    return (
      <Card className="border-danger/40">
        <p className="flex items-center gap-2 font-display text-2xl font-extrabold text-danger-ink">
          <ShieldX className="h-6 w-6" aria-hidden="true" />
          Replace it — don&apos;t repair it
        </p>
        <p className="mt-2 text-ink-soft">{item.baseReason}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Expect to pay about {formatMoney(item.estimatedReplacementCost ?? 0)} for new gear. Check the{" "}
          <a href="https://www.cpsc.gov/Recalls" target="_blank" rel="noopener noreferrer" className="link">
            recall list
          </a>{" "}
          first — recalled gear is often replaced for free.
        </p>
      </Card>
    );
  }

  if (!comparison) {
    return (
      <Card className="flex flex-col justify-center">
        <p className="font-display text-2xl font-extrabold text-ink">Your verdict shows up here</p>
        <p className="mt-2 text-ink-soft">
          Pick a common repair, or enter a repair cost and a replacement cost.
        </p>
      </Card>
    );
  }

  const copy = verdictCopy[comparison.verdict];
  const max = Math.max(comparison.repairCost, comparison.replacementCost, 1);
  const logParams = new URLSearchParams({
    outcome: path === "pro" ? "referred-to-pro" : "fixed",
    saved: String(Math.max(0, Math.round(comparison.savings * 100) / 100)),
    waste: String(pounds),
  });
  if (item) logParams.set("item", item.id);

  return (
    <Card className={`border-2 ${copy.tone}`}>
      <p className="eyebrow">Verdict</p>
      <h2 className="mt-1 font-display text-3xl font-extrabold leading-tight text-ink" aria-live="polite">
        {copy.headline(comparison)}
      </h2>
      <p className="mt-2 text-ink-soft">{copy.detail(comparison)}</p>

      <dl className="mt-6 space-y-3">
        <CostBar
          label={path === "pro" ? "Pro repair" : "DIY repair"}
          amount={comparison.repairCost}
          width={comparison.repairCost / max}
          barClass="bg-brand-600"
        />
        <CostBar
          label="Buy new"
          amount={comparison.replacementCost}
          width={comparison.replacementCost / max}
          barClass="bg-concrete-400"
        />
      </dl>

      {pounds > 0 && comparison.verdict !== "replace" && (
        <p className="mt-6 flex items-start gap-2 rounded-lg bg-safe-soft px-3 py-2.5 text-sm font-medium text-safe-ink">
          <Recycle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          Repairing keeps about {formatWeight(pounds)} out of the landfill.
        </p>
      )}

      {comparison.verdict !== "replace" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href={`/log?${logParams.toString()}`}>
            Log this repair
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          {item && !item.dangerous && item.guideId && path === "diy" && (
            <Link href={`/safety-checker?item=${item.id}`} className="link text-sm">
              Run the safety check first
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}

function CostBar({
  label,
  amount,
  width,
  barClass,
}: {
  label: string;
  amount: number;
  width: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <dt className="font-semibold text-ink">{label}</dt>
        <dd className="font-display text-xl font-extrabold text-ink tabular">{formatMoney(amount)}</dd>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-concrete-100" aria-hidden="true">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${Math.max(width * 100, 2)}%` }} />
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
  const id = useId();
  const invalid = value.trim() !== "" && parseAmount(value) === undefined;
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          aria-invalid={invalid}
          className="input pl-7 tabular"
        />
      </div>
      {invalid && <p className="mt-1 text-sm text-danger-ink">Enter a number, like 25 or 12.50.</p>}
    </div>
  );
}

function NumberInput({
  label,
  suffix,
  hint,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const invalid = value.trim() !== "" && parseAmount(value) === undefined;
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {hint && <span className="font-normal text-ink-muted">({hint})</span>}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          aria-invalid={invalid}
          className="input pr-12 tabular"
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted" aria-hidden="true">
          {suffix}
        </span>
      </div>
      {invalid && <p className="mt-1 text-sm text-danger-ink">Enter a number, like 3 or 1.5.</p>}
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <CalculatorContent />
    </Suspense>
  );
}
