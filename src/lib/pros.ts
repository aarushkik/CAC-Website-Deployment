import prosData from "@/data/pros.json";
import { haversineDistanceMiles, type Coordinates } from "./distance";
import type { ProListing } from "./types";

export { getTrade, trades } from "./trades";

/**
 * Repair businesses by trade, from the OpenStreetMap snapshot in
 * src/data/pros.json (refresh with `node scripts/fetch-pros.mjs`).
 * Server-side only: the snapshot is too big to send to every browser.
 */

const listings = prosData as ProListing[];

export interface NearbyPro extends ProListing {
  miles: number;
}

/**
 * The closest businesses in the given trades, preferring ones with a phone
 * number. Trades earlier in the list are what the repair needs most, so
 * a plumber for a dripping faucet ranks ahead of a hardware store.
 */
export function findNearbyPros(
  tradeIds: string[],
  origin: Coordinates,
  options: { limit?: number; maxMiles?: number } = {},
): NearbyPro[] {
  const { limit = 6, maxMiles = 60 } = options;
  const rank = (listing: ProListing) => {
    const index = tradeIds.findIndex((id) => listing.trades.includes(id));
    return index === -1 ? Infinity : index;
  };

  return listings
    .filter((listing) => rank(listing) !== Infinity)
    .map((listing) => ({ ...listing, miles: haversineDistanceMiles(origin, listing) }))
    .filter((listing) => listing.miles <= maxMiles)
    .sort((a, b) => {
      // Within ~15 miles, a closer match on trade and a phone number matter
      // more than a few extra minutes of driving.
      const band = (pro: NearbyPro) => Math.floor(pro.miles / 15);
      return (
        band(a) - band(b) ||
        rank(a) - rank(b) ||
        Number(Boolean(b.phone)) - Number(Boolean(a.phone)) ||
        a.miles - b.miles
      );
    })
    .slice(0, limit);
}

export function snapshotSize(): number {
  return listings.length;
}
