/**
 * The shared counter: what everyone using FixIt has saved together.
 *
 *   GET  /api/community   -> { configured, repairs, saved, lbs, categories, red }
 *   POST /api/community   { saved, lbs, categoryId?, team? }   adds one fixed item
 *   POST /api/community   { kind: "red", itemId }              counts one red result
 *
 * The numbers live in an Upstash Redis database. Without the two settings
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN the counter is simply
 * off: GET says configured: false and the pages do not show it.
 *
 * Nobody signs in, so anyone could post a made-up repair. One post is capped
 * (see lib/community.ts) so a single request cannot blow up the totals, but
 * this is an honour system and the pages say the numbers are self-reported.
 */

import { cleanId, cleanRepair, cleanTeamCode, pairs, totalsFrom } from "@/lib/community";
import { KEYS, redis, redisReady } from "@/lib/redis";

export async function GET() {
  if (!redisReady()) return Response.json({ configured: false });
  const answer = await redis([["HGETALL", KEYS.community], ["HGETALL", KEYS.red]]);
  if (!answer) return Response.json({ configured: true, error: "The counter did not answer" }, { status: 502 });
  return Response.json({ configured: true, ...totalsFrom(answer[0]), red: pairs(answer[1]) });
}

export async function POST(request: Request) {
  if (!redisReady()) return Response.json({ configured: false });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (body?.kind === "red") {
    const itemId = cleanId(body.itemId);
    if (!itemId) return Response.json({ error: "itemId is needed" }, { status: 400 });
    const counted = await redis([["HINCRBY", KEYS.red, itemId, 1]]);
    return Response.json({ configured: true, counted: Boolean(counted) }, { status: counted ? 200 : 502 });
  }

  const repair = cleanRepair(body);
  if (!repair) return Response.json({ error: "saved and lbs have to be numbers" }, { status: 400 });
  const commands: Array<Array<string | number>> = [
    ["HINCRBY", KEYS.community, "repairs", 1],
    ["HINCRBYFLOAT", KEYS.community, "saved", repair.saved],
    ["HINCRBYFLOAT", KEYS.community, "lbs", repair.lbs],
  ];
  const categoryId = cleanId(body?.categoryId);
  if (categoryId) commands.push(["HINCRBY", KEYS.community, `cat:${categoryId}`, 1]);

  // a team only counts when it exists, so a typed-in code cannot create one
  const team = cleanTeamCode(body?.team);
  if (team) {
    const exists = await redis([["EXISTS", KEYS.team(team)]]);
    if (exists && exists[0] === 1) {
      commands.push(
        ["HINCRBY", KEYS.team(team), "repairs", 1],
        ["HINCRBYFLOAT", KEYS.team(team), "saved", repair.saved],
        ["HINCRBYFLOAT", KEYS.team(team), "lbs", repair.lbs],
        ["ZINCRBY", KEYS.teams, 1, team],
      );
    }
  }
  commands.push(["HGETALL", KEYS.community]);
  const answer = await redis(commands);
  if (!answer) return Response.json({ configured: true, error: "The counter did not answer" }, { status: 502 });
  return Response.json({ configured: true, ...totalsFrom(answer[answer.length - 1]) });
}
