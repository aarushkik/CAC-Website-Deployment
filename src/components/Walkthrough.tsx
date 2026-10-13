"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";

const SEEN_KEY = "fixit-wa03-walkthrough-seen";

const SCREENS: Array<{ icon: IconName; colour: string; title: string; text: string }> = [
  {
    icon: "check",
    colour: "bg-safe",
    title: "Green: safe for a beginner",
    text: "You get a step-by-step guide with a checklist. Tick steps as you go and pick it up again later.",
  },
  {
    icon: "alert",
    colour: "bg-caution",
    title: "Yellow: go carefully",
    text: "There is some added risk. Read the safety tips first, and stop if anything looks different from the guide.",
  },
  {
    icon: "stop",
    colour: "bg-danger",
    title: "Red: take it to a pro",
    text: "Things like gas, wiring, brakes and swollen batteries never get do-it-yourself steps here. FixIt finds local help and writes what to say when you call.",
  },
];

/** Three short screens the first time someone opens the app, explaining the colours. */
export function Walkthrough() {
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) setStep(0);
    } catch {
      setStep(null);
    }
  }, []);

  function close() {
    setStep(null);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private window: it will show again next time, which is fine
    }
  }

  if (step === null) return null;
  const screen = SCREENS[step];
  const last = step === SCREENS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="How FixIt works"
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <div key={step} className="w-full max-w-sm animate-pop rounded-[1.5rem] border border-workshop-200 bg-surface p-6 text-center shadow-lift">
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ${screen.colour}`}>
          <Icon name={screen.icon} size={32} />
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-workshop-900">{screen.title}</h2>
        <p className="mt-2 text-workshop-800">{screen.text}</p>
        <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          {SCREENS.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-brand-600" : "w-2 bg-workshop-300"}`} />
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <Button variant="ghost" onClick={close} className="flex-1">
            Skip
          </Button>
          <Button autoFocus onClick={() => (last ? close() : setStep(step + 1))} className="flex-1">
            {last ? "Got it" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
