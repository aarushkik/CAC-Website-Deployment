import type { Item, SafetyLevel, SafetyQuestion } from "./types";

/**
 * Repairs that FixIt WA 03 must NEVER give detailed instructions for.
 * These always resolve to a red result that recommends professional help.
 * Keep this list conservative: when in doubt, treat a repair as dangerous.
 */
export const DANGEROUS_REPAIRS: string[] = [
  "car brakes",
  "airbags",
  "gas appliances",
  "microwaves",
  "high voltage electronics",
  "electrical wiring",
  "e-bike battery repair",
  "power tool motor repair",
  "structural repairs",
];

/**
 * Questions asked for every safety check. They can only escalate the result
 * toward more caution (red > yellow > green), never relax it.
 */
export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  {
    id: "burning",
    text: "Do you smell burning, smoke, or see scorch marks?",
    escalatesTo: "red",
    reason: "Burning smells or scorch marks can mean an electrical or fire hazard.",
  },
  {
    id: "gas",
    text: "Is there any gas smell, or is this a gas-powered appliance?",
    escalatesTo: "red",
    reason: "Gas leaks are dangerous and must be handled by a professional.",
  },
  {
    id: "high-voltage",
    text: "Does the repair involve mains wiring, a large capacitor, or high voltage?",
    escalatesTo: "red",
    reason: "High voltage can cause serious injury even when unplugged.",
  },
  {
    id: "battery-swelling",
    text: "Is a battery swollen, leaking, or very hot?",
    escalatesTo: "red",
    reason: "Damaged batteries can catch fire and should not be opened at home.",
  },
  {
    id: "structural",
    text: "Does the item hold weight or keep people safe (brakes, ladders, load-bearing parts)?",
    escalatesTo: "red",
    reason: "Safety-critical parts should be repaired by a qualified professional.",
  },
  {
    id: "water",
    text: "Is there standing water or a plumbing leak near the repair?",
    escalatesTo: "yellow",
    reason: "Water near electricity or moving parts adds risk. Take extra care.",
  },
  {
    id: "unsure",
    text: "Are you unsure how the item comes apart?",
    escalatesTo: "yellow",
    reason: "If the item is unfamiliar, go slowly and stop if anything feels unsafe.",
  },
];

/** Numeric weight so we can compare/escalate safety levels. */
const RANK: Record<SafetyLevel, number> = { green: 0, yellow: 1, red: 2 };

/** Returns the more cautious of two safety levels. */
export function moreCautious(a: SafetyLevel, b: SafetyLevel): SafetyLevel {
  return RANK[a] >= RANK[b] ? a : b;
}

/** True if the given free-text repair matches the dangerous list. */
export function isDangerousText(text: string): boolean {
  const normalized = text.toLowerCase();
  return DANGEROUS_REPAIRS.some((danger) => normalized.includes(danger));
}

/**
 * Computes the final safety result from an item's baseline safety plus the
 * user's yes/no answers. The result can only become MORE cautious.
 * Returns the level and the list of reasons that drove any escalation.
 */
export function evaluateSafety(
  item: Pick<Item, "baseSafety" | "dangerous">,
  answers: Record<string, boolean>,
): { level: SafetyLevel; reasons: string[] } {
  const reasons: string[] = [];

  // A dangerous item is always red, regardless of answers.
  let level: SafetyLevel = item.dangerous ? "red" : item.baseSafety;
  if (item.dangerous) {
    reasons.push("This repair is on our do-not-DIY list and needs a professional.");
  }

  for (const question of SAFETY_QUESTIONS) {
    if (answers[question.id]) {
      level = moreCautious(level, question.escalatesTo);
      if (question.reason) reasons.push(question.reason);
    }
  }

  return { level, reasons };
}

/** Human-readable heading for each safety level. */
export function safetyHeading(level: SafetyLevel): string {
  switch (level) {
    case "green":
      return "Safe for a beginner repair";
    case "yellow":
      return "Repair with caution";
    case "red":
      return "Get professional help";
  }
}

/** Short explanation shown under the heading. */
export function safetySummary(level: SafetyLevel): string {
  switch (level) {
    case "green":
      return "This looks like a good beginner repair. Follow the guide and take your time.";
    case "yellow":
      return "You may be able to fix this, but there are added risks. Read the safety tips carefully, and stop if anything feels unsafe.";
    case "red":
      return "This repair can be dangerous. We won't give step-by-step instructions. Instead, document the problem and contact a local professional.";
  }
}
