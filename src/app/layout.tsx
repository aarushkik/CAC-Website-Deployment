import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PageTransition } from "@/components/PageTransition";
import { AiChatWidget } from "@/components/AiChatWidget";
import { ClientProviders } from "@/components/ClientProviders";
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
import { ClickSparkleEffect } from "@/components/ClickSparkleEffect";

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
      <body className="flex min-h-screen items-center justify-center bg-gradient-animated text-black font-black">
        {/* Phone Frame Mockup */}
        <div className="relative w-[385px] h-[780px] max-h-[calc(100vh-32px)] bg-[#F8F9FA] rounded-[2rem] border-[12px] border-slate-900 shadow-[0_0_60px_rgba(255,122,0,0.15)] overflow-hidden flex flex-col">
          {/* Dynamic Island / Notch simulation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-4 bg-black rounded-b-xl z-50"></div>
          
          <ClientProviders>
            <ClickSparkleEffect />
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
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}
