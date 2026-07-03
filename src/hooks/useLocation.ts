"use client";

import { useState, useEffect, useCallback } from "react";

interface LocationState {
  city: string;
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  source: "geo" | "manual" | null;
}

const STORAGE_KEY = "repairbuddy_location";

function getSaved(): Partial<LocationState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save(state: Partial<LocationState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* noop */ }
}

/**
 * Custom hook for getting user location.
 * Tries browser Geolocation first, falls back to manual input.
 * Persists to localStorage.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    city: "",
    lat: null,
    lng: null,
    loading: false,
    error: null,
    source: null,
  });

  // Load saved location on mount
  useEffect(() => {
    const saved = getSaved();
    if (saved?.city) {
      setState((prev) => ({
        ...prev,
        city: saved.city || "",
        lat: saved.lat ?? null,
        lng: saved.lng ?? null,
        source: saved.source ?? "manual",
      }));
    }
  }, []);

  const requestGeoLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode using free Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Your area";

          const newState = { city, lat: latitude, lng: longitude, source: "geo" as const };
          save(newState);
          setState((prev) => ({
            ...prev,
            ...newState,
            loading: false,
          }));
        } catch {
          const newState = { city: "Your area", lat: latitude, lng: longitude, source: "geo" as const };
          save(newState);
          setState((prev) => ({
            ...prev,
            ...newState,
            loading: false,
          }));
        }
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Location access denied",
        }));
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const setManualCity = useCallback((city: string) => {
    const newState = { city, lat: null, lng: null, source: "manual" as const };
    save(newState);
    setState((prev) => ({
      ...prev,
      ...newState,
      error: null,
    }));
  }, []);

  return {
    ...state,
    requestGeoLocation,
    setManualCity,
  };
}
