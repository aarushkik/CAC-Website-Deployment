#!/usr/bin/env node
/**
 * Refreshes src/data/pros.json: repair businesses across Washington State from
 * OpenStreetMap (© OpenStreetMap contributors, ODbL), grouped by trade.
 *
 *   node scripts/fetch-pros.mjs
 *
 * Trades and their OSM tags live in src/data/trades.json. The public Overpass
 * servers are sometimes overloaded, so each query tries several mirrors.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const trades = JSON.parse(readFileSync(join(root, "src/data/trades.json"), "utf8"));
const OUT = join(root, "src/data/pros.json");

const MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** "shop=bicycle" -> ["shop"="bicycle"], "name~garage door" -> ["name"~"garage door",i] */
function selector(tag) {
  const regex = tag.indexOf("~");
  if (regex > 0) return `["${tag.slice(0, regex)}"~"${tag.slice(regex + 1)}",i]`;
  const [key, value] = tag.split("=");
  return `["${key}"="${value}"]`;
}

async function overpass(query) {
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of MIRRORS) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "User-Agent": "FixIt-WA03/1.0 (Congressional App Challenge student project)" },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(120_000),
        });
        const text = await response.text();
        if (response.ok && text.trimStart().startsWith("{")) return JSON.parse(text);
        console.warn(`  ${new URL(url).host}: busy (${response.status})`);
      } catch (error) {
        console.warn(`  ${new URL(url).host}: ${error.message}`);
      }
    }
    await sleep(10_000 * (attempt + 1));
  }
  throw new Error("Every Overpass mirror was busy. Try again later.");
}

function address(tags) {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const line = [street, tags["addr:unit"] && `#${tags["addr:unit"]}`].filter(Boolean).join(" ");
  return line || undefined;
}

const byId = new Map();
for (const trade of trades) {
  console.log(`Fetching ${trade.label}…`);
  const parts = trade.osm.map((tag) => `nwr${selector(tag)}["name"](area.wa);`).join("");
  const query = `[out:json][timeout:180];area["ISO3166-2"="US-WA"][admin_level=4]->.wa;(${parts});out center tags;`;
  const { elements } = await overpass(query);
  let kept = 0;
  for (const element of elements) {
    const tags = element.tags ?? {};
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (!tags.name || lat === undefined || lng === undefined) continue;
    if (tags.disused || tags["disused:shop"] || tags.opening_hours === "closed") continue;
    const key = `${element.type}/${element.id}`;
    const existing = byId.get(key);
    if (existing) {
      if (!existing.trades.includes(trade.id)) existing.trades.push(trade.id);
      continue;
    }
    byId.set(key, {
      name: tags.name,
      trades: [trade.id],
      lat: Math.round(lat * 1e5) / 1e5,
      lng: Math.round(lng * 1e5) / 1e5,
      phone: tags.phone ?? tags["contact:phone"],
      website: tags.website ?? tags["contact:website"],
      address: address(tags),
      city: tags["addr:city"],
    });
    kept += 1;
  }
  console.log(`  ${kept} new listings`);
  await sleep(3_000);
}

const listings = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(OUT, `${JSON.stringify(listings)}\n`);
const withPhone = listings.filter((l) => l.phone).length;
console.log(`Wrote ${listings.length} listings (${withPhone} with a phone number) to src/data/pros.json`);
