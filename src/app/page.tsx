import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CommunityImpact } from "@/components/CommunityImpact";
import { HomeShowcase } from "@/components/HomeShowcase";
import { ContinueStrip, ImpactStrip, ProblemSearch } from "@/components/HomeWidgets";
import { Icon, type IconName } from "@/components/Icon";
import { CategoryTiles, Rise, Stagger, StaggerItem } from "@/components/Motion";
import { Walkthrough } from "@/components/Walkthrough";
import { Counter, Reveal, SectionTitle, ToolsBackdrop, Wrenches } from "@/components/Workshop";
import { getGuide, getGuideCategory, guides, items } from "@/lib/data";
import { SAFETY_QUESTIONS } from "@/lib/safety";

/** Guides shown under "Popular fixes". */
const POPULAR = ["patch-tube", "fix-zipper", "unclog-sink", "tighten-joints", "sew-button", "squeaky-hinge"];

const RESULTS: Array<{ word: string; fill: string; icon: IconName; title: string; text: string }> = [
  { word: "SAFE", fill: "bg-[#15803d]", icon: "check", title: "Green", text: "A beginner can do it. You get a step-by-step guide with a checklist." },
  { word: "CAREFUL", fill: "bg-[#b45309]", icon: "alert", title: "Yellow", text: "There is some added risk. Read the safety tips before you start." },
  { word: "STOP", fill: "bg-[#b91c1c]", icon: "stop", title: "Red", text: "Not a home repair. You get local help and what to say when you call." },
];

/**
 * The home screen. It opens on the start of the safety check ("What's broken?")
 * and then shows what is in the app: the numbers, how the three results work,
 * the categories, popular guides, what never gets a guide, and local help.
 */
export default function HomePage() {
  const dangerous = items.filter((item) => item.dangerous);
  const features: Array<{ number: number; title: string; text: string; href: string; link: string }> = [
    { number: items.length, title: "repairs checked for safety", text: `Each one starts with ${SAFETY_QUESTIONS.length} quick questions before you pick up a tool.`, href: "/choose-item", link: "Pick your item" },
    { number: guides.length, title: "step-by-step guides", text: "Big-type steps, a tool checklist, and 3D pictures on many of them.", href: "/guides", link: "Browse the guides" },
    { number: dangerous.length, title: "repairs we send to a pro", text: "Gas, wiring, brakes, swollen batteries: no home instructions, ever.", href: "/about", link: "Our safety promise" },
  ];

  return (
    <div>
      <Walkthrough />

      {/* Hero: the question on the left, a real guide to play with on the right */}
      <section className="grid items-center gap-8 py-4 lg:grid-cols-[1.1fr,1fr] lg:py-10">
        <div className="relative isolate text-center lg:text-left">
          <ToolsBackdrop />
          <Rise>
            <p className="chip bg-brand-50 font-semibold text-brand-700">
              <Icon name="wrench" size={15} />
              Your repair bench
            </p>
            <h1 className="display mt-5 text-[3.25rem] leading-[0.95] text-workshop-900 sm:text-7xl xl:text-8xl">
              What&apos;s broken?
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base text-workshop-800 sm:text-lg lg:mx-0">
              Find out in a minute if it is safe to fix yourself. Then follow a guide, or find
              someone nearby who can fix it.
            </p>
          </Rise>
          <Rise delay={0.1} className="[&>div]:lg:mx-0">
            <ProblemSearch />
          </Rise>
          <Rise delay={0.18}>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold lg:justify-start">
              {[
                ["/choose-item", "Pick from a list", "list"],
                ["/guides", "Browse guides", "book"],
                ["/resources", "Help near me", "pin"],
                ["/recalls", "Check a recall", "alert"],
              ].map(([href, label, icon]) => (
                <Link key={href} href={href} className="inline-flex items-center gap-1.5 text-brand-700 hover:underline">
                  <Icon name={icon as IconName} size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </Rise>
        </div>
        <Rise delay={0.15}>
          <HomeShowcase />
        </Rise>
      </section>

      <ContinueStrip />
      <ImpactStrip />
      <CommunityImpact />

      {/* What is in the app, in numbers */}
      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <Link href={feature.href} className="tile plate group flex h-full flex-col p-7">
              <Counter value={feature.number} className="text-6xl" />
              <span className="mt-3 text-lg font-bold text-workshop-900">{feature.title}</span>
              <span className="mt-1 flex-1 text-sm text-workshop-800">{feature.text}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                {feature.link}
                <Icon name="arrow" size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      {/* The three results */}
      <Reveal className="mt-14">
        <SectionTitle>Three possible answers</SectionTitle>
        <p className="mt-3 max-w-2xl text-workshop-800">
          You answer {SAFETY_QUESTIONS.length} yes-or-no questions. &ldquo;Not sure&rdquo; counts as yes, so the
          answer can only come out more careful.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {RESULTS.map((result) => (
            <div key={result.word} className="overflow-hidden rounded-card border-2 border-workshop-200 bg-surface shadow-card">
              <div className={`flex items-center gap-3 px-5 py-4 text-white ${result.fill} ${result.word === "STOP" ? "hazard-stripes" : ""}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                  <Icon name={result.icon} size={24} />
                </span>
                <span className="display text-3xl">{result.word}</span>
              </div>
              <p className="p-5 text-workshop-800">
                <strong className="text-workshop-900">{result.title}.</strong> {result.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Categories */}
      <Reveal className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <SectionTitle>Pick a category</SectionTitle>
          <Link href="/choose-item" className="text-sm font-semibold text-brand-700 hover:underline">
            All {items.length} repairs
          </Link>
        </div>
        <CategoryTiles />
      </Reveal>

      {/* Popular guides */}
      <Reveal className="mt-14">
        <div className="mb-4 flex items-end justify-between">
          <SectionTitle>Popular fixes</SectionTitle>
          <Link href="/guides" className="text-sm font-semibold text-brand-700 hover:underline">
            All {guides.length} guides
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.flatMap((id) => getGuide(id) ?? []).map((guide) => {
            const category = getGuideCategory(guide.id);
            return (
              <Link key={guide.id} href={`/guide/${guide.id}`} className="tile group flex overflow-hidden">
                <span className="ticket-stub flex w-20 flex-none flex-col items-center justify-center gap-1 p-3 text-center">
                  <CategoryIcon name={category?.icon} className="h-8 w-8 text-workshop-800 transition-colors group-hover:text-brand-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-workshop-600">Job</span>
                </span>
                <span className="flex-1 p-4">
                  <span className="block font-bold leading-tight text-workshop-900">{guide.title}</span>
                  <span className="mt-1 block text-sm text-workshop-600">{category?.name}</span>
                  <span className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-workshop-800">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="clock" size={14} />
                      {guide.time}
                    </span>
                    <Wrenches difficulty={guide.difficulty} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {/* What never gets a guide */}
      <Reveal className="hazard-stripes mt-14 rounded-[1.5rem] bg-[#b91c1c] p-6 text-white sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr] lg:items-center">
          <div>
            <h2 className="display text-3xl sm:text-4xl">Some things you should not fix</h2>
            <p className="mt-2 text-white/90">
              {dangerous.length} of the repairs in FixIt never get home instructions. You get a
              professional near you and a note of what to tell them.
            </p>
            <Link href="/choose-item" className="mt-5 inline-flex min-h-[3rem] items-center gap-2 rounded-card bg-white px-5 font-bold text-[#1f2937] transition hover:brightness-95">
              Check yours
              <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2">
            {dangerous.slice(0, 14).map((item) => (
              <li key={item.id} className="rounded-full bg-black/25 px-3 py-1.5 text-sm font-semibold">
                {item.name}
              </li>
            ))}
            <li className="rounded-full border border-white/50 px-3 py-1.5 text-sm font-semibold">
              and {dangerous.length - 14} more
            </li>
          </ul>
        </div>
      </Reveal>

      {/* Local help and recalls */}
      <Reveal className="mt-14 grid gap-4 md:grid-cols-2">
        {[
          { icon: "pin" as IconName, title: "Repair help near you", text: "Repair cafes, tool libraries, bike shops, tailors and tradespeople on a map, nearest first.", href: "/resources", link: "Open the map" },
          { icon: "alert" as IconName, title: "Recalled? Do not repair it", text: "Search the US government's recall notices by brand or product before you start.", href: "/recalls", link: "Check a recall" },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="tile group flex gap-4 p-6">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-workshop-900 text-workshop-50">
              <Icon name={card.icon} size={26} />
            </span>
            <span>
              <span className="block text-xl font-bold text-workshop-900">{card.title}</span>
              <span className="mt-1 block text-workshop-800">{card.text}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                {card.link}
                <Icon name="arrow" size={16} className="transition group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        ))}
      </Reveal>
    </div>
  );
}
