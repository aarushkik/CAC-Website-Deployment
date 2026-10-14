import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local repair help",
  description: "Repair shops, free repair events, and licensed pros around Southwest Washington.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
