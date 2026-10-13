"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { getMyTeam, setMyTeam } from "@/components/CommunityImpact";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";

interface Team {
  code: string;
  name: string;
  repairs: number;
  saved: number;
  lbs: number;
}

/** Team challenges: a class, club or street counts its repairs together and climbs a board. */
export default function TeamsPage() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [mine, setMine] = useState<{ code: string; name: string } | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const data = await (await fetch("/api/teams")).json();
      setConfigured(Boolean(data.configured));
      setTeams(data.teams ?? []);
    } catch {
      setConfigured(false);
    }
  }

  useEffect(() => {
    setMine(getMyTeam());
    load();
  }, []);

  function choose(team: { code: string; name: string } | null) {
    setMyTeam(team);
    setMine(team);
    setProblem("");
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).catch(() => null);
    const data = response ? await response.json() : {};
    setBusy(false);
    if (!response?.ok || !data.team) {
      setProblem(data.error ?? "The team could not be made.");
      return;
    }
    choose({ code: data.team.code, name: data.team.name });
    setName("");
    load();
  }

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const response = await fetch(`/api/teams?code=${encodeURIComponent(code.trim())}`).catch(() => null);
    const data = response ? await response.json() : {};
    setBusy(false);
    if (!response?.ok || !data.team) {
      setProblem("No team has that code. Codes are six letters and digits.");
      return;
    }
    choose({ code: data.team.code, name: data.team.name });
    setCode("");
  }

  return (
    <div>
      <PageHeader
        title="Team challenge"
        intro="Count repairs together as a class, a club or a street. Every repair a member logs as fixed adds to the team."
      />

      {configured === false && (
        <Card>
          <p className="font-semibold text-workshop-900">Teams are not switched on here.</p>
          <p className="mt-1 text-sm text-workshop-800">
            They need the shared counter database. See the README for the two settings.
          </p>
        </Card>
      )}

      {configured && (
        <div className="grid gap-5 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-5">
            {mine ? (
              <Card className="border-safe/40 bg-safe/5">
                <p className="eyebrow">Your team</p>
                <p className="mt-1 text-xl font-extrabold text-workshop-900">{mine.name}</p>
                <p className="mt-3 text-sm text-workshop-800">Share this code so others can join:</p>
                <p className="mt-1 select-all rounded-card bg-surface px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] text-workshop-900">
                  {mine.code}
                </p>
                <p className="mt-3 text-sm text-workshop-800">
                  Repairs you log as &ldquo;Fixed it&rdquo; from now on count for this team.
                </p>
                <Button variant="ghost" onClick={() => choose(null)} className="mt-2">
                  Leave the team
                </Button>
              </Card>
            ) : (
              <>
                <Card>
                  <h2 className="text-lg font-semibold text-workshop-900">Join with a code</h2>
                  <form onSubmit={join} className="mt-3 flex gap-2">
                    <label className="flex-1">
                      <span className="sr-only">Team code</span>
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="ABC234"
                        maxLength={6}
                        autoCapitalize="characters"
                        className="input font-mono tracking-widest"
                      />
                    </label>
                    <Button type="submit" disabled={busy || code.trim().length !== 6}>
                      Join
                    </Button>
                  </form>
                </Card>
                <Card>
                  <h2 className="text-lg font-semibold text-workshop-900">Start a team</h2>
                  <form onSubmit={create} className="mt-3 space-y-3">
                    <label className="block">
                      <span className="text-sm font-medium text-workshop-900">Team name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Room 204 Fixers"
                        maxLength={30}
                        className="input mt-1"
                      />
                      <span className="mt-1 block text-xs text-workshop-600">
                        Everyone can see it. Letters, digits and spaces, no personal names.
                      </span>
                    </label>
                    <Button type="submit" disabled={busy || name.trim().length < 3}>
                      <Icon name="plus" size={18} />
                      Create team
                    </Button>
                  </form>
                </Card>
              </>
            )}
            {problem && (
              <p role="alert" className="rounded-card border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                {problem}
              </p>
            )}
          </div>

          <Card>
            <h2 className="text-lg font-semibold text-workshop-900">Leaderboard</h2>
            {teams.length === 0 ? (
              <p className="mt-3 text-workshop-800">No teams yet. Start the first one.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {teams.map((team, i) => (
                  <li
                    key={team.code}
                    className={`flex items-center gap-3 rounded-card border p-3 ${
                      mine?.code === team.code ? "border-brand-300 bg-brand-50" : "border-workshop-200"
                    }`}
                  >
                    <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full font-bold ${
                      i === 0 ? "bg-caution text-white" : "bg-workshop-100 text-workshop-800"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 font-semibold text-workshop-900">{team.name}</span>
                    <span className="text-right text-sm text-workshop-800">
                      <strong className="block text-base text-workshop-900">
                        {team.repairs} {team.repairs === 1 ? "repair" : "repairs"}
                      </strong>
                      ${Math.round(team.saved)} · {Math.round(team.lbs)} lbs
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-4 text-xs text-workshop-600">
              Self-reported: nobody checks the repairs, and anyone with a team&apos;s code can count for it.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
