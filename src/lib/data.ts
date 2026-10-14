import categoriesData from "@/data/categories.json";
import itemsData from "@/data/items.json";
import guidesData from "@/data/guides.json";
import resourcesData from "@/data/resources.json";
import placesData from "@/data/places.json";
import type { Category, Guide, Item, Resource } from "./types";

/**
 * Central access to the local JSON data. Keeping the casts in one place makes
 * it easy to swap JSON for a real database later without touching components.
 */

export const categories = categoriesData as Category[];
export const items = itemsData as Item[];
export const guides = guidesData as Guide[];
export const resources = resourcesData as Resource[];

/** A town in WA-03, used to sort local help by distance. */
export interface Place {
  name: string;
  county: string;
  lat: number;
  lng: number;
  /** "statewide" for cities outside WA-03; district towns leave it out. */
  region?: "statewide";
}

export const places = placesData as Place[];

export function getCategory(id: string | null | undefined): Category | undefined {
  return id ? categories.find((c) => c.id === id) : undefined;
}

export function getItem(id: string | null | undefined): Item | undefined {
  return id ? items.find((i) => i.id === id) : undefined;
}

/** Items in a category, with the catch-all "something else" item last. */
export function getItemsByCategory(categoryId: string): Item[] {
  return items
    .filter((i) => i.categoryId === categoryId)
    .sort((a, b) => Number(Boolean(a.generic)) - Number(Boolean(b.generic)));
}

/** The catch-all "something else" item for a category. */
export function getGenericItem(categoryId: string): Item | undefined {
  return items.find((i) => i.generic && i.categoryId === categoryId);
}

export function getGuide(id: string | null | undefined): Guide | undefined {
  return id ? guides.find((g) => g.id === id) : undefined;
}

/** Catalog items that use a guide. */
export function getItemsForGuide(guideId: string): Item[] {
  return items.filter((i) => i.guideId === guideId);
}

export function getResourcesForCategory(categoryId: string): Resource[] {
  return resources.filter((r) => r.categories.includes(categoryId));
}
