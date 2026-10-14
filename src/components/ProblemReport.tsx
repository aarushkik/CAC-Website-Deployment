"use client";

import { useId, useMemo, useState } from "react";
import { ClipboardCopy, NotebookPen, Printer } from "lucide-react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { formatDate } from "@/lib/format";
import { safetySignalWord } from "@/lib/safety";
import type { Item, SafetyLevel, SafetyReason } from "@/lib/types";

/** Copies text, falling back to a hidden textarea on older browsers. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/**
 * Helps someone describe a problem to a professional without taking the item
 * apart: brand, symptoms, and when it started, ready to copy or print.
 */
export function ProblemReport({
  item,
  level,
  reasons,
}: {
  item: Item;
  level: SafetyLevel;
  reasons: SafetyReason[];
}) {
  const toast = useToast();
  const baseId = useId();
  const [model, setModel] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [started, setStarted] = useState("");
  const [tried, setTried] = useState("");

  const summary = useMemo(() => {
    const lines = [
      `Repair request: ${item.name}`,
      model.trim() && `Brand / model: ${model.trim()}`,
      `What's happening: ${symptoms.trim() || item.commonIssue}`,
      started.trim() && `When it started: ${started.trim()}`,
      tried.trim() && `Already tried: ${tried.trim()}`,
      `Safety check: ${safetySignalWord(level)}${reasons.length ? ` — ${reasons.map((r) => r.text).join(" ")}` : ""}`,
      `Prepared with FixIt WA 03 on ${formatDate(new Date().toISOString())}.`,
    ];
    return lines.filter(Boolean).join("\n");
  }, [item, model, symptoms, started, tried, level, reasons]);

  async function handleCopy() {
    const ok = await copyText(summary);
    toast(
      ok
        ? { message: "Copied. Paste it into an email or text to the shop." }
        : { message: "Couldn't copy automatically. Select the text and copy it instead.", tone: "error" },
    );
  }

  const logHref = `/log?${new URLSearchParams({
    item: item.id,
    outcome: "referred-to-pro",
    notes: summary.slice(0, 600),
  }).toString()}`;

  const field = (suffix: string) => `${baseId}-${suffix}`;

  return (
    <section aria-labelledby={field("heading")} className="print-plain rounded-card border border-concrete-200 bg-white p-5 shadow-card sm:p-6">
      <h3 id={field("heading")} className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
        <NotebookPen className="h-6 w-6 text-brand-600 no-print" aria-hidden="true" />
        Write it up for the pro
      </h3>
      <p className="no-print mt-1 text-sm text-ink-soft">
        A clear description gets you a faster, more accurate quote. Don&apos;t take the item apart —
        a photo from a safe distance is plenty.
      </p>

      <div className="no-print mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={field("model")} className="label">
            Brand and model <span className="font-normal text-ink-muted">(on a sticker, often underneath)</span>
          </label>
          <input
            id={field("model")}
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="e.g. Hamilton Beach 38521"
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor={field("started")} className="label">
            When it started
          </label>
          <input
            id={field("started")}
            value={started}
            onChange={(event) => setStarted(event.target.value)}
            placeholder="e.g. last Tuesday, after a power outage"
            className="input mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={field("symptoms")} className="label">
            What&apos;s happening
          </label>
          <textarea
            id={field("symptoms")}
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
            rows={2}
            placeholder="Sounds, smells, error lights, when it happens…"
            className="input mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={field("tried")} className="label">
            Anything you&apos;ve already tried <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id={field("tried")}
            value={tried}
            onChange={(event) => setTried(event.target.value)}
            placeholder="e.g. tried a different outlet"
            className="input mt-1"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="label no-print">Your summary</p>
        <pre className="mt-1 whitespace-pre-wrap rounded-lg border border-concrete-200 bg-concrete-50 p-4 font-sans text-sm leading-relaxed text-ink">
          {summary}
        </pre>
      </div>

      <div className="no-print mt-4 flex flex-wrap gap-2">
        <Button onClick={handleCopy}>
          <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
          Copy summary
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print
        </Button>
        <Button variant="ghost" href={logHref}>
          Log it after the repair
        </Button>
      </div>
    </section>
  );
}
