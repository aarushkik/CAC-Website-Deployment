import { describe, expect, it } from "vitest";
import { categories, items } from "./data";
import { buildItemIndex, matchConfidence, matchItems, stem, tokenize } from "./match";

const index = buildItemIndex(items, categories);
const top = (query: string) => matchItems(query, index)[0]?.item.id;

describe("stem", () => {
  it.each([
    ["dripping", "drip"],
    ["drips", "drip"],
    ["leaky", "leak"],
    ["leaking", "leak"],
    ["brakes", "brak"],
    ["braking", "brak"],
    ["wobbly", "wobbl"],
    ["wobble", "wobbl"],
    ["batteries", "batter"],
    ["switches", "switch"],
    ["clogged", "clog"],
    ["tire", "tire"],
  ])("%s -> %s", (word, expected) => {
    expect(stem(word)).toBe(expected);
  });
});

describe("tokenize", () => {
  it("drops filler words and maps synonyms", () => {
    expect(tokenize("My bicycle tyre won't hold air")).toEqual(["bike", "tire", "hold", "air"]);
  });
});

describe("matchItems", () => {
  it.each([
    ["my bike tire is flat", "flat-tire"],
    ["lamp won't turn on", "lamp-cord"],
    ["toaster lever won't stay down", "toaster-lever-stuck"],
    ["my faucet keeps dripping", "leaky-faucet"],
    ["zip is stuck on my jacket", "stuck-zipper"],
    ["phone only charges at an angle", "phone-not-charging"],
    ["squeaky door", "squeaky-door"],
    ["hole in the knee of my jeans", "jeans-hole"],
    ["vacuum has no suction", "vacuum-suction"],
    ["toilet keeps running", "running-toilet"],
    ["microwave not heating food", "microwave"],
  ])("matches %s", (query, expected) => {
    expect(top(query)).toBe(expected);
  });

  it("is confident about clear descriptions and unsure about vague ones", () => {
    expect(matchConfidence(matchItems("my bike tire is flat", index))).toBe("strong");
    expect(matchConfidence(matchItems("bike", index))).not.toBe("strong");
    expect(matchConfidence(matchItems("purple elephant", index))).toBe("weak");
  });

  it("leaves out catch-all items unless asked", () => {
    expect(matchItems("something else", index).some((m) => m.item.generic)).toBe(false);
  });

  it("returns nothing for an empty query", () => {
    expect(matchItems("   ", index)).toEqual([]);
  });
});
