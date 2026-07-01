"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { getItem } from "@/lib/data";
import { evaluateSafety, safetyHeading, safetySummary } from "@/lib/safety";

function SafetyResultContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");
  const item = itemId ? getItem(itemId) : undefined;

  if (!item) {
    return (
      <div>
        <PageHeader title="Safety result" intro="We couldn't find that item." />
        <Button href="/choose-item">Choose an item</Button>
      </div>
    );
  }

  // Rebuild the answers map from the flags query param.
  const flags = (searchParams.get("flags") ?? "").split(",").filter(Boolean);
  const answers = Object.fromEntries(flags.map((id) => [id, true]));

  const { level, reasons } = evaluateSafety(item, answers);
  const canDIY = level !== "red";

  return (
    <div>
      <PageHeader title="Your safety result" />

      <Card className={level === "red" ? "border-danger/40" : level === "yellow" ? "border-caution/40" : "border-safe/40"}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-workshop-800">{item.name}</p>
            <h2 className="text-2xl font-bold text-workshop-900">{safetyHeading(level)}</h2>
          </div>
          <SafetyBadge level={level} />
        </div>
        <p className="mt-4 text-lg text-workshop-800">{safetySummary(level)}</p>

        {reasons.length > 0 && (
          <div className="mt-4 rounded-card bg-workshop-100 p-4">
            <p className="font-semibold text-workshop-900">Why we said this:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-workshop-800">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Green / yellow: offer a guide and next steps */}
      {canDIY && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {item.guideId ? (
            <Card>
              <h3 className="text-lg font-semibold text-workshop-900">📘 Beginner-safe guide</h3>
              <p className="mt-1 text-sm text-workshop-800">
                Step-by-step instructions with safety tips for this repair.
              </p>
              <Button href={`/guide/${item.guideId}`} className="mt-4">
                Open repair guide
              </Button>
            </Card>
          ) : (
            <Card>
              <h3 className="text-lg font-semibold text-workshop-900">📘 Guide coming soon</h3>
              <p className="mt-1 text-sm text-workshop-800">
                We don&apos;t have a written guide for this yet. A local resource can help.
              </p>
              <Button href="/resources" variant="secondary" className="mt-4">
                Find local help
              </Button>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-workshop-900">💵 Fix or replace?</h3>
            <p className="mt-1 text-sm text-workshop-800">
              Compare the cost of repairing versus buying new.
            </p>
            <Button href={`/calculator?item=${item.id}`} variant="secondary" className="mt-4">
              Compare costs
            </Button>
          </Card>
        </div>
      )}

      {/* Red: professional help + safe documentation. NEVER a DIY guide. */}
      {!canDIY && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-danger/30">
            <h3 className="text-lg font-semibold text-workshop-900">🧰 Find a professional</h3>
            <p className="mt-1 text-sm text-workshop-800">
              This repair should be handled by someone trained for it. Here are local options.
            </p>
            <Button href={`/resources?category=${item.categoryId}`} className="mt-4">
              Find local pros
            </Button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-workshop-900">📝 Document it safely</h3>
            <p className="mt-1 text-sm text-workshop-800">
              Before you call, note these so the pro can help faster:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-workshop-800">
              <li>What the item is (brand and model if you can find it)</li>
              <li>What is happening (sounds, smells, when it started)</li>
              <li>A photo from a safe distance — don&apos;t take it apart</li>
            </ul>
            <Button href="/log" variant="secondary" className="mt-4">
              Save to repair log
            </Button>
          </Card>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/safety-checker?item=${item.id}`} className="text-sm font-semibold text-brand-700 underline">
          ← Redo safety check
        </Link>
        <Link href="/choose-item" className="text-sm font-semibold text-brand-700 underline">
          Choose a different item
        </Link>
      </div>
    </div>
  );
}

export default function SafetyResultPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <SafetyResultContent />
    </Suspense>
  );
}
