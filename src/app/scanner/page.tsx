"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { dangerMatches } from "@/lib/safety";
import { findItems } from "@/lib/search";

/**
 * "Describe it": the user types what is wrong in their own words and gets the
 * closest items. The matching is keyword based (see lib/search.ts), it is not
 * image recognition. Words that point at a dangerous repair are flagged right
 * away, before any item is picked. The photo never leaves the device, it is
 * only there so the user has it ready to show a repair shop.
 */
function DescribeContent() {
  const searchParams = useSearchParams();
  const [description, setDescription] = useState(searchParams.get("q") ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  const matches = useMemo(() => findItems(description), [description]);
  const dangers = useMemo(() => dangerMatches(description), [description]);
  const typed = description.trim().length > 2;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <PageHeader
        title="Describe the problem"
        intro="Say what is wrong in your own words. The closest repairs show up as you type."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <label className="block">
            <span className="font-semibold text-workshop-900">What is broken?</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              autoFocus
              placeholder="e.g. My bike tire keeps going flat"
              className="input mt-2"
            />
          </label>

          <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-card border-2 border-dashed border-workshop-200 bg-workshop-50 p-4 transition hover:bg-workshop-100">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Your photo of the item" className="h-20 w-20 rounded-xl object-cover" />
            ) : (
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-surface text-workshop-600 shadow-card">
                <Icon name="camera" size={24} />
              </span>
            )}
            <span>
              <span className="block font-medium text-workshop-900">
                {preview ? "Photo added" : "Add a photo (optional)"}
              </span>
              <span className="block text-sm text-workshop-800">
                Handy to show a repair shop. It stays on this device and is not used for the match.
              </span>
            </span>
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onFile} />
          </label>
        </Card>

        <div aria-live="polite">
          {dangers.length > 0 && (
            <div className="mb-4 animate-pop rounded-card border border-danger/40 bg-danger/10 p-4 text-danger">
              <p className="flex items-center gap-2 font-bold">
                <Icon name="stop" />
                This sounds like a job for a professional
              </p>
              <p className="mt-1 text-sm">
                Your description points at: <strong>{dangers.join(", ")}</strong>. FixIt does not
                give do-it-yourself steps for that.
              </p>
              <Button href="/resources" variant="danger" className="mt-3">
                Find a local professional
              </Button>
            </div>
          )}

          {!typed && (
            <Card className="text-workshop-800">
              <p className="font-semibold text-workshop-900">Matches will show up here.</p>
              <p className="mt-1 text-sm">
                Mention the thing and what it is doing, like &ldquo;lamp won&apos;t turn on&rdquo; or
                &ldquo;zipper stuck on my jacket&rdquo;.
              </p>
            </Card>
          )}

          {typed && matches.length === 0 && dangers.length === 0 && (
            <Card className="text-workshop-800">
              <p className="font-semibold text-workshop-900">That is not in our list, but you can still check it.</p>
              <p className="mt-1 text-sm">
                The safety check works for anything. There will be no written guide, only the
                safety result and local help.
              </p>
            </Card>
          )}

          {matches.length > 0 && (
            <>
              <p className="eyebrow mb-2">Closest repairs</p>
              <ul className="space-y-3">
                {matches.map((item, i) => (
                  <li key={item.id} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                    <Link href={`/safety-checker?item=${item.id}`} className="tile flex items-center gap-3 p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-workshop-900">{item.name}</p>
                        <p className="mb-2 text-sm text-workshop-800">{item.commonIssue}</p>
                        <SafetyBadge level={item.baseSafety} />
                      </div>
                      <Icon name="arrow" className="text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {typed && dangers.length === 0 && (
            <Link
              href={`/safety-checker?custom=${encodeURIComponent(description.trim())}`}
              className="tile mt-3 flex items-center gap-3 border-dashed p-4"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon name="plus" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-workshop-900">
                  {matches.length > 0 ? "None of these?" : "Check it anyway"}
                </span>
                <span className="block text-sm text-workshop-800">
                  Run the safety check for &ldquo;{description.trim().slice(0, 60)}&rdquo;
                </span>
              </span>
              <Icon name="arrow" className="text-brand-700" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <DescribeContent />
    </Suspense>
  );
}
