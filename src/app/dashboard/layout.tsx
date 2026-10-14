import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your impact",
  description: "Money saved, waste kept out of the landfill, and repair milestones.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
