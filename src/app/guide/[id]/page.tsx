import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Clock, Gauge, ListChecks, OctagonX, Wrench } from "lucide-react";
import { Card } from "@/components/Card";
import { GuideNextSteps } from "@/components/GuideNextSteps";
import { GuideSteps } from "@/components/GuideSteps";
import { PageHeader } from "@/components/PageHeader";
import { SafetySign } from "@/components/SafetySign";
import { getGuide, getItemsForGuide, guides } from "@/lib/data";

/** Pre-render a page for every known guide. */
export function generateStaticParams() {
  return guides.map((g) => ({ id: g.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const guide = getGuide(id);
  if (!guide) return {};
  return {
    title: guide.title,
    description: `${guide.difficulty} repair guide · ${guide.time} · ${guide.steps.length} steps, with safety tips first.`,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = getGuide(id);
  if (!guide) notFound();

  const usedFor = getItemsForGuide(guide.id);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Repair guide" title={guide.title}>
        <ul className="flex flex-wrap gap-2 text-sm">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-concrete-300 bg-white px-3 py-1 font-semibold text-ink">
            <Clock className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {guide.time}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-concrete-300 bg-white px-3 py-1 font-semibold text-ink">
            <Gauge className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {guide.difficulty}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full border border-concrete-300 bg-white px-3 py-1 font-semibold text-ink">
            <ListChecks className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {guide.steps.length} steps
          </li>
        </ul>
        {usedFor.length > 0 && (
          <p className="no-print mt-3 text-sm text-ink-muted">
            Used for:{" "}
            {usedFor.map((item, index) => (
              <span key={item.id}>
                {index > 0 && ", "}
                <Link href={`/safety-checker?item=${item.id}`} className="link font-medium">
                  {item.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </PageHeader>

      {/* Safety tips first — always. */}
      <SafetySign level="yellow" title="Read before you start">
        <ul className="mt-3 space-y-2 text-ink">
          {guide.safetyTips.map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-caution ring-1 ring-caution-ink/40" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-soft">
          If anything feels unsafe or looks different from these steps, stop and{" "}
          <Link href="/resources" className="link">
            find local help
          </Link>
          .
        </p>
      </SafetySign>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
              <Wrench className="h-5 w-5 text-brand-600" aria-hidden="true" />
              What you&apos;ll need
            </h2>
            <ul className="mt-3 space-y-2">
              {guide.tools.map((tool) => (
                <li key={tool} className="flex gap-2.5 text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-ink-muted" aria-hidden="true" />
                  {tool}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <h2 className="mb-3 font-display text-2xl font-extrabold text-ink">Steps</h2>
          <GuideSteps guideId={guide.id} steps={guide.steps} />
        </Card>
      </div>

      {guide.stopIf && guide.stopIf.length > 0 && (
        <section className="mt-6 rounded-card border-2 border-danger/40 bg-danger-soft p-5 sm:p-6" aria-labelledby="stop-heading">
          <h2 id="stop-heading" className="flex items-center gap-2 font-display text-2xl font-extrabold text-danger-ink">
            <OctagonX className="h-6 w-6" aria-hidden="true" />
            Stop and get help if…
          </h2>
          <ul className="mt-3 space-y-1.5 text-ink">
            {guide.stopIf.map((reason) => (
              <li key={reason} className="flex gap-2.5">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-danger" aria-hidden="true" />
                {reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="done-heading">
        <h2 id="done-heading" className="no-print mb-4 font-display text-3xl font-extrabold text-ink">
          When you&apos;re done
        </h2>
        <Suspense fallback={null}>
          <GuideNextSteps items={usedFor} />
        </Suspense>
      </section>
    </div>
  );
}
