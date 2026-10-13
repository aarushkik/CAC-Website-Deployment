"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { computeImpact, type ImpactTotals } from "@/lib/impact";
import { getGuide } from "@/lib/data";
import { getAllGuideProgress, getRepairLog } from "@/lib/storage";
import { Icon } from "./Icon";

const EXAMPLES = ["flat bike tire", "stuck zipper", "wobbly chair", "dripping faucet"];

/** The search box on the home page: type what is wrong and go straight to the matches. */
export function ProblemSearch() {
  const router = useRouter();
  const [text, setText] = useState("");

  function go(value: string) {
    const query = value.trim();
    router.push(query ? `/scanner?q=${encodeURIComponent(query)}` : "/choose-item");
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(text);
        }}
        className="flex items-center gap-2 rounded-[1.25rem] border-2 border-workshop-900 bg-surface p-2 shadow-lift focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100"
      >
        <label className="flex flex-1 items-center gap-2 pl-3 text-workshop-600">
          <Icon name="search" />
          <span className="sr-only">What is broken?</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's broken?"
            enterKeyHint="search"
            className="w-full bg-transparent py-3 text-lg text-workshop-900 placeholder:text-workshop-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="flex min-h-[3.25rem] items-center gap-1.5 rounded-xl bg-brand-600 px-5 text-lg font-bold text-white transition hover:brightness-110 active:scale-95"
        >
          Check it
          <Icon name="arrow" size={18} />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => go(example)}
            className="chip border border-workshop-200 bg-surface/80 text-workshop-800 transition hover:border-brand-300 hover:text-brand-700"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A line of the user's own totals, shown on the home page once they have logged something. */
export function ImpactStrip() {
  const [totals, setTotals] = useState<ImpactTotals | null>(null);

  useEffect(() => {
    const log = getRepairLog();
    if (log.length > 0) setTotals(computeImpact(log));
  }, []);

  if (!totals) return null;

  return (
    <Link
      href="/dashboard"
      className="tile mt-6 flex animate-rise items-center justify-between gap-4 px-5 py-4"
    >
      <div>
        <p className="eyebrow">Your impact so far</p>
        <p className="mt-1 text-workshop-900">
          <strong className="text-xl">${totals.totalMoneySaved.toFixed(0)}</strong> saved ·{" "}
          <strong className="text-xl">{totals.totalRepairs}</strong>{" "}
          {totals.totalRepairs === 1 ? "repair" : "repairs"} ·{" "}
          <strong className="text-xl">{totals.totalWasteAvoidedLbs.toFixed(0)}</strong> lbs kept out
          of the landfill
        </p>
      </div>
      <Icon name="arrow" className="text-brand-700" />
    </Link>
  );
}

/** Guides with some steps ticked but not all, so a half-done repair is one tap away. */
export function ContinueStrip() {
  const [started, setStarted] = useState<Array<{ id: string; title: string; done: number; total: number }>>([]);

  useEffect(() => {
    const rows = Object.entries(getAllGuideProgress()).flatMap(([id, steps]) => {
      const guide = getGuide(id);
      if (!guide || steps.length === 0 || steps.length >= guide.steps.length) return [];
      return [{ id, title: guide.title, done: steps.length, total: guide.steps.length }];
    });
    setStarted(rows.slice(0, 3));
  }, []);

  if (started.length === 0) return null;

  return (
    <section className="mt-6 animate-rise">
      <p className="eyebrow mb-2">Pick up where you left off</p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {started.map((row) => (
          <li key={row.id}>
            <Link href={`/guide/${row.id}`} className="tile block p-4">
              <span className="block font-semibold text-workshop-900">{row.title}</span>
              <span className="mt-2 block h-2 overflow-hidden rounded-full bg-workshop-200">
                <span className="block h-full rounded-full bg-safe" style={{ width: `${(row.done / row.total) * 100}%` }} />
              </span>
              <span className="mt-1 block text-sm text-workshop-800">
                {row.done} of {row.total} steps done
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
