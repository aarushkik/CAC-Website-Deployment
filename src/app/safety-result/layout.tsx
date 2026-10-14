import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety result",
  description: "Your green, yellow, or red repair safety result, with next steps.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
