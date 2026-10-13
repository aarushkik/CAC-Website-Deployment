"use client";

import { useEffect, useState } from "react";
import type { Coordinates } from "@/lib/distance";
import { findNearby, type NearbyPlace, type NearbyResult } from "@/lib/nearby";
import { Icon } from "./Icon";

const RADII = [5, 10, 25];
const PAGE = 12;

/** Real places around the chosen location, from OpenStreetMap, nearest first. */
export function NearbyPlaces({ location, categoryId }: { location: Coordinates; categoryId: string }) {
  const [radius, setRadius] = useState(10);
  const [result, setResult] = useState<NearbyResult | null>(null);
  const places: NearbyPlace[] | null = result ? result.places : null;
  const [problem, setProblem] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    setResult(null);
    setProblem("");
    setShown(PAGE);
    findNearby(location, radius, categoryId)
      .then((found) => {
        if (current) setResult(found);
      })
      .catch(() => {
        if (current) {
          setProblem(
            navigator.onLine
              ? "The map service did not answer. It is a free public service and is sometimes busy."
              : "You are offline, so the map cannot be searched right now.",
          );
        }
      });
    return () => {
      current = false;
    };
  }, [location, radius, categoryId, attempt]);

  return (
    <section className="mt-10" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">
            {result?.source === "live" ? "Live from OpenStreetMap" : "From OpenStreetMap"}
          </p>
          <h2 className="text-xl font-bold text-workshop-900 sm:text-2xl">More places near you</h2>
        </div>
        <div className="flex rounded-card border border-workshop-200 bg-surface p-1" role="group" aria-label="Search distance">
          {RADII.map((miles) => (
            <button
              key={miles}
              type="button"
              aria-pressed={radius === miles}
              onClick={() => setRadius(miles)}
              className={`min-h-[2.5rem] rounded-xl px-3 text-sm font-semibold transition ${
                radius === miles ? "bg-brand-600 text-white" : "text-workshop-800 hover:bg-workshop-100"
              }`}
            >
              {miles} mi
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-sm text-workshop-800">
        Mapped by volunteers and not checked by FixIt. Call ahead to make sure a place is open and
        does the repair you need.
      </p>

      {problem && (
        <div className="mt-4 rounded-card border border-caution/40 bg-caution/10 p-4 text-sm text-workshop-900">
          {problem}{" "}
          <button type="button" onClick={() => setAttempt(attempt + 1)} className="font-bold text-brand-700 underline">
            Try again
          </button>
        </div>
      )}

      {!places && !problem && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2" aria-label="Searching">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="h-28 animate-pulse rounded-card border border-workshop-200 bg-workshop-100" />
          ))}
          <li className="text-sm text-workshop-800 sm:col-span-2">
            Searching the map. This can take up to half a minute.
          </li>
        </ul>
      )}

      {places && places.length === 0 && (
        <p className="mt-4 rounded-card border border-dashed border-workshop-300 bg-surface p-6 text-center text-workshop-800">
          Nothing mapped within {radius} miles for this category. Try a wider distance or
          &ldquo;All&rdquo;.
        </p>
      )}

      {places && places.length > 0 && (
        <>
          <p className="mt-4 text-sm text-workshop-800">
            {places.length} {places.length === 1 ? "place" : "places"} within {radius} miles
            {result?.source === "saved" && result.fetched ? `, as mapped on ${result.fetched}` : ""}
          </p>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {places.slice(0, shown).map((place) => (
              <li key={place.id} className="rounded-card border border-workshop-200 bg-surface p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-workshop-900">{place.name}</h3>
                    <p className="chip mt-1 bg-workshop-100 px-2.5 text-xs text-workshop-800">{place.type}</p>
                  </div>
                  <span className="flex-none text-sm font-semibold text-brand-700">
                    {place.distanceMiles.toFixed(1)} mi
                  </span>
                </div>
                {place.address && <p className="mt-2 text-sm text-workshop-800">{place.address}</p>}
                {place.openingHours && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-workshop-600">
                    <Icon name="clock" size={13} className="mt-0.5" />
                    {place.openingHours}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone.replace(/[^\d+]/g, "")}`}
                      className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl bg-brand-600 px-3 text-white transition hover:brightness-110"
                    >
                      <Icon name="phone" size={15} />
                      Call
                    </a>
                  )}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-workshop-200 px-3 text-workshop-900 transition hover:bg-workshop-100"
                    >
                      <Icon name="globe" size={15} />
                      Website
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-workshop-200 px-3 text-workshop-900 transition hover:bg-workshop-100"
                  >
                    <Icon name="navigate" size={15} />
                    Directions
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {shown < places.length && (
            <button
              type="button"
              onClick={() => setShown(shown + PAGE)}
              className="mt-4 min-h-[3rem] w-full rounded-card border border-workshop-200 bg-surface font-semibold text-workshop-900 transition hover:bg-workshop-100"
            >
              Show {Math.min(PAGE, places.length - shown)} more
            </button>
          )}
          <p className="mt-3 text-xs text-workshop-600">
            Map data ©{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
              OpenStreetMap contributors
            </a>
          </p>
        </>
      )}
    </section>
  );
}
