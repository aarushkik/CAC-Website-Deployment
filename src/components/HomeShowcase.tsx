"use client";

import Link from "next/link";
import { useState } from "react";
import { getGuide } from "@/lib/data";
import { Guide3D } from "./Guide3D";
import { Icon } from "./Icon";

const SHOWN: Array<{ guideId: string; label: string }> = [
  { guideId: "patch-tube", label: "Bike tube" },
  { guideId: "tighten-joints", label: "Wobbly chair" },
  { guideId: "clean-waterproof-boots", label: "Boots" },
  { guideId: "running-toilet", label: "Toilet" },
];

/**
 * The picture next to the search on the home screen: a real guide's 3D model
 * that can be turned, with a few to switch between. It shows what a guide looks
 * like before anyone has picked an item.
 */
export function HomeShowcase() {
  const [at, setAt] = useState(0);
  const guide = getGuide(SHOWN[at].guideId);
  if (!guide) return null;

  return (
    <div className="plate rounded-[1.5rem] border-2 border-workshop-900 bg-surface p-5 shadow-lift sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="eyebrow whitespace-nowrap">On the workbench</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Example guide">
          {SHOWN.map((shown, i) => (
            <button
              key={shown.guideId}
              type="button"
              aria-pressed={i === at}
              onClick={() => setAt(i)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                i === at ? "bg-workshop-900 text-workshop-50" : "bg-workshop-100 text-workshop-800 hover:bg-workshop-200"
              }`}
            >
              {shown.label}
            </button>
          ))}
        </div>
      </div>

      <Guide3D key={guide.id} guideId={guide.id} step={1} className="mt-3" />

      <Link href={`/guide/${guide.id}`} className="group mt-4 flex items-center justify-between gap-3 rounded-card bg-workshop-100 p-3 transition hover:bg-brand-50">
        <span>
          <span className="block font-bold text-workshop-900">{guide.title}</span>
          <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-workshop-800">
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={14} />
              {guide.time}
            </span>
            <span>{guide.steps.length} steps</span>
            <span>{guide.difficulty}</span>
          </span>
        </span>
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-600 text-white transition group-hover:translate-x-1">
          <Icon name="arrow" size={18} />
        </span>
      </Link>
    </div>
  );
}
