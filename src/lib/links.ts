/** Builds a tel: link from a display phone number. */
export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")}`;
}

/** A Google Maps search link — works without an API key. */
export function directionsHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Searches maps for a kind of business near a town, or near the viewer. */
export function nearbySearchHref(term: string, town?: string): string {
  return directionsHref(town ? `${term} near ${town}, WA` : `${term} near me`);
}
