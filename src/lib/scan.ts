import { categories, getItem, items } from "./data";
import { buildItemIndex, matchConfidence, matchItems, type MatchConfidence } from "./match";
import { detectHazards, type HazardMatch } from "./safety";
import type { Item } from "./types";

/**
 * The scanner combines two sources:
 *   1. On-device matching of the description (always available, offline).
 *   2. Optional AI photo recognition from /api/scan.
 * The AI only suggests which catalog item it sees and which hazards are
 * visible. The safety result always comes from the app's own rules.
 */

const index = buildItemIndex(items, categories);

/** Hazards the AI may report, mapped onto the app's hazard wording. */
export const AI_HAZARDS = {
  gas: {
    label: "Gas",
    reason:
      "Gas leaks and gas appliances need a licensed professional. If you smell gas, leave now and call 911 or your gas company from outside.",
  },
  fire: {
    label: "Fire or electrical hazard",
    reason:
      "Smoke, scorch marks, or melting mean a fire or electrical hazard. Unplug it only if it's safe to touch, and don't use it until a pro checks it.",
  },
  "electrical-wiring": {
    label: "Electrical wiring",
    reason:
      "Outlets, switches, light fixtures, and wiring connect to your home's power. A licensed electrician should handle them.",
  },
  battery: {
    label: "Damaged battery",
    reason:
      "Swollen, leaking, or damaged batteries can catch fire. Don't charge, open, or puncture it. Move it away from anything that can burn.",
  },
  "high-voltage": {
    label: "High voltage",
    reason: "High-voltage parts like those inside microwaves and power supplies can shock you even after unplugging.",
  },
  structural: {
    label: "Structural",
    reason:
      "Cracked parts that hold weight, roofs, ladders, and stairs can fail or cause falls. Get a licensed contractor.",
  },
  "water-near-power": {
    label: "Water near power",
    reason: "Water near outlets or wiring can shock you. Stay out of standing water and call an electrician.",
  },
  "broken-glass": {
    label: "Broken glass",
    reason: "Wear gloves and eye protection, and keep kids and pets away from broken glass.",
  },
} as const;

export type AiHazardId = keyof typeof AI_HAZARDS;
export const AI_HAZARD_IDS = Object.keys(AI_HAZARDS) as AiHazardId[];

/** What /api/scan returns on success. */
export interface AiScanResult {
  objectName: string;
  /** Model-specific searches for parts or supplies, e.g. "Dyson V8 filter". */
  partQueries?: string[];
  matches: string[];
  confidence: "high" | "medium" | "low";
  hazards: AiHazardId[];
  isRepairPhoto: boolean;
}

export interface ScanSuggestion {
  item: Item;
  /** Where the suggestion came from. */
  source: "photo" | "description" | "both";
}

export interface ScanOutcome {
  suggestions: ScanSuggestion[];
  confidence: MatchConfidence;
  hazards: HazardMatch[];
  /** Short name of what the photo shows, when AI looked at one. */
  seen?: string;
  /** The photo didn't look like something to repair. */
  notRepairPhoto?: boolean;
  /** Model-specific store searches from photo recognition. */
  partQueries?: string[];
}

/** On-device analysis of a description. */
export function analyzeDescription(description: string): ScanOutcome {
  const ranked = matchItems(description, index, { limit: 3 });
  // Keep alternatives only when they're nearly as good as the best match.
  const matches = ranked.filter((match, i) => i === 0 || match.score >= ranked[0].score * 0.65);
  return {
    suggestions: matches.map((match) => ({ item: match.item, source: "description" })),
    confidence: matchConfidence(matches),
    hazards: detectHazards(description),
  };
}

const RANK = { green: 0, yellow: 1, red: 2 } as const;

/**
 * Merges the AI's view of a photo into the on-device result. Hazards are
 * unioned (either source can raise one); item suggestions put agreement first.
 */
export function mergeAiResult(local: ScanOutcome, ai: AiScanResult | null): ScanOutcome {
  if (!ai) return local;

  const aiItems = ai.matches.map((id) => getItem(id)).filter((item): item is Item => Boolean(item));
  const trustedAi = ai.confidence === "low" ? aiItems.slice(0, 1) : aiItems;
  const localIds = new Set(local.suggestions.map((s) => s.item.id));

  const merged: ScanSuggestion[] = [];
  const add = (item: Item, source: ScanSuggestion["source"]) => {
    if (!merged.some((s) => s.item.id === item.id)) merged.push({ item, source });
  };
  // Items both sources agree on, then the photo's picks, then the description's.
  for (const item of trustedAi) if (localIds.has(item.id)) add(item, "both");
  for (const item of trustedAi) add(item, "photo");
  for (const suggestion of local.suggestions) add(suggestion.item, "description");

  const hazards = [...local.hazards];
  for (const id of ai.hazards) {
    const hazard = AI_HAZARDS[id];
    if (hazard && !hazards.some((h) => h.label === hazard.label)) {
      hazards.push({ id: `photo-${id}`, label: hazard.label, level: id === "broken-glass" ? "yellow" : "red", reason: hazard.reason });
    }
  }
  hazards.sort((a, b) => RANK[b.level] - RANK[a.level]);

  const agree = merged[0]?.source === "both";
  const confidence: MatchConfidence =
    agree || (ai.confidence === "high" && trustedAi.length > 0)
      ? "strong"
      : ai.confidence === "medium" && trustedAi.length > 0
        ? local.confidence === "weak"
          ? "possible"
          : local.confidence
        : local.confidence;

  return {
    suggestions: merged.slice(0, 3),
    confidence,
    hazards,
    seen: ai.objectName || undefined,
    notRepairPhoto: !ai.isRepairPhoto,
    partQueries: ai.partQueries?.length ? ai.partQueries : undefined,
  };
}
