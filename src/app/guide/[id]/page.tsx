import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
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
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-workshop-100 px-3 py-1 font-medium text-workshop-900">
            ⏱ {guide.time}
          </span>
          <span className="rounded-full bg-workshop-100 px-3 py-1 font-medium text-workshop-900">
            🧠 {guide.difficulty}
          </span>
        </div>
      </PageHeader>

      {/* Safety tips first — always. */}
      <Card className="border-caution/40 bg-caution/5">
        <h2 className="text-lg font-semibold text-workshop-900">⚠️ Read before you start</h2>
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,2fr]">
        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">🧰 What you&apos;ll need</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-workshop-800">
            {guide.tools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">Steps</h2>
          <ol className="mt-3 space-y-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-workshop-900">{step.title}</p>
                  <p className="text-workshop-800">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/log">✅ I did it — log this repair</Button>
        <Button href="/calculator" variant="secondary">
          Compare fix vs. replace
        </Button>
      </div>
    </div>
  );
}
