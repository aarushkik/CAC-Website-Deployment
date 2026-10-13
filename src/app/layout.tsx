import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { OfflineSupport } from "@/components/AppShell";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixIt — Is it safe to fix yourself?",
  description:
    "Fix everyday items safely, save money, and reduce waste. FixIt checks repair safety and connects you with local repair help.",
  appleWebApp: { capable: true, title: "FixIt", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets light or dark before the page is drawn, so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('fixit-wa03-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <Header />
        <OfflineSupport />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-6 sm:pt-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
