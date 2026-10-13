"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CallScript } from "@/components/CallScript";
import { countRedResult } from "@/components/CommunityImpact";
import { RecallCheck } from "@/components/RecallCheck";
import { Guide3D } from "@/components/Guide3D";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { itemFromParams, itemQuery } from "@/lib/data";
import { estimateSavings } from "@/lib/impact";
import { modelForItem } from "@/lib/models";
import { evaluateSafety, safetyHeading, safetySummary } from "@/lib/safety";

function SafetyResultContent() {
  const searchParams = useSearchParams();
  const item = itemFromParams(searchParams);
  const flagList = searchParams.get("flags") ?? "";
  // a red result for a listed item is counted (without anything about the person) for the community report
  useEffect(() => {
    if (!item || item.id === "custom") return;
    const answered = Object.fromEntries(flagList.split(",").filter(Boolean).map((id) => [id, true]));
    if (evaluateSafety(item, answered).level === "red") countRedResult(item.id);
  }, [item, flagList]);

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
  const custom = item.id === "custom";
  const carry = itemQuery(item);
  const helpLink = item.categoryId ? `/resources?category=${item.categoryId}` : "/resources";

  const look = {
    green: { fill: "bg-[#15803d]", icon: "check" as const, word: "SAFE" },
    yellow: { fill: "bg-[#b45309]", icon: "alert" as const, word: "CAREFUL" },
    red: { fill: "bg-[#b91c1c]", icon: "stop" as const, word: "STOP" },
  }[level];
  const savings = estimateSavings(item);

  return (
    <div className="mx-auto max-w-3xl">
      {/* The answer fills the screen in its colour: one word, readable from across the garage. */}
      <section
        className={`result-hero -mx-4 -mt-6 animate-pop px-6 pb-8 pt-10 text-center text-white sm:mx-0 sm:mt-0 sm:rounded-[1.75rem] sm:px-10 sm:pb-10 sm:pt-12 ${look.fill} ${
          level === "red" ? "hazard-stripes" : ""
        }`}
      >
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30">
          <Icon name={look.icon} size={44} />
        </span>
        <p className="mt-4 text-[3.5rem] font-black leading-none tracking-tight sm:text-7xl">{look.word}</p>
        <h1 className="mt-3 text-xl font-bold sm:text-2xl">{safetyHeading(level)}</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-white/80">{item.name}</p>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/95 sm:text-lg">
          {custom && canDIY
            ? "None of your answers point at a serious hazard. This item is not in our list, so there is no written guide for it. A repair cafe or shop can show you how."
            : safetySummary(level)}
        </p>

        {reasons.length > 0 && (
          <div className="mx-auto mt-5 max-w-xl rounded-card bg-black/20 p-4 text-left">
            <p className="font-bold">Why:</p>
            <ul className="mt-2 space-y-1.5 text-white/95">
              {reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="no-print mt-6 flex flex-wrap justify-center gap-2">
          {canDIY && item.guideId && (
            <Link
              href={`/guide/${item.guideId}?${carry}`}
              className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-card bg-white px-6 text-lg font-bold text-[#1f2937] shadow-lift transition hover:brightness-95 active:scale-[.98]"
            >
              Open the repair guide
              <Icon name="arrow" size={20} />
            </Link>
          )}
          {(!canDIY || !item.guideId) && (
            <Link
              href={helpLink}
              className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-card bg-white px-6 text-lg font-bold text-[#1f2937] shadow-lift transition hover:brightness-95 active:scale-[.98]"
            >
              <Icon name="pin" size={20} />
              Find local help
            </Link>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-card border-2 border-white/60 px-5 font-semibold text-white transition hover:bg-white/10"
          >
            <Icon name="printer" size={18} />
            Print for a repair cafe
          </button>
        </div>
      </section>

      {/* Green / yellow: offer a guide and next steps */}
      {canDIY && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {item.guideId ? (
            <Card>
              <h3 className="text-lg font-semibold text-workshop-900">Step-by-step guide</h3>
              <p className="mt-1 text-sm text-workshop-800">
                Step-by-step instructions with safety tips for this repair.
              </p>
              <Button href={`/guide/${item.guideId}?${carry}`} className="mt-4">
                Open repair guide
              </Button>
            </Card>
          ) : (
            <Card>
              <h3 className="text-lg font-semibold text-workshop-900">No guide for this yet</h3>
              <p className="mt-1 text-sm text-workshop-800">
                We don&apos;t have a written guide for this yet. A local resource can help.
              </p>
              <Button href={helpLink} className="mt-4">
                Find local help
              </Button>
            </Card>
          )}

          <Card className={custom ? "hidden" : ""}>
            <h3 className="text-lg font-semibold text-workshop-900">Fix or replace?</h3>
            <p className="mt-1 text-sm text-workshop-800">
              {savings > 0
                ? `Fixing this could save about $${savings} compared with buying new.`
                : "Compare the cost of repairing versus buying new."}
            </p>
            <Button href={`/calculator?item=${item.id}`} variant="secondary" className="mt-4">
              Compare costs
            </Button>
          </Card>
        </div>
      )}

      {!canDIY && modelForItem(item) && (
        <section className="plate mt-6 rounded-card border-2 border-workshop-200 bg-surface p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-semibold text-workshop-900">Leave it closed</h2>
          <p className="mt-1 text-sm text-workshop-800">
            Do not open or take apart the {item.name.toLowerCase()}. A professional has the tools and
            training for what is inside.
          </p>
          <Guide3D guideId="" file={modelForItem(item)!.file} step={0} className="mt-4" />
        </section>
      )}

      <RecallCheck />

      {!canDIY && <CallScript itemName={item.name} issue={item.id === "custom" ? "" : item.commonIssue} flags={flags} />}

      {/* Red: professional help + safe documentation. NEVER a DIY guide. */}
      {!canDIY && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="border-danger/30">
            <h3 className="text-lg font-semibold text-workshop-900">Find a professional</h3>
            <p className="mt-1 text-sm text-workshop-800">
              This repair should be handled by someone trained for it. Here are local options.
            </p>
            <Button href={helpLink} variant="danger" className="mt-4">
              Find local pros
            </Button>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-workshop-900">Write it down first</h3>
            <p className="mt-1 text-sm text-workshop-800">
              Before you call, note these so the pro can help faster:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-workshop-800">
              <li>What the item is (brand and model if you can find it)</li>
              <li>What is happening (sounds, smells, when it started)</li>
              <li>A photo from a safe distance — don&apos;t take it apart</li>
            </ul>
            <Button href={`/log?${carry}&outcome=referred-to-pro`} variant="secondary" className="mt-4">
              Save to repair log
            </Button>
          </Card>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/safety-checker?${carry}`} className="text-sm font-semibold text-brand-700 underline">
          Redo the safety check
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
