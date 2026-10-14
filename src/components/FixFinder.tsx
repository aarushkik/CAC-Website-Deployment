"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Camera, Loader2, ShieldAlert, Sparkles, TriangleAlert, X } from "lucide-react";
import { MiniSafetySign } from "@/components/SafetySign";
import { Solutions } from "@/components/Solutions";
import { categories, getGenericItem } from "@/lib/data";
import { prepareImage } from "@/lib/image";
import { safetyHeading } from "@/lib/safety";
import { analyzeDescription, mergeAiResult, type AiScanResult, type ScanOutcome } from "@/lib/scan";

const EXAMPLES = ["My bike tire keeps going flat", "Zipper on my coat is stuck", "Toilet keeps running", "Microwave isn't heating"];

type Status = "idle" | "analyzing" | "done";

/**
 * The one-box flow: describe the problem (and/or add a photo), then see what
 * it is, whether it's safe, and the cheapest ways to fix it — right away.
 * Pass `resultsTarget` to render results into another element (the home
 * page shows them below the hero).
 */
export function FixFinder({
  initialQuery = "",
  resultsTarget,
  autoRun = false,
}: {
  initialQuery?: string;
  resultsTarget?: string;
  autoRun?: boolean;
}) {
  const ids = { description: useId(), photo: useId() };
  const [description, setDescription] = useState(initialQuery);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const ranInitial = useRef(false);

  useEffect(() => {
    if (resultsTarget) setPortalTarget(document.getElementById(resultsTarget));
  }, [resultsTarget]);

  // Ask the server whether photo recognition is turned on.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/scan")
      .then((response) => (response.ok ? response.json() : { enabled: false }))
      .then((data: { enabled?: boolean }) => !cancelled && setAiEnabled(Boolean(data.enabled)))
      .catch(() => !cancelled && setAiEnabled(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (!autoRun || ranInitial.current || !initialQuery.trim()) return;
    ranInitial.current = true;
    show(analyzeDescription(initialQuery));
    // show() only sets state; running once on arrival is the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, initialQuery]);

  function show(next: ScanOutcome) {
    setOutcome(next);
    setSelectedId(next.suggestions[0]?.item.id ?? null);
    setStatus("done");
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("That file isn't a photo. Choose a JPG, PNG, or HEIC image.");
      return;
    }
    setFormError(null);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function analyze(event?: FormEvent) {
    event?.preventDefault();
    const text = description.trim();
    if (!text && !(photo && aiEnabled)) {
      setFormError(
        photo
          ? "Photo recognition isn't turned on here yet, so add a few words about the problem."
          : "Tell us what's wrong in a few words, like “bike tire keeps going flat”.",
      );
      return;
    }
    setFormError(null);
    setNotice(null);
    const local = analyzeDescription(text);
    if (!(aiEnabled && (photo !== null || local.confidence !== "strong"))) {
      show(local);
      return;
    }
    setStatus("analyzing");
    try {
      const image = photo ? await prepareImage(photo) : null;
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text, image }),
      });
      const data = (await response.json().catch(() => ({}))) as AiScanResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Photo recognition didn't respond.");
      show(mergeAiResult(local, data));
    } catch (error) {
      setNotice(`${error instanceof Error ? error.message : "Photo recognition didn't respond."}${text ? " These results come from your description." : ""}`);
      show(local);
    }
  }

  const form = (
    <form onSubmit={analyze} noValidate className="w-full">
      <label htmlFor={ids.description} className="label mb-2">
        What&apos;s broken? Describe it or snap a photo.
      </label>
      <div className="rounded-xl border border-concrete-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        <textarea
          id={ids.description}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (formError) setFormError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void analyze();
            }
          }}
          rows={2}
          maxLength={500}
          placeholder="e.g. My bike tire keeps going flat"
          aria-invalid={Boolean(formError)}
          aria-describedby={formError ? `${ids.description}-error` : undefined}
          className="block w-full resize-none rounded-t-xl border-0 bg-transparent px-4 pt-3 text-lg text-ink placeholder:text-ink-muted/85 focus:outline-none focus:ring-0"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2 pt-1">
          {preview ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-concrete-100 py-1 pl-1 pr-2 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
              <img src={preview} alt="Your photo" className="h-9 w-9 rounded object-cover" />
              Photo added
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPreview(null);
                }}
                aria-label="Remove photo"
                className="rounded p-0.5 text-ink-muted hover:bg-concrete-200 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </span>
          ) : (
            <label
              htmlFor={ids.photo}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-brand-500"
            >
              <Camera className="h-5 w-5" aria-hidden="true" />
              Add a photo
              <input id={ids.photo} type="file" accept="image/*" onChange={onPhoto} className="sr-only" />
            </label>
          )}
          <button
            type="submit"
            disabled={status === "analyzing"}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70"
          >
            {status === "analyzing" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : null}
            {status === "analyzing" ? "Looking…" : "Find affordable fixes"}
            {status !== "analyzing" && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {formError && (
        <p id={`${ids.description}-error`} role="alert" className="mt-2 text-sm font-semibold text-danger-ink">
          {formError}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-muted">Try:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setDescription(example);
              show(analyzeDescription(example));
            }}
            className="rounded-full border border-concrete-300 bg-white px-3 py-1 font-semibold text-ink-soft hover:border-brand-200 hover:text-brand-700"
          >
            {example}
          </button>
        ))}
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
        {aiEnabled ? (
          <>
            <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-brand-600" aria-hidden="true" />
            Photos are shrunk on your device, then sent to our AI provider (Anthropic) only to identify the item. We
            don&apos;t store them.
          </>
        ) : (
          <>Photo recognition isn&apos;t turned on for this site, so photos stay on your device and your words do the matching.</>
        )}
      </p>
    </form>
  );

  const results =
    status === "idle" || !outcome ? null : (
      <div ref={resultsRef} className="scroll-mt-24" aria-live="polite">
        <Results
          outcome={outcome}
          notice={notice}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );

  return (
    <>
      {form}
      {results && (portalTarget ? createPortal(results, portalTarget) : <div className="mt-8">{results}</div>)}
    </>
  );
}

function Results({
  outcome,
  notice,
  selectedId,
  onSelect,
}: {
  outcome: ScanOutcome;
  notice: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const red = outcome.hazards.filter((h) => h.level === "red");
  const yellow = outcome.hazards.filter((h) => h.level === "yellow");
  const selected = outcome.suggestions.find((s) => s.item.id === selectedId) ?? outcome.suggestions[0];
  const item = selected?.item;
  // A hazard in the description makes this result red even if the item usually isn't.
  const level = item ? (red.length > 0 ? "red" : item.dangerous ? "red" : item.baseSafety) : "red";

  return (
    <div className="space-y-5">
      {notice && (
        <p className="flex items-start gap-2 rounded-lg border border-concrete-300 bg-white px-4 py-3 text-sm text-ink-soft">
          <TriangleAlert className="mt-0.5 h-4 w-4 flex-none text-caution-ink" aria-hidden="true" />
          {notice}
        </p>
      )}

      {red.length > 0 && (
        <section className="overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-lift" aria-label="Possible danger">
          <div className="flex items-center gap-2 bg-danger px-4 py-2 font-display text-xl font-extrabold uppercase tracking-[0.12em] text-white">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            Possible danger
          </div>
          <div className="p-4">
            <p className="font-semibold text-ink">Don&apos;t try this one yourself. Here&apos;s why:</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-soft">
              {red.map((hazard) => (
                <li key={hazard.id}>
                  <strong className="text-ink">{hazard.label}:</strong> {hazard.reason}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {yellow.length > 0 && (
        <div className="rounded-card border border-caution/70 bg-caution-soft p-4 text-sm">
          {yellow.map((hazard) => (
            <p key={hazard.id}>
              <strong>{hazard.label}:</strong> {hazard.reason}
            </p>
          ))}
        </div>
      )}

      {item ? (
        <>
          <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div>
              <p className="eyebrow mb-2">
                {outcome.confidence === "strong" ? "We think it's" : "It sounds like"}
                {selected.source === "both" && " · matches your photo"}
                {selected.source === "photo" && " · from your photo"}
              </p>
              <MiniSafetySign level={level} label={item.name} detail={safetyHeading(level)} />
            </div>
            <div className="text-sm">
              {outcome.seen && (
                <p className="flex items-center gap-2 text-ink-soft">
                  <Sparkles className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  Your photo looks like: <strong className="text-ink">{outcome.seen}</strong>
                </p>
              )}
              {outcome.suggestions.length > 1 && (
                <div className="mt-2">
                  <p className="font-semibold text-ink">Not quite? Pick the closest:</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {outcome.suggestions.map(({ item: option }) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === item.id}
                        onClick={() => onSelect(option.id)}
                        className={`rounded-full border px-3 py-1 font-semibold ${
                          option.id === item.id ? "border-ink bg-ink text-white" : "border-concrete-300 bg-white text-ink-soft hover:text-ink"
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-3 text-ink-soft">
                Want a personal safety check first?{" "}
                <Link href={`/safety-checker?item=${item.id}`} className="link">
                  Answer a few quick questions
                </Link>
                .
              </p>
            </div>
          </div>
          <Solutions key={item.id} item={item} level={level} extraQueries={level === "red" ? [] : outcome.partQueries} />
        </>
      ) : (
        <div className="rounded-card border border-concrete-200 bg-white p-5 shadow-card">
          <p className="font-semibold text-ink">We couldn&apos;t match that yet.</p>
          <p className="mt-1 text-sm text-ink-soft">Try different words, or pick the kind of thing it is:</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => {
              const generic = getGenericItem(category.id);
              return generic ? (
                <li key={category.id}>
                  <Link
                    href={`/safety-checker?item=${generic.id}`}
                    className="inline-flex rounded-full border border-concrete-300 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-brand-200 hover:text-brand-700"
                  >
                    {category.icon} {category.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
