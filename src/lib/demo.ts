import type { RepairLogEntry } from "./types";

/**
 * Example repairs for showing the dashboard to someone (a judge, a classmate)
 * without logging real repairs first. Every id starts with "demo-", so they
 * can be taken out again without touching real entries.
 */
const EXAMPLES: Array<Omit<RepairLogEntry, "id" | "date"> & { daysAgo: number }> = [
  { daysAgo: 3, itemName: "Flat bike tire", categoryId: "bikes", outcome: "fixed", moneySaved: 25, wasteAvoidedLbs: 2 },
  { daysAgo: 11, itemName: "Missing coat button", categoryId: "clothing", outcome: "fixed", moneySaved: 23, wasteAvoidedLbs: 1 },
  { daysAgo: 26, itemName: "Wobbly kitchen chair", categoryId: "furniture", outcome: "fixed", moneySaved: 114, wasteAvoidedLbs: 15 },
  { daysAgo: 40, itemName: "Sparking outlet", categoryId: "home", outcome: "referred-to-pro", moneySaved: 0, wasteAvoidedLbs: 0, notes: "Called an electrician." },
  { daysAgo: 47, itemName: "Stuck backpack zipper", categoryId: "clothing", outcome: "fixed", moneySaved: 40, wasteAvoidedLbs: 1 },
  { daysAgo: 62, itemName: "Dripping bathroom faucet", categoryId: "home", outcome: "fixed", moneySaved: 110, wasteAvoidedLbs: 3 },
  { daysAgo: 75, itemName: "Desk fan not spinning", categoryId: "small-appliances", outcome: "attempted", moneySaved: 0, wasteAvoidedLbs: 0, notes: "Cleaned it, still stuck. Taking it to a repair cafe." },
  { daysAgo: 88, itemName: "Squeaky bike chain", categoryId: "bikes", outcome: "fixed", moneySaved: 14, wasteAvoidedLbs: 2 },
];

export function isDemoEntry(entry: RepairLogEntry): boolean {
  return entry.id.startsWith("demo-");
}

export function demoEntries(now = new Date()): RepairLogEntry[] {
  return EXAMPLES.map(({ daysAgo, ...entry }, i) => ({
    ...entry,
    id: `demo-${i}`,
    date: new Date(now.getTime() - daysAgo * 86_400_000).toISOString(),
  }));
}
