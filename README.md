# FixIt WA 03

A community **repair assistant for Southwest Washington** (WA 03). FixIt helps
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
- **Local JSON** data (`src/data`) — swap for Firebase/Supabase later
- **Recharts** for the impact dashboard
- **localStorage** for the repair log (offline-friendly)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## App flow

Home → Choose Item (or AI Scanner) → Safety Checker → Safety Result
(green / yellow / red) → Repair Guide *or* Local Resources → Fix-or-Replace
Calculator → Repair Log → Impact Dashboard.

## Project structure

```
src/
  app/            # pages (one folder per route)
  components/     # small reusable UI (Button, Card, SafetyBadge, Header…)
  data/           # placeholder JSON: categories, items, guides, resources
  lib/            # types, safety logic, storage, impact math, data access
```

## Placeholder data

All items, guides, and local resources are realistic placeholders meant to be
replaced with verified local content before launch. Look for "(placeholder)"
labels in [`src/data/resources.json`](src/data/resources.json).
