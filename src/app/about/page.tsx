import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { DANGEROUS_REPAIRS } from "@/lib/safety";

export const metadata = {
  title: "About — FixIt",
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About FixIt"
        intro="A repair assistant that checks safety first."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">Why we built this</h2>
          <p className="mt-2 text-workshop-800">
            Too many working items get thrown away because fixing them feels hard or unsafe.
            FixIt helps people repair everyday things with confidence — saving money,
            cutting waste, and supporting the right to repair. When a repair isn&apos;t safe to do
            at home, we connect people with local pros and student trade programs instead.
          </p>
          <p className="mt-3 text-workshop-800">[FILL IN: your reason]</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-workshop-900">What it does</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-workshop-800">
            <li>Checks whether a repair is safe for a beginner</li>
            <li>Gives a clear green, yellow, or red result</li>
            <li>Shares beginner-safe, step-by-step guides</li>
            <li>Compares repair cost versus replacement cost</li>
            <li>Tracks money saved and waste avoided</li>
            <li>Points to trusted local repair help</li>
          </ul>
        </Card>
      </div>

      <Card className="mt-6 border-danger/30 bg-danger/5">
        <h2 className="text-lg font-semibold text-workshop-900">Our safety promise</h2>
        <p className="mt-2 text-workshop-800">
          FixIt will <strong>never</strong> give step-by-step instructions for dangerous
          repairs. For anything on this list, we recommend a professional and help you document
          the problem safely:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DANGEROUS_REPAIRS.map((d) => (
            <span
              key={d}
              className="rounded-full border border-danger/30 bg-surface px-3 py-1 text-sm font-medium capitalize text-danger"
            >
              {d}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-workshop-900">Local values</h2>
        <p className="mt-2 text-workshop-800">
          This project connects right-to-repair values with real local life: keeping money in
          working families&apos; pockets, supporting neighborhood repair businesses, and giving
          students a place to practice trade skills that matter.
        </p>
        <Button href="/choose-item" className="mt-4">
          Start a repair
        </Button>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-workshop-900">Learn the trades</h2>
        <p className="mt-2 text-workshop-800">
          Repair skills connect directly to careers in electrical work, HVAC, machining, auto
          repair, and sewing. The habits that make a good repair guide also matter in the trades:
          check safety first, use the right tools, and work carefully. In the US, Apprenticeship.gov
          lists paid apprenticeships by trade and by place.
        </p>
        <a
          href="https://www.apprenticeship.gov/apprenticeship-job-finder"
          className="mt-4 inline-flex items-center justify-center rounded-card bg-brand-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:brightness-110"
        >
          Find an apprenticeship
        </a>
      </Card>

      <p className="mt-8 text-xs text-workshop-800">
        The repairs, guides and cost estimates were written for this project and have not been reviewed by a tradesperson.
      </p>
    </div>
  );
}
