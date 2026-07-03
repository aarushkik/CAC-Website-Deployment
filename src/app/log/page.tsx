"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { categories } from "@/lib/data";
import { addRepairLogEntry, getRepairLog, removeRepairLogEntry } from "@/lib/storage";
import type { RepairLogEntry } from "@/lib/types";
import { Mascot } from "@/components/Mascot";
import {
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  BriefcaseIcon,
  TrashIcon,
  PlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

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
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Repair log"
        intro="Keep a record of your repairs. Your log powers the impact dashboard and stays private on this device."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add form */}
        <Card className="animate-slide-up delay-100">
          <div className="flex items-center gap-2 mb-4">
            <PlusIcon className="h-5 w-5 text-accent-400" />
            <h2 className="text-lg font-bold text-white">Log a repair</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)} 
                  className="input"
                >
                  <option value="" className="bg-dark-950">Not sure</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-dark-950">
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
                  <option value="fixed" className="bg-dark-950">Fixed it</option>
                  <option value="attempted" className="bg-dark-950">Attempted</option>
                  <option value="referred-to-pro" className="bg-dark-950">Went to a pro</option>
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

            <Button type="submit" className="w-full">Save to log</Button>
          </form>
        </Card>

        {/* Entries */}
        <div className="animate-slide-up delay-150">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your repairs</h2>
            <Button href="/dashboard" variant="ghost">
              <ChartBarIcon className="h-4.5 w-4.5" />
              View impact
            </Button>
          </div>

          {!loaded ? (
            <div className="text-center py-12 text-slate-400 animate-pulse font-medium">Loading…</div>
          ) : entries.length === 0 ? (
            <Card className="border-dashed border-white/5 bg-dark-850/20 text-center py-10 flex flex-col items-center justify-center space-y-4">
              <div className="flex flex-col items-center space-y-2 opacity-50">
                <Mascot size="sm" variant="notes" />
                <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-500">No logged repairs</span>
              </div>
              <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
                No repairs logged yet. Add your first fix to start tracking your environmental impact!
              </p>
            </Card>
          ) : (
            <ul className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {entries.map((entry, idx) => {
                const OutcomeIcon = 
                  entry.outcome === "fixed" 
                    ? CheckCircleIcon 
                    : entry.outcome === "attempted" 
                      ? WrenchScrewdriverIcon 
                      : BriefcaseIcon;
                
                const outcomeColors = {
                  fixed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  attempted: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                  "referred-to-pro": "text-sky-400 bg-sky-500/10 border-sky-500/20",
                };

                const outcomeText = {
                  fixed: "Fixed it",
                  attempted: "Attempted",
                  "referred-to-pro": "Went to pro",
                };

                return (
                  <li key={entry.id} className={`animate-scale-in delay-${idx * 50}`}>
                    <Card className="p-4 relative group">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-white text-base leading-tight mb-1">{entry.itemName}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-2xs font-bold uppercase tracking-wider ${outcomeColors[entry.outcome]}`}>
                              <OutcomeIcon className="h-3.5 w-3.5" />
                              {outcomeText[entry.outcome]}
                            </span>
                            <span className="text-slate-400 font-medium">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                          aria-label={`Delete ${entry.itemName}`}
                        >
                          <TrashIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {(entry.moneySaved > 0 || entry.wasteAvoidedLbs > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {entry.moneySaved > 0 && (
                            <span className="rounded-full bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 font-bold text-emerald-400">
                              ${entry.moneySaved.toFixed(0)} saved
                            </span>
                          )}
                          {entry.wasteAvoidedLbs > 0 && (
                            <span className="rounded-full bg-accent-500/5 border border-accent-500/10 px-3 py-1 font-bold text-accent-400">
                              {entry.wasteAvoidedLbs} lbs kept out of landfill
                            </span>
                          )}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2.5">
                          {entry.notes}
                        </p>
                      )}
                    </Card>
                  </li>
                );
              })}
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
      <span className="font-bold text-slate-300 text-sm">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
