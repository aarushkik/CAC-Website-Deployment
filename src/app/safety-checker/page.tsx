"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getItem } from "@/lib/data";
import { SAFETY_QUESTIONS } from "@/lib/safety";
import { ShieldCheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

function SafetyCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemId = searchParams.get("item");
  const item = itemId ? getItem(itemId) : undefined;

  // Track the yes/no answers for safety checklist
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // Contextual questions state
  const [helpers, setHelpers] = useState(1);
  const [hasTools, setHasTools] = useState<boolean | null>(null);
  const [hasExperience, setHasExperience] = useState<boolean | null>(null);

  if (!item) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto py-12 animate-fade-in">
        <PageHeader
          title="Safety check"
          intro="We couldn't find that item. Choose one to run a safety check."
        />
        <Button href="/choose-item">Choose an item</Button>
      </div>
    );
  }

  function toggle(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function submit() {
    const flags = Object.entries(answers)
      .filter(([, yes]) => yes)
      .map(([id]) => id)
      .join(",");
    const params = new URLSearchParams({
      item: item!.id,
      helpers: helpers.toString(),
      hasTools: hasTools === null ? "unknown" : hasTools ? "true" : "false",
      hasExp: hasExperience === null ? "unknown" : hasExperience ? "true" : "false",
    });
    if (flags) params.set("flags", flags);
    router.push(`/safety-result?${params.toString()}`);
  }

  const safetyAnswered = Object.keys(answers).length;
  const totalSurveyQuestions = SAFETY_QUESTIONS.length + 3; // safety + 3 contextual
  const contextualAnswered = (helpers >= 1 ? 1 : 0) + (hasTools !== null ? 1 : 0) + (hasExperience !== null ? 1 : 0);
  const progressPercent = ((safetyAnswered + contextualAnswered) / totalSurveyQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-6 animate-fade-in">
      {/* Enlarged Centered Page Header */}
      <div className="text-center space-y-4">
        <PageHeader title="Quick safety check" intro="Answer these questions honestly to get a safe, tailored repair recommendation." />
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-2xl font-black text-white">{item.name}</span>
          <SafetyBadge level={item.baseSafety} />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full bg-dark-800/40 rounded-full h-3 border border-white/5 overflow-hidden animate-slide-up delay-100">
        <div 
          className="bg-gradient-to-r from-accent-500 to-orange-600 h-full rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Warning Notice Box */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-accent-500/5 border border-accent-500/10 shadow-inner">
        <QuestionMarkCircleIcon className="h-6 w-6 text-accent-400 shrink-0 mt-0.5" />
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Please review the checklist questions below carefully. If you are unsure or in doubt, choose <strong>Yes</strong>. We err on the side of caution to protect you.
        </p>
      </div>

      <div className="space-y-10 animate-slide-up delay-150">
        {/* Section 1: Context & Setup (Personal Questions) */}
        <Card className="p-8 space-y-8">
          <h3 className="text-xl font-extrabold text-white pb-3 border-b border-white/5">
            <span className="text-gradient-shimmer">1. Setup & Context</span>
          </h3>

          <div className="space-y-6">
            {/* Helpers Count */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-200">
                How many people will be helping with this repair?
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={helpers}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setHelpers(isNaN(val) ? 1 : Math.max(1, val));
                }}
                className="w-full max-w-[12rem] bg-dark-900 border border-white/10 text-white rounded-xl px-5 py-3 text-lg font-bold focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Tools Availability */}
            <div className="space-y-3">
              <span className="block text-base font-bold text-slate-200">
                Do you have the recommended tools ready?
              </span>
              <div className="flex gap-4 max-w-sm">
                <button
                  type="button"
                  onClick={() => setHasTools(true)}
                  className={`flex-1 py-3 px-6 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    hasTools === true
                      ? "border-accent-500/40 bg-accent-500/10 text-accent-400"
                      : "border-white/5 bg-dark-900/40 text-slate-400 hover:text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasTools(false)}
                  className={`flex-1 py-3 px-6 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    hasTools === false
                      ? "border-accent-500/40 bg-accent-500/10 text-accent-400"
                      : "border-white/5 bg-dark-900/40 text-slate-400 hover:text-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Past Experience */}
            <div className="space-y-3">
              <span className="block text-base font-bold text-slate-200">
                Have you attempted similar repairs before?
              </span>
              <div className="flex gap-4 max-w-sm">
                <button
                  type="button"
                  onClick={() => setHasExperience(true)}
                  className={`flex-1 py-3 px-6 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    hasExperience === true
                      ? "border-accent-500/40 bg-accent-500/10 text-accent-400"
                      : "border-white/5 bg-dark-900/40 text-slate-400 hover:text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasExperience(false)}
                  className={`flex-1 py-3 px-6 rounded-xl border text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    hasExperience === false
                      ? "border-accent-500/40 bg-accent-500/10 text-accent-400"
                      : "border-white/5 bg-dark-900/40 text-slate-400 hover:text-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Safety Hazards Checklist */}
        <Card className="p-8 space-y-8">
          <h3 className="text-xl font-extrabold text-white pb-3 border-b border-white/5">
            <span className="text-gradient-shimmer">2. Safety Hazards Checklist</span>
          </h3>

          <ul className="space-y-6">
            {SAFETY_QUESTIONS.map((q, idx) => (
              <li key={q.id} className="rounded-card-lg border border-white/5 bg-dark-900/40 p-6 sm:p-8 transition-all duration-300 hover:border-white/10 space-y-4">
                <p className="font-extrabold text-white leading-relaxed text-base sm:text-lg">{q.text}</p>
                <div className="flex gap-4" role="group" aria-label={q.text}>
                  <ToggleButton
                    active={answers[q.id] === true}
                    onClick={() => toggle(q.id, true)}
                    tone="danger"
                  >
                    Yes
                  </ToggleButton>
                  <ToggleButton
                    active={answers[q.id] === false}
                    onClick={() => toggle(q.id, false)}
                    tone="safe"
                  >
                    No
                  </ToggleButton>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 flex justify-end">
            <Button onClick={submit} className="w-full sm:w-auto py-4 px-8 text-base">
              <ShieldCheckIcon className="h-6 w-6" />
              See my result
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "danger" | "safe";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeClasses =
    tone === "danger"
      ? "border-rose-500/35 bg-rose-500/10 text-rose-400 shadow-glow shadow-rose-500/5"
      : "border-emerald-500/35 bg-emerald-500/10 text-emerald-400 shadow-glow shadow-emerald-500/5";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-[7rem] sm:min-w-[8rem] rounded-xl border py-3 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 ${
        active 
          ? activeClasses 
          : "border-white/5 bg-dark-800/40 text-slate-400 hover:bg-dark-750 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function SafetyCheckerPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading check…" />}>
      <SafetyCheckerContent />
    </Suspense>
  );
}
