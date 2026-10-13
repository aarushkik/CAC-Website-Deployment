"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { categories, items } from "@/lib/data";
import { CategoryIcon } from "./CategoryIcon";

/** Springs used across the app, so everything moves with the same feel. */
export const spring = { type: "spring", stiffness: 420, damping: 30 } as const;
export const soft = { type: "spring", stiffness: 220, damping: 26 } as const;

/** Children come in one after another. Wrap each child in <StaggerItem>. */
export function Stagger({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="shown"
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }: HTMLMotionProps<"div">) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: still ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 },
        shown: { opacity: 1, y: 0, scale: 1, transition: soft },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Fades and lifts one block in when the page opens. */
export function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? { opacity: 0 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...soft, delay }}
    >
      {children}
    </motion.div>
  );
}

/** The big category tiles on the home page and at the top of the picker. */
export function CategoryTiles({ compact = false }: { compact?: boolean }) {
  return (
    <Stagger className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-4"} sm:gap-4`}>
      {categories.map((category) => {
        const count = items.filter((item) => item.categoryId === category.id).length;
        return (
          <StaggerItem key={category.id} whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }} transition={spring}>
            <Link
              href={`/choose-item?category=${category.id}`}
              className="tile group flex h-full flex-col items-start p-4 hover:translate-y-0 sm:p-5"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <CategoryIcon name={category.icon} className="h-8 w-8" />
              </span>
              <span className="mt-3 font-bold leading-tight text-workshop-900">{category.name}</span>
              <span className="mt-0.5 text-sm text-workshop-600">{count} repairs</span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
