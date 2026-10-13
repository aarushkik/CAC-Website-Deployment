"use client";

import { Cog6ToothIcon, WrenchIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

/** A number shown as a mechanical counter, one box per digit. It counts up when it comes into view. */
export function Counter({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });
  const still = useReducedMotion();
  const [shown, setShown] = useState(still ? value : 0);

  useEffect(() => {
    if (!seen || still) {
      if (still) setShown(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (n) => setShown(Math.round(n)),
    });
    return () => controls.stop();
  }, [seen, still, value]);

  // keep the number of boxes fixed while it counts, so nothing jumps around
  const digits = String(shown).padStart(String(value).length, "0").split("");
  return (
    <span ref={ref} className={`display inline-flex gap-[0.08em] leading-none ${className}`} aria-label={String(value)}>
      {digits.map((digit, i) => (
        <span key={i} className="counter-digit" aria-hidden="true">
          {digit}
        </span>
      ))}
    </span>
  );
}

/** A section that slides up into place the first time it is scrolled into view. */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const still = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={still ? { opacity: 0 } : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
    >
      {children}
    </motion.section>
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
