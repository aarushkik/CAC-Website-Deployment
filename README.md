# FixIt

A **repair assistant**. FixIt helps
people repair everyday items safely, save money, reduce waste, and find local
repair help.

Built for the Congressional App Challenge.

## Safety first

FixIt **never** gives step-by-step instructions for dangerous repairs (car brakes,
airbags, gas appliances, microwaves, high-voltage electronics, electrical wiring,
e-bike batteries, power tool motors, structural work). For those, it recommends a
professional and helps the user document the problem. The rules live in
[`src/lib/safety.ts`](src/lib/safety.ts).

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** for styling (workshop-inspired theme)
- **Heroicons** for the category icons (`src/components/CategoryIcon.tsx`) and **Framer Motion** for the animations (`src/components/Motion.tsx`). No emojis are used as icons.
- **Local JSON** data (`src/data`) — swap for Firebase/Supabase later
- **Recharts** for the impact dashboard
- **localStorage** for the repair log and guide progress (nothing leaves the device)
- **Vitest** for the tests of the safety rules, search and impact maths

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm test`.

On a phone, open the site and use "Add to Home Screen" to install it like an app.

## App flow

Home (type what is broken) → Describe it / Choose Item → Safety Checker (one question per screen) → Safety Result
(green / yellow / red) → Repair Guide checklist *or* Local Resources → Repair Log
(filled in from the repair) → Impact Dashboard. The Fix-or-Replace Calculator is linked from
the result.

The "Describe it" page matches your words to items with keywords (`src/lib/search.ts`). It is
not image or language AI, and the optional photo is not analysed.

## Project structure

```
src/
  app/            # pages (one folder per route)
  components/     # small reusable UI (Button, Card, SafetyBadge, Header…)
  data/           # placeholder JSON: categories, items, guides, resources
  lib/            # types, safety logic, search, storage, impact math, data access (+ tests)
```

## What is in the data

- `src/data/items.json`: 136 common repairs in 11 categories, each with a starting safety level,
  rough costs and everyday search words. 39 of them are on the do-not-DIY side and never get a guide.
- `src/data/guides.json`: 84 beginner guides.
- `src/data/osm-places.json`: 477 real repair places in Southwest Washington, copied from
  OpenStreetMap by `python3 scripts/fetch_places.py` (run it again to refresh). Data ©
  OpenStreetMap contributors, ODbL. Outside Southwest Washington the app asks OpenStreetMap live
  through `src/app/api/nearby/route.ts`.
- `scripts/more_data.py` is how the extra repairs and guides were added. It refuses to write a
  red item that has a guide.

Anything that is not on the list can still be checked: describe it, and the safety check runs on
your words (it starts at yellow and turns red when the words point at the dangerous list).

Newer pieces: a full-colour result screen, a full-screen step-by-step mode for guides, simple
3D pictures for 39 guides (`src/components/Guide3D.tsx`): five built from basic shapes with
step highlighting, 34 ready-made CC0 models from Kenney and Poly Haven in `public/models`
(see `public/models/CREDITS.txt`), a map view of local help (Leaflet + OpenStreetMap tiles), a recall lookup
(US CPSC, `/api/recalls`), team challenges (`/teams`) and a district report (`/report`). Teams,
the report and the "together" totals need an Upstash Redis database: put
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local` (never commit it).

Other things the app does: light and dark mode, works offline after the first visit
(`public/sw.js`), a guide library at `/guides`, guides that remember ticked steps and can keep
the screen on.

## Placeholder data

The repairs, guides and cost estimates were written for this project and have not been
reviewed by a tradesperson. The eight hand-picked local resources should be verified before launch. The dashboard's "example data" button
adds made-up repairs (ids start with `demo-`) for demos and can remove them again. Look for "(placeholder)"
labels in [`src/data/resources.json`](src/data/resources.json).
