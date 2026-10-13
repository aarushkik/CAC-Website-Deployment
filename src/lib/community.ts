/** The parts of the shared counter that can be tested without a database. */

const LIMITS = { saved: 2000, lbs: 300 };

export interface CommunityTotals {
  repairs: number;
  saved: number;
  lbs: number;
  /** Repairs per category id. */
  categories: Record<string, number>;
}

/** HGETALL comes back as [field, value, field, value, ...]. */
export function pairs(flat: unknown): Record<string, number> {
  const found: Record<string, number> = {};
  if (Array.isArray(flat)) {
    for (let i = 0; i + 1 < flat.length; i += 2) {
      const value = Number(flat[i + 1]);
      if (Number.isFinite(value)) found[String(flat[i])] = value;
    }
  }
  return found;
}

export function totalsFrom(flat: unknown): CommunityTotals {
  const all = pairs(flat);
  const categories: Record<string, number> = {};
  for (const [field, value] of Object.entries(all)) {
    if (field.startsWith("cat:")) categories[field.slice(4)] = value;
  }
  return { repairs: all.repairs ?? 0, saved: all.saved ?? 0, lbs: all.lbs ?? 0, categories };
}

/** An id as used in the data files: short, lower case, letters, digits and dashes. */
export function cleanId(value: unknown): string {
  return typeof value === "string" && /^[a-z0-9-]{1,40}$/.test(value) ? value : "";
}

/** Team codes are six letters and digits, without the ones that look alike (0/O, 1/I). */
export function cleanTeamCode(value: unknown): string {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^[A-HJ-NP-Z2-9]{6}$/.test(code) ? code : "";
}

/** Team names are shown to everyone, so only plain letters, digits and spaces get through. */
export function cleanTeamName(value: unknown): string {
  if (typeof value !== "string") return "";
  const name = value.replace(/\s+/g, " ").trim();
  return /^[A-Za-z0-9 '&.-]{3,30}$/.test(name) ? name : "";
}

export function newTeamCode(random: () => number = Math.random): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => letters[Math.floor(random() * letters.length)]).join("");
}

/** Keeps one post inside sensible bounds. Returns null when it is not a repair at all. */
export function cleanRepair(body: unknown): { saved: number; lbs: number } | null {
  if (!body || typeof body !== "object") return null;
  const { saved, lbs } = body as { saved?: unknown; lbs?: unknown };
  const money = Number(saved);
  const weight = Number(lbs);
  if (!Number.isFinite(money) || !Number.isFinite(weight) || money < 0 || weight < 0) return null;
  return {
    saved: Math.round(Math.min(money, LIMITS.saved) * 100) / 100,
    lbs: Math.round(Math.min(weight, LIMITS.lbs) * 10) / 10,
  };
}
