import type { ReactNode } from "react";
import { safetySignalWord } from "@/lib/safety";
import type { SafetyLevel } from "@/lib/types";

/**
 * The app's signature: a safety result drawn like a real ANSI Z535 sign,
 * with the signal word in a colored header band ("DANGER" in white on red,
 * "CAUTION" in black on yellow) above a plain white message panel.
 */

const header: Record<SafetyLevel, string> = {
  green: "bg-safe text-white",
  yellow: "bg-caution text-ink",
  red: "bg-danger text-white",
};

/** ANSI's safety alert symbol: a triangle with an exclamation mark. */
function AlertSymbol({ level }: { level: "yellow" | "red" }) {
  const triangle = level === "red" ? "#ffffff" : "#1c2321";
  const mark = level === "red" ? "#c8102e" : "#ffd100";
  return (
    <svg viewBox="0 0 24 22" className="h-[0.9em] w-[0.98em]" aria-hidden="true">
      <path
        d="M12 1.5 22.5 20.5H1.5Z"
        fill={triangle}
        stroke={triangle}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10.9 7.5h2.2l-.35 7h-1.5z" fill={mark} />
      <circle cx="12" cy="17.1" r="1.25" fill={mark} />
    </svg>
  );
}

function CheckSymbol() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.9em] w-[0.9em]" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#ffffff" />
      <path
        d="m6.8 12.4 3.4 3.4 7-7.4"
        fill="none"
        stroke="#007a53"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SignalWord({ level, className = "" }: { level: SafetyLevel; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display font-extrabold uppercase leading-none tracking-[0.12em] ${className}`}
    >
      {level === "green" ? <CheckSymbol /> : <AlertSymbol level={level} />}
      {safetySignalWord(level)}
    </span>
  );
}

/** Full-size sign for the safety result. */
export function SafetySign({
  level,
  eyebrow,
  title,
  children,
  animate = false,
}: {
  level: SafetyLevel;
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  animate?: boolean;
}) {
  return (
    <section
      aria-label={`Safety result: ${safetySignalWord(level)}`}
      className={`overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-lift ${animate ? "animate-sign-in" : ""}`}
    >
      <div className={`flex items-center px-5 py-3 sm:px-7 ${header[level]}`}>
        <SignalWord level={level} className="text-2xl sm:text-3xl" />
      </div>
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** Small sign used as an example on the home page. */
export function MiniSafetySign({
  level,
  label,
  detail,
}: {
  level: SafetyLevel;
  label: string;
  detail: string;
}) {
  return (
    <span className="block overflow-hidden rounded-lg border-2 border-ink bg-white shadow-card transition-transform group-hover:-translate-y-0.5 group-hover:shadow-lift">
      <span className={`flex items-center px-3 py-1.5 ${header[level]}`}>
        <SignalWord level={level} className="text-base" />
      </span>
      <span className="block px-3 py-2.5">
        <span className="block font-semibold leading-snug text-ink">{label}</span>
        <span className="block text-sm text-ink-muted">{detail}</span>
      </span>
    </span>
  );
}
