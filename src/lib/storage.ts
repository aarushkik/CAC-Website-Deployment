import type { RepairLogEntry } from "./types";

/**
 * Repair log persistence. For the MVP this uses localStorage so it works
 * offline with no backend. It can be swapped for Firebase/Supabase later
 * without changing the calling components.
 */

const STORAGE_KEY = "fixit-wa03-repair-log";

/** Reads all repair log entries, newest first. Safe to call on the server. */
export function getRepairLog(): RepairLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RepairLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Overwrites the whole log. Used internally by add/remove helpers. */
function saveRepairLog(entries: RepairLogEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Adds a new entry and returns the updated list (newest first). */
export function addRepairLogEntry(
  entry: Omit<RepairLogEntry, "id" | "date"> & { date?: string },
): RepairLogEntry[] {
  const newEntry: RepairLogEntry = {
    id: crypto.randomUUID(),
    date: entry.date ?? new Date().toISOString(),
    ...entry,
  };
  const updated = [newEntry, ...getRepairLog()];
  saveRepairLog(updated);
  return updated;
}

/** Removes an entry by id and returns the updated list. */
export function removeRepairLogEntry(id: string): RepairLogEntry[] {
  const updated = getRepairLog().filter((e) => e.id !== id);
  saveRepairLog(updated);
  return updated;
}
