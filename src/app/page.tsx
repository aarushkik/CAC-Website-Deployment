import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { categories } from "@/lib/data";

const steps = [
  { n: 1, title: "Pick or scan your item", detail: "Choose a category or upload a photo." },
  { n: 2, title: "Run the safety check", detail: "Answer a few quick questions." },
  { n: 3, title: "Get a clear result", detail: "Green, yellow, or red — with next steps." },
  { n: 4, title: "Fix it or find help", detail: "Follow a guide or contact a local pro." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="workshop-texture rounded-card border border-workshop-200 bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
        <p className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-sm font-semibold text-brand-700">
          Southwest Washington · Right to repair
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-workshop-900 sm:text-5xl">
          Fix it yourself, safely — or find someone local who can.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-workshop-800">
          FixIt WA 03 helps you repair everyday items, save money, and keep usable
          things out of the landfill. We check every repair for safety first.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/choose-item">Start a repair</Button>
          <Button href="/scanner" variant="secondary">
            📷 Scan an item
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-workshop-900">How it works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.n}>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {step.n}
              </div>
              <h3 className="font-semibold text-workshop-900">{step.title}</h3>
              <p className="mt-1 text-sm text-workshop-800">{step.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-workshop-900">What are you fixing?</h2>
          <Link href="/choose-item" className="text-sm font-semibold text-brand-700 underline">
            See all
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/choose-item?category=${category.id}`}
              className="group rounded-card border border-workshop-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl" aria-hidden="true">
                {category.icon}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-workshop-900 group-hover:text-brand-700">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-workshop-800">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-workshop-900">💵 Save money</h3>
          <p className="mt-1 text-sm text-workshop-800">
            Repairs often cost a fraction of replacement. See the difference before you decide.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-workshop-900">♻️ Reduce waste</h3>
          <p className="mt-1 text-sm text-workshop-800">
            Every fix keeps usable material out of the landfill. Track your impact over time.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-workshop-900">🤝 Support local</h3>
          <p className="mt-1 text-sm text-workshop-800">
            When a repair needs a pro, we point you to trusted local shops and repair cafes.
          </p>
        </Card>
      </section>
    </div>
  );
}
