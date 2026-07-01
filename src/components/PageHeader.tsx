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
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold text-workshop-900 sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-lg text-workshop-800">{intro}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
