"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Camera, Search, X } from "lucide-react";
import { ItemCard } from "@/components/ItemCard";
import { PageHeader } from "@/components/PageHeader";
import { categories, getCategory, getItemsByCategory, items } from "@/lib/data";
import { buildItemIndex, matchItems } from "@/lib/match";
import { useScrollIntoViewIf } from "@/lib/useScrollIntoViewIf";

const index = buildItemIndex(items, categories);

/** Keeps the URL shareable without adding history entries or scrolling. */
function replaceQuery(changes: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

function ChooseItemContent() {
  const searchParams = useSearchParams();
  const activeCategory = getCategory(searchParams.get("category"))?.id ?? null;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const trimmed = query.trim();
  const results = useMemo(() => {
    if (!trimmed) return null;
    return matchItems(trimmed, index).filter(
      (match) => !activeCategory || match.item.categoryId === activeCategory,
    );
  }, [trimmed, activeCategory]);

  function updateQuery(value: string) {
    setQuery(value);
    replaceQuery({ q: value.trim() || null });
  }

  function chipHref(categoryId: string | null) {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    if (trimmed) params.set("q", trimmed);
    const search = params.toString();
    return `/choose-item${search ? `?${search}` : ""}`;
  }

  const visibleCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div>
      <PageHeader
        eyebrow="Start a repair"
        title="What needs fixing?"
        intro="Search or pick a category. Next comes a quick safety check made for that kind of item."
      />

      {/* Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="item-search" className="sr-only">
            Search repairs
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            id="item-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Try “zipper” or “flat tire”"
            autoComplete="off"
            className="input h-12 pl-11 pr-11 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-muted hover:bg-concrete-100 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <Link
          href={trimmed ? `/scanner?q=${encodeURIComponent(trimmed)}` : "/scanner"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-concrete-300 bg-white px-5 font-semibold text-ink shadow-sm hover:bg-concrete-50"
        >
          <Camera className="h-5 w-5" aria-hidden="true" />
          Describe or snap it
        </Link>
      </div>

      {/* Category chips */}
      <nav
        aria-label="Categories"
        className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        <CategoryChip href={chipHref(null)} label="All repairs" active={!activeCategory} />
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            href={chipHref(category.id)}
            label={`${category.icon} ${category.name}`}
            active={activeCategory === category.id}
          />
        ))}
      </nav>

      {results ? (
        <section aria-live="polite">
          <p className="mb-4 text-sm font-semibold text-ink-muted">
            {results.length === 0
              ? `No matches for “${trimmed}”`
              : `${results.length} ${results.length === 1 ? "match" : "matches"} for “${trimmed}”`}
            {activeCategory ? ` in ${getCategory(activeCategory)?.name}` : ""}
          </p>
          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ item }) => (
                <ItemCard key={item.id} item={item} showCategory={!activeCategory} />
              ))}
            </div>
          ) : (
            <NoMatches query={trimmed} activeCategory={activeCategory} />
          )}
        </section>
      ) : (
        <div className="space-y-12">
          {visibleCategories.map((category) => (
            <section key={category.id} aria-labelledby={`cat-${category.id}`}>
              {!activeCategory && (
                <h2
                  id={`cat-${category.id}`}
                  className="mb-4 flex items-center gap-2 font-display text-2xl font-extrabold text-ink"
                >
                  <span aria-hidden="true">{category.icon}</span>
                  {category.name}
                </h2>
              )}
              {activeCategory && (
                <h2 id={`cat-${category.id}`} className="sr-only">
                  {category.name}
                </h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getItemsByCategory(category.id).map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function NoMatches({ query, activeCategory }: { query: string; activeCategory: string | null }) {
  const genericChoices = (activeCategory ? categories.filter((c) => c.id === activeCategory) : categories).map(
    (category) => ({ category, item: getItemsByCategory(category.id).find((i) => i.generic) }),
  );
  return (
    <div className="rounded-card border border-concrete-200 bg-white p-6 shadow-card">
      <h3 className="font-semibold text-ink">It might not be in our list yet.</h3>
      <p className="mt-1 text-ink-soft">
        Describe the problem in the scanner, or run a general safety check for its category.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/scanner?q=${encodeURIComponent(query)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Describe it in the scanner
        </Link>
      </div>
      <p className="mt-5 text-sm font-semibold text-ink">General safety check for:</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {genericChoices.map(({ category, item }) =>
          item ? (
            <li key={category.id}>
              <Link
                href={`/safety-checker?item=${item.id}`}
                className="inline-flex rounded-full border border-concrete-300 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-brand-200 hover:text-brand-700"
              >
                {category.icon} {category.name}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  );
}

function CategoryChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  const ref = useScrollIntoViewIf<HTMLAnchorElement>(active);
  return (
    <Link
      ref={ref}
      href={href}
      replace
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-concrete-300 bg-white text-ink-soft hover:border-concrete-400 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export default function ChooseItemPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading repairs…</p>}>
      <ChooseItemContent />
    </Suspense>
  );
}
