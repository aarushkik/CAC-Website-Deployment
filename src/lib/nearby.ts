import { haversineDistanceMiles, type Coordinates } from "./distance";

/**
 * Repair places around a point, from OpenStreetMap. This is what keeps "Local
 * help" from being limited to the hand-written list: hundreds of real places in
 * one region ship with the app, and anywhere else is searched live.
 * It is whatever volunteers have mapped. Nothing here is checked by FixIt, and
 * the page says so.
 */

export interface NearbyPlace {
  id: string;
  name: string;
  /** Plain-language kind of place, e.g. "Bike shop". */
  type: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  phone?: string;
  website?: string;
  address?: string;
  openingHours?: string;
}

/** OpenStreetMap tag -> what we call it. The key is "tag=value". */
const KINDS: Record<string, string> = {
  "shop=bicycle": "Bike shop",
  "amenity=bicycle_repair_station": "Public bike repair stand",
  "craft=tailor": "Tailor",
  "shop=tailor": "Tailor",
  "craft=dressmaker": "Dressmaker",
  "shop=sewing": "Sewing shop",
  "craft=shoemaker": "Shoe repair",
  "shop=shoe_repair": "Shoe repair",
  "craft=electronics_repair": "Electronics repair",
  "shop=mobile_phone": "Phone shop",
  "shop=computer": "Computer shop",
  "shop=appliance": "Appliance shop",
  "shop=repair": "Repair shop",
  "craft=upholsterer": "Upholsterer",
  "craft=carpenter": "Carpenter",
  "craft=plumber": "Plumber",
  "craft=electrician": "Electrician",
  "craft=handyman": "Handyman",
  "craft=hvac": "Heating and cooling",
  "shop=hardware": "Hardware store",
  "shop=doityourself": "Home improvement store",
  "shop=car_repair": "Auto repair",
  "shop=tyres": "Tire shop",
  "amenity=tool_library": "Tool library",
  "shop=garden_centre": "Garden centre",
};

/** Which kinds of place can help with which category of item. */
const KINDS_FOR_CATEGORY: Record<string, string[]> = {
  clothing: ["craft=tailor", "shop=tailor", "craft=dressmaker", "shop=sewing"],
  "shoes-bags": ["craft=shoemaker", "shop=shoe_repair", "craft=tailor", "shop=tailor"],
  "small-appliances": ["craft=electronics_repair", "shop=appliance", "shop=repair", "shop=hardware"],
  kitchen: ["shop=appliance", "shop=repair", "shop=hardware"],
  furniture: ["craft=upholsterer", "craft=carpenter", "amenity=tool_library", "shop=hardware"],
  bikes: ["shop=bicycle", "amenity=bicycle_repair_station"],
  electronics: ["craft=electronics_repair", "shop=mobile_phone", "shop=computer", "shop=repair"],
  home: ["craft=plumber", "craft=electrician", "craft=handyman", "craft=hvac", "shop=hardware", "shop=doityourself", "amenity=tool_library"],
  outdoor: ["shop=hardware", "shop=doityourself", "shop=garden_centre", "amenity=tool_library"],
  toys: ["shop=repair", "amenity=tool_library", "craft=electronics_repair"],
  auto: ["shop=car_repair", "shop=tyres"],
};

/** With no category chosen: the places that are most clearly about repair. */
const DEFAULT_KINDS = [
  "shop=repair", "amenity=tool_library", "shop=bicycle", "craft=tailor", "shop=tailor", "craft=shoemaker",
  "shop=shoe_repair", "craft=electronics_repair", "craft=upholsterer", "shop=appliance", "shop=hardware",
];

export function kindsFor(categoryId: string): string[] {
  return KINDS_FOR_CATEGORY[categoryId] ?? DEFAULT_KINDS;
}

/** The Overpass query for these kinds of place within a radius. */
export function buildQuery(origin: Coordinates, radiusMiles: number, kinds: string[]): string {
  const metres = Math.round(radiusMiles * 1609.34);
  const around = `(around:${metres},${origin.lat.toFixed(5)},${origin.lng.toFixed(5)})`;
  const byKey = new Map<string, string[]>();
  for (const kind of kinds) {
    const [key, value] = kind.split("=");
    byKey.set(key, [...(byKey.get(key) ?? []), value]);
  }
  const parts = Array.from(byKey, ([key, values]) => `nwr${around}["${key}"~"^(${values.join("|")})$"];`);
  return `[out:json][timeout:25];(${parts.join("")});out center tags 150;`;
}

export interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string | undefined>;
}

function safeWebsite(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(url).protocol.startsWith("http") ? url : undefined;
  } catch {
    return undefined;
  }
}

/** Turns an Overpass answer into a tidy list, nearest first, without duplicates. */
export function parsePlaces(
  elements: OverpassElement[],
  origin: Coordinates,
  kinds: string[],
): NearbyPlace[] {
  const seen = new Set<string>();
  const places: NearbyPlace[] = [];
  for (const element of elements) {
    const tags = element.tags ?? {};
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    // places that have closed down stay on the map for a while with these marks
    if (tags["disused:shop"] || tags["abandoned"] || tags["access"] === "private") continue;

    const kind = kinds.find((k) => {
      const [key, value] = k.split("=");
      return tags[key] === value;
    });
    if (!kind) continue;
    const type = KINDS[kind] ?? "Repair place";
    const name = tags.name ?? type;
    const key = `${name.toLowerCase()}|${lat.toFixed(3)}|${lng.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
    places.push({
      id: `${element.type}/${element.id}`,
      name,
      type,
      lat,
      lng,
      distanceMiles: haversineDistanceMiles({ lat, lng }, origin),
      phone: tags.phone ?? tags["contact:phone"],
      website: safeWebsite(tags.website ?? tags["contact:website"]),
      address: [street, tags["addr:city"]].filter(Boolean).join(", ") || undefined,
      openingHours: tags.opening_hours,
    });
  }
  return places.sort((a, b) => a.distanceMiles - b.distanceMiles);
}

export interface NearbyResult {
  places: NearbyPlace[];
  /** "saved": the copy that ships with the app. "live": asked OpenStreetMap just now. */
  source: "saved" | "live";
  /** For the saved copy, the day it was downloaded. */
  fetched?: string;
}

function within(places: NearbyPlace[], origin: Coordinates, radiusMiles: number): NearbyPlace[] {
  return places
    .map((place) => ({ ...place, distanceMiles: haversineDistanceMiles(place, origin) }))
    .filter((place) => place.distanceMiles <= radiusMiles)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

/**
 * Repair places around a point.
 *
 * Inside Southwest Washington the answer comes from src/data/osm-places.json, a
 * copy of OpenStreetMap made with scripts/fetch_places.py. That is instant and
 * works offline. Anywhere else it asks our own /api/nearby, which asks
 * OpenStreetMap live and retries when a server is busy. Throws when a live
 * search gets no answer.
 */
export async function findNearby(
  origin: Coordinates,
  radiusMiles: number,
  categoryId: string,
): Promise<NearbyResult> {
  const kinds = kindsFor(categoryId);
  const snapshot = (await import("@/data/osm-places.json")).default as unknown as {
    fetched: string;
    box: number[];
    elements: OverpassElement[];
  };
  const [south, west, north, east] = snapshot.box;
  // the whole search circle has to fit in the saved area, or places would be missing
  const reach = radiusMiles / 69;
  const reachEastWest = radiusMiles / (69 * Math.cos((origin.lat * Math.PI) / 180));
  const inside =
    origin.lat - reach >= south - 0.3 &&
    origin.lat + reach <= north + 0.3 &&
    origin.lng - reachEastWest >= west - 0.3 &&
    origin.lng + reachEastWest <= east + 0.3 &&
    origin.lat >= south && origin.lat <= north && origin.lng >= west && origin.lng <= east;
  if (inside) {
    return {
      places: within(parsePlaces(snapshot.elements, origin, kinds), origin, radiusMiles),
      source: "saved",
      fetched: snapshot.fetched,
    };
  }

  const cacheKey = `fixit-nearby:${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${radiusMiles}:${categoryId}`;
  let places: NearbyPlace[] | null = null;
  try {
    const kept = window.sessionStorage.getItem(cacheKey);
    if (kept) places = JSON.parse(kept) as NearbyPlace[];
  } catch {
    // no session storage, just ask again
  }

  if (!places) {
    const query = new URLSearchParams({
      lat: String(origin.lat),
      lng: String(origin.lng),
      radius: String(radiusMiles),
      category: categoryId,
    });
    const response = await fetch(`/api/nearby?${query}`, { signal: AbortSignal.timeout(70000) });
    if (!response.ok) throw new Error(`The map service answered ${response.status}`);
    places = ((await response.json()) as { places: NearbyPlace[] }).places;
    try {
      window.sessionStorage.setItem(cacheKey, JSON.stringify(places));
    } catch {
      // fine without the saved copy
    }
  }

  return { places: within(places, origin, radiusMiles + 0.5), source: "live" };
}
