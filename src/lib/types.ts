/** Shared types for FixIt WA 03. */

/** The three safety outcomes shown to the user. */
export type SafetyLevel = "green" | "yellow" | "red";

/** A top-level item category shown on the Choose Item page. */
export interface Category {
  id: string;
  name: string;
  /** Short description for the category card. */
  description: string;
  /** Emoji used as a simple, dependency-free icon. */
  icon: string;
  /** What to search a map for to find a pro, e.g. "appliance repair". */
  proSearch?: string;
  /** Everyday words for things in this category; helps search and the scanner. */
  keywords?: string[];
}

/** A specific repairable item the user can pick or scan. */
export interface Item {
  id: string;
  categoryId: string;
  name: string;
  /** Common repair the user is likely attempting. */
  commonIssue: string;
  /** Other words people use for this problem. Powers search and the scanner. */
  keywords?: string[];
  /**
   * Baseline safety level for this item before the checker questions run.
   * The safety checker can only make the result MORE cautious, never less.
   */
  baseSafety: SafetyLevel;
  /**
   * If true, this item involves a repair on the dangerous list and must
   * always resolve to a red result recommending professional help.
   */
  dangerous?: boolean;
  /** Plain-language reason for a yellow or red baseline, shown on the result. */
  baseReason?: string;
  /** What to search a map for to find the right pro. Falls back to the category's. */
  proSearch?: string;
  /** Supplies for a DIY fix, as store searches. Never set for red items. */
  parts?: PartSearch[];
  /** What to search for to buy a cheaper used or refurbished replacement. */
  replaceQuery?: string;
  /** Etsy search for mail-in repair services or handmade parts. */
  etsyQuery?: string;
  /** Kinds of businesses that can fix it, nearest first. */
  trades?: string[];
  /** Guide id to show when the result is green or yellow. */
  guideId?: string;
  /** True for the catch-all "something else" item in each category. */
  generic?: boolean;
  /** Safety gear and similar items that should be replaced, not repaired. */
  replaceOnly?: boolean;
  /** Typical DIY parts and supplies cost in USD, used by the calculator. */
  estimatedRepairCost?: number;
  /** Typical cost to have a local professional repair it, in USD. */
  estimatedProCost?: number;
  /** Typical replacement cost in USD, used by the calculator. */
  estimatedReplacementCost?: number;
  /** Rough weight in pounds, used to estimate waste avoided. */
  estimatedWeightLbs?: number;
}

/** A part or supply to search for in online stores. */
export interface PartSearch {
  label: string;
  query: string;
}

/** A kind of repair business (bike shop, plumber…) and how to find one. */
export interface Trade {
  id: string;
  label: string;
  /** Search words for Yelp and maps. */
  search: string;
  /** OpenStreetMap tags used by scripts/fetch-pros.mjs. */
  osm: string[];
}

/** A repair business from the OpenStreetMap snapshot (src/data/pros.json). */
export interface ProListing {
  name: string;
  trades: string[];
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
}

/** How someone answered a safety question. "Unsure" is treated like "yes". */
export type SafetyAnswer = "yes" | "no" | "unsure";

/** A yes/no question asked during the safety check. */
export interface SafetyQuestion {
  id: string;
  /** Question text shown to the user. */
  text: string;
  /** Optional clarification shown under the question. */
  hint?: string;
  /**
   * The safety level this question escalates to when answered "yes".
   * Example: "Does it smell like burning?" -> yes escalates to red.
   */
  escalatesTo: SafetyLevel;
  /** Plain-language reason shown on the result page. */
  reason: string;
  /**
   * Category ids this question is asked for. Omit to ask it for every item.
   * Catch-all ("something else") items get every question in their category.
   */
  categories?: string[];
}

/** One thing that raised (or set) the safety level, shown on the result page. */
export interface SafetyReason {
  text: string;
  level: SafetyLevel;
  /** Where the reason came from. */
  source: "item" | "answer" | "unsure";
  /** The question that produced it, when there is one. */
  questionId?: string;
}

/** A step inside a beginner-safe repair guide. */
export interface GuideStep {
  title: string;
  detail: string;
}

/** A beginner-safe repair guide. Never used for dangerous repairs. */
export interface Guide {
  id: string;
  title: string;
  /** Estimated time to complete, e.g. "20-30 min". */
  time: string;
  /** Difficulty label, e.g. "Beginner". */
  difficulty: string;
  tools: string[];
  safetyTips: string[];
  steps: GuideStep[];
  /** Signs that mean the reader should stop and get help. */
  stopIf?: string[];
}

/** What kind of help a resource offers. */
export type ResourceKind = "pro" | "community" | "info";

/** A local repair resource in the WA 03 area. */
export interface Resource {
  id: string;
  name: string;
  /** Type of help, e.g. "Repair cafe", "Bike shop". */
  type: string;
  /**
   * "pro": a business or shop that can take safety-critical repairs.
   * "community": volunteer repair events and tool libraries.
   * "info": official lookups and hotlines (no storefront).
   */
  kind: ResourceKind;
  /** City for the listing. Omit for statewide or online resources. */
  city?: string;
  /** Street address, when there is a storefront. */
  address?: string;
  /** Latitude for distance sorting on the resources page. */
  lat?: number;
  /** Longitude for distance sorting on the resources page. */
  lng?: number;
  /** Free-form area/neighborhood note. */
  area?: string;
  phone?: string;
  website?: string;
  /** Category ids this resource can help with. */
  categories: string[];
  notes?: string;
  /** Something people should know before going, e.g. "Not open yet". */
  notice?: string;
}

/** What happened with a logged repair. */
export type RepairOutcome = "fixed" | "attempted" | "referred-to-pro";

/** A saved repair log entry, stored in localStorage. */
export interface RepairLogEntry {
  id: string;
  /** ISO date string of when the repair happened. */
  date: string;
  itemName: string;
  /** Catalog item id, when the repair started from a known item. */
  itemId?: string;
  categoryId?: string;
  /** What the user did or the outcome. */
  outcome: RepairOutcome;
  moneySaved: number;
  wasteAvoidedLbs: number;
  notes?: string;
}
