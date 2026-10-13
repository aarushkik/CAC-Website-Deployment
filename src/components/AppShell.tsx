"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** Switches between the light and the dark look and remembers the choice on this device. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function flip() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("fixit-wa03-theme", next);
    } catch {
      // private window: the choice just is not remembered
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full p-2 text-workshop-800 transition hover:bg-workshop-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={21} />
    </button>
  );
}

/**
 * Turns on the offline copy (public/sw.js) and shows a small bar while there is
 * no connection, so guides opened before still work in a garage with no signal.
 */
export function OfflineSupport() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // no offline copy on this browser, the site still works online
      });
    }
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return (
    <div role="status" className="bg-caution/15 px-4 py-2 text-center text-sm font-medium text-workshop-900">
      You are offline. Guides and your log still work. Nearby places need a connection.
    </div>
  );
}
