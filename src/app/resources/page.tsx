"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { categories, getCategory, resources } from "@/lib/data";
import { haversineDistanceMiles, sortByDistance } from "@/lib/distance";

type Coordinates = {
  lat: number;
  lng: number;
};

const CITY_COORDINATES: Array<{ name: string; location: Coordinates }> = [
  { name: "Vancouver", location: { lat: 45.6387, lng: -122.6615 } },
  { name: "Camas", location: { lat: 45.5871, lng: -122.3995 } },
  { name: "Washougal", location: { lat: 45.5826, lng: -122.3553 } },
  { name: "Battle Ground", location: { lat: 45.7801, lng: -122.5337 } },
  { name: "Longview", location: { lat: 46.1382, lng: -122.9382 } },
  { name: "Kelso", location: { lat: 46.1468, lng: -122.9087 } },
  { name: "Chehalis", location: { lat: 46.6615, lng: -122.9640 } },
  { name: "Centralia", location: { lat: 46.7162, lng: -122.9540 } },
  { name: "Cathlamet", location: { lat: 46.2034, lng: -123.3830 } },
  { name: "Raymond", location: { lat: 46.6868, lng: -123.7321 } },
  { name: "South Bend", location: { lat: 46.6731, lng: -123.7998 } },
  { name: "Stevenson", location: { lat: 45.6954, lng: -121.8845 } },
];

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>(searchParams.get("category") ?? "");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationNotice, setLocationNotice] = useState("");

  const locationSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const visible = useMemo(() => {
    const filtered = filter ? resources.filter((r) => r.categories.includes(filter)) : resources;
    if (!userLocation) {
      return filtered;
    }
    return sortByDistance(filtered, userLocation);
  }, [filter, userLocation]);

  const activeCategory = filter ? getCategory(filter) : undefined;

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
        setLocationNotice("Location not shared - showing all local resources");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  function handleCityChange(value: string) {
    const selectedCity = CITY_COORDINATES.find((city) => city.name === value);
    if (!selectedCity) {
      setUserLocation(null);
      setLocationNotice("");
      return;
    }

    setLocationNotice("");
    setUserLocation(selectedCity.location);
  }

  return (
    <div>
      <PageHeader
        title="Local repair help"
        intro="Trusted shops, repair cafes, and pros around Southwest Washington's 3rd district. For red-level repairs, always choose a professional."
      >
        {activeCategory && (
          <p className="rounded-card bg-workshop-100 px-4 py-2 text-sm text-workshop-800">
            Showing help for <strong>{activeCategory.name}</strong>.
          </p>
        )}
      </PageHeader>

      {/* Filter */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,20rem)]">
        <label className="block">
          <span className="font-medium text-workshop-900">Filter by category</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input mt-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-2">
          {locationSupported && (
            <Button type="button" variant="secondary" className="w-full" onClick={useCurrentLocation}>
              Find repairs near me
            </Button>
          )}
          <label className="block">
            <span className="font-medium text-workshop-900">or choose your city</span>
            <select
              defaultValue=""
              onChange={(e) => handleCityChange(e.target.value)}
              className="input mt-2"
            >
              <option value="">Select a city</option>
              {CITY_COORDINATES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {locationNotice && <p className="mb-4 text-sm text-workshop-800">{locationNotice}</p>}

      {visible.length === 0 ? (
        <p className="text-workshop-800">No local resources listed for this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-workshop-900">{r.name}</h2>
                  <p className="text-sm font-medium text-brand-700">{r.type}</p>
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
                    📍 {r.city}
                    {r.area ? ` · ${r.area}` : ""}
                    {distanceLabel ? ` · ${distanceLabel}` : ""}
                  </p>
                );
              })()}
              {r.notes && <p className="mt-2 text-sm text-workshop-800">{r.notes}</p>}
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/[^\d]/g, "")}`} className="text-brand-700 underline">
                    📞 {r.phone}
                  </a>
                )}
                {r.website && (
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 underline"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-workshop-800">
        These are placeholder listings for the demo. Replace with verified local businesses before launch.
      </p>
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
