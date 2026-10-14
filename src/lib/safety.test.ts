import { describe, expect, it } from "vitest";
import { categories, items } from "./data";
import {
  DANGEROUS_REPAIRS,
  SAFETY_QUESTIONS,
  answersFromParams,
  answersToParams,
  detectHazards,
  evaluateSafety,
  isDangerousText,
  moreCautious,
  questionsForItem,
} from "./safety";
import type { SafetyLevel } from "./types";

const RANK: Record<SafetyLevel, number> = { green: 0, yellow: 1, red: 2 };

describe("evaluateSafety", () => {
  it("keeps every dangerous item red, whatever the answers", () => {
    const allNo = Object.fromEntries(SAFETY_QUESTIONS.map((q) => [q.id, "no" as const]));
    for (const item of items.filter((i) => i.dangerous)) {
      expect(evaluateSafety(item, {}).level).toBe("red");
      expect(evaluateSafety(item, allNo).level).toBe("red");
    }
  });

  it("never lowers an item below its baseline", () => {
    for (const item of items) {
      for (const question of SAFETY_QUESTIONS) {
        for (const answer of ["yes", "no", "unsure"] as const) {
          const { level } = evaluateSafety(item, { [question.id]: answer });
          expect(RANK[level]).toBeGreaterThanOrEqual(RANK[item.baseSafety]);
        }
      }
    }
  });

  it("escalates on yes and on not sure, but not on no", () => {
    const item = items.find((i) => i.id === "flat-tire")!;
    expect(evaluateSafety(item, { structural: "no" }).level).toBe("green");
    expect(evaluateSafety(item, { structural: "yes" }).level).toBe("red");
    expect(evaluateSafety(item, { structural: "unsure" }).level).toBe("red");
    expect(evaluateSafety(item, { unsure: "yes" }).level).toBe("yellow");
  });

  it("explains a not-sure answer as its own kind of reason", () => {
    const item = items.find((i) => i.id === "torn-seam")!;
    const { reasons } = evaluateSafety(item, { "safety-gear": "unsure" });
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatchObject({ source: "unsure", level: "red", questionId: "safety-gear" });
  });

  it("explains a yellow or red baseline", () => {
    const lamp = items.find((i) => i.id === "lamp-cord")!;
    const { level, reasons } = evaluateSafety(lamp, {});
    expect(level).toBe("yellow");
    expect(reasons[0]?.source).toBe("item");
  });

  it("still accepts the older boolean answers", () => {
    const item = items.find((i) => i.id === "flat-tire")!;
    expect(evaluateSafety(item, { structural: true }).level).toBe("red");
    expect(evaluateSafety(item, { structural: false }).level).toBe("green");
  });

  it("lets honest answers about bike brakes reach the brake guide", () => {
    // Brakes "keep people safe", but adjusting pads isn't a broken part.
    const brakes = items.find((i) => i.id === "bike-brakes")!;
    const answers = Object.fromEntries(questionsForItem(brakes).map((q) => [q.id, "no" as const]));
    expect(evaluateSafety(brakes, answers).level).toBe("yellow");
  });
});

describe("moreCautious", () => {
  it("picks the stricter level", () => {
    expect(moreCautious("green", "yellow")).toBe("yellow");
    expect(moreCautious("red", "yellow")).toBe("red");
    expect(moreCautious("green", "green")).toBe("green");
  });
});

describe("questionsForItem", () => {
  it("asks only questions that fit the category", () => {
    const clothing = questionsForItem({ categoryId: "clothing" }).map((q) => q.id);
    expect(clothing).not.toContain("gas");
    expect(clothing).toContain("safety-gear");
    expect(questionsForItem({ categoryId: "bikes" }).map((q) => q.id)).toContain("e-bike");
  });

  it("asks every category at least the 'unsure' question", () => {
    for (const category of categories) {
      expect(questionsForItem({ categoryId: category.id }).map((q) => q.id)).toContain("unsure");
    }
  });
});

describe("answers in the URL", () => {
  it("round-trips yes, no, and not sure", () => {
    const answers = { gas: "yes", water: "unsure", unsure: "no" } as const;
    const params = answersToParams(answers);
    expect(answersFromParams(params)).toEqual(answers);
  });

  it("reads the older 'flags' parameter as yes", () => {
    const params = new URLSearchParams("flags=burning,water");
    expect(answersFromParams(params)).toEqual({ burning: "yes", water: "yes" });
  });
});

describe("hazard detection", () => {
  it("detects every repair on the dangerous list", () => {
    for (const repair of DANGEROUS_REPAIRS) {
      expect(isDangerousText(repair), repair).toBe(true);
    }
  });

  it.each([
    "my microwave isn't heating",
    "Microwaves",
    "the gas stove burner won't light",
    "kitchen smells like gas",
    "my truck's brakes are grinding",
    "swollen phone battery",
    "the e-bike won't charge",
    "sparking outlet in the bedroom",
    "outlet stopped working",
    "water stain on the ceiling",
    "garage door won't close",
    "my kid's car seat strap is torn",
    "power drill motor smells like burning",
    "replace the light switch",
    "roof is leaking",
    "old house with asbestos tiles",
  ])("flags %s as dangerous", (text) => {
    expect(isDangerousText(text)).toBe(true);
  });

  it.each([
    "squeaky door hinge",
    "torn seam on my jacket",
    "my bike brakes are loose",
    "lamp stopped working, outlet works fine",
    "lamp won't turn on even in a different outlet",
    "used white lithium grease on the hinge",
    "smoke detector keeps chirping",
    "replace the batteries in my TV remote",
    "my wifi router won't turn on",
    "flat tire on my e-bike",
    "",
  ])("does not flag %s as dangerous", (text) => {
    expect(isDangerousText(text)).toBe(false);
  });

  it("lists the most serious hazard first and doesn't repeat labels", () => {
    const hazards = detectHazards("spilled water on my laptop and now the outlet sparks");
    expect(hazards[0]?.level).toBe("red");
    const labels = hazards.map((h) => h.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("marks liquid damage as caution, not danger", () => {
    const hazards = detectHazards("spilled coffee on my keyboard");
    expect(hazards.map((h) => h.label)).toContain("Liquid damage");
    expect(hazards.every((h) => h.level === "yellow")).toBe(true);
  });
});
