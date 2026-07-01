"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { items } from "@/lib/data";
import { isDangerousText } from "@/lib/safety";

/**
 * Placeholder "AI scanner". Real image recognition can be added later.
 * For now it accepts a photo and a short description, then makes a simple
 * keyword-based guess. Dangerous keywords are flagged immediately so the app
 * never encourages an unsafe DIY repair, even before a real model exists.
 */
export default function ScannerPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [dangerWarning, setDangerWarning] = useState(false);
  const [guessIds, setGuessIds] = useState<string[] | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  function analyze() {
    setDangerWarning(isDangerousText(description));

    const words = description.toLowerCase();
    const matches = items
      .filter((item) =>
        item.name
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.length > 3 && words.includes(word)),
      )
      .map((item) => item.id);

    setGuessIds(matches);
  }

  return (
    <div>
      <PageHeader
        title="AI Scanner"
        intro="Upload a photo and describe the problem. We'll suggest a likely match and run a safety check."
      >
        <p className="rounded-card bg-workshop-100 px-4 py-3 text-sm text-workshop-800">
          <strong>Note:</strong> Automatic photo recognition is a placeholder in this
          version. Your description drives the match today. No photo is uploaded to a
          server — it stays on your device.
        </p>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">1. Add a photo (optional)</h2>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-workshop-200 bg-workshop-50 px-4 py-10 text-center hover:bg-workshop-100">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Item preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <span className="text-4xl" aria-hidden="true">
                  📷
                </span>
                <span className="mt-2 font-medium text-workshop-900">Tap to add a photo</span>
                <span className="text-sm text-workshop-800">or use the description below</span>
              </>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={onFile} />
          </label>

          <h2 className="mt-6 text-lg font-semibold text-workshop-900">2. Describe the problem</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. My bike tire is flat, or my lamp won't turn on"
            className="mt-3 w-full rounded-card border border-workshop-200 bg-white px-4 py-3 text-workshop-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />

          <div className="mt-4">
            <Button onClick={analyze} disabled={description.trim().length === 0}>
              Analyze
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">Results</h2>

          {dangerWarning && (
            <div className="mt-3 rounded-card border border-danger/30 bg-danger/10 p-4 text-danger">
              <p className="font-semibold">⚠️ This may be a dangerous repair.</p>
              <p className="mt-1 text-sm">
                Based on your description, this could involve a repair we don&apos;t give DIY
                instructions for. Please{" "}
                <Link href="/resources" className="font-semibold underline">
                  find a local professional
                </Link>{" "}
                instead.
              </p>
            </div>
          )}

          {guessIds === null && (
            <p className="mt-3 text-workshop-800">
              Add a description and tap <strong>Analyze</strong> to see suggested matches.
            </p>
          )}

          {guessIds !== null && guessIds.length === 0 && !dangerWarning && (
            <div className="mt-3 text-workshop-800">
              <p>No confident match yet. You can pick your item manually:</p>
              <Button href="/choose-item" variant="secondary" className="mt-3">
                Choose item manually
              </Button>
            </div>
          )}

          {guessIds !== null && guessIds.length > 0 && (
            <ul className="mt-3 space-y-2">
              {guessIds.map((id) => {
                const item = items.find((i) => i.id === id)!;
                return (
                  <li key={id}>
                    <Link
                      href={`/safety-checker?item=${id}`}
                      className="flex items-center justify-between rounded-card border border-workshop-200 bg-workshop-50 px-4 py-3 hover:bg-workshop-100"
                    >
                      <span className="font-medium text-workshop-900">{item.name}</span>
                      <span className="text-sm font-semibold text-brand-700">Check safety →</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
