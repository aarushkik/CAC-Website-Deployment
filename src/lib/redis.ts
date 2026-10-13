/** Talks to the Upstash Redis database. Only used on the server (API routes). */

export function redisReady(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Runs the commands in one request. Returns null when the database is off or did not answer. */
export async function redis(commands: Array<Array<string | number>>): Promise<unknown[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const answers = (await response.json()) as Array<{ result?: unknown; error?: string }>;
    return answers.some((a) => a.error) ? null : answers.map((a) => a.result);
  } catch {
    return null;
  }
}

export const KEYS = {
  community: "fixit-wa03:community",
  red: "fixit-wa03:red",
  teams: "fixit-wa03:teams",
  team: (code: string) => `fixit-wa03:team:${code}`,
};
