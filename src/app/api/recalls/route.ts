/**
 * GET /api/recalls?q=dehumidifier
 *
 * Looks a product up in the public recall database of the US Consumer Product
 * Safety Commission (SaferProducts.gov). The search matches the words in the
 * title of a recall notice, newest first. A recalled product should not be
 * repaired at home, the notice says what the maker owes you instead.
 */

import { parseRecalls } from "@/lib/recalls";

export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim().slice(0, 60);
  if (q.length < 3) return Response.json({ error: "Type at least 3 letters" }, { status: 400 });
  try {
    const response = await fetch(
      `https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallTitle=${encodeURIComponent(q)}`,
      { signal: AbortSignal.timeout(15000), next: { revalidate: 86400 } },
    );
    const recalls = response.ok ? parseRecalls(await response.json()) : null;
    if (!recalls) return Response.json({ error: "The recall database did not answer" }, { status: 502 });
    return Response.json({ recalls });
  } catch {
    return Response.json({ error: "The recall database did not answer" }, { status: 502 });
  }
}
