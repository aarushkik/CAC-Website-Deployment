"use client";

import { Cog6ToothIcon, WrenchIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";

/** Section heading with a strip of tape measure under it. */
export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div>
      <h2 id={id} className="display text-3xl text-workshop-900 sm:text-4xl">
        {children}
      </h2>
      <div className="tape-measure mt-2" aria-hidden="true" />
    </div>
  );
}

/** A number shown as a mechanical counter, one box per digit. */
export function Counter({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`display inline-flex gap-[0.08em] leading-none ${className}`} aria-label={String(value)}>
      {String(value)
        .split("")
        .map((digit, i) => (
          <span key={i} className="counter-digit" aria-hidden="true">
            {digit}
          </span>
        ))}
    </span>
  );
}

/** How hard a guide is, as wrenches: one for a beginner job, two when it takes some experience. */
export function Wrenches({ difficulty }: { difficulty: string }) {
  const level = difficulty === "Beginner" ? 1 : 2;
  return (
    <span className="inline-flex items-center gap-0.5" title={difficulty} aria-label={difficulty}>
      {[1, 2, 3].map((n) => (
        <WrenchIcon
          key={n}
          className={`h-4 w-4 ${n <= level ? "fill-brand-600 text-brand-600" : "fill-workshop-200 text-workshop-200"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Slowly turning gears and a wrench behind the home screen's headline. Decoration only. */
export function ToolsBackdrop() {
  const still = useReducedMotion();
  const turn = (seconds: number, direction = 1) =>
    still ? {} : { animate: { rotate: 360 * direction }, transition: { duration: seconds, repeat: Infinity, ease: "linear" as const } };
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-workshop-300" aria-hidden="true">
      <motion.div className="absolute -left-28 -top-24 opacity-40" {...turn(60)}>
        <Cog6ToothIcon className="h-56 w-56" strokeWidth={0.6} />
      </motion.div>
      <motion.div className="absolute left-[4.5rem] top-[5.5rem] opacity-30" {...turn(40, -1)}>
        <Cog6ToothIcon className="h-28 w-28" strokeWidth={0.8} />
      </motion.div>
      <WrenchIcon className="absolute -bottom-6 right-6 h-44 w-44 rotate-[28deg] opacity-35" strokeWidth={0.6} />
      <WrenchScrewdriverIcon className="absolute right-1/3 top-2 hidden h-24 w-24 -rotate-12 opacity-30 sm:block" strokeWidth={0.7} />
    </div>
  );
}
