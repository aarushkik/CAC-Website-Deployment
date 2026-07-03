import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { getGuide, guides } from "@/lib/data";
import {
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  ListBulletIcon,
  CalculatorIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

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
    <div className="space-y-12 animate-fade-in">
      <PageHeader title={guide.title}>
        <div className="flex flex-wrap gap-2.5 text-xs font-bold uppercase tracking-wider mt-4">
          <span className="flex items-center gap-1.5 rounded-full border border-white/5 bg-dark-800/60 px-3.5 py-1.5 text-slate-300">
            <ClockIcon className="h-4 w-4 text-accent-400" />
            {guide.time}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/5 bg-dark-800/60 px-3.5 py-1.5 text-slate-300">
            <AcademicCapIcon className="h-4 w-4 text-accent-400" />
            {guide.difficulty}
          </span>
        </div>
      </PageHeader>

      {/* Safety tips first — Warning panel (Caution themed yellow-orange border and bg) */}
      <div className="rounded-2xl border border-caution/20 bg-caution/5 p-6 shadow-glow shadow-caution/5 animate-scale-in">
        <div className="flex items-center gap-2 mb-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-caution" />
          <h2 className="text-lg font-bold text-white">Read before you start</h2>
        </div>
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-300 leading-relaxed">
          {guide.safetyTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          If anything feels unsafe or looks different from these steps, stop and{" "}
          <Link href="/resources" className="font-bold text-accent-400 underline hover:text-accent-300">
            find professional help
          </Link>
          .
        </p>
      </div>

      {/* Grid: Tools (Small sidebar cards) vs Steps (Large open layout) */}
      <div className="grid gap-8 lg:grid-cols-[1fr,2fr] animate-slide-up delay-100">
        
        {/* Tools Section: compact individual boxes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <BriefcaseIcon className="h-5 w-5 text-accent-400" />
            <h2 className="text-lg font-extrabold text-white">What you&apos;ll need</h2>
          </div>
          <ul className="space-y-2.5 text-sm">
            {guide.tools.map((tool, i) => {
              const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(tool)}`;
              return (
                <li key={i} className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-white/5 bg-dark-900/60 shadow-sm">
                  <span className="font-bold text-slate-200">{tool}</span>
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-400 hover:text-accent-300 border border-accent-500/20 hover:border-accent-500/40 rounded-lg px-2.5 py-1.5 bg-accent-500/5 transition-all duration-300 shrink-0"
                    title={`Search for "${tool}" on Amazon`}
                  >
                    <ShoppingBagIcon className="h-3.5 w-3.5" />
                    Shop
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Steps Section: Open layout with divider lines (no card box border) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <ListBulletIcon className="h-5 w-5 text-accent-400" />
            <h2 className="text-lg font-extrabold text-white">Step-by-Step Guide</h2>
          </div>
          <ol className="divide-y divide-white/5 border border-white/5 bg-dark-900/20 rounded-2xl overflow-hidden">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-5 p-6 hover:bg-white/5 transition-colors group">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent-500/10 border border-accent-500/20 font-black text-accent-400 text-sm group-hover:bg-gradient-to-r group-hover:from-accent-500 group-hover:to-orange-600 group-hover:text-white transition-all duration-300">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-white text-base group-hover:text-accent-400 transition-colors">{step.title}</p>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Completion Section — Highly styled card (amber glow, gradient background, rounded corners) */}
      <div className="relative overflow-hidden rounded-3xl border border-accent-500/30 bg-gradient-to-br from-accent-950/20 via-dark-900/50 to-transparent p-10 text-center shadow-glow-md animate-slide-up delay-200">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Ready to wrap up?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Awesome job getting this far! Once you complete the repair, make sure to log it in your private dashboard so we can track the landfill waste and money you saved!
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button href="/log" className="w-full sm:w-auto px-8 py-3.5 shadow-glow-md">
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              I did it — log this repair
            </Button>
            <Button href="/calculator" variant="secondary" className="w-full sm:w-auto px-8 py-3.5">
              <CalculatorIcon className="h-5 w-5 text-accent-400" />
              Compare fix vs. replace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
