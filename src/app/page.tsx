import Link from "next/link";
import { ArrowRight, MapPin, PiggyBank, Recycle, Search } from "lucide-react";
import { ImpactTeaser } from "@/components/ImpactTeaser";
import { MiniSafetySign } from "@/components/SafetySign";
import { categories, items } from "@/lib/data";
import type { SafetyLevel } from "@/lib/types";

const exampleSigns: { level: SafetyLevel; itemId: string; label: string; detail: string; tilt: string }[] = [
  {
    level: "green",
    itemId: "flat-tire",
    label: "Flat bike tire",
    detail: "Patch kit, about 30 minutes, around $10.",
    tilt: "-rotate-1",
  },
  {
    level: "yellow",
    itemId: "leaky-faucet",
    label: "Dripping faucet",
    detail: "Doable — once the water is shut off.",
    tilt: "rotate-[0.6deg]",
  },
  {
    level: "red",
    itemId: "microwave",
    label: "Microwave not heating",
    detail: "Stored high voltage. Call a pro.",
    tilt: "-rotate-[0.4deg]",
  },
];

const quickPicks = ["stuck-zipper", "dry-chain", "running-toilet", "lamp-cord"];

const steps = [
  {
    title: "Pick or describe it",
    detail: `Choose from ${items.filter((i) => !i.generic).length} common repairs, or describe the problem in your own words.`,
  },
  {
    title: "Answer a few safety questions",
    detail: "Only the ones that matter for that kind of item. Not sure? Say so — we play it safe.",
  },
  {
    title: "Get green, yellow, or red",
    detail: "A clear result with the reasons behind it, so you know why.",
  },
  {
    title: "Fix it or find help",
    detail: "Follow a step-by-step guide, or call a local shop or licensed pro.",
  },
];

export default function HomePage() {
  const picks = quickPicks.map((id) => items.find((i) => i.id === id)).filter((i) => i !== undefined);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-concrete-200 bg-white px-5 py-10 shadow-card sm:px-10 sm:py-14">
        <div className="pegboard pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="eyebrow">Southwest Washington · Right to repair</p>
            <h1 className="mt-3 max-w-2xl font-display text-5xl font-extrabold leading-[0.92] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Fix it yourself, safely — or find someone local who can.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              FixIt WA 03 checks whether a repair is safe for a beginner, walks you through the easy
              ones, and points you to local pros for the rest.
            </p>

            <form action="/scanner" method="get" className="mt-7 max-w-xl" role="search">
              <label htmlFor="hero-q" className="label mb-2">
                What&apos;s broken?
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-q"
                    name="q"
                    type="search"
                    required
                    autoComplete="off"
                    placeholder="e.g. my bike chain squeaks"
                    className="input h-12 pl-11 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-lg font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Check it
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="text-ink-muted">Common fixes:</span>
              {picks.map((item) => (
                <Link
                  key={item.id}
                  href={`/safety-checker?item=${item.id}`}
                  className="rounded-full border border-concrete-300 bg-white px-3 py-1 font-semibold text-ink-soft hover:border-brand-200 hover:text-brand-700"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/choose-item" className="link">
                Browse all
              </Link>
            </div>

            <ImpactTeaser />
          </div>

          <div>
            <p className="eyebrow mb-4">Every repair gets a sign</p>
            <ul className="space-y-5">
              {exampleSigns.map((sign) => (
                <li key={sign.itemId} className={`relative ${sign.tilt}`}>
                  {/* the nail it hangs from */}
                  <span
                    className="absolute -top-2 left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-ink bg-concrete-300"
                    aria-hidden="true"
                  />
                  <Link href={`/safety-checker?item=${sign.itemId}`} className="group block rounded-lg">
                    <MiniSafetySign level={sign.level} label={sign.label} detail={sign.detail} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-card border border-concrete-200 bg-white p-5 shadow-card">
              <span className="w-6 flex-none font-display text-4xl font-extrabold leading-none text-brand-600 tabular">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section className="mt-16" aria-labelledby="categories-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="categories-heading" className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            What are you fixing?
          </h2>
          <Link href="/choose-item" className="link whitespace-nowrap text-sm">
            See all repairs
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = items.filter((i) => i.categoryId === category.id && !i.generic).length;
            return (
              <Link
                key={category.id}
                href={`/choose-item?category=${category.id}`}
                className="group flex items-start gap-4 rounded-card border border-concrete-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
              >
                <span
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-concrete-100 text-2xl"
                  aria-hidden="true"
                >
                  {category.icon}
                </span>
                <span>
                  <span className="block font-semibold text-ink group-hover:text-brand-700">{category.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{category.description}</span>
                  <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                    {count} repairs
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why it matters */}
      <section className="mt-16 grid gap-4 md:grid-cols-3" aria-label="Why repair">
        <div className="rounded-card border border-concrete-200 bg-white p-6 shadow-card">
          <PiggyBank className="h-7 w-7 text-brand-600" aria-hidden="true" />
          <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">Save money</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            A $10 patch kit beats a $35 tire. The{" "}
            <Link href="/calculator" className="link">
              fix-or-replace calculator
            </Link>{" "}
            shows the math before you decide.
          </p>
        </div>
        <div className="rounded-card border border-concrete-200 bg-white p-6 shadow-card">
          <Recycle className="h-7 w-7 text-brand-600" aria-hidden="true" />
          <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">Cut waste</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Every fix keeps something in use. Your{" "}
            <Link href="/log" className="link">
              repair log
            </Link>{" "}
            adds up the pounds you&apos;ve kept out of the landfill.
          </p>
        </div>
        <div className="rounded-card border border-concrete-200 bg-white p-6 shadow-card">
          <MapPin className="h-7 w-7 text-brand-600" aria-hidden="true" />
          <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">Keep repair local</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Risky repairs go to{" "}
            <Link href="/resources" className="link">
              Southwest Washington shops and licensed pros
            </Link>
            , sorted by distance from you.
          </p>
        </div>
      </section>
    </div>
  );
}
