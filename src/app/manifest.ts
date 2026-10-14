import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FixIt WA 03",
    short_name: "FixIt",
    description:
      "Check if a repair is safe to do yourself, follow beginner guides, and find local repair help in Southwest Washington.",
    start_url: "/",
    display: "standalone",
    background_color: "#ebf0f2",
    theme_color: "#ebf0f2",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
