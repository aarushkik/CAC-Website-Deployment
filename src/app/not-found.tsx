import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold leading-none text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        The link may be old, or the guide may have moved. Try starting a repair from the list.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/choose-item">Start a repair</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        Looking for repair help nearby?{" "}
        <Link href="/resources" className="link">
          See local help
        </Link>
        .
      </p>
    </div>
  );
}
