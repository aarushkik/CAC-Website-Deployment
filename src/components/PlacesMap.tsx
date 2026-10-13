"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as L_NS from "leaflet";
import type { Coordinates } from "@/lib/distance";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Icon } from "./Icon";

export interface MapPlace {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  /** Hand-picked for the app, or straight from OpenStreetMap. */
  picked: boolean;
  phone?: string;
  website?: string;
  address?: string;
  notes?: string;
  distanceMiles?: number;
}

/** With no position yet, the map shows the whole of the US. */
const HOME: [number, number] = [39.5, -98.35];

/**
 * Local help on a real map. Tap a dot and a card for that place slides up from
 * the bottom, the way map apps do it. The map tiles and most dots are
 * OpenStreetMap; the bigger gold dots are the places picked by hand.
 */
export function PlacesMap({ places, userLocation }: { places: MapPlace[]; userLocation: Coordinates | null }) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<L_NS.Map | null>(null);
  const layer = useRef<L_NS.LayerGroup | null>(null);
  const leaflet = useRef<typeof L_NS | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<MapPlace | null>(null);

  // make the map once
  useEffect(() => {
    let stopped = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (stopped || !holder.current || map.current) return;
      leaflet.current = L;
      map.current = L.map(holder.current, { zoomControl: true, scrollWheelZoom: false }).setView(HOME, 4);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      map.current.on("click", () => setSelected(null));
      setReady(true);
    })();
    return () => {
      stopped = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // draw the dots again whenever the list or the location changes
  useEffect(() => {
    const L = leaflet.current;
    if (!ready || !L || !map.current || !layer.current) return;
    layer.current.clearLayers();
    const bounds: Array<[number, number]> = [];
    for (const place of places) {
      const dot = L.circleMarker([place.lat, place.lng], {
        radius: place.picked ? 10 : 7,
        color: "#ffffff",
        weight: 2,
        fillColor: place.picked ? "#d97706" : "#1d4ed8",
        fillOpacity: 0.95,
      });
      dot.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        setSelected(place);
      });
      dot.bindTooltip(place.name);
      dot.addTo(layer.current);
      bounds.push([place.lat, place.lng]);
    }
    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8, color: "#ffffff", weight: 3, fillColor: "#16a34a", fillOpacity: 1,
      }).bindTooltip("You are here").addTo(layer.current);
      map.current.setView([userLocation.lat, userLocation.lng], 11);
    } else if (bounds.length > 0) {
      map.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
    setSelected(null);
  }, [places, userLocation, ready]);

  return (
    <div className="relative overflow-hidden rounded-card border border-workshop-200 shadow-card">
      <div ref={holder} className="h-[60vh] min-h-[22rem] w-full" aria-label="Map of repair places" />

      <div className="pointer-events-none absolute right-3 top-3 z-[500] flex flex-col gap-1 rounded-xl bg-surface/95 px-3 py-2 text-xs font-medium text-workshop-900 shadow-card">
        <span><i className="mr-1.5 inline-block h-3 w-3 rounded-full bg-[#d97706] align-middle" />Picked by hand</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#1d4ed8] align-middle" />From OpenStreetMap</span>
        {userLocation && <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#16a34a] align-middle" />You</span>}
      </div>

      {selected ? (
        <div key={selected.id} className="absolute inset-x-2 bottom-2 z-[500] animate-rise rounded-card border border-workshop-200 bg-surface p-4 shadow-lift sm:inset-x-auto sm:left-3 sm:w-96">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-workshop-900">{selected.name}</h3>
              <p className="text-sm text-workshop-800">
                {selected.type}
                {selected.distanceMiles !== undefined ? ` · ${selected.distanceMiles.toFixed(1)} mi` : ""}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="-mr-1 -mt-1 rounded-full p-1.5 text-workshop-600 hover:bg-workshop-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          {selected.address && <p className="mt-1 text-sm text-workshop-800">{selected.address}</p>}
          {selected.notes && <p className="mt-1 text-sm text-workshop-800">{selected.notes}</p>}
          {!selected.picked && <p className="mt-1 text-xs text-workshop-600">Not checked by FixIt. Call ahead.</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
            {selected.phone && (
              <a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`} className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl bg-brand-600 px-3 text-white">
                <Icon name="phone" size={15} />
                Call
              </a>
            )}
            {selected.website && (
              <a href={selected.website} target="_blank" rel="noopener noreferrer" className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-workshop-200 px-3 text-workshop-900">
                <Icon name="globe" size={15} />
                Website
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-workshop-200 px-3 text-workshop-900"
            >
              <Icon name="navigate" size={15} />
              Directions
            </a>
          </div>
        </div>
      ) : (
        <p className="pointer-events-none absolute inset-x-2 bottom-2 z-[500] rounded-xl bg-surface/95 px-3 py-2 text-center text-sm text-workshop-800 shadow-card sm:inset-x-auto sm:left-3">
          {userLocation
            ? `${places.length} places within 25 miles. Tap a dot for details.`
            : "Tap “Nearest to me” or type a city above to see repair places on the map."}
        </p>
      )}
    </div>
  );
}
