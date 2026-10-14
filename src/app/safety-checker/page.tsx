"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CircleAlert, OctagonAlert } from "lucide-react";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { getCategory, getItem } from "@/lib/data";
import { answersFromParams, answersToParams, questionsForItem } from "@/lib/safety";
import type { SafetyAnswer } from "@/lib/types";

const CHOICES: { value: SafetyAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

function SafetyCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const item = getItem(searchParams.get("item"));
  const questions = item ? questionsForItem(item) : [];

  // Start from answers in the URL, so "Change answers" keeps what you picked.
  const [answers, setAnswers] = useState<Record<string, SafetyAnswer>>(() => {
    const fromUrl = answersFromParams(searchParams);
    return Object.fromEntries(
      questions.filter((q) => fromUrl[q.id]).map((q) => [q.id, fromUrl[q.id]]),
    );
  });
  const [showMissing, setShowMissing] = useState(false);
  const fieldsets = useRef<Record<string, HTMLFieldSetElement | null>>({});

  if (!item) {
    return (
      <div>
        <PageHeader
          eyebrow="Safety check"
          title="Which item?"
          intro="We couldn't find that item. Choose one to run a safety check."
        />
        <Button href="/choose-item">Choose an item</Button>
      </div>
    );
  }

  const category = getCategory(item.categoryId);
  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const missing = questions.filter((q) => !answers[q.id]);

  function resultHref(): string {
    const params = new URLSearchParams({ item: item!.id });
    answersToParams(answers, params);
    return `/safety-result?${params.toString()}`;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (missing.length > 0) {
      setShowMissing(true);
      const first = fieldsets.current[missing[0].id];
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
      return;
    }
    router.push(resultHref());
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow={`Safety check · ${category?.name ?? "Repair"}`}
        title={item.name}
        intro={item.commonIssue}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <SafetyBadge level={item.baseSafety} typical />
          <span>before your answers</span>
        </div>
      </PageHeader>

      {item.dangerous && (
        <div className="mb-6 flex gap-3 rounded-card border-2 border-danger bg-danger-soft p-4 text-danger-ink">
          <OctagonAlert className="mt-0.5 h-6 w-6 flex-none" aria-hidden="true" />
          <div>
            <p className="font-bold">This repair is on our do-not-DIY list.</p>
            <p className="mt-1 text-sm">
              You&apos;ll be pointed to a professional no matter what you answer. The questions still
              help you describe the problem when you call.
            </p>
            <Link href={resultHref()} className="mt-2 inline-flex items-center gap-1 text-sm font-bold underline">
              Skip to professional help
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <div className="sticky top-16 z-10 -mx-4 mb-4 border-b border-concrete-200 bg-concrete-100/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:bg-white/95">
          <div className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>
              {answeredCount} of {questions.length} answered
            </span>
            <span className="text-ink-muted">“Not sure” counts as yes</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-concrete-200"
            role="progressbar"
            aria-label="Questions answered"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
              style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }}
            />
          </div>
        </div>

        <ol className="space-y-4">
          {questions.map((question, index) => {
            const isMissing = showMissing && !answers[question.id];
            return (
              <li key={question.id}>
                <fieldset
                  ref={(element) => {
                    fieldsets.current[question.id] = element;
                  }}
                  aria-describedby={isMissing ? `${question.id}-missing` : undefined}
                  className={`scroll-mt-40 rounded-card border bg-white p-5 shadow-card ${
                    isMissing ? "border-danger ring-2 ring-danger-soft" : "border-concrete-200"
                  }`}
                >
                  <legend className="sr-only">{question.text}</legend>
                  <div className="flex gap-3">
                    <span className="font-display text-2xl font-extrabold leading-none text-concrete-400 tabular" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-ink" aria-hidden="true">
                        {question.text}
                      </p>
                      {question.hint && <p className="mt-1 text-sm text-ink-muted">{question.hint}</p>}
                      <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-sm">
                        {CHOICES.map((choice) => {
                          const checked = answers[question.id] === choice.value;
                          return (
                            <label
                              key={choice.value}
                              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500 ${
                                checked
                                  ? "border-ink bg-ink text-white"
                                  : "border-concrete-300 bg-white text-ink-soft hover:border-concrete-400 hover:bg-concrete-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={choice.value}
                                checked={checked}
                                onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: choice.value }))}
                                className="sr-only"
                              />
                              {choice.label}
                            </label>
                          );
                        })}
                      </div>
                      {isMissing && (
                        <p id={`${question.id}-missing`} className="mt-2 flex items-center gap-1 text-sm font-semibold text-danger-ink">
                          <CircleAlert className="h-4 w-4" aria-hidden="true" />
                          Pick an answer for this one.
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg">
            See my result
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
          {showMissing && missing.length > 0 && (
            <p className="text-sm font-semibold text-danger-ink" role="alert">
              {missing.length === 1 ? "1 question needs" : `${missing.length} questions need`} an answer.
            </p>
          )}
        </div>
      </form>

      <p className="mt-8 text-sm text-ink-muted">
        Not the right item?{" "}
        <Link href="/choose-item" className="link">
          Choose a different one
        </Link>
        .
      </p>
    </div>
  );
}

export default function SafetyCheckerPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <SafetyCheckerContent />
    </Suspense>
  );
}
