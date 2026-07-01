"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { categories, getCategory, resources } from "@/lib/data";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>(searchParams.get("category") ?? "");

  const visible = filter ? resources.filter((r) => r.categories.includes(filter)) : resources;
  const activeCategory = filter ? getCategory(filter) : undefined;

  return (
    <div>
      <PageHeader
        title="Local repair help"
        intro="Trusted shops, repair cafes, and pros around Southwest Washington's 3rd district. For red-level repairs, always choose a professional."
      >
        {activeCategory && (
          <p className="rounded-card bg-workshop-100 px-4 py-2 text-sm text-workshop-800">
            Showing help for <strong>{activeCategory.name}</strong>.
          </p>
        )}
      </PageHeader>

      {/* Filter */}
      <div className="mb-6 max-w-sm">
        <label className="block">
          <span className="font-medium text-workshop-900">Filter by category</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input mt-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="text-workshop-800">No local resources listed for this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-workshop-900">{r.name}</h2>
                  <p className="text-sm font-medium text-brand-700">{r.type}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-workshop-800">
                📍 {r.city}
                {r.area ? ` · ${r.area}` : ""}
              </p>
              {r.notes && <p className="mt-2 text-sm text-workshop-800">{r.notes}</p>}
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/[^\d]/g, "")}`} className="text-brand-700 underline">
                    📞 {r.phone}
                  </a>
                )}
                {r.website && (
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-workshop-800">
        These are placeholder listings for the demo. Replace with verified local businesses before launch.
      </p>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <ResourcesContent />
    </Suspense>
  );
}
