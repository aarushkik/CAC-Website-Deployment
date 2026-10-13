"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTiles, spring } from "@/components/Motion";
import { categories, getCategory, getItemsByCategory, items } from "@/lib/data";
import type { SafetyLevel } from "@/lib/types";

const SAFETY_BAR = { green: "bg-safe", yellow: "bg-caution", red: "bg-danger" };
const SAFETY_INK = { green: "text-safe", yellow: "text-caution", red: "text-danger" };
const SAFETY_WORD = { green: "Beginner safe", yellow: "With caution", red: "Needs a pro" };

function ChooseItemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");

  const [query, setQuery] = useState("");
  const [safety, setSafety] = useState<"" | SafetyLevel>("");

  // The search looks at the name, the description and the everyday words for each item.
  const typed = query.trim().toLowerCase();
  const visibleItems = (activeCategory ? getItemsByCategory(activeCategory) : items).filter(
    (item) =>
      (!safety || item.baseSafety === safety) &&
      (!typed ||
        [item.name, item.commonIssue, ...(item.keywords ?? [])].some((text) =>
          text.toLowerCase().includes(typed),
        )),
  );

  // nothing typed, no category, no safety filter: show the category tiles
  const browsing = !activeCategory && !typed && !safety;

  function setCategory(id: string | null) {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    const queryString = params.toString();
    router.push(`/choose-item${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <div>
      <PageHeader
        title="Choose an item"
        intro="Pick what is broken. Next comes a quick safety check."
      />

      {/* Search + scanner shortcut */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search items</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, e.g. zipper, lamp, bike tire..."
            className="input"
          />
        </label>
        <Link
          href="/scanner"
          className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-card border border-workshop-200 bg-surface px-5 py-3 font-semibold text-workshop-900 shadow-card hover:bg-workshop-100"
        >
          Describe it instead
        </Link>
      </div>

      {/* Category chips */}
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <CategoryChip label="All items" active={!activeCategory} onClick={() => setCategory(null)} />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.name}
            active={activeCategory === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-1 text-workshop-800" aria-live="polite">
          {browsing ? "Show only:" : `${visibleItems.length} ${visibleItems.length === 1 ? "repair" : "repairs"}`}
        </span>
        {(
          [
            ["", "Any"],
            ["green", "Beginner safe"],
            ["yellow", "With caution"],
            ["red", "Needs a pro"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={label}
            type="button"
            aria-pressed={safety === value}
            onClick={() => setSafety(value)}
            className={`rounded-full border px-3 py-1.5 font-medium transition-colors ${
              safety === value
                ? "border-workshop-900 bg-workshop-900 text-workshop-50"
                : "border-workshop-200 bg-surface text-workshop-800 hover:bg-workshop-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* With nothing chosen yet, start from pictures of the categories. */}
      {browsing ? (
        <CategoryTiles compact />
      ) : visibleItems.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-workshop-300 bg-surface p-6 text-center text-workshop-800">
          <p className="font-semibold text-workshop-900">Nothing matches{query ? <> &ldquo;{query}&rdquo;</> : " these filters"}.</p>
          <p className="mt-1 text-sm">
            Try another word, or{" "}
            <Link href={`/scanner?q=${encodeURIComponent(query)}`} className="font-semibold text-brand-700 underline">
              describe the problem in your own words
            </Link>{" "}
            and run the safety check anyway.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
              >
                <Link href={`/safety-checker?item=${item.id}`} className="tile group relative flex h-full flex-col overflow-hidden p-4 hover:translate-y-0">
                  <span className={`absolute inset-x-0 top-0 h-1.5 ${SAFETY_BAR[item.baseSafety]}`} />
                  <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-workshop-100 text-workshop-800 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <CategoryIcon name={getCategory(item.categoryId)?.icon} className="h-7 w-7" />
                  </span>
                  <span className="mt-3 flex-1 font-bold leading-tight text-workshop-900">{item.name}</span>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${SAFETY_INK[item.baseSafety]}`}>
                    {SAFETY_WORD[item.baseSafety]}
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-workshop-200 bg-surface text-workshop-800 hover:bg-workshop-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function ChooseItemPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading items…</p>}>
      <ChooseItemContent />
    </Suspense>
  );
}
