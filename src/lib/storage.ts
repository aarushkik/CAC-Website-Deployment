import type { RepairLogEntry, RepairOutcome } from "./types";

/**
 * Repair log persistence. For the MVP this uses localStorage so it works
 * offline with no backend. It can be swapped for Firebase/Supabase later
 * without changing the calling components.
 */

const STORAGE_KEY = "fixit-wa03-repair-log";
/** Fired on this tab after every write; `storage` covers other tabs. */
const CHANGE_EVENT = "fixit-wa03:repair-log-change";

const OUTCOMES: RepairOutcome[] = ["fixed", "attempted", "referred-to-pro"];
const MAX_NAME_LENGTH = 120;
const MAX_NOTES_LENGTH = 2000;

/** Stable empty list so React's useSyncExternalStore doesn't loop. */
const EMPTY: RepairLogEntry[] = [];

/** Thrown when the browser refuses to save (private mode, full storage, …). */
export class StorageUnavailableError extends Error {
  constructor() {
    super(
      "Your browser didn't let us save. Private browsing or full storage can block saving — try a regular window.",
    );
    this.name = "StorageUnavailableError";
  }
}

/** New entries don't have an id yet, and the date defaults to now. */
export type NewRepairLogEntry = Omit<RepairLogEntry, "id" | "date"> & { date?: string };

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Random id. `crypto.randomUUID` only exists on HTTPS and localhost, so
 * testing on a phone over the local network needs the fallback.
 */
export function createId(): string {
  const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    try {
      return cryptoApi.randomUUID();
    } catch {
      // Fall through to the non-crypto id below.
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function toAmount(value: unknown): number {
  const number = typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : NaN;
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.round(Math.min(number, 1_000_000) * 100) / 100;
}

function optionalString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

/**
 * Turns anything (old data, imported files) into a valid entry, or null if
 * it can't be used. Never trust what comes out of storage.
 */
export function sanitizeEntry(raw: unknown): RepairLogEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;

  const itemName = optionalString(record.itemName, MAX_NAME_LENGTH);
  if (!itemName) return null;

  const parsedDate = typeof record.date === "string" ? Date.parse(record.date) : NaN;
  const outcome = OUTCOMES.includes(record.outcome as RepairOutcome)
    ? (record.outcome as RepairOutcome)
    : "fixed";

  return {
    id: optionalString(record.id, 100) ?? createId(),
    date: new Date(Number.isNaN(parsedDate) ? Date.now() : parsedDate).toISOString(),
    itemName,
    itemId: optionalString(record.itemId, 100),
    categoryId: optionalString(record.categoryId, 100),
    outcome,
    moneySaved: toAmount(record.moneySaved),
    wasteAvoidedLbs: toAmount(record.wasteAvoidedLbs),
    notes: optionalString(record.notes, MAX_NOTES_LENGTH),
  };
}

/** Newest first. */
export function sortEntries(entries: RepairLogEntry[]): RepairLogEntry[] {
  return [...entries].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

function parseLog(raw: string | null): RepairLogEntry[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const seen = new Set<string>();
    const entries: RepairLogEntry[] = [];
    for (const item of parsed) {
      const entry = sanitizeEntry(item);
      if (entry && !seen.has(entry.id)) {
        seen.add(entry.id);
        entries.push(entry);
      }
    }
    return sortEntries(entries);
  } catch {
    return EMPTY;
  }
}

// Cache so repeated reads return the same array until the data changes.
let cachedRaw: string | null | undefined;
let cachedEntries: RepairLogEntry[] = EMPTY;

/** Reads all repair log entries, newest first. Safe to call on the server. */
export function getRepairLog(): RepairLogEntry[] {
  const storage = getStorage();
  if (!storage) return EMPTY;
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedEntries = parseLog(raw);
  }
  return cachedEntries;
}

/** Server snapshot for useSyncExternalStore. */
export function getServerRepairLog(): RepairLogEntry[] {
  return EMPTY;
}

/** Overwrites the whole log. Throws StorageUnavailableError if saving fails. */
export function saveRepairLog(entries: RepairLogEntry[]): RepairLogEntry[] {
  const storage = getStorage();
  if (!storage) throw new StorageUnavailableError();
  const sorted = sortEntries(entries);
  const raw = JSON.stringify(sorted);
  try {
    storage.setItem(STORAGE_KEY, raw);
  } catch {
    throw new StorageUnavailableError();
  }
  cachedRaw = raw;
  cachedEntries = sorted.length ? sorted : EMPTY;
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return cachedEntries;
}

/** Adds a new entry and returns it. */
export function addRepairLogEntry(input: NewRepairLogEntry): RepairLogEntry {
  const entry = sanitizeEntry({
    ...input,
    id: createId(),
    date: input.date ?? new Date().toISOString(),
  });
  if (!entry) throw new Error("Add a name for the item you repaired.");
  saveRepairLog([entry, ...getRepairLog()]);
  return entry;
}

/** Updates an entry in place and returns the new version. */
export function updateRepairLogEntry(
  id: string,
  changes: Partial<NewRepairLogEntry>,
): RepairLogEntry | null {
  const current = getRepairLog();
  const existing = current.find((entry) => entry.id === id);
  if (!existing) return null;
  const updated = sanitizeEntry({ ...existing, ...changes, id });
  if (!updated) throw new Error("Add a name for the item you repaired.");
  saveRepairLog(current.map((entry) => (entry.id === id ? updated : entry)));
  return updated;
}

/** Removes an entry and returns it, so the caller can offer Undo. */
export function removeRepairLogEntry(id: string): RepairLogEntry | null {
  const current = getRepairLog();
  const removed = current.find((entry) => entry.id === id) ?? null;
  if (removed) saveRepairLog(current.filter((entry) => entry.id !== id));
  return removed;
}

/** Puts back entries (Undo after delete or clear). */
export function restoreRepairLogEntries(entries: RepairLogEntry[]): void {
  const current = getRepairLog();
  const ids = new Set(current.map((entry) => entry.id));
  saveRepairLog([...current, ...entries.filter((entry) => !ids.has(entry.id))]);
}

/** Deletes everything and returns what was there, for Undo. */
export function clearRepairLog(): RepairLogEntry[] {
  const previous = getRepairLog();
  saveRepairLog([]);
  return previous;
}

/**
 * Imports a backup made by `toJSONBackup` (or a plain array of entries).
 * Entries already in the log (same id) are skipped.
 */
export function importRepairLog(data: unknown): { added: number; skipped: number } {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { entries?: unknown }).entries)
      ? (data as { entries: unknown[] }).entries
      : null;
  if (!list) {
    throw new Error("That file isn't a FixIt repair log backup.");
  }

  const current = getRepairLog();
  const ids = new Set(current.map((entry) => entry.id));
  const incoming: RepairLogEntry[] = [];
  let skipped = 0;
  for (const raw of list) {
    const entry = sanitizeEntry(raw);
    if (!entry || ids.has(entry.id)) {
      skipped += 1;
      continue;
    }
    ids.add(entry.id);
    incoming.push(entry);
  }
  if (incoming.length) saveRepairLog([...current, ...incoming]);
  return { added: incoming.length, skipped };
}

/** A backup file that `importRepairLog` can read back. */
export function toJSONBackup(entries: RepairLogEntry[]): string {
  return JSON.stringify(
    { app: "fixit-wa03", version: 1, exportedAt: new Date().toISOString(), entries },
    null,
    2,
  );
}

function csvCell(value: string | number | undefined): string {
  const text = value === undefined ? "" : String(value);
  // Quote everything that needs it, and neutralize spreadsheet formulas.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Spreadsheet-friendly export. */
export function toCSV(
  entries: RepairLogEntry[],
  categoryName: (id: string | undefined) => string = (id) => id ?? "",
): string {
  const header = ["Date", "Item", "Category", "Outcome", "Money saved (USD)", "Waste avoided (lbs)", "Notes"];
  const outcomeLabel: Record<RepairOutcome, string> = {
    fixed: "Fixed",
    attempted: "Attempted",
    "referred-to-pro": "Went to a pro",
  };
  const rows = entries.map((entry) =>
    [
      entry.date.slice(0, 10),
      entry.itemName,
      categoryName(entry.categoryId),
      outcomeLabel[entry.outcome],
      entry.moneySaved,
      entry.wasteAvoidedLbs,
      entry.notes,
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...rows].join("\r\n");
}

/** Calls `onChange` whenever the log changes in this tab or another one. */
export function subscribeToRepairLog(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
