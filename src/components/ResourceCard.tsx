import { ExternalLink, Globe, MapPin, Navigation, Phone, TriangleAlert } from "lucide-react";
import { directionsHref, telHref } from "@/lib/links";
import type { Resource, ResourceKind } from "@/lib/types";

const kindLabel: Record<ResourceKind, { label: string; classes: string }> = {
  pro: { label: "Repair shop / pro", classes: "bg-brand-50 text-brand-700 border-brand-100" },
  community: { label: "Community", classes: "bg-manila-100 text-manila-700 border-manila-200" },
  info: { label: "Official info", classes: "bg-concrete-100 text-ink-soft border-concrete-300" },
};

/** One local repair resource with ways to reach it. */
export function ResourceCard({
  resource,
  distanceMiles,
  compact = false,
}: {
  resource: Resource;
  distanceMiles?: number;
  compact?: boolean;
}) {
  const kind = kindLabel[resource.kind];
  const place = [resource.city, resource.area].filter(Boolean).join(" · ");

  return (
    <article className="flex h-full flex-col rounded-card border border-concrete-200 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${kind.classes}`}>{kind.label}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{resource.type}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{resource.name}</h3>

      {(place || distanceMiles !== undefined) && (
        <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
          <MapPin className="mt-0.5 h-4 w-4 flex-none text-ink-muted" aria-hidden="true" />
          <span>
            {place}
            {distanceMiles !== undefined && (
              <>
                {place ? " · " : ""}
                <strong className="whitespace-nowrap font-semibold text-ink">
                  {distanceMiles < 0.95 ? "under 1" : distanceMiles.toFixed(distanceMiles < 10 ? 1 : 0)} mi away
                </strong>
              </>
            )}
          </span>
        </p>
      )}

      {!compact && resource.notes && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{resource.notes}</p>}

      {resource.notice && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-caution-soft px-2.5 py-1.5 text-sm font-medium text-caution-ink">
          <TriangleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          {resource.notice}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4 text-sm font-semibold">
        {resource.phone && (
          <a href={telHref(resource.phone)} className="inline-flex items-center gap-1.5 text-brand-700 hover:underline">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {resource.phone}
          </a>
        )}
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
          >
            {resource.kind === "info" ? (
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Globe className="h-4 w-4" aria-hidden="true" />
            )}
            {resource.kind === "info" ? "Open" : "Website"}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {resource.address && (
          <a
            href={directionsHref(`${resource.name}, ${resource.address}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
