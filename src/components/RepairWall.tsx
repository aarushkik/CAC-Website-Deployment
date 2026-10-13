"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getCategory } from "@/lib/data";
import type { RepairLogEntry } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

const LOOK: Record<RepairLogEntry["outcome"], { tile: string; word: string }> = {
  fixed: { tile: "border-safe bg-safe/10 text-safe", word: "Fixed" },
  attempted: { tile: "border-workshop-300 bg-workshop-100 text-workshop-600", word: "Tried" },
  "referred-to-pro": { tile: "border-caution bg-caution/10 text-caution", word: "To a pro" },
};

/**
 * Every logged repair as a tile on a pegboard, oldest first, so the wall fills
 * up as you fix things. The dashed tiles are the empty hooks up to the next
 * five.
 */
export function RepairWall({ entries }: { entries: RepairLogEntry[] }) {
  const still = useReducedMotion();
  const oldestFirst = [...entries].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const hooks = (5 - (oldestFirst.length % 5)) % 5 || (oldestFirst.length === 0 ? 5 : 0);
  const toNext = hooks === 0 ? 5 : hooks;

  return (
    <section className="pegboard mt-5 rounded-card border-2 border-workshop-200 p-4 shadow-card sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="display text-2xl text-workshop-900">Your repair wall</h2>
        <p className="text-sm font-medium text-workshop-800">
          {toNext} more to fill the next row
        </p>
      </div>
      <motion.ul
        className="grid grid-cols-3 gap-3 sm:grid-cols-5"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
      >
        {oldestFirst.map((entry) => {
          const look = LOOK[entry.outcome];
          return (
            <motion.li
              key={entry.id}
              variants={{
                hidden: still ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -12 },
                shown: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 380, damping: 18 } },
              }}
              whileHover={still ? undefined : { y: -4, rotate: 1.5 }}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 bg-surface p-2 text-center ${look.tile}`}
              title={`${entry.itemName}, ${new Date(entry.date).toLocaleDateString()}`}
            >
              <CategoryIcon name={getCategory(entry.categoryId ?? "")?.icon} className="h-7 w-7 sm:h-9 sm:w-9" />
              <span className="mt-1 line-clamp-2 text-[11px] font-bold leading-tight text-workshop-900 sm:text-xs">
                {entry.itemName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {entry.moneySaved > 0 ? `$${entry.moneySaved.toFixed(0)}` : look.word}
              </span>
            </motion.li>
          );
        })}
        {Array.from({ length: hooks }, (_, i) => (
          <li
            key={`hook-${i}`}
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-workshop-300 text-2xl font-bold text-workshop-300"
          >
            +
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
