"use client";

import { useCallback, useSyncExternalStore } from "react";
import { places, type Place } from "./data";
import { haversineDistanceMiles, type Coordinates } from "./distance";

/** Shared with the Local help page, so a town picked anywhere is remembered everywhere. */
export const TOWN_KEY = "fixit-wa03-town";
const EVENT = "fixit-wa03:town-change";

function read(): string | null {
  try {
    return window.localStorage.getItem(TOWN_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The closest town in our list to a point, for "Use my location". */
export function nearestPlace(coords: Coordinates): Place {
  return [...places].sort((a, b) => haversineDistanceMiles(coords, a) - haversineDistanceMiles(coords, b))[0];
}

/** The viewer's chosen Washington town (remembered on this device). */
export function useTown(): { town: Place | null; setTown: (name: string | null) => void } {
  const name = useSyncExternalStore(subscribe, read, () => null);
  const town = places.find((place) => place.name === name) ?? null;

  const setTown = useCallback((next: string | null) => {
    try {
      if (next) window.localStorage.setItem(TOWN_KEY, next);
      else window.localStorage.removeItem(TOWN_KEY);
    } catch {
      // Remembering the town is optional.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { town, setTown };
}
