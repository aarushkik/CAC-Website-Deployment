import { describe, expect, it } from "vitest";
import { analyzeDescription, mergeAiResult, type AiScanResult } from "./scan";

const ai = (partial: Partial<AiScanResult>): AiScanResult => ({
  objectName: "",
  matches: [],
  confidence: "medium",
  hazards: [],
  isRepairPhoto: true,
  ...partial,
});

describe("analyzeDescription", () => {
  it("matches the description and flags hazards on the device", () => {
    const result = analyzeDescription("my microwave sparks when I turn it on");
    expect(result.suggestions[0]?.item.id).toBe("microwave");
    expect(result.hazards.map((h) => h.label)).toEqual(expect.arrayContaining(["Microwave", "Fire or electrical hazard"]));
  });

  it("drops weak alternatives that only share a word or two", () => {
    const ids = analyzeDescription("my microwave sparks when I turn it on").suggestions.map((s) => s.item.id);
    expect(ids).not.toContain("lamp-cord");
  });
});

describe("mergeAiResult", () => {
  it("returns the device result unchanged without AI", () => {
    const local = analyzeDescription("flat bike tire");
    expect(mergeAiResult(local, null)).toBe(local);
  });

  it("puts items both sources agree on first and marks them", () => {
    const local = analyzeDescription("it's flat");
    const merged = mergeAiResult(local, ai({ matches: ["flat-tire"], confidence: "high", objectName: "bike tire" }));
    expect(merged.suggestions[0]).toMatchObject({ source: "both" });
    expect(merged.suggestions[0]?.item.id).toBe("flat-tire");
    expect(merged.confidence).toBe("strong");
    expect(merged.seen).toBe("bike tire");
  });

  it("adds hazards the photo shows, even when the words don't mention them", () => {
    const merged = mergeAiResult(analyzeDescription("toaster won't work"), ai({ matches: ["toaster-lever-stuck"], hazards: ["fire"] }));
    expect(merged.hazards[0]).toMatchObject({ label: "Fire or electrical hazard", level: "red" });
  });

  it("ignores unknown item ids from the AI and trusts only its top pick when unsure", () => {
    const merged = mergeAiResult(
      analyzeDescription(""),
      ai({ matches: ["not-a-real-item", "dry-chain", "flat-tire"], confidence: "low" }),
    );
    expect(merged.suggestions.map((s) => s.item.id)).toEqual(["dry-chain"]);
  });

  it("notes when the photo isn't of something to repair", () => {
    expect(mergeAiResult(analyzeDescription("lamp"), ai({ isRepairPhoto: false })).notRepairPhoto).toBe(true);
  });
});
