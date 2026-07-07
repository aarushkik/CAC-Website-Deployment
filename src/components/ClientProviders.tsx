"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LanguageSelector />
      {children}
    </LanguageProvider>
  );
}
