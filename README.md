# FixIt WA 03

A community **repair assistant for Southwest Washington** (WA 03). FixIt helps
people repair everyday items safely, save money, reduce waste, and find local
repair help.

Built for the Congressional App Challenge.

## What it does

- **Start a repair** — search or browse 47 common repairs across six categories,
  or run a general safety check for anything not on the list.
- **Scanner** — describe the problem in your own words (and optionally add a
  photo). It matches a repair and flags anything dangerous, like gas, sparks,
  or a swollen battery.
- **Safety check** — a few questions chosen for that kind of item, then a clear
  green / yellow / red result drawn like a real safety sign, with the reasons.
- **Repair guides** — 32 beginner-safe, step-by-step guides with safety tips
  first, steps you can check off, and a "stop and get help if…" list.
- **Fix or replace?** — compares a DIY or pro repair with buying new, and shows
  the waste you'd keep out of the landfill.
- **Repair log & impact dashboard** — money saved, pounds kept out of the
  landfill, monthly chart, milestones. Export to CSV, back up and restore,
  or load sample repairs for a demo.
- **Local help** — verified shops, repair events, and licensed pros, sorted by
  distance from your location or any WA-03 town, plus emergency numbers.

## Safety first

FixIt **never** gives step-by-step instructions for dangerous repairs (car brakes,
airbags, gas appliances, microwaves, high-voltage electronics, electrical wiring,
e-bike and damaged lithium batteries, power tool motors, structural work, garage
door springs, safety gear and child car seats, asbestos and lead paint). For
those, it recommends a professional and helps the user write up the problem.

How the safety check works (all in [`src/lib/safety.ts`](src/lib/safety.ts)):

1. Every item starts with a typical level; items on the do-not-DIY list are always red.
2. Questions are chosen per category, and answers can only make the result **more** careful.
3. "Not sure" counts as yes.
4. Red results never link to a guide.

These rules are covered by automated tests in [`src/lib/safety.test.ts`](src/lib/safety.test.ts)
and [`src/lib/data.test.ts`](src/lib/data.test.ts) — for example, a test fails if
any red item in the catalog points to a DIY guide, or if a phrase on the
dangerous list isn't caught by the scanner.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** — workshop theme with ANSI Z535 safety-sign colors; Public Sans and Barlow Condensed fonts
- **Local JSON** data (`src/data`) — swap for a database later
- **Recharts** for the impact chart, **lucide-react** for icons
- **localStorage** for the repair log (works offline, no account)
- **Vitest** for unit tests
- Optional **Claude API** (`@anthropic-ai/sdk`) for photo recognition

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm run start` | Production build and server |
| `npm test` | Run the unit tests |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Lint the code |

## Optional: AI photo recognition

The scanner works without any setup: it matches typed descriptions on the device.
To also recognize photos, set an Anthropic API key on the server (copy
[`.env.example`](.env.example) to `.env.local`, or add it in your host's
environment settings):

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

- The browser shrinks photos to 1024px JPEGs before upload (this also strips
  location metadata). Photos aren't stored.
- Claude only **classifies** the photo against the catalog and flags visible
  hazards. It never writes repair instructions — the app's own rules decide safety.
- Uses `claude-opus-5-5` by default with low effort and structured JSON output
  (`FIXIT_AI_MODEL` overrides it). Refusals fall back server-side, and a simple
  per-visitor rate limit (12 scans per 10 minutes) limits cost.
- The API route is [`src/app/api/scan/route.ts`](src/app/api/scan/route.ts).

## App flow

Home → Start a repair (or Scanner) → Safety check → Safety result
(green / yellow / red) → Repair guide *or* Local help → Fix-or-replace
calculator → Repair log → Impact dashboard.

Links carry context along the way: a guide's "I fixed it" button opens the log
already filled in with the item, estimated savings, and weight.

## Project structure

```
src/
  app/            # pages (one folder per route), API route, icons, share image
  components/     # UI pieces (SafetySign, Header, ResourceCard, Toast…)
  data/           # categories, items, guides, resources, WA-03 towns
  lib/            # safety rules, matching, storage, impact math (+ tests)
```

## Data

- **Items and guides** — [`src/data/items.json`](src/data/items.json) and
  [`src/data/guides.json`](src/data/guides.json). Cost figures are rough
  national estimates, not quotes.
- **Local resources** — [`src/data/resources.json`](src/data/resources.json).
  Addresses, phone numbers, and services were checked against each
  organization's website in October 2026, and coordinates were geocoded with
  OpenStreetMap. Re-check listings before each launch; hours and services change.
  Each listing has a `kind`: `pro` (shops and licensed pros that can take risky
  repairs), `community` (volunteer events), or `info` (official lookups).
- **Gas emergency lines** — [`src/lib/emergency.ts`](src/lib/emergency.ts),
  from each utility's own website.
- **Towns** — [`src/data/places.json`](src/data/places.json), covering Clark,
  Cowlitz, Lewis, Pacific, Skamania, and Wahkiakum counties.

`npm test` checks the data files too (unique ids, valid categories and guides,
coordinates inside Southwest Washington).

## Deploying

Any Next.js host works. On Vercel, import the repo and deploy; optionally add
`ANTHROPIC_API_KEY` for photo recognition. Link previews use
`NEXT_PUBLIC_SITE_URL` (Vercel provides its production URL automatically).
