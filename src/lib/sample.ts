import type { RepairLogEntry } from "./types";

const SAMPLE_PREFIX = "sample-";

/** True for entries added by "Load sample repairs". */
export function isSampleEntry(entry: Pick<RepairLogEntry, "id">): boolean {
  return entry.id.startsWith(SAMPLE_PREFIX);
}

/**
 * A few months of realistic repairs, for trying out the dashboard or demoing
 * the app. Dates are relative to `now`, so the charts always look current.
 */
export function sampleEntries(now: Date = new Date()): RepairLogEntry[] {
  const daysAgo = (days: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, 12).toISOString();

  return [
    {
      id: `${SAMPLE_PREFIX}1`,
      date: daysAgo(4),
      itemName: "Flat bike tire",
      itemId: "flat-tire",
      categoryId: "bikes",
      outcome: "fixed",
      moneySaved: 25,
      wasteAvoidedLbs: 2,
      notes: "Found a goathead thorn in the tire. Patched it in 25 minutes.",
    },
    {
      id: `${SAMPLE_PREFIX}2`,
      date: daysAgo(19),
      itemName: "Wobbly chair or table",
      itemId: "wobbly-chair",
      categoryId: "furniture",
      outcome: "fixed",
      moneySaved: 114,
      wasteAvoidedLbs: 15,
      notes: "Re-glued two loose rungs on a kitchen chair.",
    },
    {
      id: `${SAMPLE_PREFIX}3`,
      date: daysAgo(33),
      itemName: "Stuck or broken zipper",
      itemId: "stuck-zipper",
      categoryId: "clothing",
      outcome: "fixed",
      moneySaved: 40,
      wasteAvoidedLbs: 1,
      notes: "Bar soap on the teeth did it.",
    },
    {
      id: `${SAMPLE_PREFIX}4`,
      date: daysAgo(47),
      itemName: "Microwave not heating",
      itemId: "microwave",
      categoryId: "small-appliances",
      outcome: "referred-to-pro",
      moneySaved: 20,
      wasteAvoidedLbs: 30,
      notes: "Didn't open it. An appliance shop fixed it for $110.",
    },
    {
      id: `${SAMPLE_PREFIX}5`,
      date: daysAgo(63),
      itemName: "Lamp not turning on",
      itemId: "lamp-cord",
      categoryId: "small-appliances",
      outcome: "attempted",
      moneySaved: 0,
      wasteAvoidedLbs: 0,
      notes: "A new bulb didn't help and the switch feels loose. Bringing it to a repair event.",
    },
    {
      id: `${SAMPLE_PREFIX}6`,
      date: daysAgo(80),
      itemName: "Hole in jeans or worn knees",
      itemId: "jeans-hole",
      categoryId: "clothing",
      outcome: "fixed",
      moneySaved: 44,
      wasteAvoidedLbs: 1.5,
    },
    {
      id: `${SAMPLE_PREFIX}7`,
      date: daysAgo(102),
      itemName: "Dripping faucet",
      itemId: "leaky-faucet",
      categoryId: "home",
      outcome: "fixed",
      moneySaved: 110,
      wasteAvoidedLbs: 3,
      notes: "New cartridge from the hardware store.",
    },
    {
      id: `${SAMPLE_PREFIX}8`,
      date: daysAgo(130),
      itemName: "Dry or squeaky bike chain",
      itemId: "dry-chain",
      categoryId: "bikes",
      outcome: "fixed",
      moneySaved: 14,
      wasteAvoidedLbs: 2,
    },
  ];
}
