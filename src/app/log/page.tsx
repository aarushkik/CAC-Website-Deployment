"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { categories } from "@/lib/data";
import { addRepairLogEntry, getRepairLog, removeRepairLogEntry } from "@/lib/storage";
import type { RepairLogEntry } from "@/lib/types";

const outcomeLabels: Record<RepairLogEntry["outcome"], string> = {
  fixed: "✅ Fixed it",
  attempted: "🔧 Attempted",
  "referred-to-pro": "🧰 Went to a pro",
};

export default function RepairLogPage() {
  const [entries, setEntries] = useState<RepairLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [itemName, setItemName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [outcome, setOutcome] = useState<RepairLogEntry["outcome"]>("fixed");
  const [moneySaved, setMoneySaved] = useState("");
  const [wasteAvoided, setWasteAvoided] = useState("");
  const [notes, setNotes] = useState("");

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
    // Reset form
    setItemName("");
    setCategoryId("");
    setOutcome("fixed");
    setMoneySaved("");
    setWasteAvoided("");
    setNotes("");
  }

  function handleDelete(id: string) {
    setEntries(removeRepairLogEntry(id));
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
              <Field label="Money saved ($)">
                <input
                  type="number"
                  min="0"
                  value={moneySaved}
                  onChange={(e) => setMoneySaved(e.target.value)}
                  placeholder="0"
                  className="input"
                />
              </Field>
              <Field label="Waste avoided (lbs)">
                <input
                  type="number"
                  min="0"
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

            <Button type="submit">Save to log</Button>
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
            <Card>
              <p className="text-workshop-800">
                No repairs logged yet. Add your first one to start tracking your impact.
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
                        className="rounded-lg px-2 py-1 text-sm text-danger hover:bg-danger/10"
                        aria-label={`Delete ${entry.itemName}`}
                      >
                        Delete
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
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-medium text-workshop-900">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
