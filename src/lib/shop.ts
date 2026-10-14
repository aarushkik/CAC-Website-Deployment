/**
 * Links to affordable fixes in online stores and local services. They are
 * plain search URLs (cheapest first where the store supports it), so they
 * work without accounts or API keys and always reflect live prices.
 */

export type StoreId = "ebay" | "amazon" | "etsy" | "ifixit" | "ebay-used" | "marketplace" | "yelp" | "maps";

export interface StoreLink {
  store: StoreId;
  /** Store name shown on the button. */
  label: string;
  href: string;
}

const enc = encodeURIComponent;

export const storeUrl = {
  /** eBay, sorted by price + shipping, lowest first. */
  ebay: (query: string) => `https://www.ebay.com/sch/i.html?_nkw=${enc(query)}&_sop=15`,
  /** eBay new items only, cheapest first. */
  ebayNew: (query: string) => `https://www.ebay.com/sch/i.html?_nkw=${enc(query)}&_sop=15&LH_ItemCondition=1000`,
  /** eBay used items only, cheapest first. */
  ebayUsed: (query: string) => `https://www.ebay.com/sch/i.html?_nkw=${enc(query)}&_sop=15&LH_ItemCondition=3000`,
  /** Amazon, sorted by price, low to high. */
  amazon: (query: string) => `https://www.amazon.com/s?k=${enc(query)}&s=price-asc-rank`,
  /** Etsy, sorted by price, low to high. */
  etsy: (query: string) => `https://www.etsy.com/search?q=${enc(query)}&order=price_asc`,
  /** iFixit parts and repair guides. */
  ifixit: (query: string) => `https://www.ifixit.com/Search?query=${enc(query)}`,
  /** Facebook Marketplace (uses the shopper's own location). */
  marketplace: (query: string) => `https://www.facebook.com/marketplace/search/?query=${enc(query)}`,
  /** Yelp search near a Washington town. */
  yelp: (search: string, town?: string) =>
    `https://www.yelp.com/search?find_desc=${enc(search)}&find_loc=${enc(town ? `${town}, WA` : "Washington")}`,
  /** Google Maps search near a town, or near the viewer. */
  maps: (search: string, town?: string) =>
    `https://www.google.com/maps/search/?api=1&query=${enc(town ? `${search} near ${town}, WA` : `${search} near me`)}`,
};

/** Where to buy supplies for a DIY fix. */
export function partLinks(query: string, options: { electronics?: boolean; handmade?: boolean } = {}): StoreLink[] {
  const links: StoreLink[] = [
    { store: "ebay", label: "eBay", href: storeUrl.ebay(query) },
    { store: "amazon", label: "Amazon", href: storeUrl.amazon(query) },
  ];
  if (options.handmade) links.push({ store: "etsy", label: "Etsy", href: storeUrl.etsy(query) });
  if (options.electronics) links.push({ store: "ifixit", label: "iFixit", href: storeUrl.ifixit(query) });
  return links;
}

/**
 * Cheaper ways to replace the item: used and refurbished. Safety gear is
 * the exception — `newOnly` links to new items, since used gear can hide damage.
 */
export function replacementLinks(
  query: string,
  options: { refurbished?: boolean; newOnly?: boolean } = {},
): StoreLink[] {
  if (options.newOnly) {
    return [
      { store: "ebay", label: "eBay (new only)", href: storeUrl.ebayNew(query) },
      { store: "amazon", label: "Amazon", href: storeUrl.amazon(query) },
    ];
  }
  return [
    { store: "ebay-used", label: "eBay (used)", href: storeUrl.ebayUsed(query) },
    { store: "marketplace", label: "Facebook Marketplace", href: storeUrl.marketplace(query) },
    {
      store: "amazon",
      label: options.refurbished ? "Amazon Renewed" : "Amazon",
      href: storeUrl.amazon(options.refurbished ? `renewed ${query}` : query),
    },
  ];
}

/** Finding a local repair service when we don't list one nearby. */
export function serviceLinks(search: string, town?: string): StoreLink[] {
  return [
    { store: "yelp", label: "Yelp", href: storeUrl.yelp(search, town) },
    { store: "maps", label: "Google Maps", href: storeUrl.maps(search, town) },
  ];
}
