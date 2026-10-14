import { NextResponse } from "next/server";

/**
 * Optional live prices from eBay's Browse API, cheapest first.
 *   GET /api/deals?q=bike+inner+tube
 *
 * Turned on by setting EBAY_CLIENT_ID and EBAY_CLIENT_SECRET (a free eBay
 * developer "production" keyset). Without them it reports `enabled: false`
 * and the app shows plain eBay search links instead.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = process.env.EBAY_API_BASE?.replace(/\/$/, "") || "https://api.ebay.com";

export interface Deal {
  title: string;
  price: number;
  shipping?: number;
  currency: string;
  condition?: string;
  image?: string;
  url: string;
}

let token: { value: string; expiresAt: number } | null = null;
const cache = new Map<string, { at: number; deals: Deal[] }>();
const CACHE_MS = 60 * 60 * 1000;

function credentials() {
  const id = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  return id && secret ? { id, secret } : null;
}

async function getToken(id: string, secret: string): Promise<string> {
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const response = await fetch(`${API}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`eBay token request failed (${response.status})`);
  const data = (await response.json()) as { access_token: string; expires_in: number };
  token = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return token.value;
}

interface ItemSummary {
  title?: string;
  price?: { value?: string; currency?: string };
  image?: { imageUrl?: string };
  itemWebUrl?: string;
  condition?: string;
  shippingOptions?: { shippingCost?: { value?: string } }[];
}

export async function GET(request: Request) {
  const keys = credentials();
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (!keys) return NextResponse.json({ enabled: false, deals: [] });
  if (!query) return NextResponse.json({ enabled: true, deals: [] });

  const cached = cache.get(query.toLowerCase());
  if (cached && Date.now() - cached.at < CACHE_MS) return NextResponse.json({ enabled: true, deals: cached.deals });

  try {
    const access = await getToken(keys.id, keys.secret);
    const params = new URLSearchParams({
      q: query,
      sort: "price",
      limit: "12",
      filter: "buyingOptions:{FIXED_PRICE},deliveryCountry:US,priceCurrency:USD,price:[2..]",
    });
    const response = await fetch(`${API}/buy/browse/v1/item_summary/search?${params}`, {
      headers: { Authorization: `Bearer ${access}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`eBay search failed (${response.status})`);
    const data = (await response.json()) as { itemSummaries?: ItemSummary[] };

    const deals: Deal[] = (data.itemSummaries ?? [])
      .map((item) => {
        const price = Number(item.price?.value);
        const shipping = Number(item.shippingOptions?.[0]?.shippingCost?.value);
        return {
          title: item.title ?? "",
          price,
          shipping: Number.isFinite(shipping) ? shipping : undefined,
          currency: item.price?.currency ?? "USD",
          condition: item.condition,
          image: item.image?.imageUrl,
          url: item.itemWebUrl ?? "",
        };
      })
      .filter((deal) => deal.title && deal.url.startsWith("https://") && Number.isFinite(deal.price))
      .sort((a, b) => a.price + (a.shipping ?? 0) - (b.price + (b.shipping ?? 0)))
      .slice(0, 4);

    cache.set(query.toLowerCase(), { at: Date.now(), deals });
    return NextResponse.json({ enabled: true, deals });
  } catch (error) {
    console.error("[deals]", error instanceof Error ? error.message : error);
    return NextResponse.json({ enabled: true, deals: [], error: "Live prices aren't available right now." });
  }
}
