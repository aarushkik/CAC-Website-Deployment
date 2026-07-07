"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, LangCode } from "@/lib/translations";

const LANG_KEY = "repairbuddy_lang";

type LanguageContextType = {
  language: LangCode;
  setLanguage: (lang: LangCode) => void;
  t: (key: string) => string;
  isLanguageSelected: boolean;
  confirmLanguage: () => void;
  changeLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  isLanguageSelected: true,
  confirmLanguage: () => {},
  changeLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LangCode>("en");
  const [isLanguageSelected, setIsLanguageSelected] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && saved in translations) {
        setLanguageState(saved as LangCode);
        setIsLanguageSelected(true);
      } else {
        setIsLanguageSelected(false);
      }
    } catch {
      setIsLanguageSelected(false);
    }
    setMounted(true);
  }, []);

  function setLanguage(lang: LangCode) {
    setLanguageState(lang);
  }

  function confirmLanguage() {
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch { /* noop */ }
    setIsLanguageSelected(true);
  }

  function changeLanguage() {
    setIsLanguageSelected(false);
  }

  function t(key: string): string {
    const dict = translations[language] as Record<string, string>;
    return dict[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSelected, confirmLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
