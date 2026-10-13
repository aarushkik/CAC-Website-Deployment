/**
 * Teams for challenges: a class, a club or a street that counts its repairs together.
 *
 *   GET  /api/teams            -> { configured, teams: [{ code, name, repairs, saved, lbs }] }  top 20
 *   GET  /api/teams?code=ABC   -> { configured, team } or 404
 *   POST /api/teams { name }   -> { configured, team }   makes a team and its join code
 *
 * There are no accounts. Whoever knows the six-letter code can count repairs for
 * the team, so the code is the only "password". Names are public, which is why
 * lib/community.ts only lets plain letters, digits and spaces through.
 */

import { cleanTeamCode, cleanTeamName, newTeamCode, pairs } from "@/lib/community";
import { KEYS, redis, redisReady } from "@/lib/redis";

interface Team {
  code: string;
  name: string;
  repairs: number;
  saved: number;
  lbs: number;
}

function teamFrom(code: string, flat: unknown): Team | null {
  if (!Array.isArray(flat) || flat.length === 0) return null;
  const numbers = pairs(flat);
  const at = flat.indexOf("name");
  return {
    code,
    name: at >= 0 ? String(flat[at + 1]) : code,
    repairs: numbers.repairs ?? 0,
    saved: numbers.saved ?? 0,
    lbs: numbers.lbs ?? 0,
  };
}

export async function GET(request: Request) {
  if (!redisReady()) return Response.json({ configured: false, teams: [] });
  const wanted = new URL(request.url).searchParams.get("code");
  if (wanted !== null) {
    const code = cleanTeamCode(wanted);
    const answer = code ? await redis([["HGETALL", KEYS.team(code)]]) : null;
    const team = answer ? teamFrom(code, answer[0]) : null;
    return team
      ? Response.json({ configured: true, team })
      : Response.json({ configured: true, error: "No team has that code" }, { status: 404 });
  }

  const top = await redis([["ZREVRANGE", KEYS.teams, 0, 19]]);
  if (!top) return Response.json({ configured: true, error: "The counter did not answer" }, { status: 502 });
  const codes = (top[0] as string[]) ?? [];
  if (codes.length === 0) return Response.json({ configured: true, teams: [] });
  const rows = await redis(codes.map((code) => ["HGETALL", KEYS.team(code)]));
  const teams = (rows ?? []).flatMap((flat, i) => teamFrom(codes[i], flat) ?? []);
  return Response.json({ configured: true, teams });
}

export async function POST(request: Request) {
  if (!redisReady()) return Response.json({ configured: false });
  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = cleanTeamName(body?.name);
  if (!name) {
    return Response.json(
      { error: "A team name is 3 to 30 characters: letters, digits and spaces." },
      { status: 400 },
    );
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = newTeamCode();
    // HSETNX only writes when the code is free, so two teams never share one
    const made = await redis([
      ["HSETNX", KEYS.team(code), "name", name],
      ["ZADD", KEYS.teams, "NX", 0, code],
    ]);
    if (!made) break;
    if (made[0] === 1) return Response.json({ configured: true, team: { code, name, repairs: 0, saved: 0, lbs: 0 } });
  }
  return Response.json({ configured: true, error: "The team could not be made, try again" }, { status: 502 });
}
