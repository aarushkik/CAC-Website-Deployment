import { describe, expect, it } from "vitest";
import { categories, getGenericItem, guides, items, places, resources } from "./data";

/**
 * The catalog is hand-edited JSON, so these checks catch typos and, more
 * importantly, safety mistakes like a red item pointing to a DIY guide.
 */
describe("catalog integrity", () => {
  it("has unique ids", () => {
    for (const list of [items, guides, categories, resources]) {
      const ids = list.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("only uses known categories and guides", () => {
    const categoryIds = new Set(categories.map((c) => c.id));
    const guideIds = new Set(guides.map((g) => g.id));
    for (const item of items) {
      expect(categoryIds.has(item.categoryId), item.id).toBe(true);
      if (item.guideId) expect(guideIds.has(item.guideId), item.id).toBe(true);
    }
    for (const resource of resources) {
      for (const id of resource.categories) expect(categoryIds.has(id), resource.id).toBe(true);
    }
  });

  it("never links a red or dangerous item to a DIY guide", () => {
    for (const item of items) {
      if (item.dangerous || item.baseSafety === "red") {
        expect(item.guideId, item.id).toBeUndefined();
      }
    }
  });

  it("marks every dangerous item red", () => {
    for (const item of items.filter((i) => i.dangerous)) {
      expect(item.baseSafety, item.id).toBe("red");
    }
  });

  it("explains every yellow or red baseline", () => {
    for (const item of items.filter((i) => i.baseSafety !== "green")) {
      expect(item.baseReason, item.id).toBeTruthy();
    }
  });

  it("has one catch-all item per category", () => {
    for (const category of categories) {
      expect(getGenericItem(category.id), category.id).toBeDefined();
      expect(items.filter((i) => i.generic && i.categoryId === category.id)).toHaveLength(1);
    }
  });

  it("uses every guide and gives each one steps and safety tips", () => {
    const used = new Set(items.map((i) => i.guideId));
    for (const guide of guides) {
      expect(used.has(guide.id), guide.id).toBe(true);
      expect(guide.steps.length, guide.id).toBeGreaterThanOrEqual(3);
      expect(guide.safetyTips.length, guide.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps costs and weights non-negative", () => {
    for (const item of items) {
      for (const value of [
        item.estimatedRepairCost,
        item.estimatedProCost,
        item.estimatedReplacementCost,
        item.estimatedWeightLbs,
      ]) {
        if (value !== undefined) expect(value, item.id).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("places resources and towns in Southwest Washington", () => {
    const inArea = (lat: number, lng: number) => lat > 45.4 && lat < 47.1 && lng > -124.3 && lng < -121.5;
    for (const resource of resources) {
      if (resource.lat !== undefined && resource.lng !== undefined) {
        expect(inArea(resource.lat, resource.lng), resource.id).toBe(true);
      }
      if (resource.website) expect(resource.website.startsWith("https://"), resource.id).toBe(true);
    }
    const inWashington = (lat: number, lng: number) => lat > 45.5 && lat < 49.1 && lng > -124.9 && lng < -116.9;
    for (const place of places) {
      const check = place.region === "statewide" ? inWashington : inArea;
      expect(check(place.lat, place.lng), place.name).toBe(true);
    }
  });
});
