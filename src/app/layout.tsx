import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Public_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

// Body text: Public Sans, the U.S. Web Design System's typeface.
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Display text: Barlow Condensed, drawn from public-infrastructure signage.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FixIt WA 03 — Repair assistant for Southwest Washington",
    template: "%s · FixIt WA 03",
  },
  description:
    "Check if a repair is safe to do yourself, follow a beginner guide, compare fixing vs. replacing, and find local repair help in Southwest Washington.",
  applicationName: "FixIt WA 03",
  openGraph: {
    type: "website",
    siteName: "FixIt WA 03",
    title: "FixIt WA 03 — Fix it yourself, safely",
    description:
      "A community repair assistant for Southwest Washington: safety checks, beginner guides, and local repair help.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ebf0f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ToastProvider>
          <Header />
          <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
