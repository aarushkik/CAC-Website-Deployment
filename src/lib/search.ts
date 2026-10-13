import { items } from "./data";
import type { Item } from "./types";

/** Small words that say nothing about which item is meant. */
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "has", "have", "not", "wont", "won't", "doesnt",
  "doesn't", "isn't", "isnt", "its", "it's", "broken", "broke", "fix", "repair", "need", "help",
  "when", "from", "does", "will", "anymore", "stopped", "working", "work",
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9' -]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/** "tires" and "tire" should match each other. */
function stem(word: string): string {
  return word.replace(/(ing|ed|es|s)$/, "");
}

/**
 * Finds the items a plain-language description most likely means, best match
 * first. This is keyword matching, not image or language AI: every word of the
 * description is compared with the item's name, common issue and keywords.
 */
export function findItems(description: string, limit = 5): Item[] {
  const typed = words(description).map(stem);
  if (typed.length === 0) return [];
  const phrase = description.toLowerCase();

  const scored = items.map((item) => {
    const nameWords = words(item.name).map(stem);
    const issueWords = words(item.commonIssue).map(stem);
    let score = 0;
    for (const keyword of item.keywords ?? []) {
      if (keyword.includes(" ")) {
        if (phrase.includes(keyword)) score += 4;
      } else if (typed.includes(stem(keyword))) {
        score += 3;
      }
    }
    for (const word of typed) {
      if (nameWords.includes(word)) score += 2;
      else if (issueWords.includes(word)) score += 1;
    }
    return { item, score };
  });

  return scored
    // one loose word in common ("open", "door") is not a match
    .filter((entry) => entry.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
