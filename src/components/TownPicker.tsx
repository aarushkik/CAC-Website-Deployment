"use client";

import { useId, useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import { places } from "@/lib/data";
import { nearestPlace, useTown } from "@/lib/useTown";

const districtCounties = [...new Set(places.filter((p) => !p.region).map((p) => p.county))];
const statewide = places.filter((p) => p.region === "statewide");

/** Town options: WA-03 towns by county, then other Washington cities. */
export function TownOptions() {
  return (
    <>
      {districtCounties.map((county) => (
        <optgroup key={county} label={`${county} County`}>
          {places
            .filter((p) => !p.region && p.county === county)
            .map((place) => (
              <option key={place.name} value={place.name}>
                {place.name}
              </option>
            ))}
        </optgroup>
      ))}
      <optgroup label="Elsewhere in Washington">
        {statewide.map((place) => (
          <option key={place.name} value={place.name}>
            {place.name}
          </option>
        ))}
      </optgroup>
    </>
  );
}

/** Compact "near [town]" control used above shopping and pro results. */
export function TownPicker({ label = "Near" }: { label?: string }) {
  const id = useId();
  const { town, setTown } = useTown();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function locate() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTown(nearestPlace({ lat: position.coords.latitude, lng: position.coords.longitude }).name);
        setLocating(false);
      },
      () => {
        setError("Location is off — pick your town.");
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        value={town?.name ?? ""}
        onChange={(event) => setTown(event.target.value || null)}
        className="rounded-lg border border-concrete-300 bg-white py-1.5 pl-2.5 pr-8 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <option value="">Choose your town</option>
        <TownOptions />
      </select>
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-60"
      >
        {locating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="h-4 w-4" aria-hidden="true" />}
        Use my location
      </button>
      {error && <span className="text-danger-ink">{error}</span>}
    </div>
  );
}
