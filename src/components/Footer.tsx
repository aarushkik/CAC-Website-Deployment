import Link from "next/link";

/** Simple footer with the project's mission and safety reminder. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-workshop-200 bg-workshop-100">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-workshop-800">
        <p className="font-semibold text-workshop-900">FixIt WA 03</p>
        <p className="mt-1 max-w-2xl">
          A community repair assistant for Southwest Washington. Fix everyday items
          safely, save money, and keep usable things out of the landfill.
        </p>
        <p className="mt-4 text-workshop-800">
          Safety first: FixIt never gives step-by-step instructions for dangerous
          repairs. For those, we help you{" "}
          <Link href="/resources" className="font-semibold text-brand-700 underline">
            find local professionals
          </Link>
          .
        </p>
        <p className="mt-4 text-xs text-workshop-800">
          Congressional App Challenge project · Placeholder data — replace before launch.
        </p>
      </div>
    </footer>
  );
}
