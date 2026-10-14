import type { Category, Item } from "./types";

/**
 * Lightweight text matching for item search and the scanner. It runs fully
 * on the device: no network, no model download. Words are reduced to simple
 * stems so "dripping", "drips", and "drip" all match each other.
 */

const STOPWORDS = new Set([
  "a", "an", "and", "any", "are", "as", "at", "be", "been", "but", "by", "can", "cant",
  "could", "did", "do", "does", "doesnt", "dont", "for", "from", "get", "gets", "got",
  "had", "has", "have", "help", "how", "i", "im", "in", "into", "is", "isnt", "it", "its",
  "ive", "just", "keep", "keeps", "kind", "kinda", "like", "me", "my", "need", "needs",
  "of", "on", "one", "or", "our", "please", "really", "so", "some", "something", "still",
  "that", "the", "their", "them", "then", "there", "this", "to", "too", "up", "very", "was",
  "wasnt", "we", "what", "when", "where", "which", "while", "why", "will", "with", "wont",
  "would", "you", "your",
]);

/** Spelling variants and everyday words mapped onto the catalog's words. */
const SYNONYMS: Record<string, string> = {
  tyre: "tire",
  tyres: "tire",
  bicycle: "bike",
  bicycles: "bike",
  cycle: "bike",
  cellphone: "phone",
  cell: "phone",
  iphone: "phone",
  smartphone: "phone",
  android: "phone",
  couch: "sofa",
  tap: "faucet",
  spigot: "faucet",
  television: "tv",
  telly: "tv",
  trousers: "pants",
  jumper: "sweater",
  hoodie: "sweater",
  sneaker: "shoe",
  sneakers: "shoe",
  earbuds: "headphone",
  earphones: "headphone",
  headphones: "headphone",
  usb: "cable",
  cord: "cable",
  charger: "charging",
  wardrobe: "cabinet",
  cupboard: "cabinet",
  bureau: "dresser",
  doorknob: "knob",
  shower: "showerhead",
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/** A deliberately small stemmer: consistent, not linguistically perfect. */
export function stem(input: string): string {
  let word = input.toLowerCase().replace(/'s$/, "");
  if (word.length <= 3) return word;

  if (word.endsWith("ies") && word.length > 4) {
    word = `${word.slice(0, -3)}y`;
  } else if (/(?:ss|x|z|ch|sh)es$/.test(word)) {
    word = word.slice(0, -2);
  } else if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    word = word.slice(0, -1);
  }

  if (word.endsWith("ing") && word.length > 5) {
    word = word.slice(0, -3);
  } else if (word.endsWith("ed") && word.length > 4) {
    word = word.slice(0, -2);
  }

  // "dripp" -> "drip", "stopp" -> "stop"
  if (/([bdfgmnprt])\1$/.test(word)) word = word.slice(0, -1);

  // "leaky" -> "leak", "wobbly" -> "wobbl"
  if (word.endsWith("y") && word.length >= 5 && !VOWELS.has(word[word.length - 2])) {
    word = word.slice(0, -1);
  }
  // "wobble" -> "wobbl", "brake" -> "brak"
  if (word.endsWith("e") && word.length > 4) word = word.slice(0, -1);

  return word;
}

/** Splits text into stemmed, meaningful words. */
export function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[‘’ʼ']/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const tokens: string[] = [];
  for (const raw of words) {
    const word = SYNONYMS[raw] ?? raw;
    if (STOPWORDS.has(word)) continue;
    const stemmed = stem(word);
    if (stemmed.length < 2 && !/^\d+$/.test(stemmed)) continue;
    tokens.push(SYNONYMS[stemmed] ?? stemmed);
  }
  return tokens;
}

/** Precomputed words for one catalog item. */
export interface IndexedItem {
  item: Item;
  name: Set<string>;
  keywords: Set<string>;
  issue: Set<string>;
  category: Set<string>;
}

export function buildItemIndex(items: Item[], categories: Category[]): IndexedItem[] {
  const categoryWords = new Map(
    categories.map((category) => [
      category.id,
      new Set(tokenize([category.name, ...(category.keywords ?? [])].join(" "))),
    ]),
  );
  return items.map((item) => ({
    item,
    name: new Set(tokenize(item.name)),
    keywords: new Set(tokenize((item.keywords ?? []).join(" "))),
    issue: new Set(tokenize(item.commonIssue)),
    category: categoryWords.get(item.categoryId) ?? new Set(),
  }));
}

export interface ItemMatch {
  item: Item;
  score: number;
  /** Query words that matched something about the item. */
  matched: string[];
}

function hasPrefix(words: Set<string>, prefix: string): boolean {
  for (const word of words) {
    if (word.length > prefix.length && word.startsWith(prefix)) return true;
  }
  return false;
}

/** A word that only matches the item's category (e.g. "kitchen") counts a little. */
const CATEGORY_SCORE = 0.5;

/** Scores one query word against one item. */
function scoreToken(token: string, entry: IndexedItem): number {
  if (entry.name.has(token)) return 3;
  if (entry.keywords.has(token)) return 2.5;
  if (entry.issue.has(token)) return 1.5;
  if (entry.category.has(token)) return CATEGORY_SCORE;
  if (token.length >= 3) {
    if (hasPrefix(entry.name, token)) return 1.2;
    if (hasPrefix(entry.keywords, token)) return 1;
  }
  return 0;
}

/**
 * Ranks catalog items against free text, best first. Items that match
 * nothing are left out. Catch-all items are excluded unless asked for.
 */
export function matchItems(
  query: string,
  index: IndexedItem[],
  options: { limit?: number; includeGeneric?: boolean } = {},
): ItemMatch[] {
  const tokens = [...new Set(tokenize(query))];
  if (tokens.length === 0) return [];

  const results: ItemMatch[] = [];
  for (const entry of index) {
    if (entry.item.generic && !options.includeGeneric) continue;
    let score = 0;
    let itemMatches = 0;
    const matched: string[] = [];
    for (const token of tokens) {
      const tokenScore = scoreToken(token, entry);
      if (tokenScore > 0) {
        score += tokenScore;
        matched.push(token);
        if (tokenScore > CATEGORY_SCORE) itemMatches += 1;
      }
    }
    if (score === 0) continue;
    // Reward items that explain more of what the person wrote (category
    // words don't count — they'd lift every item in the category).
    score += (itemMatches / tokens.length) * 1.5;
    results.push({ item: entry.item, score: Math.round(score * 100) / 100, matched });
  }

  results.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  return options.limit ? results.slice(0, options.limit) : results;
}

/** How sure the matcher is about its best guess. */
export type MatchConfidence = "strong" | "possible" | "weak";

export function matchConfidence(matches: ItemMatch[]): MatchConfidence {
  const [first, second] = matches;
  if (!first) return "weak";
  const lead = first.score - (second?.score ?? 0);
  if (first.score >= 4.5 && lead >= 2) return "strong";
  if (first.score >= 3.5) return "possible";
  return "weak";
}
