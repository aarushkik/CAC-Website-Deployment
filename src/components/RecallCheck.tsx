"use client";

import { useState } from "react";
import type { Recall } from "@/lib/recalls";
import { Icon } from "./Icon";

/**
 * A search of the US government's recall notices. A recalled product should go
 * back to the maker for the refund, repair or replacement in the notice, not be
 * fixed at home.
 */
export function RecallCheck() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "failed">("idle");
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [asked, setAsked] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) return;
    setState("busy");
    setAsked(q);
    try {
      const response = await fetch(`/api/recalls?q=${encodeURIComponent(q)}`);
      if (!response.ok) throw new Error("no answer");
      setRecalls(((await response.json()) as { recalls: Recall[] }).recalls);
      setState("done");
    } catch {
      setState("failed");
    }
  }

  return (
    <section className="no-print mt-6 rounded-card border border-workshop-200 bg-surface p-5 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-workshop-900">
        <Icon name="alert" className="text-caution" />
        Has it been recalled?
      </h2>
      <p className="mt-1 text-sm text-workshop-800">
        Search the US Consumer Product Safety Commission&apos;s recall notices by brand or product.
        If yours is on it, do not repair it. The maker owes you a fix, a replacement or a refund.
      </p>
      <form onSubmit={search} className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Brand or product</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Gree dehumidifier"
            className="input"
            enterKeyHint="search"
          />
        </label>
        <button
          type="submit"
          disabled={query.trim().length < 3 || state === "busy"}
          className="min-h-[3rem] rounded-card bg-brand-600 px-4 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {state === "busy" ? "Searching…" : "Check"}
        </button>
      </form>

      <div aria-live="polite">
        {state === "failed" && (
          <p className="mt-3 text-sm text-workshop-800">
            The recall database did not answer. You can search it directly at{" "}
            <a href="https://www.cpsc.gov/Recalls" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline">
              cpsc.gov/Recalls
            </a>
            .
          </p>
        )}
        {state === "done" && recalls.length === 0 && (
          <p className="mt-3 text-sm text-workshop-800">
            No recall notice has &ldquo;{asked}&rdquo; in its title. That is not proof there is none: try
            just the brand, or just the kind of product.
          </p>
        )}
        {state === "done" && recalls.length > 0 && (
          <>
            <p className="mt-3 text-sm font-semibold text-workshop-900">
              {recalls.length} recall {recalls.length === 1 ? "notice mentions" : "notices mention"} &ldquo;{asked}&rdquo;.
              Check the model numbers in the notice against yours.
            </p>
            <ul className="mt-2 space-y-2">
              {recalls.map((recall) => (
                <li key={recall.url}>
                  <a
                    href={recall.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-card border border-caution/40 bg-caution/10 p-3 transition hover:bg-caution/20"
                  >
                    <span className="block text-xs font-semibold text-workshop-600">{recall.date}</span>
                    <span className="block font-semibold text-workshop-900">{recall.title}</span>
                    {recall.hazard && <span className="mt-1 block text-sm text-workshop-800">{recall.hazard}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
