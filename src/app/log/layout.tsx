import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repair log",
  description: "Keep a record of your repairs. Your log stays on this device.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
