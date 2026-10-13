import type { MetadataRoute } from "next";

/** Lets a phone or laptop install FixIt to the home screen and open it without the browser bars. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FixIt",
    short_name: "FixIt",
    description: "Check if a repair is safe, follow a beginner guide, or find repair help near you.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#1d4ed8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    shortcuts: [
      { name: "Start a repair", url: "/choose-item" },
      { name: "Local help", url: "/resources" },
      { name: "Repair log", url: "/log" },
    ],
  };
}
