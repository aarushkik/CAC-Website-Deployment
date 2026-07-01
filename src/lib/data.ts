import categoriesData from "@/data/categories.json";
import itemsData from "@/data/items.json";
import guidesData from "@/data/guides.json";
import resourcesData from "@/data/resources.json";
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
