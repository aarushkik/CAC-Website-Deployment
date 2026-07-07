"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getItem } from "@/lib/data";
import { evaluateSafety, safetyHeading, safetySummary } from "@/lib/safety";
import {
  BookOpenIcon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

function SafetyResultContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");
  const item = itemId ? getItem(itemId) : undefined;
  
  const [city, setCity] = useState("me");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("repairbuddy_location");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.city) setCity(parsed.city);
      }
    } catch { /* noop */ }
  }, []);

  if (!item) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto py-12 animate-fade-in">
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

  const cardBorderClasses = {
    red: "border-rose-500/20 bg-rose-500/5 shadow-rose-500/5",
    yellow: "border-caution/20 bg-caution/5 shadow-caution/5",
    green: "border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5",
  };

  const textGradientClasses = {
    red: "text-rose-400",
    yellow: "text-amber-400",
    green: "text-emerald-400",
  };

  // Build real professional search URLs
  const searchLoc = city || "me";
  const googleProUrl = `https://www.google.com/search?q=${encodeURIComponent(`${item.name} repair professional near ${searchLoc}`)}`;
  const yelpProUrl = `https://www.yelp.com/search?find_desc=${encodeURIComponent(`${item.name} repair`)}&find_loc=${encodeURIComponent(searchLoc)}`;
  const linkedinProUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${item.name} repair professional`)}`;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Safety assessment" />

      <Card className={`border shadow-glow ${cardBorderClasses[level]} animate-scale-in delay-100`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{item.name}</p>
            <h2 className={`text-2xl font-extrabold tracking-tight ${textGradientClasses[level]}`}>
              {safetyHeading(level)}
            </h2>
          </div>
          <div className="self-start sm:self-auto">
            <SafetyBadge level={level} />
          </div>
        </div>
        <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">{safetySummary(level)}</p>

        {reasons.length > 0 && (
          <div className="mt-5 rounded-xl border border-white/5 bg-dark-900/60 p-4">
            <p className="font-bold text-white flex items-center gap-2 mb-2 text-sm">
              <ExclamationTriangleIcon className="h-4.5 w-4.5 text-accent-400" />
              Safety Flag Reasons:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-400 leading-relaxed">
              {reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Green / yellow: offer a guide and next steps */}
      {canDIY && (
        <div className="grid gap-6 sm:grid-cols-2 animate-slide-up delay-200">
          {item.guideId ? (
            <Card className="flex flex-col h-full justify-between">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                  <BookOpenIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Beginner-safe guide</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Step-by-step instructions with custom safety tips for this repair.
                </p>
              </div>
              <Button href={`/guide/${item.guideId}`} className="mt-6 w-full">
                Open repair guide
              </Button>
            </Card>
          ) : (
            <Card className="flex flex-col h-full justify-between">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                  <BookOpenIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Guide coming soon</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  We don&apos;t have a written guide for this yet. Check local resources for guidance.
                </p>
              </div>
              <Button href="/resources" variant="secondary" className="mt-6 w-full">
                Find local help
              </Button>
            </Card>
          )}

          <Card className="flex flex-col h-full justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                <CalculatorIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Fix or replace?</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Compare the cost of repairing versus buying a new replacement.
              </p>
            </div>
            <Button href={`/calculator?item=${item.id}`} variant="secondary" className="mt-6 w-full">
              Compare costs
            </Button>
          </Card>
        </div>
      )}

      {/* Red: professional help + search links. NEVER a DIY guide. */}
      {!canDIY && (
        <div className="grid gap-6 sm:grid-cols-2 animate-slide-up delay-200">
          <Card className="border-rose-500/10 bg-dark-800/20 flex flex-col h-full justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <WrenchScrewdriverIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Find a professional</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                This repair is safety-critical and requires a certified specialist. Choose a directory below to find vetted pros:
              </p>

              <div className="mt-4 space-y-2.5">
                <a
                  href={googleProUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/5 hover:border-accent-500/30 text-sm font-bold text-slate-300 hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">🔍 Search on Google Maps</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400" />
                </a>

                <a
                  href={yelpProUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/5 hover:border-accent-500/30 text-sm font-bold text-slate-300 hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">⭐ View repair shops on Yelp</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400" />
                </a>

                <a
                  href={linkedinProUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/5 hover:border-accent-500/30 text-sm font-bold text-slate-300 hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">💼 Find freelancers on LinkedIn</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-400" />
                </a>
              </div>
            </div>
            <Button href={`/resources?category=${item.categoryId}`} variant="secondary" className="mt-6 w-full">
              Browse Local Network
            </Button>
          </Card>

          <Card className="flex flex-col h-full justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Document it safely</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Before calling a professional, note down the model details so you can get a fast quote:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-slate-400">
                <li>Brand name and model number</li>
                <li>What is happening (smells, sounds, errors)</li>
                <li>Do not attempt to disassemble the item yourself</li>
              </ul>
            </div>
            <Button href="/log" variant="secondary" className="mt-6 w-full">
              Save details to log
            </Button>
          </Card>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-white/5 animate-fade-in delay-300">
        <Link 
          href={`/safety-checker?item=${item.id}`} 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 hover:text-accent-400 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Redo safety check
        </Link>
        <Link 
          href="/choose-item" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-300 hover:text-accent-400 transition-colors"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          Choose different item
        </Link>
      </div>
    </div>
  );
}

export default function SafetyResultPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading safety result…" />}>
      <SafetyResultContent />
    </Suspense>
  );
}
