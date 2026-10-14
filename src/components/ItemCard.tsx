import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { SafetyBadge } from "@/components/SafetyBadge";
import { getCategory } from "@/lib/data";
import type { Item } from "@/lib/types";

/** A repair you can pick. Leads to that item's safety check. */
export function ItemCard({ item, showCategory = false }: { item: Item; showCategory?: boolean }) {
  const category = getCategory(item.categoryId);

  if (item.generic) {
    return (
      <Link
        href={`/safety-checker?item=${item.id}`}
        className="group flex h-full flex-col rounded-card border-2 border-dashed border-concrete-300 bg-concrete-50 p-5 transition hover:border-brand-200 hover:bg-white"
      >
        <HelpCircle className="h-6 w-6 text-ink-muted group-hover:text-brand-600" aria-hidden="true" />
        <h3 className="mt-3 font-semibold text-ink group-hover:text-brand-700">{item.name}</h3>
        <p className="mt-1 flex-1 text-sm text-ink-soft">{item.commonIssue}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
          General safety check
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/safety-checker?item=${item.id}`}
      className="group flex h-full flex-col rounded-card border border-concrete-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <SafetyBadge level={item.baseSafety} typical />
        {showCategory && category && (
          <span className="text-lg" title={category.name} aria-label={category.name}>
            {category.icon}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-semibold leading-snug text-ink group-hover:text-brand-700">{item.name}</h3>
      <p className="mt-1 flex-1 text-sm text-ink-soft">{item.commonIssue}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
        Check safety
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
