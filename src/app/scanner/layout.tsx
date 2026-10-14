import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a fix",
  description: "Describe a problem or snap a photo to see if it's safe to fix and the cheapest ways to fix it.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
