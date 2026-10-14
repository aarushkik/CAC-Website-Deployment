"use client";

import { useSyncExternalStore } from "react";
import { getRepairLog, getServerRepairLog, subscribeToRepairLog } from "./storage";
import type { RepairLogEntry } from "./types";

const noopSubscribe = () => () => {};

/**
 * The repair log, kept in sync across components and browser tabs.
 * `ready` is false during server rendering and the first client paint,
 * so pages can avoid flashing an empty state before storage is read.
 */
export function useRepairLog(): { entries: RepairLogEntry[]; ready: boolean } {
  const entries = useSyncExternalStore(subscribeToRepairLog, getRepairLog, getServerRepairLog);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return { entries, ready };
}
