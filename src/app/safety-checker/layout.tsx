import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety check",
  description: "Answer a few quick questions to see whether a repair is safe for a beginner.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
