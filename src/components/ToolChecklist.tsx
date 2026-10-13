"use client";

import { useEffect, useState } from "react";
import { getToolbox, saveToolbox, toolKey } from "@/lib/storage";
import { Icon } from "./Icon";

/**
 * The tools of a guide with a tick for "I have this". Ticks are kept in one
 * toolbox for the whole app, so a screwdriver ticked here is already ticked in
 * the next guide that needs one.
 */
export function ToolChecklist({ tools }: { tools: string[] }) {
  const [owned, setOwned] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOwned(getToolbox());
    setLoaded(true);
  }, []);

  function toggle(tool: string) {
    const key = toolKey(tool);
    const next = owned.includes(key) ? owned.filter((k) => k !== key) : [...owned, key];
    setOwned(next);
    saveToolbox(next);
  }

  const missing = tools.filter((tool) => !owned.includes(toolKey(tool)));

  return (
    <>
      <ul className="mt-3 space-y-1">
        {tools.map((tool) => {
          const have = owned.includes(toolKey(tool));
          return (
            <li key={tool}>
              <label className="flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-xl px-2 text-workshop-800 transition hover:bg-workshop-100">
                <input type="checkbox" checked={have} onChange={() => toggle(tool)} className="peer sr-only" />
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200 ${
                    have ? "border-safe bg-safe text-white" : "border-workshop-300 bg-surface text-transparent"
                  }`}
                >
                  <Icon name="check" size={15} />
                </span>
                <span className={have ? "text-workshop-600" : ""}>{tool}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {loaded && (
        <p className={`no-print mt-3 text-sm font-medium ${missing.length === 0 ? "text-safe" : "text-workshop-800"}`} aria-live="polite">
          {missing.length === 0
            ? "You have everything for this one."
            : owned.length === 0
              ? "Tick what you already own. FixIt remembers it for every guide."
              : `Still needed: ${missing.length} of ${tools.length}.`}
        </p>
      )}
    </>
  );
}
