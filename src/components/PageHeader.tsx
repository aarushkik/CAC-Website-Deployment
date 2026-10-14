import type { ReactNode } from "react";

/** Consistent page title + intro used at the top of each page. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {intro && <p className="mt-3 max-w-2xl text-lg text-ink-soft">{intro}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
