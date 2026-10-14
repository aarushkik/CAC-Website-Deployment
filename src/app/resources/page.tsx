"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState } from "react";
import { LocateFixed, Loader2, MapPinned, Phone, ShieldAlert, X } from "lucide-react";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { categories, getCategory, places, resources, type Place } from "@/lib/data";
import { haversineDistanceMiles, type Coordinates } from "@/lib/distance";
import { GAS_UTILITIES } from "@/lib/emergency";
import { nearbySearchHref, telHref } from "@/lib/links";
import { useScrollIntoViewIf } from "@/lib/useScrollIntoViewIf";
import type { Resource, ResourceKind } from "@/lib/types";

const TOWN_KEY = "fixit-wa03-town";
const counties = [...new Set(places.map((place) => place.county))];

type LocationState =
  | { status: "none" }
  | { status: "locating" }
  | { status: "town"; place: Place }
  | { status: "device"; coords: Coordinates; nearest?: Place }
  | { status: "error"; message: string };

function nearestPlace(coords: Coordinates): { place: Place; miles: number } {
  return places
    .map((place) => ({ place, miles: haversineDistanceMiles(coords, place) }))
    .sort((a, b) => a.miles - b.miles)[0];
}

const kindOrder: Record<ResourceKind, number> = { pro: 0, community: 1, info: 2 };

function ResourcesContent() {
  const searchParams = useSearchParams();
  const category = getCategory(searchParams.get("category"));
  const redLevel = searchParams.get("level") === "red";
  const townSelectId = useId();

  const [location, setLocation] = useState<LocationState>({ status: "none" });
  const [geoSupported, setGeoSupported] = useState(false);

  // Browser-only checks happen after mount to keep server and client in sync.
  useEffect(() => {
    setGeoSupported("geolocation" in navigator);
    try {
      const saved = window.localStorage.getItem(TOWN_KEY);
      const place = places.find((p) => p.name === saved);
      if (place) setLocation({ status: "town", place });
    } catch {
      // Remembering the town is optional.
    }
  }, []);

  const origin: Coordinates | null =
    location.status === "town" ? location.place : location.status === "device" ? location.coords : null;

  const locationLabel =
    location.status === "town"
      ? location.place.name
      : location.status === "device"
        ? location.nearest
          ? `near ${location.nearest.name}`
          : "your location"
        : null;

  const farAway =
    location.status === "device" && origin ? nearestPlace(origin).miles > 60 : false;

  const { storefronts, info } = useMemo(() => {
    const matching = resources.filter((r) => !category || r.categories.includes(category.id));
    const distance = (r: Resource) =>
      origin && r.lat !== undefined && r.lng !== undefined
        ? haversineDistanceMiles(origin, { lat: r.lat, lng: r.lng })
        : undefined;
    const withDistance = matching
      .filter((r) => r.kind !== "info")
      .map((resource) => ({ resource, miles: distance(resource) }))
      .sort((a, b) => {
        // For risky repairs, licensed shops come before volunteer events.
        if (redLevel && a.resource.kind !== b.resource.kind) {
          return kindOrder[a.resource.kind] - kindOrder[b.resource.kind];
        }
        if (a.miles !== undefined && b.miles !== undefined) return a.miles - b.miles;
        if (a.miles !== undefined) return -1;
        if (b.miles !== undefined) return 1;
        return kindOrder[a.resource.kind] - kindOrder[b.resource.kind];
      });
    return {
      storefronts: withDistance,
      info: matching.filter((r) => r.kind === "info"),
    };
  }, [category, origin, redLevel]);

  function chooseTown(name: string) {
    const place = places.find((p) => p.name === name);
    try {
      if (place) window.localStorage.setItem(TOWN_KEY, place.name);
      else window.localStorage.removeItem(TOWN_KEY);
    } catch {
      // Remembering the town is optional.
    }
    setLocation(place ? { status: "town", place } : { status: "none" });
  }

  function locateMe() {
    setLocation({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        const nearest = nearestPlace(coords);
        setLocation({ status: "device", coords, nearest: nearest.miles <= 25 ? nearest.place : undefined });
      },
      (error) => {
        setLocation({
          status: "error",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location is blocked for this site. Choose your town instead."
              : "We couldn't get your location. Choose your town instead.",
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  function chipHref(id: string | null) {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    if (redLevel) params.set("level", "red");
    const search = params.toString();
    return `/resources${search ? `?${search}` : ""}`;
  }

  const proSearch = category?.proSearch ?? "repair shop";
  const town = location.status === "town" ? location.place.name : location.status === "device" ? location.nearest?.name : undefined;

  return (
    <div>
      <PageHeader
        eyebrow="Local help"
        title="Repair help near you"
        intro="Repair shops, free repair events, and licensed pros around Southwest Washington. For red-level repairs, always choose a professional."
      />

      {redLevel && (
        <div className="mb-6 flex gap-3 rounded-card border-2 border-danger/40 bg-danger-soft p-4 text-danger-ink">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
          <p className="text-sm">
            <strong>Showing shops and licensed pros first.</strong> Free repair events can&apos;t take
            hazardous items like microwaves, gas appliances, or damaged batteries.
          </p>
        </div>
      )}

      <Card className="mb-8">
        <nav
          aria-label="Filter by category"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <FilterChip href={chipHref(null)} label="Everything" active={!category} />
          {categories.map((c) => (
            <FilterChip key={c.id} href={chipHref(c.id)} label={`${c.icon} ${c.name}`} active={category?.id === c.id} />
          ))}
        </nav>

        <div className="mt-5 grid gap-3 border-t border-concrete-200 pt-5 sm:grid-cols-[auto_minmax(0,18rem)_1fr] sm:items-end">
          {geoSupported && (
            <button
              type="button"
              onClick={locateMe}
              disabled={location.status === "locating"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-70"
            >
              {location.status === "locating" ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="h-5 w-5" aria-hidden="true" />
              )}
              {location.status === "locating" ? "Finding you…" : "Use my location"}
            </button>
          )}
          <div>
            <label htmlFor={townSelectId} className="label">
              {geoSupported ? "Or choose your town" : "Choose your town"}
            </label>
            <select
              id={townSelectId}
              value={location.status === "town" ? location.place.name : ""}
              onChange={(event) => chooseTown(event.target.value)}
              className="input mt-1"
            >
              <option value="">Select a town</option>
              {counties.map((county) => (
                <optgroup key={county} label={`${county} County`}>
                  {places
                    .filter((p) => p.county === county)
                    .map((place) => (
                      <option key={place.name} value={place.name}>
                        {place.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div aria-live="polite" className="text-sm sm:min-h-6 sm:pb-2.5">
            {locationLabel && (
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 py-1 pl-3 pr-1 font-semibold text-brand-700">
                Nearest to {locationLabel}
                <button
                  type="button"
                  onClick={() => chooseTown("")}
                  aria-label="Stop sorting by distance"
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand-100"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            )}
            {location.status === "error" && <span className="font-medium text-danger-ink">{location.message}</span>}
          </div>
        </div>
        {farAway && (
          <p className="mt-3 text-sm text-ink-muted">
            You look to be outside Southwest Washington, so these listings may be far away.
          </p>
        )}
      </Card>

      <section aria-labelledby="places-heading">
        <h2 id="places-heading" className="mb-4 font-display text-2xl font-extrabold text-ink">
          {category ? `${category.name}: shops and repair events` : "Shops and repair events"}
        </h2>
        {storefronts.length === 0 ? (
          <Card>
            <p className="text-ink-soft">We don&apos;t have a local listing for this category yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {storefronts.map(({ resource, miles }) => (
              <ResourceCard key={resource.id} resource={resource} distanceMiles={miles} />
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 rounded-card border border-dashed border-concrete-300 bg-concrete-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            <strong className="text-ink">Don&apos;t see what you need?</strong> Search a map for{" "}
            {proSearch} {town ? `near ${town}` : "near you"}, and read recent reviews before you go.
          </p>
          <a
            href={nearbySearchHref(proSearch, town)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-none items-center gap-2 rounded-lg border border-concrete-300 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-concrete-100"
          >
            <MapPinned className="h-4 w-4" aria-hidden="true" />
            Search the map
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      {info.length > 0 && (
        <section className="mt-10" aria-labelledby="info-heading">
          <h2 id="info-heading" className="mb-4 font-display text-2xl font-extrabold text-ink">
            Check before you hire or toss
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {info.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-card border-2 border-danger/40 bg-white p-5 shadow-card" aria-labelledby="emergency-heading">
        <h2 id="emergency-heading" className="flex items-center gap-2 font-display text-2xl font-extrabold text-danger-ink">
          <Phone className="h-5 w-5" aria-hidden="true" />
          Emergencies
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Fire, sparks, or someone hurt: call{" "}
          <a href="tel:911" className="link">
            911
          </a>
          . Smell gas: leave first, then call 911 or your gas company from outside.
        </p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          {GAS_UTILITIES.map((utility) => (
            <li key={utility.name} className="rounded-lg bg-concrete-50 px-3 py-2">
              <span className="block font-semibold text-ink">{utility.name}</span>
              <a href={telHref(utility.phone)} className="link">
                {utility.phone}
              </a>
              <span className="block text-xs text-ink-muted">{utility.area}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs text-ink-muted">
        Listings were checked against each organization&apos;s website in October 2026. Hours and
        services change — call ahead. Know a great local shop or repair event?{" "}
        <Link href="/about#contribute" className="link">
          Tell us
        </Link>
        .
      </p>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  const ref = useScrollIntoViewIf<HTMLAnchorElement>(active);
  return (
    <Link
      ref={ref}
      href={href}
      replace
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`flex-none whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-concrete-300 bg-white text-ink-soft hover:border-concrete-400 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <ResourcesContent />
    </Suspense>
  );
}
