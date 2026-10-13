"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { Wrenches } from "@/components/Workshop";
import { categories, getGuideCategory, guides } from "@/lib/data";
import { getAllGuideProgress } from "@/lib/storage";

const LEVELS = ["All", "Beginner", "Some experience"];

/** Every guide in one place, to browse without picking a broken item first. */
export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [categoryId, setCategoryId] = useState("");
  const [progress, setProgress] = useState<Record<string, number[]>>({});

  useEffect(() => setProgress(getAllGuideProgress()), []);

  const rows = useMemo(
    () => guides.map((guide) => ({ guide, category: getGuideCategory(guide.id) })),
    [],
  );
  const typed = query.trim().toLowerCase();
  const visible = rows.filter(
    ({ guide, category }) =>
      (level === "All" || guide.difficulty === level) &&
      (!categoryId || category?.id === categoryId) &&
      (!typed ||
        [guide.title, ...guide.tools, ...guide.steps.map((s) => s.title)].some((text) =>
          text.toLowerCase().includes(typed),
        )),
  );

  return (
    <div>
      <PageHeader
        title="Repair guides"
        intro={`${guides.length} step-by-step guides for repairs that are safe to do yourself.`}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr,auto,auto]">
        <label className="relative block">
          <span className="sr-only">Search guides</span>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-workshop-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, tools or steps"
            className="input pl-11"
          />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex rounded-card border border-workshop-200 bg-surface p-1" role="group" aria-label="Difficulty">
          {LEVELS.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={level === name}
              onClick={() => setLevel(name)}
              className={`min-h-[2.5rem] flex-1 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition ${
                level === name ? "bg-brand-600 text-white" : "text-workshop-800 hover:bg-workshop-100"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-workshop-800" aria-live="polite">
        {visible.length} {visible.length === 1 ? "guide" : "guides"}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-card border border-dashed border-workshop-300 bg-surface p-6 text-center text-workshop-800">
          No guide matches. Try fewer words, or{" "}
          <Link href="/scanner" className="font-semibold text-brand-700 underline">
            describe the problem
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ guide, category }) => {
            const done = progress[guide.id]?.length ?? 0;
            return (
              <li key={guide.id}>
                <Link href={`/guide/${guide.id}`} className="tile flex h-full flex-col p-4">
                  <span className="text-sm text-workshop-600">
                    {category ? category.name : "General"}
                  </span>
                  <span className="mt-1 flex-1 font-semibold text-workshop-900">{guide.title}</span>
                  <span className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="chip bg-workshop-100 px-2.5 text-xs text-workshop-800">
                      <Icon name="clock" size={13} />
                      {guide.time}
                    </span>
                    <Wrenches difficulty={guide.difficulty} />
                    {done > 0 && (
                      <span className="chip bg-brand-50 px-2.5 text-xs text-brand-700">
                        {done === guide.steps.length ? "Done" : `${done}/${guide.steps.length} steps`}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 text-sm text-workshop-800">
        Not sure it is safe? Run the{" "}
        <Link href="/choose-item" className="font-semibold text-brand-700 underline">
          safety check
        </Link>{" "}
        first. Dangerous repairs never have a guide here.
      </p>
    </div>
  );
}
