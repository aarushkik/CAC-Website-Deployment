import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { GuideChecklist, KeepAwakeButton, PrintButton } from "@/components/GuideChecklist";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { ToolChecklist } from "@/components/ToolChecklist";
import { getGuide, guides } from "@/lib/data";

/** Pre-render a page for every known guide. */
export function generateStaticParams() {
  return guides.map((g) => ({ id: g.id }));
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = getGuide(id);
  if (!guide) notFound();

  return (
    <div>
      <PageHeader title={guide.title}>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="chip bg-workshop-100 text-workshop-900">
            <Icon name="clock" size={15} />
            {guide.time}
          </span>
          <span className="chip bg-workshop-100 text-workshop-900">
            <Icon name="star" size={15} />
            {guide.difficulty}
          </span>
          <span className="chip bg-workshop-100 text-workshop-900">{guide.steps.length} steps</span>
        </div>
      </PageHeader>

      {/* Safety tips first — always. */}
      <Card className="border-caution/40 bg-caution/5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-workshop-900">
          <Icon name="alert" className="text-caution" />
          Read before you start
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-workshop-800">
          {guide.safetyTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-workshop-800">
          If anything feels unsafe or looks different from these steps, stop and{" "}
          <Link href="/resources" className="font-semibold text-brand-700 underline">
            find local help
          </Link>
          .
        </p>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr,2fr] lg:items-start">
        <Card className="lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold text-workshop-900">What you&apos;ll need</h2>
          <ToolChecklist tools={guide.tools} />
          <p className="mt-4 border-t border-workshop-200 pt-3 text-sm text-workshop-800">
            Missing a tool? A{" "}
            <Link href="/resources" className="font-semibold text-brand-700 underline">
              tool library or repair cafe
            </Link>{" "}
            can lend one.
          </p>
        </Card>

        {/* The checklist reads the item from the address, so it waits for the browser. */}
        <Suspense fallback={<Card>Loading the steps…</Card>}>
          <GuideChecklist guide={guide} />
        </Suspense>
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <KeepAwakeButton />
        <PrintButton />
        <Button href="/guides" variant="ghost">
          All guides
        </Button>
        <Button href="/calculator" variant="ghost">
          Compare fix vs. replace
        </Button>
      </div>
    </div>
  );
}
