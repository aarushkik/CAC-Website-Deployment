import categoriesData from "@/data/categories.json";
import itemsData from "@/data/items.json";
import guidesData from "@/data/guides.json";
import resourcesData from "@/data/resources.json";
import { dangerMatches } from "./safety";
import type { Category, Guide, Item, Resource } from "./types";

/**
 * Central access to the local JSON data. Keeping the casts in one place makes
 * it easy to swap JSON for a real database later without touching components.
 */

export const categories = categoriesData as Category[];
export const items = itemsData as Item[];
export const guides = guidesData as Guide[];
export const resources = resourcesData as Resource[];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getItemsByCategory(categoryId: string): Item[] {
  return items.filter((i) => i.categoryId === categoryId);
}

export function getGuide(id: string): Guide | undefined {
  return guides.find((g) => g.id === id);
}

export function getResourcesForCategory(categoryId: string): Resource[] {
  return resources.filter((r) => r.categories.includes(categoryId));
}

/**
 * An item made from the user's own words, for things that are not on the list.
 * It starts at yellow because nothing is known about it, turns red when the
 * words point at the dangerous list, and never has a do-it-yourself guide.
 */
export function customItem(description: string): Item {
  const name = description.trim().slice(0, 80);
  return {
    id: "custom",
    categoryId: "",
    name,
    commonIssue: "Described in your own words.",
    baseSafety: "yellow",
    dangerous: dangerMatches(name).length > 0,
  };
}

/** The item a page is about: one from the list (?item=) or a described one (?custom=). */
export function itemFromParams(params: { get(name: string): string | null }): Item | undefined {
  const listed = getItem(params.get("item") ?? "");
  if (listed) return listed;
  const custom = (params.get("custom") ?? "").trim();
  return custom.length > 1 ? customItem(custom) : undefined;
}

/** The address part that carries the item on to the next page. */
export function itemQuery(item: Item): string {
  return item.id === "custom" ? `custom=${encodeURIComponent(item.name)}` : `item=${item.id}`;
}

export function getGuidesForCategory(categoryId: string): Guide[] {
  const ids = new Set(items.filter((i) => i.categoryId === categoryId).map((i) => i.guideId));
  return guides.filter((g) => ids.has(g.id));
}

/** The category a guide belongs to, taken from the first item that links to it. */
export function getGuideCategory(guideId: string): Category | undefined {
  const item = items.find((i) => i.guideId === guideId);
  return item ? getCategory(item.categoryId) : undefined;
}
