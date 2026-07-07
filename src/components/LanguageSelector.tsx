"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { languageMeta, LangCode } from "@/lib/translations";
import { CheckCircleIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

export function LanguageSelector() {
  const { language, setLanguage, t, isLanguageSelected, confirmLanguage } = useLanguage();
  const [animateOut, setAnimateOut] = useState(false);

  if (isLanguageSelected) return null;

  function handleDone() {
    setAnimateOut(true);
    setTimeout(() => {
      confirmLanguage();
    }, 400);
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-400 ${
        animateOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6 shrink-0">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-500 border-4 border-orange-300/30 shadow-lg shadow-orange-500/30 mb-5 animate-bounce">
          <GlobeAltIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight text-center">
          {t("selectLanguage")}
        </h1>
        <p className="text-sm font-bold text-slate-400 mt-2 text-center max-w-xs">
          {t("choosePreferredLanguage")}
        </p>
      </div>

      {/* Language Grid — Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {languageMeta.map((lang, i) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-3 p-4 min-h-[100px] transition-all duration-300 active:scale-95 ${
                  isActive
                    ? "border-orange-500 bg-orange-500/15 shadow-lg shadow-orange-500/20 scale-[1.03]"
                    : "border-slate-600/50 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-700/60"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="h-5 w-5 text-orange-500 animate-scale-in" />
                  </div>
                )}
                <span className="text-3xl" role="img" aria-label={lang.english}>
                  {lang.flag}
                </span>
                <span className={`text-base font-black tracking-tight ${isActive ? "text-orange-400" : "text-white"}`}>
                  {lang.native}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {lang.english}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Done Button — Sticky Bottom */}
      <div className="shrink-0 px-6 pb-8 pt-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <button
          onClick={handleDone}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 border-4 border-black text-white font-black text-lg py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200"
        >
          <CheckCircleIcon className="h-6 w-6" />
          {t("done")}
        </button>
      </div>
    </div>
  );
}
