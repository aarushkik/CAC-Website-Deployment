import { NextResponse } from "next/server";
import itemsLarge from "@/data/items_large.json";
import type { Item } from "@/lib/types";

/**
 * Next.js API route handler to search and fetch items from the large database.
 * Supports filtering by category chip and query search.
 * Endpoint: /api/items?category={categoryId}&q={searchTerm}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.toLowerCase() || "";

  // Cast JSON data
  let filtered = itemsLarge as Item[];

  // Filter by category if supplied
  if (category) {
    filtered = filtered.filter((item) => item.categoryId === category);
  }

  // Filter by search query if supplied
  if (q) {
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.commonIssue.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(filtered);
}
