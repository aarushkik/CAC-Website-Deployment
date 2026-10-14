"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Download,
  FileJson,
  FlaskConical,
  Pencil,
  Recycle,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/Toast";
import { logEstimates } from "@/lib/cost";
import { categories, getCategory, getItem, items } from "@/lib/data";
import { downloadText } from "@/lib/download";
import {
  formatDate,
  formatMoney,
  formatWeight,
  fromDateInputValue,
  parseAmount,
  toDateInputValue,
} from "@/lib/format";
import { computeImpact } from "@/lib/impact";
import { isSampleEntry, sampleEntries } from "@/lib/sample";
import {
  addRepairLogEntry,
  clearRepairLog,
  importRepairLog,
  removeRepairLogEntry,
  restoreRepairLogEntries,
  saveRepairLog,
  toCSV,
  toJSONBackup,
  updateRepairLogEntry,
} from "@/lib/storage";
import type { RepairLogEntry, RepairOutcome } from "@/lib/types";
import { useRepairLog } from "@/lib/useRepairLog";

const OUTCOMES: { value: RepairOutcome; label: string; badge: string }[] = [
  { value: "fixed", label: "Fixed it", badge: "bg-safe-soft text-safe-ink border-safe/30" },
  { value: "attempted", label: "Tried it", badge: "bg-caution-soft text-caution-ink border-caution/60" },
  { value: "referred-to-pro", label: "Went to a pro", badge: "bg-brand-50 text-brand-700 border-brand-100" },
];

const catalogItems = items.filter((item) => !item.generic);

interface FormState {
  itemName: string;
  itemId: string;
  categoryId: string;
  outcome: RepairOutcome;
  date: string;
  moneySaved: string;
  wasteAvoided: string;
  notes: string;
}

function emptyForm(): FormState {
  return {
    itemName: "",
    itemId: "",
    categoryId: "",
    outcome: "fixed",
    date: toDateInputValue(),
    moneySaved: "",
    wasteAvoided: "",
    notes: "",
  };
}

/** Builds the starting form from links like /log?item=flat-tire&outcome=fixed. */
function formFromParams(params: URLSearchParams): FormState {
  const form = emptyForm();
  const item = getItem(params.get("item"));
  const outcome = OUTCOMES.find((o) => o.value === params.get("outcome"))?.value ?? "fixed";
  const estimates = logEstimates(item, outcome);
  const saved = params.get("saved") ?? (estimates.saved !== undefined ? String(estimates.saved) : "");
  const waste = params.get("waste") ?? (estimates.waste !== undefined ? String(estimates.waste) : "");

  return {
    ...form,
    itemName: params.get("name") ?? item?.name ?? "",
    itemId: item?.id ?? "",
    categoryId: item?.categoryId ?? getCategory(params.get("category"))?.id ?? "",
    outcome,
    moneySaved: parseAmount(saved) !== undefined && Number(saved) > 0 ? saved : "",
    wasteAvoided: parseAmount(waste) !== undefined && Number(waste) > 0 ? waste : "",
    notes: params.get("notes")?.slice(0, 2000) ?? "",
  };
}

function formFromEntry(entry: RepairLogEntry): FormState {
  return {
    itemName: entry.itemName,
    itemId: entry.itemId ?? "",
    categoryId: entry.categoryId ?? "",
    outcome: entry.outcome,
    date: toDateInputValue(new Date(entry.date)),
    moneySaved: entry.moneySaved ? String(entry.moneySaved) : "",
    wasteAvoided: entry.wasteAvoidedLbs ? String(entry.wasteAvoidedLbs) : "",
    notes: entry.notes ?? "",
  };
}

function RepairLogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { entries, ready } = useRepairLog();
  const [form, setForm] = useState<FormState>(() => formFromParams(new URLSearchParams(searchParams.toString())));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ids = {
    name: useId(),
    category: useId(),
    date: useId(),
    saved: useId(),
    waste: useId(),
    notes: useId(),
    list: useId(),
  };

  const prefilled = Boolean(searchParams.get("item") || searchParams.get("name"));
  const recognized = catalogItems.find((item) => item.name.toLowerCase() === form.itemName.trim().toLowerCase());
  const estimates = logEstimates(recognized, form.outcome);
  const canUseEstimates =
    recognized &&
    (estimates.saved !== undefined || estimates.waste !== undefined) &&
    (String(estimates.saved ?? "") !== form.moneySaved || String(estimates.waste ?? "") !== form.wasteAvoided);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  function onNameChange(value: string) {
    if (nameError && value.trim()) setNameError(false);
    const match = catalogItems.find((item) => item.name.toLowerCase() === value.trim().toLowerCase());
    setForm((previous) => ({
      ...previous,
      itemName: value,
      itemId: match?.id ?? "",
      categoryId: match ? match.categoryId : previous.categoryId,
    }));
  }

  function applyEstimates() {
    setForm((previous) => ({
      ...previous,
      moneySaved: estimates.saved !== undefined ? String(estimates.saved) : previous.moneySaved,
      wasteAvoided: estimates.waste !== undefined ? String(estimates.waste) : previous.wasteAvoided,
    }));
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setNameError(false);
    if (window.location.search) window.history.replaceState(null, "", "/log");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.itemName.trim()) {
      setNameError(true);
      nameRef.current?.focus();
      return;
    }
    const values = {
      itemName: form.itemName.trim(),
      itemId: form.itemId || undefined,
      categoryId: form.categoryId || undefined,
      outcome: form.outcome,
      date: fromDateInputValue(form.date) ?? new Date().toISOString(),
      moneySaved: parseAmount(form.moneySaved) ?? 0,
      wasteAvoidedLbs: parseAmount(form.wasteAvoided) ?? 0,
      notes: form.notes.trim() || undefined,
    };
    try {
      if (editingId) {
        updateRepairLogEntry(editingId, values);
        toast({ message: "Changes saved." });
      } else {
        addRepairLogEntry(values);
        toast({
          message: `Saved “${values.itemName}” to your log.`,
          action: { label: "See impact", onClick: () => router.push("/dashboard") },
        });
      }
      resetForm();
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't save that repair.", tone: "error" });
    }
  }

  function startEdit(entry: RepairLogEntry) {
    setEditingId(entry.id);
    setForm(formFromEntry(entry));
    setNameError(false);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    nameRef.current?.focus({ preventScroll: true });
  }

  function handleDelete(entry: RepairLogEntry) {
    try {
      const removed = removeRepairLogEntry(entry.id);
      if (editingId === entry.id) resetForm();
      if (removed) {
        toast({
          message: `Deleted “${removed.itemName}”.`,
          action: { label: "Undo", onClick: () => restoreRepairLogEntries([removed]) },
        });
      }
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't delete that repair.", tone: "error" });
    }
  }

  function handleClearAll() {
    if (!window.confirm(`Delete all ${entries.length} repairs from this device?`)) return;
    try {
      const previous = clearRepairLog();
      resetForm();
      toast({
        message: "Deleted every repair.",
        action: { label: "Undo", onClick: () => restoreRepairLogEntries(previous) },
      });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't clear the log.", tone: "error" });
    }
  }

  function loadSamples() {
    try {
      saveRepairLog([...entries.filter((entry) => !isSampleEntry(entry)), ...sampleEntries()]);
      toast({ message: "Added 8 sample repairs. Remove them anytime." });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't add samples.", tone: "error" });
    }
  }

  function removeSamples() {
    try {
      const samples = entries.filter(isSampleEntry);
      saveRepairLog(entries.filter((entry) => !isSampleEntry(entry)));
      toast({
        message: "Removed the sample repairs.",
        action: { label: "Undo", onClick: () => restoreRepairLogEntries(samples) },
      });
    } catch (error) {
      toast({ message: error instanceof Error ? error.message : "Couldn't remove samples.", tone: "error" });
    }
  }

  function exportCSV() {
    downloadText(
      `fixit-repair-log-${toDateInputValue()}.csv`,
      toCSV(entries, (id) => getCategory(id)?.name ?? ""),
      "text/csv;charset=utf-8",
    );
  }

  function exportBackup() {
    downloadText(`fixit-repair-log-${toDateInputValue()}.json`, toJSONBackup(entries), "application/json");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error("That file is too big to be a repair log backup.");
      const { added, skipped } = importRepairLog(JSON.parse(await file.text()));
      toast({
        message:
          added === 0
            ? "Nothing new to import — those repairs are already here."
            : `Imported ${added} ${added === 1 ? "repair" : "repairs"}${skipped ? ` (skipped ${skipped})` : ""}.`,
      });
    } catch (error) {
      toast({
        message: error instanceof SyntaxError ? "That file isn't a FixIt backup (.json)." : error instanceof Error ? error.message : "Import failed.",
        tone: "error",
      });
    }
  }

  const totals = computeImpact(entries);
  const hasSamples = entries.some(isSampleEntry);

  return (
    <div>
      <PageHeader
        eyebrow="Repair log"
        title="Your repairs"
        intro="Keep a record of what you fixed. Your log powers the impact dashboard and stays on this device."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Add / edit form */}
        <Card className="lg:sticky lg:top-24">
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="scroll-mt-24">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-ink">
                {editingId ? "Edit repair" : "Log a repair"}
              </h2>
              {prefilled && !editingId && (
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                  Filled in for you
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor={ids.name} className="label">
                  What did you fix?
                </label>
                <input
                  ref={nameRef}
                  id={ids.name}
                  type="text"
                  list={ids.list}
                  value={form.itemName}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder="e.g. Kitchen chair"
                  autoComplete="off"
                  aria-invalid={nameError}
                  aria-describedby={nameError ? `${ids.name}-error` : undefined}
                  className="input mt-1"
                />
                <datalist id={ids.list}>
                  {catalogItems.map((item) => (
                    <option key={item.id} value={item.name} />
                  ))}
                </datalist>
                {nameError && (
                  <p id={`${ids.name}-error`} className="mt-1 text-sm font-medium text-danger-ink">
                    Add a name so you can find this repair later.
                  </p>
                )}
              </div>

              <fieldset>
                <legend className="label">How did it go?</legend>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {OUTCOMES.map((outcome) => {
                    const checked = form.outcome === outcome.value;
                    return (
                      <label
                        key={outcome.value}
                        className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-brand-500 ${
                          checked
                            ? "border-ink bg-ink text-white"
                            : "border-concrete-300 bg-white text-ink-soft hover:bg-concrete-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="outcome"
                          value={outcome.value}
                          checked={checked}
                          onChange={() => update("outcome", outcome.value)}
                          className="sr-only"
                        />
                        {outcome.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={ids.category} className="label">
                    Category
                  </label>
                  <select
                    id={ids.category}
                    value={form.categoryId}
                    onChange={(event) => update("categoryId", event.target.value)}
                    className="input mt-1"
                  >
                    <option value="">Other / not sure</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={ids.date} className="label">
                    Date
                  </label>
                  <input
                    id={ids.date}
                    type="date"
                    value={form.date}
                    max={toDateInputValue()}
                    onChange={(event) => update("date", event.target.value)}
                    className="input mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={ids.saved} className="label">
                    Money saved
                  </label>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">
                      $
                    </span>
                    <input
                      id={ids.saved}
                      type="text"
                      inputMode="decimal"
                      value={form.moneySaved}
                      onChange={(event) => update("moneySaved", event.target.value)}
                      placeholder="0"
                      className="input pl-7 tabular"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={ids.waste} className="label">
                    Waste avoided
                  </label>
                  <div className="relative mt-1">
                    <input
                      id={ids.waste}
                      type="text"
                      inputMode="decimal"
                      value={form.wasteAvoided}
                      onChange={(event) => update("wasteAvoided", event.target.value)}
                      placeholder="0"
                      className="input pr-12 tabular"
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-muted" aria-hidden="true">
                      lbs
                    </span>
                  </div>
                </div>
              </div>

              {canUseEstimates && (
                <button
                  type="button"
                  onClick={applyEstimates}
                  className="w-full rounded-lg border border-dashed border-brand-200 bg-brand-50 px-3 py-2 text-left text-sm text-brand-700 hover:border-brand-500"
                >
                  <strong>Use our estimate:</strong>{" "}
                  {estimates.saved !== undefined && `${formatMoney(estimates.saved)} saved`}
                  {estimates.saved !== undefined && estimates.waste !== undefined && ", "}
                  {estimates.waste !== undefined && `${formatWeight(estimates.waste)} kept out of the landfill`}
                </button>
              )}

              <div>
                <label htmlFor={ids.notes} className="label">
                  Notes <span className="font-normal text-ink-muted">(optional)</span>
                </label>
                <textarea
                  id={ids.notes}
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  rows={3}
                  placeholder="What worked, parts you bought, what to remember next time…"
                  className="input mt-1"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="submit">{editingId ? "Save changes" : "Save to log"}</Button>
              {(editingId || prefilled) && (
                <Button variant="ghost" onClick={resetForm}>
                  {editingId ? "Cancel" : "Clear form"}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Entries */}
        <section aria-labelledby="entries-heading">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="entries-heading" className="font-display text-2xl font-extrabold text-ink">
                History
              </h2>
              {ready && entries.length > 0 && (
                <p className="text-sm text-ink-muted tabular">
                  {entries.length} {entries.length === 1 ? "repair" : "repairs"} ·{" "}
                  {formatMoney(totals.totalMoneySaved)} saved · {formatWeight(totals.totalWasteAvoidedLbs)} kept out
                  of the landfill
                </p>
              )}
            </div>
            {entries.length > 0 && (
              <Link href="/dashboard" className="link inline-flex items-center gap-1 text-sm">
                View impact
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          {!ready ? (
            <p className="text-ink-muted">Loading your log…</p>
          ) : entries.length === 0 ? (
            <Card className="text-center">
              <p className="font-semibold text-ink">No repairs logged yet.</p>
              <p className="mt-1 text-ink-soft">
                Log your first fix to start tracking money saved and waste avoided — or load a few
                sample repairs to see how the dashboard works.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button variant="secondary" onClick={loadSamples}>
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Load sample repairs
                </Button>
                <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Import a backup
                </Button>
              </div>
            </Card>
          ) : (
            <ul className="space-y-3">
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  editing={editingId === entry.id}
                  onEdit={() => startEdit(entry)}
                  onDelete={() => handleDelete(entry)}
                />
              ))}
            </ul>
          )}

          {ready && entries.length > 0 && (
            <div className="mt-6 rounded-card border border-concrete-200 bg-concrete-50 p-4">
              <p className="text-sm font-semibold text-ink">Your data</p>
              <p className="mt-0.5 text-sm text-ink-muted">
                Your log lives only in this browser. Back it up to move it to another device.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={exportCSV}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Spreadsheet (.csv)
                </Button>
                <Button size="sm" variant="secondary" onClick={exportBackup}>
                  <FileJson className="h-4 w-4" aria-hidden="true" />
                  Backup (.json)
                </Button>
                <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Import backup
                </Button>
                {hasSamples ? (
                  <Button size="sm" variant="ghost" onClick={removeSamples}>
                    Remove sample repairs
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={handleClearAll} className="text-danger-ink hover:bg-danger-soft">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete all
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </section>
      </div>
    </div>
  );
}

function EntryCard({
  entry,
  editing,
  onEdit,
  onDelete,
}: {
  entry: RepairLogEntry;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const outcome = OUTCOMES.find((o) => o.value === entry.outcome) ?? OUTCOMES[0];
  const category = getCategory(entry.categoryId);
  return (
    <li
      className={`rounded-card border bg-white p-4 shadow-card ${editing ? "border-brand-500 ring-2 ring-brand-100" : "border-concrete-200"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-concrete-100 text-xl" aria-hidden="true">
            {category?.icon ?? "🧰"}
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-ink">
              {entry.itemName}
              {isSampleEntry(entry) && (
                <span className="ml-2 rounded bg-concrete-100 px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                  Sample
                </span>
              )}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${outcome.badge}`}>{outcome.label}</span>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </p>
          </div>
        </div>
        <div className="flex flex-none gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-concrete-100 hover:text-ink"
            aria-label={`Edit ${entry.itemName}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-danger-soft hover:text-danger-ink"
            aria-label={`Delete ${entry.itemName}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {(entry.moneySaved > 0 || entry.wasteAvoidedLbs > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {entry.moneySaved > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-safe-soft px-2.5 py-1 font-semibold text-safe-ink tabular">
              <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
              {formatMoney(entry.moneySaved)} saved
            </span>
          )}
          {entry.wasteAvoidedLbs > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 tabular">
              <Recycle className="h-3.5 w-3.5" aria-hidden="true" />
              {formatWeight(entry.wasteAvoidedLbs)} kept out of the landfill
            </span>
          )}
        </div>
      )}
      {entry.notes && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{entry.notes}</p>}
    </li>
  );
}

export default function RepairLogPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <RepairLogContent />
    </Suspense>
  );
}
