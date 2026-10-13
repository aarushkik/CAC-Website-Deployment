import { buildQuery, kindsFor, parsePlaces, type NearbyPlace } from "@/lib/nearby";

/**
 * GET /api/nearby?lat=..&lng=..&radius=10&category=bikes
 *
 * Asks OpenStreetMap (Overpass) for repair places on behalf of the page. Going
 * through our own server means we can try several public Overpass servers one
 * after another, try twice, and keep the answer, because each of them is free
 * and is busy now and then.
 */

const SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const KEEP_MS = 6 * 60 * 60 * 1000;
/** Hosts stop a request after about a minute, so give up a little before that. */
export const maxDuration = 60;
const GIVE_UP_MS = 35000;
const saved = new Map<string, { at: number; places: NearbyPlace[] }>();

async function ask(server: string, query: string): Promise<NearbyPlace[] | null> {
  try {
    const response = await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "FixIt/0.1 (student repair-help project)",
      },
      body: "data=" + encodeURIComponent(query),
      signal: AbortSignal.timeout(22000),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { elements?: unknown[] };
    return Array.isArray(data.elements) ? (data.elements as never[]) : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  const radius = Math.min(30, Math.max(1, Number(params.get("radius")) || 10));
  const category = (params.get("category") ?? "").slice(0, 40);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) {
    return Response.json({ error: "lat and lng are needed" }, { status: 400 });
  }

  // round the position so people a few streets apart share one saved answer
  const origin = { lat: Math.round(lat * 100) / 100, lng: Math.round(lng * 100) / 100 };
  const key = `${origin.lat},${origin.lng}:${radius}:${category}`;
  const hit = saved.get(key);
  if (hit && Date.now() - hit.at < KEEP_MS) {
    return Response.json({ places: hit.places, saved: true });
  }

  const kinds = kindsFor(category);
  const query = buildQuery(origin, radius, kinds);
  const started = Date.now();
  for (let round = 0; round < 2; round++) {
    for (const server of SERVERS) {
      if (Date.now() - started > GIVE_UP_MS) break;
      const elements = await ask(server, query);
      if (elements) {
        // distances are worked out again in the browser from the exact position
        const places = parsePlaces(elements as never[], origin, kinds);
        saved.set(key, { at: Date.now(), places });
        if (saved.size > 300) saved.delete(saved.keys().next().value as string);
        return Response.json({ places }, { headers: { "Cache-Control": "public, s-maxage=21600" } });
      }
    }
  }
  return Response.json({ error: "The map service did not answer" }, { status: 502 });
}
