/** Display formatting shared across pages. */

const wholeDollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dollarsAndCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "$1,234" for whole amounts, "$4.50" when there are cents. */
export function formatMoney(amount: number): string {
  if (!Number.isFinite(amount)) return "$0";
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? wholeDollars.format(rounded) : dollarsAndCents.format(rounded);
}

/** "1 lb", "2.5 lbs", "120 lbs". */
export function formatWeight(pounds: number): string {
  if (!Number.isFinite(pounds) || pounds <= 0) return "0 lbs";
  const value = pounds >= 10 ? Math.round(pounds) : Math.round(pounds * 10) / 10;
  return `${value.toLocaleString("en-US")} ${value === 1 ? "lb" : "lbs"}`;
}

/** "Oct 11, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "2026-10-11" in the user's local time zone, for <input type="date">. */
export function toDateInputValue(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Turns a date-input value into an ISO string at local noon, so the day
 * doesn't shift when it's shown in another time zone.
 */
export function fromDateInputValue(value: string): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Parses a money or weight field. Empty or invalid input becomes undefined. */
export function parseAmount(value: string): number | undefined {
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return undefined;
  const number = Number(cleaned);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}
