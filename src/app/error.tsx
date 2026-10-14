"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-2 font-display text-5xl font-extrabold leading-none text-ink">This page hit a snag</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Your repair log is safe — it&apos;s stored on your device. Try loading the page again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
    </div>
  );
}
