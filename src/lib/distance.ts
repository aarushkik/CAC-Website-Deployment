import type { Resource } from "./types";

/** Coordinates used for distance calculations. */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Returns the straight-line distance between two coordinates in miles. */
export function haversineDistanceMiles(a: Coordinates, b: Coordinates): number {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);

  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const arc =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * earthRadiusMiles * Math.asin(Math.min(1, Math.sqrt(arc)));
}

/** Sorts resources by distance from the user, nearest first. */
export function sortByDistance(resources: Resource[], userLocation: Coordinates): Resource[] {
  return [...resources].sort((first, second) => {
    const firstLat = first.lat;
    const firstLng = first.lng;
    const secondLat = second.lat;
    const secondLng = second.lng;
    const firstHasCoords = typeof firstLat === "number" && typeof firstLng === "number";
    const secondHasCoords = typeof secondLat === "number" && typeof secondLng === "number";

    if (!firstHasCoords && !secondHasCoords) {
      return 0;
    }

    if (!firstHasCoords) {
      return 1;
    }

    if (!secondHasCoords) {
      return -1;
    }

    const firstLocation = { lat: firstLat, lng: firstLng };
    const secondLocation = { lat: secondLat, lng: secondLng };

    const firstDistance = haversineDistanceMiles(
      firstLocation,
      userLocation,
    );
    const secondDistance = haversineDistanceMiles(
      secondLocation,
      userLocation,
    );

    return firstDistance - secondDistance;
  });
}