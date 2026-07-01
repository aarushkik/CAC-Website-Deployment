"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { getItem } from "@/lib/data";
import { SAFETY_QUESTIONS } from "@/lib/safety";

function SafetyCheckerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemId = searchParams.get("item");
  const item = itemId ? getItem(itemId) : undefined;

  // Track only the questions answered "yes"; unanswered defaults to no/safe.
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

  function toggle(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function submit() {
    const flags = Object.entries(answers)
      .filter(([, yes]) => yes)
      .map(([id]) => id)
      .join(",");
    const params = new URLSearchParams({ item: item!.id });
    if (flags) params.set("flags", flags);
    router.push(`/safety-result?${params.toString()}`);
  }

  return (
    <div>
      <PageHeader title="Quick safety check" intro="Answer these to get a safe repair recommendation.">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-workshop-900">{item.name}</span>
          <SafetyBadge level={item.baseSafety} />
        </div>
      </PageHeader>

      <Card>
        <p className="mb-4 text-workshop-800">
          Answer honestly. If you&apos;re not sure, choose <strong>Yes</strong> — we&apos;ll err on the
          side of caution.
        </p>
        <ul className="space-y-4">
          {SAFETY_QUESTIONS.map((q) => (
            <li key={q.id} className="rounded-card border border-workshop-200 p-4">
              <p className="font-medium text-workshop-900">{q.text}</p>
              <div className="mt-3 flex gap-2" role="group" aria-label={q.text}>
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

        <div className="mt-6">
          <Button onClick={submit}>See my result</Button>
        </div>
      </Card>
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
    tone === "danger" ? "border-danger bg-danger text-white" : "border-safe bg-safe text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-[5rem] rounded-lg border px-5 py-2 font-semibold transition-colors ${
        active ? activeClasses : "border-workshop-200 bg-white text-workshop-800 hover:bg-workshop-100"
      }`}
    >
      {children}
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
