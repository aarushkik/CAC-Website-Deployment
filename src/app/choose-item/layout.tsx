import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a repair",
  description: "Pick or search for the item you want to fix, then run a quick safety check.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
