"use client";

import { useEffect, useState } from "react";
import { Check, Printer, RotateCcw } from "lucide-react";
import type { GuideStep } from "@/lib/types";

const storageKey = (guideId: string) => `fixit-wa03-guide-progress:${guideId}`;

function readProgress(guideId: string, stepCount: number): boolean[] {
  try {
    const raw = window.localStorage.getItem(storageKey(guideId));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const done = Array.isArray(parsed) ? parsed : [];
    return Array.from({ length: stepCount }, (_, index) => done.includes(index));
  } catch {
    return Array.from({ length: stepCount }, () => false);
  }
}

function writeProgress(guideId: string, done: boolean[]) {
  try {
    const indexes = done.flatMap((isDone, index) => (isDone ? [index] : []));
    if (indexes.length) window.localStorage.setItem(storageKey(guideId), JSON.stringify(indexes));
    else window.localStorage.removeItem(storageKey(guideId));
  } catch {
    // Progress is a convenience; the guide still works without saving it.
  }
}

/** Repair steps you can check off as you go. Progress is remembered on this device. */
export function GuideSteps({ guideId, steps }: { guideId: string; steps: GuideStep[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));

  useEffect(() => {
    setDone(readProgress(guideId, steps.length));
  }, [guideId, steps.length]);

  function toggle(index: number) {
    setDone((previous) => {
      const next = previous.map((value, i) => (i === index ? !value : value));
      writeProgress(guideId, next);
      return next;
    });
  }

  function reset() {
    const cleared = steps.map(() => false);
    setDone(cleared);
    writeProgress(guideId, cleared);
  }

  const completed = done.filter(Boolean).length;
  const allDone = completed === steps.length;

  return (
    <div>
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink" aria-live="polite">
          {allDone ? "All steps done — nice work." : `${completed} of ${steps.length} steps done`}
        </p>
        <div className="flex gap-1">
          {completed > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink-soft hover:bg-concrete-100"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Start over
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink-soft hover:bg-concrete-100"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </button>
        </div>
      </div>
      <div className="no-print mt-2 h-2 overflow-hidden rounded-full bg-concrete-200" aria-hidden="true">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${allDone ? "bg-safe" : "bg-brand-600"}`}
          style={{ width: `${(completed / steps.length) * 100}%` }}
        />
      </div>

      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => {
          const isDone = done[index];
          return (
            <li key={step.title}>
              <label
                className={`flex cursor-pointer gap-4 rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-brand-500 ${
                  isDone ? "border-safe/30 bg-safe-soft/60" : "border-concrete-200 bg-white hover:border-concrete-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(index)}
                  className="sr-only"
                />
                <span
                  className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 font-display text-lg font-extrabold tabular ${
                    isDone ? "border-safe bg-safe text-white" : "border-brand-600 text-brand-700"
                  }`}
                  aria-hidden="true"
                >
                  {isDone ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                </span>
                <span className="flex-1">
                  <span className={`block font-semibold ${isDone ? "text-ink-muted line-through decoration-1" : "text-ink"}`}>
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </span>
                  <span className="mt-0.5 block leading-relaxed text-ink-soft">{step.detail}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
