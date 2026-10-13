"use client";

import Link from "next/link";
import { MODELS } from "@/lib/models";
import { Carousel3D } from "./Carousel3D";

/** The models on the home screen's turntable, in order. */
const ON_SHOW = ["toilet", "metal-toolbox", "sedan", "screwdriver", "washer", "plunger", "toaster", "rubber-boots", "kitchenblender", "tire-pump", "frying-pan", "drill-01"];

/**
 * The picture next to the search on the home screen: a turntable of 3D models
 * from the guides that turns by itself and can be spun by hand.
 */
export function HomeShowcase() {
  const models = ON_SHOW.flatMap((id) => MODELS.find((m) => m.id === id) ?? []);
  return (
    <div className="plate rounded-[1.5rem] border-2 border-workshop-900 bg-surface p-5 shadow-lift sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="eyebrow whitespace-nowrap">On the workbench</p>
        <Link href="/models" className="text-sm font-bold text-brand-700 hover:underline">
          All {MODELS.length} in 3D
        </Link>
      </div>
      <Carousel3D models={models} />
    </div>
  );
}
