"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { itemFromParams, itemQuery } from "@/lib/data";
import { getGuideProgress, saveGuideProgress } from "@/lib/storage";
import type { Guide } from "@/lib/types";
import { Button } from "./Button";
import { Guide3D, hasModel } from "./Guide3D";
import { Icon } from "./Icon";

/**
 * The steps of a guide as a checklist. Ticked steps are remembered on this
 * device, so a repair can be left half done and picked up again later.
 */
export function GuideChecklist({ guide }: { guide: Guide }) {
  const item = itemFromParams(useSearchParams());
  const [done, setDone] = useState<number[]>([]);
  // step-by-step mode: one step fills the screen. null means it is closed.
  const [focusStep, setFocusStep] = useState<number | null>(null);

  useEffect(() => {
    setDone(getGuideProgress(guide.id));
  }, [guide.id]);

  function toggle(index: number) {
    const next = done.includes(index) ? done.filter((i) => i !== index) : [...done, index];
    setDone(next);
    saveGuideProgress(guide.id, next);
  }

  function reset() {
    setDone([]);
    saveGuideProgress(guide.id, []);
  }

  const total = guide.steps.length;
  const finished = done.length === total;
  const nextStep = guide.steps.findIndex((_, i) => !done.includes(i));
  const logLink = item ? `/log?${itemQuery(item)}&outcome=fixed` : `/log?custom=${encodeURIComponent(guide.title)}&outcome=fixed`;

  return (
    <section className="rounded-card border border-workshop-200 bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-workshop-900">Steps</h2>
        <p className="text-sm font-semibold text-workshop-800" aria-live="polite">
          {done.length} of {total} done
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-workshop-200">
        <div
          className="h-full rounded-full bg-safe transition-all duration-300"
          style={{ width: `${(done.length / total) * 100}%` }}
        />
      </div>

      {hasModel(guide.id) && (
        <Guide3D guideId={guide.id} step={nextStep < 0 ? total - 1 : nextStep} className="mt-5" />
      )}

      <Button onClick={() => setFocusStep(nextStep < 0 ? 0 : nextStep)} className="no-print mt-5 w-full">
        <Icon name="eye" size={18} />
        {done.length === 0 ? "Start step by step" : finished ? "Go through the steps again" : "Continue step by step"}
      </Button>

      {focusStep !== null && (
        <StepByStep
          guide={guide}
          step={focusStep}
          done={done}
          onStep={setFocusStep}
          onDone={(index) => {
            if (!done.includes(index)) toggle(index);
          }}
          onClose={() => setFocusStep(null)}
        />
      )}

      <ol className="mt-5 space-y-3">
        {guide.steps.map((step, i) => {
          const checked = done.includes(i);
          const current = i === nextStep;
          return (
            <li key={i}>
              <label
                className={`flex cursor-pointer gap-3 rounded-card border-2 p-4 transition ${
                  checked
                    ? "border-safe/30 bg-safe/5"
                    : current
                      ? "border-brand-300 bg-brand-50/60"
                      : "border-workshop-200 bg-surface"
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(i)} className="peer sr-only" />
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full font-bold transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200 ${
                    checked ? "bg-safe text-white" : "bg-brand-600 text-white"
                  }`}
                >
                  {checked ? <Icon name="check" size={18} /> : i + 1}
                </span>
                <span>
                  <span className={`block font-semibold ${checked ? "text-workshop-600 line-through" : "text-workshop-900"}`}>
                    {step.title}
                  </span>
                  <span className={checked ? "text-workshop-600" : "text-workshop-800"}>{step.detail}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>

      {finished ? (
        <div className="no-print mt-5 animate-pop rounded-card border border-safe/40 bg-safe/10 p-5 text-center">
          <p className="text-xl font-extrabold text-workshop-900">Nice work. You fixed it.</p>
          <p className="mt-1 text-sm text-workshop-800">
            Log it so it counts toward your money saved and waste avoided.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button href={logLink}>
              <Icon name="check" size={18} />
              Log this repair
            </Button>
            <Button variant="ghost" onClick={reset}>
              Start over
            </Button>
          </div>
        </div>
      ) : (
        <p className="no-print mt-4 text-sm text-workshop-800">
          Tap a step when it is done. Your place is saved on this device.
        </p>
      )}
    </section>
  );
}

/**
 * One step on the whole screen, in big type, for when the phone is propped up and
 * your hands are busy. Swipe or use the buttons. "Done, next" ticks the step.
 */
function StepByStep({
  guide,
  step,
  done,
  onStep,
  onDone,
  onClose,
}: {
  guide: Guide;
  step: number;
  done: number[];
  onStep: (step: number) => void;
  onDone: (step: number) => void;
  onClose: () => void;
}) {
  const total = guide.steps.length;
  const current = guide.steps[step];
  const last = step === total - 1;
  const [touchX, setTouchX] = useState<number | null>(null);

  const back = () => step > 0 && onStep(step - 1);
  const next = () => {
    onDone(step);
    if (last) onClose();
    else onStep(step + 1);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  });

  return (
    <div
      className="no-print fixed inset-0 z-50 flex flex-col bg-workshop-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${guide.title}, step ${step + 1} of ${total}`}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const moved = e.changedTouches[0].clientX - touchX;
        // a swipe that starts on the 3D picture turns the picture, not the page
        if (!(e.target as HTMLElement).closest("canvas")) {
          if (moved < -60) next();
          if (moved > 60) back();
        }
        setTouchX(null);
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-workshop-200 px-4 py-3">
        <p className="truncate text-sm font-semibold text-workshop-800">{guide.title}</p>
        <button
          type="button"
          onClick={onClose}
          className="flex-none rounded-full px-3 py-2 text-sm font-bold text-brand-700 hover:bg-workshop-100"
        >
          Close
        </button>
      </div>
      <div className="flex gap-1.5 px-4 pt-3" aria-hidden="true">
        {guide.steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i === step ? "bg-brand-600" : done.includes(i) ? "bg-safe" : "bg-workshop-200"
            }`}
          />
        ))}
      </div>

      <div key={step} className="mx-auto flex w-full max-w-2xl flex-1 animate-rise flex-col justify-center overflow-y-auto px-6 py-6">
        {hasModel(guide.id) && <Guide3D guideId={guide.id} step={step} className="mb-6" />}
        <p className="eyebrow">
          Step {step + 1} of {total}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold leading-tight text-workshop-900 sm:text-5xl">{current.title}</h2>
        <p className="mt-4 text-xl leading-relaxed text-workshop-800 sm:text-2xl">{current.detail}</p>
      </div>

      <div className="safe-bottom border-t border-workshop-200 bg-surface px-4 pt-3">
        <div className="mx-auto mb-3 flex max-w-2xl gap-3">
          <Button variant="secondary" onClick={back} disabled={step === 0} className="min-h-[3.75rem] flex-1 text-lg">
            <Icon name="back" />
            Back
          </Button>
          <Button onClick={next} className="min-h-[3.75rem] flex-[2] text-lg">
            {last ? "Done, finish" : "Done, next"}
            <Icon name={last ? "check" : "arrow"} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Keeps the phone screen from switching off while a guide is open. Not every
 * browser can do this, the button only shows up where it works.
 */
export function KeepAwakeButton() {
  const [supported, setSupported] = useState(false);
  const [lock, setLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => setSupported("wakeLock" in navigator), []);
  useEffect(() => () => void lock?.release(), [lock]);

  if (!supported) return null;

  async function flip() {
    if (lock) {
      await lock.release();
      setLock(null);
      return;
    }
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      sentinel.addEventListener("release", () => setLock(null));
      setLock(sentinel);
    } catch {
      setLock(null);
    }
  }

  return (
    <Button variant={lock ? "primary" : "secondary"} onClick={flip} aria-pressed={Boolean(lock)} className="no-print">
      <Icon name="eye" size={18} />
      {lock ? "Screen stays on" : "Keep screen on"}
    </Button>
  );
}

/** Prints the guide, for people who would rather have paper in the garage. */
export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()} className="no-print">
      <Icon name="printer" size={18} />
      Print
    </Button>
  );
}
