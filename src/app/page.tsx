"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { categories } from "@/lib/data";
import { useLanguage } from "@/lib/LanguageContext";
import { tCategoryName, tCategoryDesc } from "@/lib/dataTranslations";
import {
  CameraIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  ScissorsIcon,
  BoltIcon,
  InboxStackIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const categoryIcons: Record<string, any> = {
  clothing: ScissorsIcon,
  "small-appliances": BoltIcon,
  furniture: InboxStackIcon,
  bikes: WrenchScrewdriverIcon,
  electronics: DevicePhoneMobileIcon,
  home: HomeIcon,
};

const categoryColors: Record<string, { bg: string; text: string; border: string; hover: string; iconBg: string }> = {
  clothing: { bg: "bg-orange-500/5", text: "text-orange-600", border: "border-orange-500/20", hover: "hover:border-orange-500/50 hover:shadow-orange-500/5", iconBg: "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm" },
  "small-appliances": { bg: "bg-blue-500/5", text: "text-blue-600", border: "border-blue-500/20", hover: "hover:border-blue-500/50 hover:shadow-blue-500/5", iconBg: "bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm" },
  furniture: { bg: "bg-purple-500/5", text: "text-purple-600", border: "border-purple-500/20", hover: "hover:border-purple-500/50 hover:shadow-purple-500/5", iconBg: "bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-sm" },
  bikes: { bg: "bg-emerald-500/5", text: "text-emerald-600", border: "border-emerald-500/20", hover: "hover:border-emerald-500/50 hover:shadow-emerald-500/5", iconBg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm" },
  electronics: { bg: "bg-pink-500/5", text: "text-pink-600", border: "border-pink-500/20", hover: "hover:border-pink-500/50 hover:shadow-pink-500/5", iconBg: "bg-pink-500/10 text-pink-500 border border-pink-500/20 shadow-sm" },
  home: { bg: "bg-amber-500/5", text: "text-amber-600", border: "border-amber-500/20", hover: "hover:border-amber-500/50 hover:shadow-amber-500/5", iconBg: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm" },
};

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-14 py-2 pb-12">
      
      {/* 🚀 Hero Section with Modern Tech Gradient Bezel */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1A2B4C] via-[#101F3B] to-[#0A1428] p-6 shadow-xl animate-scale-in flex flex-col items-center">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF7A00] shadow-sm animate-pop-in">
            <SparklesIcon className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            {t("communityRepairAssistant")}
          </p>
          
          <h1 className="text-3xl font-black tracking-tight text-white leading-[1.15] animate-pop-in delay-75">
            {t("heroTitle")}
          </h1>
          
          <p className="text-sm text-slate-300 leading-relaxed font-black max-w-sm animate-pop-in delay-150">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col gap-3 w-full mt-3 animate-pop-in delay-250">
            <Button href="/choose-item" variant="primary" className="w-full py-3.5 text-base">
              {t("startRepair")}
            </Button>
            <Button href="/scanner" variant="secondary" className="w-full py-3.5 text-base group">
              <CameraIcon className="h-5 w-5 text-orange-500 mr-1.5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
              {t("scanItem")}
            </Button>
          </div>
        </div>

        {/* Hero Photo */}
        <div className="relative z-10 w-full flex justify-center mt-6 animate-pop-in delay-350">
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-[1.03]">
            <img 
              src="/images/hero.png" 
              alt="Person performing electronics repair safely" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🗺️ How it Works — Glassmorphic Stepper */}
      <section className="space-y-6 px-1">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{t("howItWorks")}</h2>
          <p className="text-slate-600 text-xs font-bold">{t("howItWorksSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          
          {/* Step 1 */}
          <div className="group rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:border-[#FF7A00]/50 hover:shadow-md transition-all duration-300 opacity-0 animate-slide-up delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Camera lens for scanning" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-2.5 left-4 text-[10px] font-black text-white uppercase tracking-widest bg-[#FF7A00]/90 rounded-full px-3 py-1">Step 1</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-slate-900 text-base mb-1">{t("step1Title")}</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">{t("step1Desc")}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:border-[#FF7A00]/50 hover:shadow-md transition-all duration-300 opacity-0 animate-slide-up delay-200" style={{ animationFillMode: 'forwards' }}>
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Safety equipment" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-2.5 left-4 text-[10px] font-black text-white uppercase tracking-widest bg-[#FF7A00]/90 rounded-full px-3 py-1">Step 2</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-slate-900 text-base mb-1">{t("step2Title")}</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">{t("step2Desc")}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:border-[#FF7A00]/50 hover:shadow-md transition-all duration-300 opacity-0 animate-slide-up delay-300" style={{ animationFillMode: 'forwards' }}>
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Result checking" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-2.5 left-4 text-[10px] font-black text-white uppercase tracking-widest bg-[#FF7A00]/90 rounded-full px-3 py-1">Step 3</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-slate-900 text-base mb-1">{t("step3Title")}</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">{t("step3Desc")}</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="group rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden hover:border-[#FF7A00]/50 hover:shadow-md transition-all duration-300 opacity-0 animate-slide-up delay-400" style={{ animationFillMode: 'forwards' }}>
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Repairing" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-2.5 left-4 text-[10px] font-black text-white uppercase tracking-widest bg-[#FF7A00]/90 rounded-full px-3 py-1">Step 4</span>
            </div>
            <div className="p-4">
              <h3 className="font-black text-slate-900 text-base mb-1">{t("step4Title")}</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">{t("step4Desc")}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🍱 Category Grid */}
      <section className="space-y-6 px-1">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">{t("whatAreYouFixing")}</h2>
            <p className="text-slate-600 text-xs font-bold">{t("selectCategoryToBrowse")}</p>
          </div>
          <Link href="/choose-item" className="inline-flex items-center gap-1 text-sm font-black text-slate-800 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 border border-[#FF7A00]/30 rounded-xl px-4 py-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm transition-all">
            {t("browseAll")} <ArrowRightIcon className="h-4 w-4 stroke-[3px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, i) => {
            const Icon = categoryIcons[category.id] || BoltIcon;
            const colors = categoryColors[category.id] || categoryColors["home"];
            return (
              <Link
                key={category.id}
                href={`/choose-item?category=${category.id}`}
                className={`group rounded-3xl border ${colors.border} ${colors.bg} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.0 flex flex-col justify-between min-h-[160px] opacity-0 animate-pop-in transition-all duration-300 ${colors.hover}`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg} group-hover:scale-110 transition-all duration-300 ${i % 2 === 0 ? 'animate-float' : 'animate-float-slow'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-3 text-base font-black ${colors.text} transition-colors`}>
                    {tCategoryName(category.id, language)}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed font-bold">{tCategoryDesc(category.id, language)}</p>
                </div>
                <span className={`text-[10px] font-black ${colors.text} mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300`}>
                  {t("explore")}
                  <ArrowRightIcon className="h-3 w-3 stroke-[3px]" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Repair section removed to simplify and improve content layout focus */}
    </div>
  );
}
