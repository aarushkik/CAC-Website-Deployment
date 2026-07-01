"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { categories, getItemsByCategory, items } from "@/lib/data";

function ChooseItemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");

  const [query, setQuery] = useState("");

  const visibleItems = (activeCategory ? getItemsByCategory(activeCategory) : items).filter(
    (item) => item.name.toLowerCase().includes(query.toLowerCase()),
  );

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
        intro="Pick a category, search for your item, or scan a photo. Next we'll run a quick safety check."
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
            className="w-full rounded-card border border-workshop-200 bg-white px-4 py-3 text-lg text-workshop-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <Link
          href="/scanner"
          className="inline-flex items-center justify-center gap-2 rounded-card border border-workshop-200 bg-workshop-100 px-6 py-3 text-lg font-semibold text-workshop-900 hover:bg-workshop-200"
        >
          📷 Scan instead
        </Link>
      </div>

      {/* Category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryChip label="All items" active={!activeCategory} onClick={() => setCategory(null)} />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={`${c.icon} ${c.name}`}
            active={activeCategory === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      {/* Item grid */}
      {visibleItems.length === 0 ? (
        <p className="text-workshop-800">No items match your search yet. Try the scanner or a different word.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/safety-checker?item=${item.id}`}
              className="group flex flex-col rounded-card border border-workshop-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2">
                <SafetyBadge level={item.baseSafety} />
              </div>
              <h3 className="text-lg font-semibold text-workshop-900 group-hover:text-brand-700">
                {item.name}
              </h3>
              <p className="mt-1 flex-1 text-sm text-workshop-800">{item.commonIssue}</p>
              <span className="mt-3 text-sm font-semibold text-brand-700">Check safety →</span>
            </Link>
          ))}
        </div>
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
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-workshop-200 bg-white text-workshop-800 hover:bg-workshop-100"
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
