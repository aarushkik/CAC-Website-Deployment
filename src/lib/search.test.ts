import { describe, expect, it } from "vitest";
import { demoEntries, isDemoEntry } from "./demo";
import { byCategory, computeImpact, estimateSavings, moneySavedByMonth } from "./impact";
import { findItems } from "./search";
import { parseRepairLog } from "./storage";

describe("finding an item from a description", () => {
  it.each([
    ["my bike tire keeps going flat", "flat-tire"],
    ["the zipper on my jacket is stuck", "stuck-zipper"],
    ["kitchen chair wobbles", "wobbly-chair"],
    ["bathroom tap is dripping", "leaky-faucet"],
    ["lost a button on my coat", "missing-button"],
    ["toilet keeps running", "running-toilet"],
  ])("%s", (text, expected) => {
    expect(findItems(text)[0]?.id).toBe(expected);
  });

  it("finds nothing for words that are not about an item", () => {
    expect(findItems("help it is broken")).toEqual([]);
    expect(findItems("")).toEqual([]);
  });
});

describe("impact numbers", () => {
  const log = demoEntries(new Date("2026-06-15T12:00:00Z"));

  it("adds up money, waste and repairs, and counts pro visits separately", () => {
    const totals = computeImpact(log);
    expect(totals.totalMoneySaved).toBe(326);
    expect(totals.totalWasteAvoidedLbs).toBe(24);
    expect(totals.referredToPro).toBe(1);
    expect(totals.totalRepairs).toBe(7);
  });

  it("puts the months oldest first", () => {
    const months = moneySavedByMonth(log).map((m) => m.month);
    expect(months[0]).toMatch(/^Mar/);
    expect(months[months.length - 1]).toMatch(/^Jun/);
  });

  it("groups by category, most repairs first", () => {
    const groups = byCategory(log);
    expect(groups[0].count).toBeGreaterThanOrEqual(groups[groups.length - 1].count);
    expect(groups.reduce((sum, g) => sum + g.count, 0)).toBe(log.length);
  });

  it("never estimates negative savings", () => {
    expect(estimateSavings({ estimatedRepairCost: 60, estimatedReplacementCost: 40 })).toBe(0);
    expect(estimateSavings({ estimatedRepairCost: 3, estimatedReplacementCost: 30 })).toBe(27);
  });

  it("marks every example entry so it can be removed again", () => {
    expect(log.every(isDemoEntry)).toBe(true);
  });
});

describe("restoring a backup", () => {
  it("accepts a real log and refuses anything else", () => {
    const log = demoEntries();
    expect(parseRepairLog(JSON.stringify(log))).toHaveLength(log.length);
    expect(parseRepairLog("not json")).toBeNull();
    expect(parseRepairLog('{"a":1}')).toBeNull();
    expect(parseRepairLog('[{"id":"x","itemName":"y","date":"nope","outcome":"fixed"}]')).toBeNull();
  });
});

import { buildQuery, kindsFor, parsePlaces, type OverpassElement } from "./nearby";
import { categories, customItem, items as allItems, itemFromParams } from "./data";
import { evaluateSafety } from "./safety";

describe("nearby places from OpenStreetMap", () => {
  const vancouver = { lat: 45.6387, lng: -122.6615 };

  it("asks for the right kinds of place inside the radius", () => {
    const query = buildQuery(vancouver, 10, kindsFor("bikes"));
    expect(query).toContain("around:16093,45.63870,-122.66150");
    expect(query).toContain('["shop"~"^(bicycle)$"]');
    expect(query).toContain('["amenity"~"^(bicycle_repair_station)$"]');
  });

  it("knows what to look for in every category", () => {
    for (const category of categories) expect(kindsFor(category.id).length, category.id).toBeGreaterThan(0);
  });

  it("sorts by distance, names unnamed places, drops duplicates and closed shops", () => {
    const places = parsePlaces(
      [
        { type: "node", id: 1, lat: 45.7, lon: -122.66, tags: { shop: "bicycle", name: "Far Bikes", website: "farbikes.example" } },
        { type: "way", id: 2, center: { lat: 45.64, lon: -122.66 }, tags: { shop: "bicycle", name: "Near Bikes", phone: "+1 360 555 0100" } },
        { type: "node", id: 3, lat: 45.64, lon: -122.66, tags: { shop: "bicycle", name: "Near Bikes" } },
        { type: "node", id: 4, lat: 45.65, lon: -122.66, tags: { amenity: "bicycle_repair_station" } },
        { type: "node", id: 5, lat: 45.65, lon: -122.67, tags: { shop: "bicycle", name: "Gone", "disused:shop": "bicycle" } },
        { type: "node", id: 6, lat: 45.65, lon: -122.67, tags: { shop: "bakery", name: "Not a repair place" } },
        { type: "node", id: 7, tags: { shop: "bicycle", name: "No position" } },
      ],
      vancouver,
      kindsFor("bikes"),
    );
    expect(places.map((p) => p.name)).toEqual(["Near Bikes", "Public bike repair stand", "Far Bikes"]);
    expect(places[2].website).toBe("https://farbikes.example");
    expect(places[0].distanceMiles).toBeLessThan(places[2].distanceMiles);
  });
});

describe("things that are not on the list", () => {
  it("start at yellow and never get a guide", () => {
    const item = customItem("my umbrella will not open");
    expect(item.baseSafety).toBe("yellow");
    expect(item.guideId).toBeUndefined();
    expect(evaluateSafety(item, {}).level).toBe("yellow");
  });

  it("are red when the words point at the dangerous list", () => {
    expect(evaluateSafety(customItem("gas fireplace will not light"), {}).level).toBe("red");
  });

  it("are read from the address, a listed item wins", () => {
    const params = (query: string) => new URLSearchParams(query);
    expect(itemFromParams(params("item=flat-tire"))?.id).toBe("flat-tire");
    expect(itemFromParams(params("custom=umbrella"))?.id).toBe("custom");
    expect(itemFromParams(params(""))).toBeUndefined();
  });
});

describe("the bigger dataset", () => {
  it("has plenty of repairs in every category", () => {
    expect(allItems.length).toBeGreaterThanOrEqual(130);
    for (const category of categories) {
      expect(allItems.filter((i) => i.categoryId === category.id).length, category.id).toBeGreaterThanOrEqual(6);
    }
  });

  it("can be found by its own name", () => {
    for (const item of allItems) {
      expect(findItems(item.name, 8).map((i) => i.id), item.name).toContain(item.id);
    }
  });
});

import snapshot from "@/data/osm-places.json";

describe("the saved copy of OpenStreetMap", () => {
  const cities = { Vancouver: [45.6387, -122.6615], Longview: [46.1382, -122.9382], Centralia: [46.7162, -122.954] };

  it("has hundreds of places, all inside the saved area", () => {
    const [south, west, north, east] = snapshot.box;
    expect(snapshot.elements.length).toBeGreaterThan(300);
    for (const e of snapshot.elements) {
      expect(e.lat >= south && e.lat <= north && e.lon >= west && e.lon <= east).toBe(true);
    }
  });

  it.each(Object.entries(cities))("finds places near %s", (_, [lat, lng]) => {
    const origin = { lat, lng };
    const places = parsePlaces(snapshot.elements as OverpassElement[], origin, kindsFor("auto")).filter((p) => p.distanceMiles <= 10);
    expect(places.length).toBeGreaterThan(0);
    expect(places[0].distanceMiles).toBeLessThanOrEqual(places[places.length - 1].distanceMiles);
  });
});

import { cleanRepair, cleanTeamCode, cleanTeamName, newTeamCode, totalsFrom } from "./community";
import { parseRecalls } from "./recalls";

describe("the shared counter", () => {
  it("reads totals and categories from what Redis sends", () => {
    expect(totalsFrom(["repairs", "12", "saved", "340.5", "lbs", "61", "cat:bikes", "7", "junk", "x"])).toEqual({
      repairs: 12, saved: 340.5, lbs: 61, categories: { bikes: 7 },
    });
    expect(totalsFrom(null)).toEqual({ repairs: 0, saved: 0, lbs: 0, categories: {} });
  });

  it("caps one post and refuses nonsense", () => {
    expect(cleanRepair({ saved: 25, lbs: 2 })).toEqual({ saved: 25, lbs: 2 });
    expect(cleanRepair({ saved: 999999, lbs: 999999 })).toEqual({ saved: 2000, lbs: 300 });
    expect(cleanRepair({ saved: -5, lbs: 1 })).toBeNull();
    expect(cleanRepair({ saved: "lots", lbs: 1 })).toBeNull();
    expect(cleanRepair(null)).toBeNull();
  });

  it("only lets plain team names and well-formed codes through", () => {
    expect(cleanTeamName("  Ms. Lee's  4th Period ")).toBe("Ms. Lee's 4th Period");
    expect(cleanTeamName("<script>")).toBe("");
    expect(cleanTeamName("ab")).toBe("");
    const code = newTeamCode();
    expect(cleanTeamCode(code.toLowerCase())).toBe(code);
    expect(cleanTeamCode("ABC")).toBe("");
    expect(cleanTeamCode("O0I1AA")).toBe("");
  });
});

describe("the recall database", () => {
  it("keeps real notices, newest first, and spots its own error reply", () => {
    const recalls = parseRecalls([
      { RecallDate: "2021-03-01T00:00:00", Title: "Old Heater Recall", URL: "https://www.cpsc.gov/Recalls/2021/old", Hazards: [{ Name: "Fire" }], Remedies: [{ Name: "Refund" }] },
      { RecallDate: "2024-06-01T00:00:00", Title: "New Heater Recall", URL: "https://www.cpsc.gov/Recalls/2024/new" },
      { RecallDate: "2024-07-01T00:00:00", Title: "Odd link", URL: "https://example.com/x" },
    ]);
    expect(recalls?.map((r) => r.title)).toEqual(["New Heater Recall", "Old Heater Recall"]);
    expect(recalls?.[1].hazard).toBe("Fire");
    expect(parseRecalls([{ Title: "Error retrieving Recalls: provider failed", URL: null }])).toBeNull();
    expect(parseRecalls("nope")).toBeNull();
  });
});

import { existsSync } from "node:fs";
import { MODELS, modelForGuide, modelForItem } from "./models";
import { getGuide as findGuide, getItem as findItem } from "./data";

describe("the 3D models", () => {
  it("all have their file in public/models, and no id is used twice", () => {
    expect(MODELS.length).toBeGreaterThan(80);
    expect(new Set(MODELS.map((m) => m.id)).size).toBe(MODELS.length);
    for (const model of MODELS) expect(existsSync(`public/models/${model.file}`), model.file).toBe(true);
  });

  it("only point at guides and items that exist", () => {
    for (const model of MODELS) {
      for (const id of model.guides) expect(findGuide(id), id).toBeDefined();
      for (const id of model.items) expect(findItem(id), id).toBeDefined();
    }
  });

  it("are found for a guide, and for an item through its guide", () => {
    expect(modelForGuide("running-toilet")?.id).toBe("toilet");
    expect(modelForItem({ id: "running-toilet", guideId: "running-toilet" })?.id).toBe("toilet");
    expect(modelForItem({ id: "microwave" })?.source).toBe("polyhaven");
    expect(modelForItem({ id: "no-such-item" })).toBeUndefined();
  });
});
