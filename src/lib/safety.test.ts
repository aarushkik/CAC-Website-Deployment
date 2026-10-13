import { describe, expect, it } from "vitest";
import { guides, items } from "./data";
import { SAFETY_QUESTIONS, dangerMatches, evaluateSafety, isDangerousText, moreCautious } from "./safety";

describe("the safety result", () => {
  it("keeps a green item green when every answer is no", () => {
    expect(evaluateSafety({ baseSafety: "green" }, {}).level).toBe("green");
  });

  it("is always red for an item on the dangerous list, whatever the answers", () => {
    const noToAll = Object.fromEntries(SAFETY_QUESTIONS.map((q) => [q.id, false]));
    const result = evaluateSafety({ baseSafety: "green", dangerous: true }, noToAll);
    expect(result.level).toBe("red");
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("can only get more careful, never less", () => {
    for (const base of ["green", "yellow", "red"] as const) {
      for (const question of SAFETY_QUESTIONS) {
        const { level } = evaluateSafety({ baseSafety: base }, { [question.id]: true });
        expect(moreCautious(level, base)).toBe(level);
        expect(moreCautious(level, question.escalatesTo)).toBe(level);
      }
    }
  });

  it("gives the reason for every yes", () => {
    const { reasons } = evaluateSafety({ baseSafety: "green" }, { burning: true, water: true });
    expect(reasons).toHaveLength(2);
  });
});

describe("dangerous words in a description", () => {
  it.each([
    "my microwave stopped heating",
    "I want to rewire an outlet",
    "the brakes on my car squeal",
    "gas stove will not light",
    "my e-bike battery is dead",
    "phone battery is swollen",
    "smells like burning when I plug it in",
    "the airbag light is on",
  ])("flags: %s", (text) => {
    expect(isDangerousText(text)).toBe(true);
    expect(dangerMatches(text).length).toBeGreaterThan(0);
  });

  it.each(["flat bike tire", "missing coat button", "wobbly chair", "zipper is stuck"])(
    "does not flag: %s",
    (text) => {
      expect(isDangerousText(text)).toBe(false);
    },
  );
});

describe("the item list", () => {
  it("never links a dangerous or red item to a do-it-yourself guide", () => {
    for (const item of items) {
      if (item.dangerous || item.baseSafety === "red") {
        expect(item.guideId, item.id).toBeUndefined();
      }
    }
  });

  it("only links to guides that exist", () => {
    const known = new Set(guides.map((g) => g.id));
    for (const item of items) {
      if (item.guideId) expect(known.has(item.guideId), item.id).toBe(true);
    }
  });
});
