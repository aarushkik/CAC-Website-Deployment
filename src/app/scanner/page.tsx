"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FixFinder } from "@/components/FixFinder";
import { PageHeader } from "@/components/PageHeader";

function ScannerContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.slice(0, 500) ?? "";
  return (
    <div>
      <PageHeader
        eyebrow="Find a fix"
        title="What's broken?"
        intro="Describe it in your own words or snap a photo. We'll tell you if it's safe to fix, then show the cheapest ways to fix it — parts online, local shops, or a used replacement."
      />
      <div className="max-w-3xl">
        <FixFinder initialQuery={query} autoRun />
      </div>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <ScannerContent />
    </Suspense>
  );
}
