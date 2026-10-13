"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Guide3D } from "@/components/Guide3D";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { getGuide, getItem } from "@/lib/data";
import { MODELS } from "@/lib/models";

const KINDS: Array<[string, string]> = [
  ["all", "All"],
  ["guides", "Used in guides"],
  ["polyhaven", "Realistic scans"],
  ["kenney", "Low-poly"],
];

/** The 3D workshop: every model in the app, one at a time on a big turntable. */
export default function ModelsPage() {
  const [kind, setKind] = useState("all");
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const lastPick = useRef(0);

  const shown = useMemo(
    () =>
      MODELS.filter(
        (m) => kind === "all" || (kind === "guides" ? m.guides.length > 0 : m.source === kind),
      ),
    [kind],
  );
  const model = shown[Math.min(at, shown.length - 1)];

  // moves to the next model every few seconds, and waits a while after a pick by hand
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      if (Date.now() - lastPick.current > 9000) setAt((i) => (i + 1) % shown.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, shown.length]);

  function pick(index: number) {
    lastPick.current = Date.now();
    setAt(((index % shown.length) + shown.length) % shown.length);
  }

  const guide = model.guides.map((id) => getGuide(id)).find(Boolean);
  const item = model.items.map((id) => getItem(id)).find(Boolean);

  return (
    <div>
      <PageHeader
        title="3D workshop"
        intro={`${MODELS.length} models you can spin around. Drag to turn one, or let them play.`}
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr,1fr] lg:items-start">
        <div className="plate rounded-[1.5rem] border-2 border-workshop-900 bg-surface p-5 shadow-lift lg:sticky lg:top-24">
          <Guide3D key={model.file} guideId="" file={model.file} step={0} tall />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div key={model.id} className="animate-rise">
              <p className="display text-3xl text-workshop-900">{model.name}</p>
              <p className="text-sm text-workshop-800">
                {at + 1} of {shown.length}
                {guide ? ` · used in "${guide.title}"` : item ? ` · shown for "${item.name}"` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => pick(at - 1)} aria-label="Previous model" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-workshop-900 bg-surface transition hover:scale-110 active:scale-95">
                <Icon name="back" size={18} />
              </button>
              <button
                type="button"
                onClick={() => setPlaying(!playing)}
                aria-pressed={playing}
                className={`min-h-[2.75rem] rounded-full border-2 border-workshop-900 px-4 text-sm font-bold transition ${playing ? "bg-workshop-900 text-workshop-50" : "bg-surface text-workshop-900"}`}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" onClick={() => pick(at + 1)} aria-label="Next model" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-workshop-900 bg-surface transition hover:scale-110 active:scale-95">
                <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>
          {(guide || item) && (
            <Link
              href={guide ? `/guide/${guide.id}` : `/safety-checker?item=${item!.id}`}
              className="mt-4 flex min-h-[3rem] items-center justify-center gap-2 rounded-card bg-brand-600 font-bold text-white transition hover:brightness-110 active:scale-[.98]"
            >
              {guide ? "Open the guide" : "Run the safety check"}
              <Icon name="arrow" size={18} />
            </Link>
          )}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Kind of model">
            {KINDS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={kind === id}
                onClick={() => {
                  setKind(id);
                  setAt(0);
                }}
                className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  kind === id ? "border-workshop-900 bg-workshop-900 text-workshop-50" : "border-workshop-200 bg-surface text-workshop-800 hover:bg-workshop-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {shown.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === at}
                  className={`flex h-full w-full flex-col rounded-card border-2 p-3 text-left transition ${
                    i === at ? "border-brand-600 bg-brand-50" : "border-workshop-200 bg-surface hover:border-workshop-900"
                  }`}
                >
                  <span className="text-sm font-bold leading-tight text-workshop-900">{m.name}</span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-workshop-600">
                    {m.source === "polyhaven" ? "Scan" : "Low-poly"}
                    {m.guides.length > 0 ? " · guide" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-workshop-600">
            All models are CC0 (free for any use), from Kenney and Poly Haven. They are general
            models, not the exact product you own.
          </p>
        </div>
      </div>
    </div>
  );
}
