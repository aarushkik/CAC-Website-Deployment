import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PageTransition } from "@/components/PageTransition";
import { AiChatWidget } from "@/components/AiChatWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "RepairBuddy — Your Community Repair Assistant",
  description:
    "Fix everyday items safely, save money, and reduce waste. RepairBuddy checks repair safety and guides you to DIY or professional solutions.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} font-sans`}>
      <body className="flex min-h-screen items-center justify-center bg-slate-100 text-black font-black">
        {/* Phone Frame Mockup */}
        <div className="relative w-full max-w-[428px] h-[100dvh] sm:h-[926px] bg-white sm:rounded-[3rem] sm:border-[16px] sm:border-black sm:shadow-2xl overflow-hidden flex flex-col">
          {/* Dynamic Island / Notch simulation */}
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-black rounded-b-3xl z-50"></div>
          
          <LoadingScreen />
          <OnboardingModal />

          <Header />
          
          <main id="main" className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 pb-24 px-4 pt-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          <BottomNav />
          <AiChatWidget />
        </div>
      </body>
    </html>
  );
}
