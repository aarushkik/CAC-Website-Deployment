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
}

/** A specific repairable item the user can pick or scan. */
export interface Item {
  id: string;
  categoryId: string;
  name: string;
  /** Common repair the user is likely attempting. */
  commonIssue: string;
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
  /** Guide id to show when the result is green or yellow. */
  guideId?: string;
  /** Typical DIY repair cost in USD, used by the calculator. */
  estimatedRepairCost?: number;
  /** Typical replacement cost in USD, used by the calculator. */
  estimatedReplacementCost?: number;
  /** Rough weight in pounds, used to estimate waste avoided. */
  estimatedWeightLbs?: number;
}

/** A yes/no question asked during the safety check. */
export interface SafetyQuestion {
  id: string;
  /** Question text shown to the user. */
  text: string;
  /**
   * The safety level this question escalates to when answered "yes".
   * Example: "Does it smell like burning?" -> yes escalates to red.
   */
  escalatesTo: SafetyLevel;
  /** Optional plain-language reason shown on the result page. */
  reason?: string;
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
}

/** A local repair resource in the WA 03 area. */
export interface Resource {
  id: string;
  name: string;
  /** Type of help, e.g. "Repair cafe", "Appliance shop". */
  type: string;
  city: string;
  /** Free-form area/neighborhood note. */
  area?: string;
  phone?: string;
  website?: string;
  /** Category ids this resource can help with. */
  categories: string[];
  notes?: string;
}

/** A saved repair log entry, stored in localStorage. */
export interface RepairLogEntry {
  id: string;
  /** ISO date string of when the repair was logged. */
  date: string;
  itemName: string;
  categoryId?: string;
  /** What the user did or the outcome. */
  outcome: "fixed" | "attempted" | "referred-to-pro";
  moneySaved: number;
  wasteAvoidedLbs: number;
  notes?: string;
}
