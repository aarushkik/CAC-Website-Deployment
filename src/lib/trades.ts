import tradesData from "@/data/trades.json";
import type { Trade } from "./types";

/** Kinds of repair businesses (client-safe; the big listing snapshot is server-only). */
export const trades = tradesData as Trade[];

export function getTrade(id: string): Trade | undefined {
  return trades.find((trade) => trade.id === id);
}
