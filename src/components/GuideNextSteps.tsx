"use client";

import { useSearchParams } from "next/navigation";
import { Calculator, CircleCheck, LifeBuoy } from "lucide-react";
import { Button } from "@/components/Button";
import { getItem } from "@/lib/data";
import type { Item } from "@/lib/types";

/**
 * What to do after a guide. Knows which item you came from (`?item=`) so the
 * log and calculator open already filled in.
 */
export function GuideNextSteps({ items }: { items: Item[] }) {
  const searchParams = useSearchParams();
  const fromUrl = getItem(searchParams.get("item"));
  // Only trust an item that actually uses this guide.
  const item = fromUrl && items.some((i) => i.id === fromUrl.id) ? fromUrl : items.length === 1 ? items[0] : undefined;

  const logHref = item ? `/log?item=${item.id}&outcome=fixed` : "/log?outcome=fixed";
  const calculatorHref = item ? `/calculator?item=${item.id}` : "/calculator";
  const helpHref = item ? `/resources?category=${item.categoryId}` : "/resources";

  return (
    <div className="no-print grid gap-3 sm:grid-cols-3">
      <Button href={logHref} size="lg" className="sm:col-span-1">
        <CircleCheck className="h-5 w-5" aria-hidden="true" />
        I fixed it — log it
      </Button>
      <Button href={calculatorHref} variant="secondary" size="lg">
        <Calculator className="h-5 w-5" aria-hidden="true" />
        Fix or replace?
      </Button>
      <Button href={helpHref} variant="secondary" size="lg">
        <LifeBuoy className="h-5 w-5" aria-hidden="true" />
        It didn&apos;t work
      </Button>
    </div>
  );
}
