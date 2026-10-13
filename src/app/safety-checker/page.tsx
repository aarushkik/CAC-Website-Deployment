"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { itemFromParams, itemQuery } from "@/lib/data";
import { SAFETY_QUESTIONS } from "@/lib/safety";

/**
 * The safety check, one question per screen. Every question has to be answered
 * before there is a result, and "Not sure" counts the same as "Yes", so the
 * result can only come out more careful than the truth, never less.
 */
function SafetyCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const item = itemFromParams(searchParams);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  if (!item) {
    return (
      <div>
        <PageHeader
          title="Safety check"
          intro="We couldn't find that item. Choose one to run a safety check."
        />
        <Button href="/choose-item">Choose an item</Button>
      </div>
    );
  }

  const total = SAFETY_QUESTIONS.length;
  const question = SAFETY_QUESTIONS[step];

  function answer(flagged: boolean) {
    const next = { ...answers, [question.id]: flagged };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
      return;
    }
    const flags = Object.entries(next)
      .filter(([, yes]) => yes)
      .map(([id]) => id)
      .join(",");
    router.push(`/safety-result?${itemQuery(item!)}${flags ? `&flags=${flags}` : ""}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (step === 0 ? router.back() : setStep(step - 1))}
          className="flex min-h-[2.75rem] items-center gap-1.5 rounded-lg pr-3 text-sm font-semibold text-brand-700 hover:underline"
        >
          <Icon name="back" size={18} />
          {step === 0 ? "Back" : "Previous question"}
        </button>
        <p className="text-sm font-semibold text-workshop-800" aria-live="polite">
          Question {step + 1} of {total}
        </p>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-workshop-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label="Safety check progress"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>

      <p className="mt-6 text-sm text-workshop-800">
        Safety check for <strong className="text-workshop-900">{item.name}</strong>
      </p>

      <div key={question.id} className="mt-2 animate-rise rounded-[1.25rem] border border-workshop-200 bg-surface p-6 shadow-lift sm:p-8">
        <h1 className="text-2xl font-bold leading-snug text-workshop-900 sm:text-[1.75rem]">
          {question.text}
        </h1>

        <div className="mt-7 grid gap-3">
          <AnswerButton
            tone="no"
            chosen={answers[question.id] === false}
            onClick={() => answer(false)}
            title="No"
          />
          <AnswerButton
            tone="yes"
            chosen={answers[question.id] === true}
            onClick={() => answer(true)}
            title="Yes"
          />
          <button
            type="button"
            onClick={() => answer(true)}
            className="min-h-[3rem] rounded-card text-sm font-semibold text-workshop-800 underline decoration-workshop-300 underline-offset-4 hover:text-workshop-900"
          >
            I&apos;m not sure (we&apos;ll treat that as a yes)
          </button>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-workshop-800">
        Answer honestly. The result can only get more careful, never less.
      </p>
    </div>
  );
}

function AnswerButton({
  tone,
  chosen,
  title,
  onClick,
}: {
  tone: "yes" | "no";
  chosen: boolean;
  title: string;
  onClick: () => void;
}) {
  const colours =
    tone === "yes"
      ? "hover:border-danger hover:bg-danger/5" + (chosen ? " border-danger bg-danger/10" : "")
      : "hover:border-safe hover:bg-safe/5" + (chosen ? " border-safe bg-safe/10" : "");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={chosen}
      className={`flex min-h-[3.75rem] items-center justify-between rounded-card border-2 border-workshop-200 bg-surface px-5 text-left text-lg font-bold text-workshop-900 transition active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${colours}`}
    >
      {title}
      <span className={tone === "yes" ? "text-danger" : "text-safe"}>
        <Icon name={tone === "yes" ? "alert" : "check"} size={22} />
      </span>
    </button>
  );
}

export default function SafetyCheckerPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <SafetyCheckerContent />
    </Suspense>
  );
}
