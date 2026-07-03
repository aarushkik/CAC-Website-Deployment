import type { ReactNode } from "react";

/** Consistent page title + intro used at the top of each page with RepairBuddy gradients. */
export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 animate-slide-up">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
        {title.includes("RepairBuddy") || title.includes("Repair") || title.includes("Impact") || title.includes("help") ? (
          <span>
            {title.split(" ").map((word, i) => (
              <span key={i} className={word.startsWith("Repair") || word.includes("Buddy") || word.includes("Impact") || word.includes("help") ? "text-gradient block sm:inline" : ""}>
                {word}{" "}
              </span>
            ))}
          </span>
        ) : (
          title
        )}
      </h1>
      {intro && <p className="mt-3 max-w-2xl text-base sm:text-lg text-slate-400 font-medium leading-relaxed">{intro}</p>}
      {children && <div className="mt-4 animate-fade-in delay-200">{children}</div>}
    </div>
  );
}

