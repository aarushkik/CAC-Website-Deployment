import { NextResponse } from "next/server";
import { findNearbyPros, snapshotSize, trades } from "@/lib/pros";

/**
 * Nearby repair businesses for a repair's trades.
 *   GET /api/pros?trades=plumber,hardware&lat=45.64&lng=-122.66
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const known = new Set(trades.map((trade) => trade.id));
  const tradeIds = (searchParams.get("trades") ?? "")
    .split(",")
    .filter((id) => known.has(id))
    .slice(0, 4);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  // Washington, with a little margin.
  if (!tradeIds.length || !(lat > 45 && lat < 49.5) || !(lng > -125 && lng < -116.5)) {
    return NextResponse.json({ error: "Pick a trade and a place in Washington." }, { status: 400 });
  }

  return NextResponse.json(
    {
      listings: findNearbyPros(tradeIds, { lat, lng }),
      snapshotSize: snapshotSize(),
      attribution: "© OpenStreetMap contributors",
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
