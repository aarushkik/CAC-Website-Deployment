"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { countForCommunity } from "@/components/CommunityImpact";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { categories, itemFromParams } from "@/lib/data";
import { estimateSavings } from "@/lib/impact";
import {
  addRepairLogEntry,
  getRepairLog,
  parseRepairLog,
  removeRepairLogEntry,
  replaceRepairLog,
} from "@/lib/storage";
import type { RepairLogEntry } from "@/lib/types";

const outcomeLabels: Record<RepairLogEntry["outcome"], string> = {
  fixed: "Fixed it",
  attempted: "Attempted",
  "referred-to-pro": "Went to a pro",
};

const OUTCOMES: RepairLogEntry["outcome"][] = ["fixed", "attempted", "referred-to-pro"];

function RepairLogContent() {
  const [entries, setEntries] = useState<RepairLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Coming from a guide or a result, the form is filled in from that item's estimates.
  const searchParams = useSearchParams();
  const fromItem = itemFromParams(searchParams);
  const wantedOutcome = searchParams.get("outcome") as RepairLogEntry["outcome"] | null;
  const startOutcome = wantedOutcome && OUTCOMES.includes(wantedOutcome) ? wantedOutcome : "fixed";
  const startSaved = fromItem && startOutcome === "fixed" ? estimateSavings(fromItem) : 0;
  const startWaste = fromItem && startOutcome === "fixed" ? fromItem.estimatedWeightLbs ?? 0 : 0;

  // Form state
  const [itemName, setItemName] = useState(fromItem?.name ?? "");
  const [categoryId, setCategoryId] = useState(fromItem?.categoryId ?? "");
  const [outcome, setOutcome] = useState<RepairLogEntry["outcome"]>(startOutcome);
  const [moneySaved, setMoneySaved] = useState(startSaved ? String(startSaved) : "");
  const [wasteAvoided, setWasteAvoided] = useState(startWaste ? String(startWaste) : "");
  const [notes, setNotes] = useState("");
  const [prefilled, setPrefilled] = useState(Boolean(fromItem));

  // What is shown in the bar at the bottom after a save, delete or restore.
  const [message, setMessage] = useState<{ text: string; undo?: RepairLogEntry[] } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function say(text: string, undo?: RepairLogEntry[]) {
    setMessage({ text, undo });
    window.setTimeout(() => setMessage((m) => (m && m.text === text ? null : m)), 7000);
  }

  // localStorage is only available in the browser, so load after mount.
  useEffect(() => {
    setEntries(getRepairLog());
    setLoaded(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemName.trim()) return;
    const updated = addRepairLogEntry({
      itemName: itemName.trim(),
      categoryId: categoryId || undefined,
      outcome,
      moneySaved: parseFloat(moneySaved) || 0,
      wasteAvoidedLbs: parseFloat(wasteAvoided) || 0,
      notes: notes.trim() || undefined,
    });
    setEntries(updated);
    // a fixed item also counts toward the shared total (if that is switched on)
    if (outcome === "fixed") countForCommunity(parseFloat(moneySaved) || 0, parseFloat(wasteAvoided) || 0, categoryId);
    say(`Saved "${itemName.trim()}" to your log.`);
    // Reset form
    setPrefilled(false);
    setItemName("");
    setCategoryId("");
    setOutcome("fixed");
    setMoneySaved("");
    setWasteAvoided("");
    setNotes("");
  }

  function handleDelete(id: string) {
    const before = entries;
    const gone = entries.find((e) => e.id === id);
    setEntries(removeRepairLogEntry(id));
    say(`Deleted "${gone?.itemName ?? "entry"}".`, before);
  }

  /** Saves the whole log as a file, so it can be moved to another phone or laptop. */
  function downloadBackup() {
    const file = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "fixit-repair-log.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function restoreBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const restored = parseRepairLog(await file.text());
    if (!restored) {
      say("That file is not a FixIt repair log, nothing was changed.");
      return;
    }
    // Entries already in the log are kept, the backup only adds what is missing.
    const known = new Set(entries.map((entry) => entry.id));
    const added = restored.filter((entry) => !known.has(entry.id));
    const merged = [...entries, ...added].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    const before = entries;
    setEntries(replaceRepairLog(merged));
    say(`Added ${added.length} ${added.length === 1 ? "repair" : "repairs"} from the backup.`, before);
  }

  return (
    <div>
      <PageHeader
        title="Repair log"
        intro="Keep a record of your repairs. Your log powers the impact dashboard and stays on this device."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add form */}
        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">Log a repair</h2>
          {fromItem && prefilled && (
            <p className="mt-2 rounded-card bg-brand-50 px-3 py-2 text-sm text-brand-800">
              Filled in from <strong>{fromItem.name}</strong>. The numbers are estimates, change
              them to what it really cost you.
            </p>
          )}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="What did you fix?">
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Kitchen chair"
                className="input"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
                  <option value="">Not sure</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Outcome">
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as RepairLogEntry["outcome"])}
                  className="input"
                >
                  <option value="fixed">Fixed it</option>
                  <option value="attempted">Attempted</option>
                  <option value="referred-to-pro">Went to a pro</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Money saved ($)" hint="Price of a new one minus what the fix cost">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={moneySaved}
                  onChange={(e) => setMoneySaved(e.target.value)}
                  placeholder="0"
                  className="input"
                />
              </Field>
              <Field label="Waste avoided (lbs)" hint="Roughly what the item weighs">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={wasteAvoided}
                  onChange={(e) => setWasteAvoided(e.target.value)}
                  placeholder="0"
                  className="input"
                />
              </Field>
            </div>

            <Field label="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="What worked, what to remember next time…"
                className="input"
              />
            </Field>

            <Button type="submit" className="w-full sm:w-auto">
              <Icon name="check" size={18} />
              Save to log
            </Button>
          </form>
        </Card>

        {/* Entries */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-workshop-900">Your repairs</h2>
            <Button href="/dashboard" variant="ghost">
              View impact →
            </Button>
          </div>

          {!loaded ? (
            <p className="text-workshop-800">Loading…</p>
          ) : entries.length === 0 ? (
            <Card className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-workshop-100 text-workshop-600">
                <Icon name="list" />
              </span>
              <p className="mt-3 font-semibold text-workshop-900">No repairs logged yet</p>
              <p className="mt-1 text-sm text-workshop-800">
                Add your first one to start counting money saved and waste avoided.
              </p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-workshop-900">{entry.itemName}</p>
                        <p className="text-sm text-workshop-800">
                          {outcomeLabels[entry.outcome]} ·{" "}
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="-mr-2 -mt-1 rounded-full p-2.5 text-workshop-500 transition hover:bg-danger/10 hover:text-danger"
                        aria-label={`Delete ${entry.itemName}`}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      {entry.moneySaved > 0 && (
                        <span className="rounded-full bg-safe/10 px-3 py-1 font-medium text-safe">
                          ${entry.moneySaved.toFixed(0)} saved
                        </span>
                      )}
                      {entry.wasteAvoidedLbs > 0 && (
                        <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">
                          {entry.wasteAvoidedLbs} lbs kept out of landfill
                        </span>
                      )}
                    </div>
                    {entry.notes && <p className="mt-2 text-sm text-workshop-800">{entry.notes}</p>}
                  </Card>
                </li>
              ))}
            </ul>
          )}

          {loaded && (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {entries.length > 0 && (
                <button type="button" onClick={downloadBackup} className="min-h-[2.75rem] font-semibold text-brand-700 hover:underline">
                  Download a backup
                </button>
              )}
              <button type="button" onClick={() => fileInput.current?.click()} className="min-h-[2.75rem] font-semibold text-brand-700 hover:underline">
                Restore from a backup
              </button>
              <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={restoreBackup} />
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-md animate-pop items-center justify-between gap-3 rounded-card border border-white/10 bg-[#2f271d] px-4 py-3 text-sm text-white shadow-lift md:bottom-6"
        >
          <span>{message.text}</span>
          {message.undo ? (
            <button
              type="button"
              className="flex-none font-bold text-[#b6d6ff] underline"
              onClick={() => {
                setEntries(replaceRepairLog(message.undo!));
                setMessage(null);
              }}
            >
              Undo
            </button>
          ) : (
            <Link href="/dashboard" className="flex-none font-bold text-[#b6d6ff] underline">
              See impact
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function RepairLogPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <RepairLogContent />
    </Suspense>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-medium text-workshop-900">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-workshop-600">{hint}</span>}
    </label>
  );
}
