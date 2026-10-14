import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, GraduationCap, Lock, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { categories, guides, items } from "@/lib/data";
import { DANGEROUS_REPAIRS, SAFETY_QUESTIONS } from "@/lib/safety";

export const metadata: Metadata = {
  title: "About",
  description: "Why FixIt WA 03 exists, how its safety check works, and how it protects your privacy.",
};

const REPO_URL = "https://github.com/aarushkik/CAC-Website-Deployment";

export default function AboutPage() {
  const repairCount = items.filter((item) => !item.generic).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="About"
        title="About FixIt WA 03"
        intro="A community repair assistant for Washington's 3rd Congressional District: Clark, Cowlitz, Lewis, Pacific, Skamania, and Wahkiakum counties, plus part of southern Thurston County."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-extrabold text-ink">Why we built this</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Families here are often stuck deciding whether to buy new or try one more repair on a
            bike, a coat, a chair, or a small appliance. Guessing can waste money — or be dangerous.
            FixIt gives people a fast, safe first step: fix the easy things with confidence, and send
            the risky ones to someone trained for them.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Every repair also keeps something useful out of the landfill and keeps money with local
            repair shops instead of a shipping box.
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-2xl font-extrabold text-ink">What it does</h2>
          <ul className="mt-2 space-y-1.5 text-ink-soft">
            <li>• Checks whether a repair is safe for a beginner ({repairCount} common repairs)</li>
            <li>• Gives a clear green, yellow, or red result, with reasons</li>
            <li>• Walks you through {guides.length} beginner-safe, step-by-step guides</li>
            <li>• Compares repair cost with replacement cost</li>
            <li>• Tracks money saved and waste kept out of the landfill</li>
            <li>• Points to local shops, repair events, and licensed pros</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
          <ShieldCheck className="h-6 w-6 text-brand-600" aria-hidden="true" />
          How the safety check works
        </h2>
        <ol className="mt-3 space-y-3 text-ink-soft">
          <li>
            <strong className="text-ink">1. Every repair starts with a typical level.</strong> Sewing a
            seam starts green; a dripping faucet starts yellow; anything on the do-not-DIY list below is
            always red.
          </li>
          <li>
            <strong className="text-ink">2. Questions can only make it more careful.</strong> We ask
            only the questions that matter for that kind of item ({SAFETY_QUESTIONS.length} in all, across{" "}
            {categories.length} categories). A &ldquo;yes&rdquo; can raise the level; nothing you answer
            can lower it.
          </li>
          <li>
            <strong className="text-ink">3. &ldquo;Not sure&rdquo; counts as yes.</strong> When in doubt,
            we play it safe.
          </li>
          <li>
            <strong className="text-ink">4. Red means no instructions.</strong> For red results we never
            show a how-to guide. We help you describe the problem and find a professional instead.
          </li>
        </ol>
        <p className="mt-4 text-sm text-ink-muted">
          These rules live in the app&apos;s code and are covered by automated tests, so a typo can&apos;t
          quietly turn a dangerous repair into a DIY guide.
        </p>
      </Card>

      <Card className="mt-6 border-2 border-danger/40">
        <h2 className="font-display text-2xl font-extrabold text-ink">Our safety promise</h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          FixIt WA 03 will <strong className="text-ink">never</strong> give step-by-step instructions
          for dangerous repairs. For anything on this list, we recommend a professional and help you
          document the problem safely:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {DANGEROUS_REPAIRS.map((repair) => (
            <li
              key={repair}
              className="rounded-full border border-danger/30 bg-danger-soft px-3 py-1 text-sm font-semibold capitalize text-danger-ink"
            >
              {repair}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
          <Lock className="h-6 w-6 text-brand-600" aria-hidden="true" />
          Your privacy
        </h2>
        <ul className="mt-3 space-y-2 text-ink-soft">
          <li>
            <strong className="text-ink">No account, no tracking.</strong> Your repair log is saved only in
            this browser. You can export it or delete it anytime from the{" "}
            <Link href="/log" className="link">
              repair log
            </Link>
            .
          </li>
          <li>
            <strong className="text-ink">Your location stays with you.</strong> &ldquo;Use my
            location&rdquo; sorts listings inside your browser; your position isn&apos;t sent anywhere.
          </li>
          <li>
            <strong className="text-ink">Photos are only sent when photo recognition is on.</strong> When
            it is, the photo is shrunk on your device and sent to our AI provider just to identify the
            item. It isn&apos;t stored.
          </li>
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
          <GraduationCap className="h-6 w-6 text-brand-600" aria-hidden="true" />
          Learn the trades
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Repair skills lead to real careers: electrician, HVAC technician, machinist, auto and bike
          mechanic, tailor. The habits behind a good repair — check safety first, use the right tool,
          work carefully — are the same ones the trades are built on. High school students in Southwest
          Washington can earn college credit for career and technical classes through Clark
          College&apos;s CTE Dual Credit program.
        </p>
        <Button href="https://www.clark.edu/academics/hs-dual-credit/cte/" external variant="secondary" className="mt-4">
          Explore Clark College CTE Dual Credit
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Card>

      <Card className="mt-6 scroll-mt-24">
        <h2 id="contribute" className="flex scroll-mt-24 items-center gap-2 font-display text-2xl font-extrabold text-ink">
          <MessageSquarePlus className="h-6 w-6 text-brand-600" aria-hidden="true" />
          Help us improve
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          Know a repair shop, repair event, or tool library in Southwest Washington we should list? Spot
          something wrong in a guide? Let us know and we&apos;ll check it out.
        </p>
        <Button href={`${REPO_URL}/issues`} external variant="secondary" className="mt-4">
          Suggest a listing or fix
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Card>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button href="/choose-item" size="lg">
          Start a repair
        </Button>
        <Button href="/resources" variant="secondary" size="lg">
          Find local help
        </Button>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-ink-muted">
        Built for the Congressional App Challenge. Sources: U.S. EPA (household waste per person), U.S.
        Consumer Product Safety Commission (recalls), Washington State Department of Labor &amp;
        Industries (contractor licenses). Cost figures are rough national estimates, not quotes.
      </p>
    </div>
  );
}
