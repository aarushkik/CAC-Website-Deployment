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

/** Replaces the whole log, used by undo, restore-from-backup and the demo data. */
export function replaceRepairLog(entries: RepairLogEntry[]): RepairLogEntry[] {
  saveRepairLog(entries);
  return entries;
}

/** Checks that a restored backup really is a list of log entries. */
export function parseRepairLog(text: string): RepairLogEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;
    const outcomes = ["fixed", "attempted", "referred-to-pro"];
    const good = parsed.every(
      (e) =>
        e &&
        typeof e.id === "string" &&
        typeof e.itemName === "string" &&
        !Number.isNaN(Date.parse(e.date)) &&
        outcomes.includes(e.outcome),
    );
    if (!good) return null;
    return parsed.map((e) => ({
      ...e,
      moneySaved: Number(e.moneySaved) || 0,
      wasteAvoidedLbs: Number(e.wasteAvoidedLbs) || 0,
    })) as RepairLogEntry[];
  } catch {
    return null;
  }
}

// ---- which steps of a guide are ticked off, so a repair can be picked up again later

const GUIDE_KEY = "fixit-wa03-guide-progress";

export function getGuideProgress(guideId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(window.localStorage.getItem(GUIDE_KEY) ?? "{}");
    return Array.isArray(all[guideId]) ? all[guideId] : [];
  } catch {
    return [];
  }
}

export function saveGuideProgress(guideId: string, doneSteps: number[]): void {
  if (typeof window === "undefined") return;
  let all: Record<string, number[]> = {};
  try {
    all = JSON.parse(window.localStorage.getItem(GUIDE_KEY) ?? "{}");
  } catch {
    all = {};
  }
  if (doneSteps.length === 0) delete all[guideId];
  else all[guideId] = doneSteps;
  window.localStorage.setItem(GUIDE_KEY, JSON.stringify(all));
}

/** Every guide that has ticked steps: { guide id: [step numbers] }. */
export function getAllGuideProgress(): Record<string, number[]> {
  if (typeof window === "undefined") return {};
  try {
    const all = JSON.parse(window.localStorage.getItem(GUIDE_KEY) ?? "{}");
    return all && typeof all === "object" ? all : {};
  } catch {
    return {};
  }
}

// ---- my toolbox: the tools the user has ticked as owned, shared by every guide

const TOOLS_KEY = "fixit-wa03-toolbox";

/** "Needle and thread (optional)" and "Needle" should count as the same tool. */
export function toolKey(tool: string): string {
  return tool.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9 ]/g, "").trim().split(/\s+/).slice(0, 2).join(" ");
}

export function getToolbox(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(TOOLS_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveToolbox(keys: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOOLS_KEY, JSON.stringify(keys));
}
