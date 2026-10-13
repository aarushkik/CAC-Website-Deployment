/**
 * GET /api/geocode?q=Portland+Oregon  ->  { lat, lng, label }
 *
 * Turns a typed city, town or ZIP code into a position, so "Local help" works
 * for people who do not want to share their GPS location. It asks Nominatim,
 * the free OpenStreetMap place search. Their rules ask for an identifying
 * User-Agent and no more than one request a second, which is why this goes
 * through our server and answers are kept for a day.
 */

const kept = new Map<string, { lat: number; lng: number; label: string } | null>();

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return Response.json({ error: "Type a city or ZIP code" }, { status: 400 });
  const key = q.toLowerCase();
  if (!kept.has(key)) {
    try {
      const response = await fetch(
        // five digits on their own are read as a US ZIP code, or they match places all over the world
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=0${
          /^\d{5}$/.test(q) ? `&countrycodes=us&postalcode=${q}` : `&q=${encodeURIComponent(q)}`
        }`,
        {
          headers: { "User-Agent": "FixIt/0.1 (student repair-help project)", "Accept-Language": "en" },
          signal: AbortSignal.timeout(10000),
          next: { revalidate: 86400 },
        },
      );
      if (!response.ok) return Response.json({ error: "The place search did not answer" }, { status: 502 });
      const found = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      const first = found[0];
      const lat = Number(first?.lat);
      const lng = Number(first?.lon);
      kept.set(
        key,
        first && Number.isFinite(lat) && Number.isFinite(lng)
          ? { lat, lng, label: first.display_name.split(",").slice(0, 2).join(",") }
          : null,
      );
      if (kept.size > 500) kept.delete(kept.keys().next().value as string);
    } catch {
      return Response.json({ error: "The place search did not answer" }, { status: 502 });
    }
  }
  const place = kept.get(key);
  return place
    ? Response.json(place)
    : Response.json({ error: `No place found for "${q}"` }, { status: 404 });
}
