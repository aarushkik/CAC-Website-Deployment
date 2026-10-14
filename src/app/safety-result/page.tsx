"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  CircleCheck,
  ClipboardList,
  Lightbulb,
  MapPinned,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EmergencyNotice, type EmergencyKind } from "@/components/EmergencyNotice";
import { PageHeader } from "@/components/PageHeader";
import { ProblemReport } from "@/components/ProblemReport";
import { ResourceCard } from "@/components/ResourceCard";
import { SafetySign } from "@/components/SafetySign";
import { getCategory, getGuide, getItem, getResourcesForCategory } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { nearbySearchHref } from "@/lib/links";
import { answersFromParams, answersToParams, evaluateSafety, safetyHeading, safetySummary } from "@/lib/safety";
import type { Item, Resource, SafetyLevel, SafetyReason } from "@/lib/types";

/** The first precaution for a caution-level repair, by category. */
const firstPrecaution: Record<string, string> = {
  clothing: "Work in good light, and keep scissors and needles pointed away from you.",
  "small-appliances": "Unplug it and let it cool before you touch anything.",
  furniture: "Get a helper for anything heavy, and empty drawers and shelves first.",
  bikes: "Work somewhere flat with the bike on a stand or held steady, and keep fingers clear of the chain.",
  electronics: "Turn it off and unplug it — and take out removable batteries.",
  home: "Shut off the water or power to the fixture before you start.",
};

const reasonDot: Record<SafetyLevel, string> = {
  green: "bg-safe",
  yellow: "bg-caution ring-1 ring-caution-ink/40",
  red: "bg-danger",
};

/** Licensed pros first, then official info, then community events. */
function rankForRed(list: Resource[]): Resource[] {
  const order = { pro: 0, info: 1, community: 2 } as const;
  return [...list].sort((a, b) => order[a.kind] - order[b.kind]);
}

function SafetyResultContent() {
  const searchParams = useSearchParams();
  const item = getItem(searchParams.get("item"));

  if (!item) {
    return (
      <div>
        <PageHeader eyebrow="Safety result" title="Which item?" intro="We couldn't find that item." />
        <Button href="/choose-item">Choose an item</Button>
      </div>
    );
  }

  const answers = answersFromParams(searchParams);
  const { level, reasons } = evaluateSafety(item, answers);
  const category = getCategory(item.categoryId);
  const canDIY = level !== "red";

  const flagged = (id: string) => answers[id] === "yes" || answers[id] === "unsure";
  const emergencies: EmergencyKind[] = [];
  if (flagged("gas") || item.id === "gas-stove") emergencies.push("gas");
  if (flagged("burning") || item.id === "sparking-outlet") emergencies.push("fire");
  if (flagged("battery-swelling") || item.id === "phone-battery") emergencies.push("battery");

  const changeAnswersHref = `/safety-checker?${answersToParams(answers, new URLSearchParams({ item: item.id })).toString()}`;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow mb-4">
        Safety result{category ? ` · ${category.name}` : ""}
      </p>

      <EmergencyNotice kinds={emergencies} />

      <div className="no-print">
        <SafetySign level={level} eyebrow={item.name} title={safetyHeading(level)} animate>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{safetySummary(level)}</p>
          {reasons.length > 0 && <ReasonList reasons={reasons} />}
        </SafetySign>
      </div>

      {canDIY ? <DiyNextSteps item={item} level={level} /> : <ProNextSteps item={item} reasons={reasons} />}

      <div className="no-print mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-concrete-200 pt-6 text-sm">
        <Link href={changeAnswersHref} className="link inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Change my answers
        </Link>
        <Link href="/choose-item" className="link">
          Check a different item
        </Link>
      </div>
    </div>
  );
}

function ReasonList({ reasons }: { reasons: SafetyReason[] }) {
  return (
    <div className="mt-5 border-t border-concrete-200 pt-4">
      <p className="font-semibold text-ink">Why we said this</p>
      <ul className="mt-2 space-y-2">
        {reasons.map((reason, index) => (
          <li key={`${reason.questionId ?? "item"}-${index}`} className="flex gap-2.5 text-ink-soft">
            <span className={`mt-2 h-2 w-2 flex-none rounded-full ${reasonDot[reason.level]}`} aria-hidden="true" />
            <span>
              {reason.source === "unsure" && <strong className="font-semibold text-ink">You weren&apos;t sure. </strong>}
              {reason.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiyNextSteps({ item, level }: { item: Item; level: SafetyLevel }) {
  const guide = getGuide(item.guideId);
  const hasCosts = item.estimatedRepairCost !== undefined && item.estimatedReplacementCost !== undefined;

  return (
    <div className="no-print mt-8">
      <h2 className="font-display text-3xl font-extrabold text-ink">Your next steps</h2>

      {level === "yellow" && (
        <div className="mt-4 rounded-card border border-caution/70 bg-caution-soft p-5 text-ink">
          <p className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-5 w-5 text-caution-ink" aria-hidden="true" />
            Before you start
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-ink-soft">
            <li>{firstPrecaution[item.categoryId] ?? "Make the item safe to handle: unplugged, cooled down, and switched off."}</li>
            <li>Take photos as you go so you can put it back together.</li>
            <li>Work slowly, and stop if anything looks different from the guide.</li>
          </ul>
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {guide ? (
          <Card className="md:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-700">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Step-by-step guide
                </p>
                <h3 className="mt-1 text-xl font-semibold text-ink">{guide.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {guide.time} · {guide.difficulty} · {guide.steps.length} steps · {guide.tools.length} tools
                </p>
              </div>
              <Button href={`/guide/${guide.id}?item=${item.id}`} size="lg">
                Open the guide
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-muted">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              No written guide yet
            </p>
            <p className="mt-2 text-ink-soft">
              We don&apos;t have a guide for this exact repair. A free repair event or a local shop can
              help — and you&apos;ll learn how it&apos;s done.
            </p>
            <Button href={`/resources?category=${item.categoryId}`} variant="secondary" className="mt-4">
              Find local help
            </Button>
          </Card>
        )}

        <Card>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-muted">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Fix or replace?
          </p>
          {hasCosts ? (
            <p className="mt-2 text-ink-soft">
              A DIY repair runs about{" "}
              <strong className="text-ink">{formatMoney(item.estimatedRepairCost ?? 0)}</strong> vs. about{" "}
              <strong className="text-ink">{formatMoney(item.estimatedReplacementCost ?? 0)}</strong> to replace it.
            </p>
          ) : (
            <p className="mt-2 text-ink-soft">Compare what a repair costs with buying new.</p>
          )}
          <Button href={`/calculator?item=${item.id}`} variant="secondary" className="mt-4">
            Compare costs
          </Button>
        </Card>

        <Card>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-muted">
            <CircleCheck className="h-4 w-4" aria-hidden="true" />
            Fixed it?
          </p>
          <p className="mt-2 text-ink-soft">Log the repair to track the money and waste you saved.</p>
          <Button href={`/log?item=${item.id}&outcome=fixed`} variant="secondary" className="mt-4">
            Log this repair
          </Button>
        </Card>
      </div>
    </div>
  );
}

function ProNextSteps({ item, reasons }: { item: Item; reasons: SafetyReason[] }) {
  const ranked = rankForRed(getResourcesForCategory(item.categoryId));
  const shown = ranked.filter((r) => r.kind !== "community").slice(0, 4);
  const proSearch = item.proSearch ?? getCategory(item.categoryId)?.proSearch;

  return (
    <div className="mt-8">
      <div className="no-print">
        <h2 className="font-display text-3xl font-extrabold text-ink">Get the right help</h2>
        <p className="mt-1 text-ink-soft">
          {item.replaceOnly
            ? "This should be replaced, not repaired. Check for a recall first — recalled gear is often replaced for free."
            : shown.some((r) => r.kind === "pro")
              ? "These shops can take repairs like this one. Free repair events usually can't take hazardous items."
              : `We don't list a shop for this kind of repair yet, so search the map for a ${proSearch ?? "repair shop"} near you. Free repair events usually can't take hazardous items.`}
        </p>

        {shown.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {shown.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={`/resources?category=${item.categoryId}&level=red`} variant="secondary">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            See all local help, nearest first
          </Button>
          {proSearch && (
            <Button href={nearbySearchHref(proSearch)} external variant="ghost">
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              Search maps for “{proSearch}” near me
            </Button>
          )}
        </div>

        <div className="mt-6 flex gap-3 rounded-card border border-concrete-200 bg-concrete-50 p-4 text-sm text-ink-soft">
          <ClipboardList className="mt-0.5 h-5 w-5 flex-none text-ink-muted" aria-hidden="true" />
          <p>
            <strong className="text-ink">Still under warranty?</strong> Contact the manufacturer first —
            opening it yourself can void the warranty. It&apos;s also worth a quick{" "}
            <a href="https://www.cpsc.gov/Recalls" target="_blank" rel="noopener noreferrer" className="link">
              recall search
            </a>
            : recalled products are often fixed or replaced for free.
          </p>
        </div>
      </div>

      {!item.replaceOnly && (
        <div className="mt-8">
          <ProblemReport item={item} level="red" reasons={reasons} />
        </div>
      )}
    </div>
  );
}

export default function SafetyResultPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <SafetyResultContent />
    </Suspense>
  );
}
