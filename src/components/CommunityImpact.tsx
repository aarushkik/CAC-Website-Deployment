"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface Totals {
  configured: boolean;
  repairs?: number;
  saved?: number;
  lbs?: number;
}

const TEAM_KEY = "fixit-wa03-team";

/** The team this device counts for: { code, name }, or null. */
export function getMyTeam(): { code: string; name: string } | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(TEAM_KEY) ?? "null");
    return saved && typeof saved.code === "string" ? saved : null;
  } catch {
    return null;
  }
}

export function setMyTeam(team: { code: string; name: string } | null): void {
  if (team) window.localStorage.setItem(TEAM_KEY, JSON.stringify(team));
  else window.localStorage.removeItem(TEAM_KEY);
}

/** Tells the shared counter about one fixed item. Quietly does nothing when it is off or offline. */
export function countForCommunity(saved: number, lbs: number, categoryId?: string): void {
  fetch("/api/community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saved, lbs, categoryId, team: getMyTeam()?.code }),
  }).catch(() => undefined);
}

/** Counts one red result per item and browser tab, for the community report. */
export function countRedResult(itemId: string): void {
  try {
    const key = `fixit-red-counted:${itemId}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    return;
  }
  fetch("/api/community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "red", itemId }),
  }).catch(() => undefined);
}

/**
 * What everyone using FixIt has fixed together. Shows nothing at all until the
 * counter database is set up and at least one repair has been counted.
 */
export function CommunityImpact() {
  const [totals, setTotals] = useState<Totals | null>(null);

  useEffect(() => {
    fetch("/api/community")
      .then((response) => (response.ok ? response.json() : null))
      .then(setTotals)
      .catch(() => setTotals(null));
  }, []);

  if (!totals?.configured || !totals.repairs) return null;

  return (
    <section className="mt-6 animate-rise rounded-card border border-brand-200 bg-brand-50 p-5">
      <p className="eyebrow flex items-center gap-1.5">
        <Icon name="pin" size={14} />
        Fixed together
      </p>
      <p className="mt-2 text-workshop-900">
        <strong className="text-2xl">{totals.repairs.toLocaleString()}</strong>{" "}
        {totals.repairs === 1 ? "repair" : "repairs"} logged,{" "}
        <strong className="text-2xl">${Math.round(totals.saved ?? 0).toLocaleString()}</strong> saved and{" "}
        <strong className="text-2xl">{Math.round(totals.lbs ?? 0).toLocaleString()}</strong> lbs kept out of
        the landfill.
      </p>
      <p className="mt-1 text-xs text-workshop-600">
        Added up from what people log in FixIt. Self-reported, nobody checks the numbers.{" "}
        <Link href="/report" className="font-semibold text-brand-700 underline">
          Community report
        </Link>{" "}
        ·{" "}
        <Link href="/teams" className="font-semibold text-brand-700 underline">
          Team challenge
        </Link>
      </p>
    </section>
  );
}
