import type {
  Item,
  SafetyAnswer,
  SafetyLevel,
  SafetyQuestion,
  SafetyReason,
} from "./types";

/**
 * Repairs that FixIt WA 03 must NEVER give detailed instructions for.
 * These always resolve to a red result that recommends professional help.
 * Keep this list conservative: when in doubt, treat a repair as dangerous.
 * Every label here must be caught by `detectHazards` (see safety.test.ts).
 */
export const DANGEROUS_REPAIRS: string[] = [
  "car brakes",
  "airbags",
  "gas appliances",
  "microwaves",
  "high-voltage electronics",
  "electrical wiring",
  "e-bike batteries",
  "damaged lithium batteries",
  "power tool motors",
  "structural repairs",
  "garage door springs",
  "safety gear and child car seats",
  "asbestos and lead paint",
];

/**
 * Questions asked during a safety check. They can only escalate the result
 * toward more caution (red > yellow > green), never relax it. Each question
 * is asked only for the categories where it makes sense.
 */
export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  {
    id: "burning",
    text: "Do you smell burning, or see smoke, sparks, or scorch marks?",
    escalatesTo: "red",
    reason: "Burning smells, smoke, sparks, or scorch marks can mean an electrical or fire hazard.",
    categories: ["small-appliances", "electronics", "home"],
  },
  {
    id: "gas",
    text: "Do you smell gas, or does it run on natural gas or propane?",
    escalatesTo: "red",
    reason: "Gas leaks and gas appliances need a licensed professional.",
    categories: ["small-appliances", "home"],
  },
  {
    id: "high-voltage",
    text: "Would the fix mean opening up something that plugs into the wall, or touching household wiring?",
    hint: "Swapping a bulb or cleaning the outside doesn't count. Taking off a cover to reach wires or circuit boards does.",
    escalatesTo: "red",
    reason: "Wall power and the parts inside plug-in items can shock you, even after unplugging.",
    categories: ["small-appliances", "electronics", "home"],
  },
  {
    id: "battery-swelling",
    text: "Does it have a battery that is swollen, leaking, very hot, or damaged?",
    hint: "Choose No if it has no battery.",
    escalatesTo: "red",
    reason: "Damaged batteries can catch fire and should never be opened at home.",
    categories: ["small-appliances", "electronics", "home"],
  },
  {
    id: "structural",
    text: "Is a part that holds weight or keeps someone safe cracked, bent, or broken?",
    hint: "For example a bike frame, fork, or handlebars, a chair leg, a ladder, or a stair railing.",
    escalatesTo: "red",
    reason: "Cracked or bent parts that hold weight or keep you safe can fail without warning.",
    categories: ["furniture", "bikes", "home"],
  },
  {
    id: "safety-gear",
    text: "Is this safety gear or a child-safety product?",
    hint: "Harnesses, helmets, life jackets, car seats, cribs, and similar gear.",
    escalatesTo: "red",
    reason: "Safety gear has to meet strict standards. Replace it or contact the manufacturer instead of repairing it.",
    categories: ["clothing", "bikes", "furniture"],
  },
  {
    id: "e-bike",
    text: "Is it an electric bike or scooter, and does the problem involve the motor, battery, or wiring?",
    escalatesTo: "red",
    reason: "E-bike batteries and motors store a lot of energy and can catch fire. Take it to a shop that services e-bikes.",
    categories: ["bikes"],
  },
  {
    id: "hydraulic-brakes",
    text: "Does it have hydraulic disc brakes, or a brake cable that is frayed or snapped?",
    hint: "Hydraulic brakes have fluid-filled hoses instead of metal cables.",
    escalatesTo: "red",
    reason: "Hydraulic brakes and damaged brake cables need a bike mechanic's tools and a test ride.",
    categories: ["bikes"],
  },
  {
    id: "water",
    text: "Is there water or moisture near outlets, cords, or wiring?",
    hint: "This includes a plug-in item that got wet or was dropped in water.",
    escalatesTo: "yellow",
    reason: "Water and electricity don't mix. Unplug the item if you can reach the plug from a dry spot, and stop if water reaches an outlet or cord.",
    categories: ["small-appliances", "electronics", "home"],
  },
  {
    id: "tip-over",
    text: "Is it tall or heavy enough to tip over, like a dresser or bookcase?",
    escalatesTo: "yellow",
    reason: "Tall furniture can tip and injure someone. Work with a helper, empty the drawers first, and anchor it to the wall when you're done.",
    categories: ["furniture"],
  },
  {
    id: "unsure",
    text: "Are you unsure how it comes apart or what's causing the problem?",
    escalatesTo: "yellow",
    reason: "When you're not sure how something works, go slowly, take photos as you go, and stop if anything feels unsafe.",
  },
];

/** Numeric weight so we can compare/escalate safety levels. */
const RANK: Record<SafetyLevel, number> = { green: 0, yellow: 1, red: 2 };

/** Returns the more cautious of two safety levels. */
export function moreCautious(a: SafetyLevel, b: SafetyLevel): SafetyLevel {
  return RANK[a] >= RANK[b] ? a : b;
}

/** The questions that make sense for this item's category. */
export function questionsForItem(item: Pick<Item, "categoryId">): SafetyQuestion[] {
  return SAFETY_QUESTIONS.filter(
    (question) => !question.categories || question.categories.includes(item.categoryId),
  );
}

/** Accepts the old boolean answers as well as yes / no / unsure. */
function normalizeAnswer(value: SafetyAnswer | boolean | undefined): SafetyAnswer | undefined {
  if (value === true) return "yes";
  if (value === false) return "no";
  return value;
}

/**
 * Computes the final safety result from an item's baseline safety plus the
 * user's answers. The result can only become MORE cautious: "yes" and
 * "not sure" both escalate. Returns the level and every reason behind it.
 */
export function evaluateSafety(
  item: Pick<Item, "baseSafety" | "dangerous" | "baseReason">,
  answers: Record<string, SafetyAnswer | boolean | undefined>,
): { level: SafetyLevel; reasons: SafetyReason[] } {
  const reasons: SafetyReason[] = [];

  // A dangerous item is always red, regardless of answers.
  let level: SafetyLevel = item.dangerous ? "red" : item.baseSafety;
  if (item.dangerous) {
    reasons.push({
      text: item.baseReason ?? "This repair is on our do-not-DIY list and needs a professional.",
      level: "red",
      source: "item",
    });
  } else if (item.baseSafety !== "green" && item.baseReason) {
    reasons.push({ text: item.baseReason, level: item.baseSafety, source: "item" });
  }

  // Every known question counts, even ones not asked for this category:
  // an extra "yes" can only make the result more careful.
  for (const question of SAFETY_QUESTIONS) {
    const answer = normalizeAnswer(answers[question.id]);
    if (answer === "yes" || answer === "unsure") {
      level = moreCautious(level, question.escalatesTo);
      reasons.push({
        text: question.reason,
        level: question.escalatesTo,
        source: answer === "unsure" ? "unsure" : "answer",
        questionId: question.id,
      });
    }
  }

  return { level, reasons };
}

/** Rebuilds answers from the result page's query string. */
export function answersFromParams(params: {
  get(name: string): string | null;
}): Record<string, SafetyAnswer> {
  const answers: Record<string, SafetyAnswer> = {};
  const list = (name: string) => (params.get(name) ?? "").split(",").filter(Boolean);
  // "flags" is the older name for "yes" and still works in shared links.
  for (const id of [...list("flags"), ...list("yes")]) answers[id] = "yes";
  for (const id of list("unsure")) {
    if (answers[id] !== "yes") answers[id] = "unsure";
  }
  for (const id of list("no")) {
    if (!answers[id]) answers[id] = "no";
  }
  return answers;
}

/** Encodes answers into query params for the result page. */
export function answersToParams(
  answers: Record<string, SafetyAnswer | undefined>,
  params: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
  const pick = (value: SafetyAnswer) =>
    Object.entries(answers)
      .filter(([, answer]) => answer === value)
      .map(([id]) => id)
      .join(",");
  for (const value of ["yes", "unsure", "no"] as const) {
    const ids = pick(value);
    if (ids) params.set(value, ids);
  }
  return params;
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

/** The word printed in the sign header, as on a real ANSI safety sign. */
export function safetySignalWord(level: SafetyLevel): string {
  switch (level) {
    case "green":
      return "Safe to fix";
    case "yellow":
      return "Caution";
    case "red":
      return "Danger";
  }
}

/* -------------------------------------------------------------------------- */
/* Free-text hazard detection (scanner and search)                             */
/* -------------------------------------------------------------------------- */

/** A hazard found in something the user typed. */
export interface HazardMatch {
  id: string;
  label: string;
  level: SafetyLevel;
  reason: string;
}

interface HazardRule extends HazardMatch {
  /** Matches on its own. */
  pattern?: RegExp;
  /** Or: a subject and a condition that must appear close together. */
  near?: {
    subject: RegExp;
    condition: RegExp;
    /** Max characters between the two. Defaults to 30. */
    within?: number;
    /** Skip a subject that is followed by this (e.g. "outlet works fine"). */
    unless?: RegExp;
  };
}

const HAZARD_RULES: HazardRule[] = [
  {
    id: "gas",
    label: "Gas",
    level: "red",
    reason:
      "Gas leaks and gas appliances need a licensed professional. If you smell gas, leave now and call 911 or your gas company from outside.",
    pattern:
      /\b(?:natural gas|propane|butane|pilot lights?|rotten[- ]eggs?|gas[- ](?:leaks?|lines?|smell|odou?r|stoves?|ovens?|ranges?|cooktops?|furnaces?|dryers?|heaters?|water heaters?|fireplaces?|grills?|valves?|meters?|appliances?|burners?|powered)|smell(?:s|ed|ing)? (?:like |of )?gas|gas smell)\b/,
  },
  {
    id: "carbon-monoxide",
    label: "Carbon monoxide",
    level: "red",
    reason: "If a carbon monoxide alarm goes off, get everyone outside and call 911.",
    pattern: /\bcarbon monoxide\b/,
  },
  {
    id: "heating-system",
    label: "Furnace or water heater",
    level: "red",
    reason:
      "Furnaces, water heaters, and heat pumps involve gas, high voltage, or high pressure. Call a licensed technician.",
    pattern: /\b(?:water heaters?|boilers?|heat pumps?|furnaces?(?!\s+filters?))\b/,
  },
  {
    id: "microwave",
    label: "Microwave",
    level: "red",
    reason: "Microwaves store a high-voltage charge that can kill, even when unplugged.",
    pattern: /\bmicro-?waves?\b/,
  },
  {
    id: "high-voltage",
    label: "High voltage",
    level: "red",
    reason: "High-voltage parts like capacitors and power supplies can shock you even after unplugging.",
    pattern:
      /\b(?:high[- ]?voltage|capacitors?|crt|(?:tube|plasma) (?:tvs?|televisions?|monitors?)|power suppl(?:y|ies)|psu|neon (?:signs?|lights?)|(?:240|220) ?-?v(?:olts?)?|mains|inverters?)\b/,
  },
  {
    id: "wiring",
    label: "Electrical wiring",
    level: "red",
    reason:
      "Outlets, switches, light fixtures, and wiring connect to your home's power. A licensed electrician should handle them.",
    pattern:
      /\b(?:electrical wiring|house wiring|home wiring|in-wall wiring|rewir\w*|hard-?wir\w*|(?:breaker|fuse|service|electrical) (?:box|panel)(?:es|s)?|junction box(?:es)?|knob[- ]and[- ]tube|aluminum wiring|(?:exposed|live|bare|loose) wires?)\b/,
  },
  {
    id: "wiring-fixture",
    label: "Electrical wiring",
    level: "red",
    reason:
      "Outlets, switches, light fixtures, and wiring connect to your home's power. A licensed electrician should handle them.",
    near: {
      subject:
        /\b(?:outlets?|receptacles?|light switch(?:es)?|wall switch(?:es)?|dimmers?|light fixtures?|ceiling (?:fans?|lights?)|wall (?:plugs?|sockets?)|gfci|gfi|breakers?)\b/g,
      condition:
        /\b(?:spark\w*|burn\w*|smok\w*|scorch\w*|melt\w*|hot|warm|buzz\w*|crackl\w*|loose|broken|cracked|dead|not working|doesn'?t work|stopped working|won'?t work|no power|replac\w*|install\w*|wir\w*|chang\w*|swap\w*|trip\w*|shock\w*|zap\w*)\b/g,
      within: 25,
      unless: /^\s+(?:is\s+|are\s+)?(?:works?|working|fine|ok|okay|good)\b/,
    },
  },
  {
    id: "battery-damage",
    label: "Damaged battery",
    level: "red",
    reason:
      "Swollen, leaking, or damaged batteries can catch fire. Don't charge, open, or puncture it. Move it away from anything that can burn.",
    near: {
      subject: /\bbatter(?:y|ies)\b/g,
      condition:
        /\b(?:swell\w*|swollen|bulg\w*|puff\w*|leak\w*|hot|overheat\w*|smok\w*|hiss\w*|damaged|punctur\w*|dent\w*|crack\w*|fire)\b/g,
      within: 30,
    },
  },
  {
    id: "lithium",
    label: "Lithium battery",
    level: "red",
    reason:
      "Rechargeable lithium batteries in phones, laptops, and e-bikes can catch fire if punctured. Battery work belongs at a repair shop.",
    pattern: /\b(?:lithium(?!\s+grease)|li-?ion|lipo)\b/,
  },
  {
    id: "device-battery",
    label: "Lithium battery",
    level: "red",
    reason:
      "Rechargeable lithium batteries in phones, laptops, and e-bikes can catch fire if punctured. Battery work belongs at a repair shop.",
    near: {
      subject:
        /\b(?:e-?bikes?|electric (?:bikes?|bicycles?|scooters?|skateboards?)|e-?scooters?|hoverboards?|phones?|iphones?|smartphones?|laptops?|macbooks?|tablets?|ipads?|vapes?|power banks?|drones?|cordless (?:drills?|tools?|vacuums?))\b/g,
      condition: /\bbatter(?:y|ies)\b/g,
      within: 40,
    },
  },
  {
    id: "e-bike",
    label: "E-bike system",
    level: "red",
    reason:
      "E-bike and e-scooter motors and batteries store a lot of energy. Take it to a shop that services e-bikes.",
    near: {
      subject: /\b(?:e-?bikes?|electric (?:bikes?|bicycles?|scooters?)|e-?scooters?|hoverboards?)\b/g,
      condition:
        /\b(?:motors?|controllers?|wir\w*|charg\w*|won'?t (?:turn on|start|power on)|no power|dead|display|throttle)\b/g,
      within: 40,
    },
  },
  {
    id: "car-brakes",
    label: "Car brakes",
    level: "red",
    reason: "Vehicle brakes are life-safety parts. Have a certified mechanic do brake work.",
    near: {
      subject: /\b(?:cars?|trucks?|vans?|suvs?|vehicles?|autos?|motorcycles?)\b/g,
      condition: /\bbrak(?:e|es|ing)\b/g,
      within: 40,
    },
  },
  {
    id: "brake-hydraulics",
    label: "Hydraulic brakes",
    level: "red",
    reason: "Brake lines and hydraulic brakes are life-safety parts. Have a certified mechanic do brake work.",
    pattern: /\bbrake (?:lines?|fluid|calipers?|master cylinders?)\b/,
  },
  {
    id: "airbags",
    label: "Airbags",
    level: "red",
    reason: "Airbags contain explosive charges. Only a certified technician should touch them.",
    pattern: /\b(?:air ?bags?|srs (?:lights?|modules?))\b/,
  },
  {
    id: "power-tool",
    label: "Power tool motor",
    level: "red",
    reason:
      "Power tool motors involve wall power and fast-moving parts. Have a tool repair shop service the motor.",
    near: {
      subject:
        /\b(?:drills?|(?:circular|table|miter|chop|band|reciprocating|power|electric) saws?|jigsaws?|chainsaws?|grinders?|sanders?|power tools?|nail guns?|impact drivers?)\b/g,
      condition:
        /\b(?:motors?|brush(?:es)?|armatures?|spark\w*|smok\w*|burn\w*|won'?t (?:start|turn on|run|spin)|hum\w*)\b/g,
      within: 40,
    },
  },
  {
    id: "structural",
    label: "Structural",
    level: "red",
    reason:
      "Roofs, ladders, stairs, and anything holding up weight can fail or cause falls. Get a licensed contractor.",
    pattern:
      /\b(?:load[- ]bearing|structural|foundations?|roofs?|roofing|joists?|rafters?|(?:support|ceiling|floor) beams?|retaining walls?|stair (?:treads?|railings?|stringers?)|staircases?|handrails?|balcon(?:y|ies)|deck (?:joists?|posts?|railings?|supports?|beams?|footings?)|ladders?|chimneys?)\b/,
  },
  {
    id: "ceiling",
    label: "Ceiling leak",
    level: "red",
    reason:
      "A wet or sagging ceiling can mean roof or plumbing damage, and soaked drywall can fall. Call a roofer or plumber.",
    near: {
      subject: /\bceilings?\b/g,
      condition: /\b(?:stain\w*|leak\w*|sag\w*|drip\w*|crack\w*|water|wet|bulg\w*)\b/g,
      within: 30,
    },
  },
  {
    id: "garage-door",
    label: "Garage door springs",
    level: "red",
    reason:
      "Garage door springs and cables are under enormous tension and cause serious injuries. Call a garage door technician.",
    near: {
      subject: /\bgarage doors?\b/g,
      condition:
        /\b(?:springs?|cables?|won'?t (?:open|close|go up|go down)|stuck|off (?:the )?tracks?|openers?|crooked|fell|falling)\b/g,
      within: 40,
    },
  },
  {
    id: "torsion-spring",
    label: "Garage door springs",
    level: "red",
    reason:
      "Garage door springs and cables are under enormous tension and cause serious injuries. Call a garage door technician.",
    pattern: /\btorsion springs?\b/,
  },
  {
    id: "safety-gear",
    label: "Safety gear",
    level: "red",
    reason:
      "Safety gear and child-safety products must meet strict standards. Replace them or contact the manufacturer instead of repairing them.",
    pattern:
      /\b(?:car ?seats?|booster seats?|cribs?|bassinets?|helmets?|harness(?:es)?|life (?:jackets?|vests?)|pfds?|climbing (?:ropes?|gear)|carabiners?|seat ?belts?|safety (?:gear|equipment|straps?))\b/,
  },
  {
    id: "fire",
    label: "Fire or electrical hazard",
    level: "red",
    reason:
      "Smoke, sparks, burning smells, or melting mean a fire or electrical hazard. Unplug it only if it's safe to touch, and don't use it until a pro checks it.",
    pattern:
      /\b(?:smok(?:e|es|ed|ing|y)(?!\s+(?:detectors?|alarms?))|spark(?:s|ed|ing|y)?|scorch(?:ed|es|ing)?|melt(?:ed|ing|s)?|on fire|caught fire|flames?|burn(?:ing|t|ed)? (?:smell|odou?r|marks?|wires?|cords?|plugs?)|smell(?:s|ed|ing)? (?:like |of )?burn(?:ing|t|ed)?)\b/,
  },
  {
    id: "toxic-materials",
    label: "Asbestos or lead",
    level: "red",
    reason:
      "Asbestos, lead paint, and large mold problems need certified abatement pros. Don't sand, scrape, or disturb them.",
    pattern: /\b(?:asbestos|lead(?:-based)? paint|vermiculite|popcorn ceilings?|black mold|toxic mold)\b/,
  },
  {
    id: "water-electric",
    label: "Water near power",
    level: "red",
    reason:
      "Water near outlets or wiring can shock you. Stay out of standing water and call an electrician.",
    near: {
      subject: /\b(?:water|wet|leak\w*|flood\w*|damp|rain)\b/g,
      condition: /\b(?:outlets?|wir(?:e|es|ing)|breakers?|electrical panels?|power strips?|extension cords?)\b/g,
      within: 30,
    },
  },
  {
    id: "liquid-damage",
    label: "Liquid damage",
    level: "yellow",
    reason: "Turn it off and don't charge it until it's completely dry. Liquid can short the battery and circuits.",
    near: {
      subject: /\b(?:water|wet|spill\w*|soak\w*|dropped (?:it )?in|liquid|coffee|soda|juice)\b/g,
      condition: /\b(?:phones?|laptops?|keyboards?|tablets?|controllers?|remotes?|electronics?|computers?)\b/g,
      within: 30,
    },
  },
  {
    id: "broken-glass",
    label: "Broken glass",
    level: "yellow",
    reason: "Wear gloves and eye protection, and keep kids and pets away from broken glass.",
    near: {
      subject: /\b(?:glass|mirrors?|windows?|screens?|windshields?)\b/g,
      condition: /\b(?:shatter\w*|broken|cracked|smashed)\b/g,
      within: 20,
    },
  },
  {
    id: "chemicals",
    label: "Cleaning chemicals",
    level: "yellow",
    reason:
      "Never mix cleaning chemicals, and don't plunge a drain after using a chemical cleaner — it can splash.",
    pattern: /\b(?:drain cleaners?|drano|bleach and ammonia|mix(?:ing|ed)? (?:chemicals|cleaners))\b/,
  },
];

/** Lowercases text and straightens quotes so patterns match reliably. */
function normalizeForHazards(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[‐-–]/g, "-")
    .replace(/\s+/g, " ");
}

function matchesNear(text: string, near: NonNullable<HazardRule["near"]>): boolean {
  const within = near.within ?? 30;
  const subjects = [...text.matchAll(near.subject)].filter((match) => {
    if (!near.unless || match.index === undefined) return true;
    return !near.unless.test(text.slice(match.index + match[0].length));
  });
  if (subjects.length === 0) return false;
  const conditions = [...text.matchAll(near.condition)];
  return subjects.some((subject) =>
    conditions.some((condition) => {
      const subjectStart = subject.index ?? 0;
      const subjectEnd = subjectStart + subject[0].length;
      const conditionStart = condition.index ?? 0;
      const conditionEnd = conditionStart + condition[0].length;
      const gap =
        conditionStart >= subjectEnd
          ? conditionStart - subjectEnd
          : subjectStart - conditionEnd;
      return gap <= within;
    }),
  );
}

/**
 * Finds hazards in free text, such as the scanner's problem description.
 * Each hazard appears once, most serious first.
 */
export function detectHazards(text: string): HazardMatch[] {
  const normalized = normalizeForHazards(text);
  if (!normalized.trim()) return [];

  const found = new Map<string, HazardMatch>();
  for (const rule of HAZARD_RULES) {
    const hit = rule.pattern
      ? rule.pattern.test(normalized)
      : rule.near
        ? matchesNear(normalized, rule.near)
        : false;
    if (hit && !found.has(rule.label)) {
      found.set(rule.label, {
        id: rule.id,
        label: rule.label,
        level: rule.level,
        reason: rule.reason,
      });
    }
  }
  return [...found.values()].sort((a, b) => RANK[b.level] - RANK[a.level]);
}

/** True if the given free-text repair matches the dangerous list. */
export function isDangerousText(text: string): boolean {
  return detectHazards(text).some((hazard) => hazard.level === "red");
}
