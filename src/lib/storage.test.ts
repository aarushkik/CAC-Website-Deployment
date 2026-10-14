import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addRepairLogEntry,
  clearRepairLog,
  createId,
  getRepairLog,
  importRepairLog,
  removeRepairLogEntry,
  restoreRepairLogEntries,
  sanitizeEntry,
  StorageUnavailableError,
  toCSV,
  toJSONBackup,
  updateRepairLogEntry,
} from "./storage";

/** A tiny in-memory stand-in for the browser's window.localStorage. */
function installFakeWindow(options: { failWrites?: boolean } = {}) {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (options.failWrites) throw new Error("QuotaExceededError");
      store.set(key, value);
    },
    removeItem: (key: string) => store.delete(key),
  };
  vi.stubGlobal("window", {
    localStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
  return store;
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("without a browser", () => {
  it("reads an empty log on the server", () => {
    expect(getRepairLog()).toEqual([]);
  });
});

describe("repair log", () => {
  beforeEach(() => {
    installFakeWindow();
  });

  it("adds, updates, removes, and restores entries", () => {
    const first = addRepairLogEntry({ itemName: "Chair", outcome: "fixed", moneySaved: 50, wasteAvoidedLbs: 15 });
    const second = addRepairLogEntry({
      itemName: "Zipper",
      outcome: "attempted",
      moneySaved: 0,
      wasteAvoidedLbs: 1,
      date: new Date(2020, 0, 1).toISOString(),
    });
    expect(getRepairLog().map((e) => e.id)).toEqual([first.id, second.id]);

    updateRepairLogEntry(second.id, { outcome: "fixed", moneySaved: 40 });
    expect(getRepairLog()[1]).toMatchObject({ outcome: "fixed", moneySaved: 40 });

    const removed = removeRepairLogEntry(first.id)!;
    expect(getRepairLog()).toHaveLength(1);
    restoreRepairLogEntries([removed]);
    expect(getRepairLog()).toHaveLength(2);

    const cleared = clearRepairLog();
    expect(cleared).toHaveLength(2);
    expect(getRepairLog()).toEqual([]);
  });

  it("returns the same array until the log changes", () => {
    addRepairLogEntry({ itemName: "Lamp", outcome: "fixed", moneySaved: 1, wasteAvoidedLbs: 1 });
    expect(getRepairLog()).toBe(getRepairLog());
  });

  it("survives corrupted storage", () => {
    const store = installFakeWindow();
    store.set("fixit-wa03-repair-log", "{not json");
    expect(getRepairLog()).toEqual([]);
    store.set("fixit-wa03-repair-log", JSON.stringify([{ itemName: "" }, 5, null, { itemName: "Fan", moneySaved: "12.5" }]));
    expect(getRepairLog()).toHaveLength(1);
    expect(getRepairLog()[0].moneySaved).toBe(12.5);
  });

  it("imports a backup and skips entries it already has", () => {
    const existing = addRepairLogEntry({ itemName: "Bike", outcome: "fixed", moneySaved: 10, wasteAvoidedLbs: 2 });
    const backup = JSON.parse(toJSONBackup([existing, { ...existing, id: "new-one", itemName: "Toaster" }]));
    expect(importRepairLog(backup)).toEqual({ added: 1, skipped: 1 });
    expect(() => importRepairLog({ nope: true })).toThrow();
  });

  it("reports when the browser blocks saving", () => {
    installFakeWindow({ failWrites: true });
    expect(() =>
      addRepairLogEntry({ itemName: "Chair", outcome: "fixed", moneySaved: 1, wasteAvoidedLbs: 1 }),
    ).toThrow(StorageUnavailableError);
  });
});

describe("sanitizeEntry", () => {
  it("rejects entries without a name and fixes bad numbers and outcomes", () => {
    expect(sanitizeEntry({ itemName: "   " })).toBeNull();
    expect(sanitizeEntry("hello")).toBeNull();
    expect(
      sanitizeEntry({ itemName: "Lamp", moneySaved: -4, wasteAvoidedLbs: "abc", outcome: "exploded" }),
    ).toMatchObject({ moneySaved: 0, wasteAvoidedLbs: 0, outcome: "fixed" });
  });
});

describe("createId", () => {
  it("works without crypto.randomUUID (plain-HTTP testing on a phone)", () => {
    vi.stubGlobal("crypto", {});
    const a = createId();
    const b = createId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(5);
  });
});

describe("toCSV", () => {
  it("quotes commas and neutralizes spreadsheet formulas", () => {
    const csv = toCSV([
      {
        id: "1",
        date: "2026-10-01T12:00:00.000Z",
        itemName: '=HYPERLINK("x")',
        outcome: "fixed",
        moneySaved: 5,
        wasteAvoidedLbs: 1,
        notes: "glue, clamps",
      },
    ]);
    const row = csv.split("\r\n")[1];
    expect(row).toContain(`"'=HYPERLINK(""x"")"`);
    expect(row).toContain('"glue, clamps"');
  });
});
