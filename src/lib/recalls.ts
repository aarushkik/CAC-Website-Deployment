/** Reading answers from the US recall database (SaferProducts.gov). */

interface CpscRecall {
  RecallDate?: string | null;
  Title?: string | null;
  URL?: string | null;
  Hazards?: Array<{ Name?: string }>;
  Remedies?: Array<{ Name?: string }>;
}

export interface Recall {
  date: string;
  title: string;
  url: string;
  hazard: string;
  remedy: string;
}

/** Turns the CPSC answer into our short form. Their error replies come back as a fake recall with no URL. */
export function parseRecalls(data: unknown): Recall[] | null {
  if (!Array.isArray(data)) return null;
  const rows = data as CpscRecall[];
  if (rows.length === 1 && !rows[0].URL && /error/i.test(rows[0].Title ?? "")) return null;
  return rows
    .filter((r) => r.Title && r.URL && /^https:\/\/www\.cpsc\.gov\//.test(r.URL))
    .map((r) => ({
      date: (r.RecallDate ?? "").slice(0, 10),
      title: r.Title as string,
      url: r.URL as string,
      hazard: r.Hazards?.[0]?.Name ?? "",
      remedy: r.Remedies?.[0]?.Name ?? "",
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);
}
