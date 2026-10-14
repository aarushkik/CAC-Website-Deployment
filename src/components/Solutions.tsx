"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  ShoppingCart,
  Store,
  Wrench,
} from "lucide-react";
import { TownPicker } from "@/components/TownPicker";
import { getGuide } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { directionsHref, telHref } from "@/lib/links";
import { partLinks, replacementLinks, serviceLinks, storeUrl, type StoreLink } from "@/lib/shop";
import { getTrade } from "@/lib/trades";
import type { Item, PartSearch, ProListing, SafetyLevel } from "@/lib/types";
import { useTown } from "@/lib/useTown";

type NearbyPro = ProListing & { miles: number };

interface Deal {
  title: string;
  price: number;
  shipping?: number;
  condition?: string;
  image?: string;
  url: string;
}

const HANDMADE = new Set(["clothing", "furniture"]);
const ELECTRONIC = new Set(["electronics", "small-appliances"]);

/**
 * The affordable ways to deal with one repair, priced for that product:
 * fix it yourself (supplies), have a local pro fix it (real nearby
 * businesses for the right trade), or replace it for less (used/refurbished).
 * Red results never show DIY supplies.
 */
export function Solutions({
  item,
  level,
  extraQueries = [],
  showGuide = true,
}: {
  item: Item;
  level: SafetyLevel;
  /** Model-specific searches from photo recognition, e.g. "Dyson V8 filter". */
  extraQueries?: string[];
  showGuide?: boolean;
}) {
  const diy = level !== "red";
  const parts: PartSearch[] = diy
    ? [
        ...extraQueries.map((query) => ({ label: `Matches your item: ${query}`, query })),
        ...(item.parts ?? []),
      ]
    : [];
  const sections = [
    parts.length > 0 && <DiySection key="diy" item={item} level={level} parts={parts} showGuide={showGuide} />,
    <ProSection key="pro" item={item} />,
    item.replaceQuery && <ReplaceSection key="replace" item={item} />,
  ].filter(Boolean);

  return (
    <section aria-labelledby={`solutions-${item.id}`} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`solutions-${item.id}`} className="font-display text-3xl font-extrabold text-ink">
            Affordable fixes
          </h2>
          <p className="text-sm text-ink-muted">Cheapest options first. Prices are typical estimates for a {item.name.toLowerCase()}.</p>
        </div>
        <TownPicker />
      </div>
      {sections}
    </section>
  );
}

function SectionCard({
  icon,
  title,
  price,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  price?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-concrete-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
          {icon}
          {title}
        </h3>
        {price && <p className="font-display text-2xl font-extrabold text-ink tabular">{price}</p>}
      </div>
      {children}
    </div>
  );
}

function StoreButtons({ links }: { links: StoreLink[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {links.map((link) => (
        <a
          key={link.store + link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-concrete-300 bg-white px-3 py-1 text-sm font-semibold text-ink-soft hover:border-brand-200 hover:text-brand-700"
        >
          {link.label}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}

function DiySection({
  item,
  level,
  parts,
  showGuide,
}: {
  item: Item;
  level: SafetyLevel;
  parts: PartSearch[];
  showGuide: boolean;
}) {
  const guide = getGuide(item.guideId);
  const cost = item.estimatedRepairCost;
  return (
    <SectionCard
      icon={<ShoppingCart className="h-5 w-5 text-brand-600" aria-hidden="true" />}
      title="Fix it yourself"
      price={cost !== undefined ? (cost === 0 ? "Free" : `about ${formatMoney(cost)}`) : undefined}
    >
      <LiveDeals query={parts[0].query} />
      <ul className="mt-4 divide-y divide-concrete-200">
        {parts.map((part) => (
          <li key={part.query} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-ink">{part.label}</span>
            <StoreButtons
              links={partLinks(part.query, {
                handmade: HANDMADE.has(item.categoryId),
                electronics: ELECTRONIC.has(item.categoryId),
              })}
            />
          </li>
        ))}
      </ul>
      {showGuide && guide && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-concrete-200 pt-4">
          <Link
            href={level === "green" ? `/guide/${guide.id}?item=${item.id}` : `/safety-checker?item=${item.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {level === "green" ? `Step-by-step guide (${guide.time})` : "Quick safety check, then the guide"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {level === "yellow" && <span className="text-sm text-ink-muted">This one needs care, so we ask a few questions first.</span>}
        </div>
      )}
    </SectionCard>
  );
}

/** Live eBay prices when the site has eBay keys; otherwise renders nothing. */
function LiveDeals({ query }: { query: string }) {
  const [deals, setDeals] = useState<Deal[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDeals(null);
    fetch(`/api/deals?q=${encodeURIComponent(query)}`)
      .then((response) => (response.ok ? response.json() : { deals: [] }))
      .then((data: { deals?: Deal[] }) => {
        if (!cancelled) setDeals(data.deals ?? []);
      })
      .catch(() => {
        if (!cancelled) setDeals([]);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!deals || deals.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-ink">Lowest prices on eBay right now</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {deals.map((deal) => (
          <li key={deal.url}>
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-concrete-200 p-2 hover:border-brand-200"
            >
              {deal.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote eBay thumbnail
                <img src={deal.image} alt="" className="h-12 w-12 flex-none rounded object-cover" loading="lazy" />
              ) : (
                <span className="h-12 w-12 flex-none rounded bg-concrete-100" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm text-ink">{deal.title}</span>
                <span className="text-sm font-bold text-safe-ink tabular">
                  {formatMoney(deal.price)}
                  <span className="font-normal text-ink-muted">
                    {deal.shipping ? ` + ${formatMoney(deal.shipping)} shipping` : deal.shipping === 0 ? " · free shipping" : ""}
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProSection({ item }: { item: Item }) {
  const { town } = useTown();
  const tradeIds = item.trades ?? [];
  const primary = getTrade(tradeIds[0] ?? "");
  const [state, setState] = useState<{ key: string; pros: NearbyPro[] | null; failed: boolean }>({
    key: "",
    pros: null,
    failed: false,
  });
  const key = town && tradeIds.length ? `${tradeIds.join(",")}@${town.name}` : "";

  useEffect(() => {
    if (!key || !town) return;
    let cancelled = false;
    setState({ key, pros: null, failed: false });
    fetch(`/api/pros?trades=${tradeIds.join(",")}&lat=${town.lat}&lng=${town.lng}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { listings: NearbyPro[] }) => {
        if (!cancelled) setState({ key, pros: data.listings, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ key, pros: [], failed: true });
      });
    return () => {
      cancelled = true;
    };
    // tradeIds is derived from item; key captures both.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const pros = state.key === key ? state.pros : null;
  const cost = item.estimatedProCost;
  const search = primary?.search ?? item.proSearch ?? "repair shop";

  return (
    <SectionCard
      icon={<Wrench className="h-5 w-5 text-brand-600" aria-hidden="true" />}
      title={item.replaceOnly ? "Get help choosing a safe replacement" : "Have a pro fix it"}
      price={cost !== undefined && !item.replaceOnly ? `about ${formatMoney(cost)}` : undefined}
    >
      {!town ? (
        <p className="mt-3 text-sm text-ink-soft">
          Choose your town above to see {primary ? primary.label.toLowerCase() : "repair shops"} near you, with
          their phone numbers.
        </p>
      ) : pros === null ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Finding {primary?.label.toLowerCase() ?? "shops"} near {town.name}…
        </p>
      ) : pros.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">
          We don&apos;t have a listing for {primary?.label.toLowerCase() ?? "this"} near {town.name} yet — these
          searches will find one:
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-concrete-200">
          {pros.map((pro) => (
            <li key={`${pro.name}-${pro.lat}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{pro.name}</p>
                <p className="flex items-center gap-1 text-sm text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                  {[getTrade(pro.trades.find((t) => tradeIds.includes(t)) ?? "")?.label, pro.city, `${pro.miles < 0.95 ? "under 1" : pro.miles.toFixed(pro.miles < 10 ? 1 : 0)} mi`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                {pro.phone && (
                  <a href={telHref(pro.phone)} className="inline-flex items-center gap-1.5 text-brand-700 hover:underline">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {pro.phone}
                  </a>
                )}
                {pro.website && (
                  <a href={pro.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-700 hover:underline">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    Website
                  </a>
                )}
                <a
                  href={directionsHref(`${pro.name}, ${pro.address ? `${pro.address}, ` : ""}${pro.city ?? ""} WA`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Map
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-concrete-200 pt-4">
        <span className="text-sm text-ink-muted">Compare reviews:</span>
        <StoreButtons links={serviceLinks(search, town?.name)} />
        {item.etsyQuery && (
          <StoreButtons links={[{ store: "etsy", label: "Mail-in repair on Etsy", href: storeUrl.etsy(item.etsyQuery) }]} />
        )}
      </div>
      {pros && pros.length > 0 && (
        <p className="mt-3 text-xs text-ink-muted">
          Business listings © OpenStreetMap contributors. Call ahead to confirm they take this repair
          {tradeIds.some((t) => ["electrician", "plumber", "roofer", "hvac", "handyman", "garage"].includes(t))
            ? ", and check their license at secure.lni.wa.gov/verify"
            : ""}
          .
        </p>
      )}
    </SectionCard>
  );
}

function ReplaceSection({ item }: { item: Item }) {
  const query = item.replaceQuery!;
  const cost = item.estimatedReplacementCost;
  return (
    <SectionCard
      icon={<Store className="h-5 w-5 text-brand-600" aria-hidden="true" />}
      title="Replace it for less"
      price={cost !== undefined ? `new about ${formatMoney(cost)}` : undefined}
    >
      <p className="mt-2 text-sm text-ink-soft">
        {item.replaceOnly
          ? "Buy safety gear new. Used gear can have damage you can't see, so skip secondhand listings for this one."
          : `Used and refurbished ones often cost a fraction of new — and still keep one out of the landfill.`}
      </p>
      <div className="mt-3">
        <StoreButtons
          links={replacementLinks(query.replace(/^refurbished /, ""), {
            refurbished: ELECTRONIC.has(item.categoryId),
            newOnly: item.replaceOnly,
          })}
        />
      </div>
    </SectionCard>
  );
}
