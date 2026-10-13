"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { NearbyPlaces } from "@/components/NearbyPlaces";
import { PlacesMap, type MapPlace } from "@/components/PlacesMap";
import { PageHeader } from "@/components/PageHeader";
import { categories, resources } from "@/lib/data";
import { haversineDistanceMiles, sortByDistance } from "@/lib/distance";
import { findNearby } from "@/lib/nearby";

type Coordinates = {
  lat: number;
  lng: number;
};

/** Hand-picked places are only shown to people within this many miles of them. */
const PICKED_RANGE_MILES = 75;

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>(searchParams.get("category") ?? "");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationNotice, setLocationNotice] = useState("");

  // Map or list. The map is what people see first.
  const [view, setView] = useState<"map" | "list">("map");
  const [mapPlaces, setMapPlaces] = useState<MapPlace[]>([]);
  useEffect(() => {
    let current = true;
    // without a position there is nothing to show yet: the app is not tied to one region
    if (!userLocation) {
      setMapPlaces([]);
      return undefined;
    }
    findNearby(userLocation, 25, filter)
      .then((result) => result.places)
      .catch(() => [])
      .then((found) => {
        if (!current) return;
        const picked: MapPlace[] = (filter ? resources.filter((r) => r.categories.includes(filter)) : resources)
          .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
          .filter((r) => haversineDistanceMiles({ lat: r.lat as number, lng: r.lng as number }, userLocation) <= PICKED_RANGE_MILES)
          // several picked places only have their city's position, so spread them a little
          .map((r, i) => ({
            id: r.id, name: r.name, type: r.type, picked: true, phone: r.phone, website: r.website, notes: r.notes,
            address: [r.area, r.city].filter(Boolean).join(", "),
            lat: (r.lat as number) + Math.sin(i * 2.4) * 0.006, lng: (r.lng as number) + Math.cos(i * 2.4) * 0.008,
          }));
        setMapPlaces([...found.map((place) => ({ ...place, picked: false })), ...picked]);
      });
    return () => {
      current = false;
    };
  }, [filter, userLocation]);

  // On a phone the chips scroll sideways, so bring the chosen one into view.
  const activeChip = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeChip.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [filter]);

  // only known in the browser, so it is worked out after the page has loaded
  const [locationSupported, setLocationSupported] = useState(false);
  useEffect(() => setLocationSupported("geolocation" in navigator), []);

  const visible = useMemo(() => {
    const filtered = filter ? resources.filter((r) => r.categories.includes(filter)) : resources;
    // the hand-picked places are all in one region, so they are only shown to people near them
    if (!userLocation) return [];
    const near = filtered.filter(
      (r) =>
        typeof r.lat === "number" &&
        typeof r.lng === "number" &&
        haversineDistanceMiles({ lat: r.lat, lng: r.lng }, userLocation) <= PICKED_RANGE_MILES,
    );
    return sortByDistance(near, userLocation);
  }, [filter, userLocation]);

  function useCurrentLocation() {
    if (!locationSupported) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationNotice("");
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserLocation(null);
        setLocationNotice("Location was not shared. You can type a city or ZIP code instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const [placeText, setPlaceText] = useState("");
  const [placeBusy, setPlaceBusy] = useState(false);

  /** Looks up a typed city or ZIP code and uses it as the position. */
  async function findPlace(e: React.FormEvent) {
    e.preventDefault();
    if (placeText.trim().length < 2) return;
    setPlaceBusy(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(placeText.trim())}`);
      const data = await response.json();
      if (!response.ok) {
        setLocationNotice(data.error ?? "That place could not be found.");
      } else {
        setUserLocation({ lat: data.lat, lng: data.lng });
        setLocationNotice(`Showing places around ${data.label}.`);
      }
    } catch {
      setLocationNotice("The place search did not answer. Check your connection.");
    }
    setPlaceBusy(false);
  }

  return (
    <div>
      <PageHeader
        title="Local repair help"
        intro="Repair cafes, tool libraries, shops and tradespeople near you. For red results, always choose a professional."
      >
      </PageHeader>

      {/* Filter */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        {[{ id: "", name: "All" }, ...categories].map((c) => (
          <button
            key={c.id || "all"}
            type="button"
            aria-pressed={filter === c.id}
            ref={filter === c.id ? activeChip : undefined}
            onClick={() => setFilter(c.id)}
            className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === c.id
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-workshop-200 bg-surface text-workshop-800 hover:bg-workshop-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-card border border-workshop-200 bg-surface p-4 shadow-card sm:flex-row sm:items-end">
        {locationSupported && (
          <Button type="button" onClick={useCurrentLocation} className="sm:flex-none">
            <Icon name="navigate" size={18} />
            Nearest to me
          </Button>
        )}
        <form onSubmit={findPlace} className="flex flex-1 items-end gap-2">
          <label className="block flex-1">
            <span className="text-sm font-medium text-workshop-900">
              {locationSupported ? "or type a city or ZIP code" : "Type a city or ZIP code"}
            </span>
            <input
              value={placeText}
              onChange={(e) => setPlaceText(e.target.value)}
              placeholder="e.g. Portland, Oregon"
              className="input mt-1"
              enterKeyHint="search"
            />
          </label>
          <Button type="submit" variant="secondary" disabled={placeBusy || placeText.trim().length < 2}>
            {placeBusy ? "Looking…" : "Go"}
          </Button>
        </form>
      </div>

      <div className="mb-4 flex rounded-card border border-workshop-200 bg-surface p-1 sm:w-64" role="group" aria-label="Map or list">
        {(["map", "list"] as const).map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={view === name}
            onClick={() => setView(name)}
            className={`flex min-h-[2.5rem] flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold capitalize transition ${
              view === name ? "bg-brand-600 text-white" : "text-workshop-800 hover:bg-workshop-100"
            }`}
          >
            <Icon name={name === "map" ? "pin" : "list"} size={16} />
            {name}
          </button>
        ))}
      </div>

      {view === "map" && (
        <div className="mb-8">
          <PlacesMap places={mapPlaces} userLocation={userLocation} />
        </div>
      )}

      {locationNotice && <p className="mb-4 text-sm text-workshop-800">{locationNotice}</p>}

      {view === "list" && (
        <>
      <h2 className="mb-3 text-xl font-bold text-workshop-900 sm:text-2xl">Hand-picked places near you</h2>
      {visible.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-workshop-300 bg-surface p-6 text-center text-workshop-800">{userLocation ? "No hand-picked places near you for this category. The map search below still finds what is around you." : "Share your location or type a city above to see what is near you."}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-workshop-900">{r.name}</h3>
                  <p className="chip mt-1 bg-brand-50 text-brand-700">{r.type}</p>
                </div>
              </div>
              {(() => {
                const lat = r.lat;
                const lng = r.lng;
                const hasCoordinates = typeof lat === "number" && typeof lng === "number";
                const distanceLabel =
                  userLocation && hasCoordinates
                    ? `${haversineDistanceMiles({ lat, lng }, userLocation).toFixed(1)} mi away`
                    : "";

                return (
                  <p className="mt-2 text-sm text-workshop-800">
                    {r.city}
                    {r.area ? ` · ${r.area}` : ""}
                    {distanceLabel ? ` · ${distanceLabel}` : ""}
                  </p>
                );
              })()}
              {r.notes && <p className="mt-2 text-sm text-workshop-800">{r.notes}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                {r.phone && (
                  <a
                    href={`tel:${r.phone.replace(/[^\d]/g, "")}`}
                    className="flex min-h-[2.75rem] items-center gap-2 rounded-card bg-brand-600 px-4 text-white transition hover:brightness-110"
                  >
                    <Icon name="phone" size={16} />
                    {r.phone}
                  </a>
                )}
                {r.website && (
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[2.75rem] items-center gap-2 rounded-card border border-workshop-200 px-4 text-workshop-900 transition hover:bg-workshop-100"
                  >
                    <Icon name="globe" size={16} />
                    Website
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name}, ${r.city}, WA`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[2.75rem] items-center gap-2 rounded-card border border-workshop-200 px-4 text-workshop-900 transition hover:bg-workshop-100"
                >
                  <Icon name="pin" size={16} />
                  Map
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-workshop-800">
        The listings above were collected by hand for the demo. Check details with the place
        before you go.
      </p>

      {userLocation ? (
        <NearbyPlaces location={userLocation} categoryId={filter} />
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-workshop-300 bg-surface p-6 text-center">
          <p className="font-semibold text-workshop-900">Want more than this list?</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-workshop-800">
            Tap &ldquo;Nearest to me&rdquo; or pick a city above. FixIt then lists the repair shops, tool libraries and tradespeople that
            OpenStreetMap has around you, nearest first.
          </p>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<p className="text-workshop-800">Loading…</p>}>
      <ResourcesContent />
    </Suspense>
  );
}
