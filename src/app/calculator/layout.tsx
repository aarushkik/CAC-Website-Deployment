import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fix or replace?",
  description: "Compare what a repair costs with buying new, and see the waste you'd avoid.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
