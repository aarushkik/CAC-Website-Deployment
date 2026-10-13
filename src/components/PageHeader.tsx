import type { ReactNode } from "react";

/** Consistent page title + intro used at the top of each page. */
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
    <div className="mb-6 animate-rise sm:mb-8">
      <h1 className="display text-4xl leading-none text-workshop-900 sm:text-6xl">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-base text-workshop-800 sm:text-lg">{intro}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
