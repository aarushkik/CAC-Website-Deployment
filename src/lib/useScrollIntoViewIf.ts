"use client";

import { useCallback } from "react";

/**
 * Ref callback that scrolls an element into view horizontally when `active`,
 * so the selected chip in a sideways-scrolling row is visible on phones.
 */
export function useScrollIntoViewIf<T extends HTMLElement>(active: boolean) {
  return useCallback(
    (element: T | null) => {
      if (active && element) {
        element.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
      }
    },
    [active],
  );
}
