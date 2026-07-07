"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { useLocation } from "@/hooks/useLocation";
import { useLanguage } from "@/lib/LanguageContext";
import {
  SparklesIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const LinkedinIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

interface Pro {
  name: string;
  title: string;
  company: string;
  rating: number;
  reviews: number;
  bestUse: string;
  linkedinUrl: string;
}

const mockPros: Pro[] = [
  {
    name: "Alex Rivera",
    title: "Senior Lead Hardware Technician",
    company: "FixIt Electronics",
    rating: 5.0,
    reviews: 24,
    bestUse: "PCB Soldering, Motherboards, Electronics",
    linkedinUrl: "https://www.linkedin.com/in/alex-rivera-repair-example",
  },
  {
    name: "Sarah Chen",
    title: "HVAC & Thermal Systems Engineer",
    company: "EcoTech Systems",
    rating: 4.9,
    reviews: 42,
    bestUse: "Heavy Appliances, Heat Pumps, Electric Motors",
    linkedinUrl: "https://www.linkedin.com/in/sarah-chen-repair-example",
  },
  {
    name: "Marcus Vance",
    title: "Certified Master Electrician",
    company: "Vance Electric Co.",
    rating: 4.8,
    reviews: 37,
    bestUse: "Wiring Diagnostics, Fuse Boxes, Power Supply Safety",
    linkedinUrl: "https://www.linkedin.com/in/marcus-vance-repair-example",
  },
  {
    name: "Elena Rostova",
    title: "Frame Welder & Mechanical Tech",
    company: "Rostova Cycle Shop",
    rating: 4.7,
    reviews: 19,
    bestUse: "Gears, Hydraulic Brakes, Frame Repair, Welding",
    linkedinUrl: "https://www.linkedin.com/in/elena-rostova-repair-example",
  },
  {
    name: "Darnell Jackson",
    title: "Lithium Battery Rebuilder",
    company: "Jackson Tech Services",
    rating: 4.5,
    reviews: 15,
    bestUse: "Battery Packs, Electric Tools, Toy Board Repair",
    linkedinUrl: "https://www.linkedin.com/in/darnell-jackson-repair-example",
  },
];

export default function ResourcesPage() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [proSort, setProSort] = useState<"rating" | "reviews">("rating");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { city, loading, error, requestGeoLocation, setManualCity } = useLocation();
  const [manualInput, setManualInput] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  // Localized query strings mapping
  const proQueriesMap: Record<string, string[]> = {
    en: ["Appliance Repair", "Electronics Repair", "Bicycle Mechanic", "Furniture Repair"],
    es: ["Reparación de Electrodomésticos", "Reparación de Electrónica", "Mecánico de Bicicletas", "Reparación de Muebles"],
    zh: ["家电维修", "电子产品维修", "自行车机械师", "家具维修"],
    fr: ["Réparation d'Appareils", "Réparation Électronique", "Mécanicien Vélo", "Réparation Meubles"],
    de: ["Gerätereparatur", "Elektronikreparatur", "Fahrradmechaniker", "Möbelreparatur"],
    pt: ["Reparo de Eletrodomésticos", "Reparo de Eletrônicos", "Mecânico de Bicicletas", "Reparo de Móveis"],
    ar: ["إصلاح الأجهزة", "إصلاح الإلكترونيات", "ميكانيكي دراجات", "إصلاح الأثاث"],
    hi: ["उपकरण मरम्मत", "इलेक्ट्रॉनिक्स मरम्मत", "साइकिल मैकेनिक", "फर्नीचर मरम्मत"],
    ko: ["가전제품 수리", "전자기기 수리", "자전거 정비사", "가구 수리"],
    ja: ["家電修理", "電子機器修理", "自転車修理士", "家具修理"],
    vi: ["Sửa chữa thiết bị", "Sửa chữa điện tử", "Thợ sửa xe đạp", "Sửa chữa đồ gỗ"],
    tl: ["Pag-aayos ng Appliance", "Pag-aayos ng Elektronika", "Mekaniko ng Bisikleta", "Pag-aayos ng Muwebles"],
  };

  const defaultProQueries = proQueriesMap[language] || proQueriesMap["en"];

  const sortedPros = [...mockPros].sort((a, b) => {
    if (proSort === "rating") {
      return b.rating - a.rating;
    } else {
      return b.reviews - a.reviews;
    }
  });

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-center space-y-3 pt-2 px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {language === "en" ? (
            <>
              Find Local <span className="text-gradient">Help</span>
            </>
          ) : (
            t("findLocalHelp")
          )}
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          {t("resourcesSubtitle")}
        </p>
      </div>

      {/* 📍 Geolocation Section */}
      <section className="px-2">
        <div className="rounded-3xl border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-pop-in">
          {/* Header Image */}
          <div className="h-32 w-full relative border-b-4 border-black">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
              alt="Map and navigation" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/70 to-transparent flex items-end p-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-orange-400 stroke-[2.5px]" />
                {t("setLocation")}
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {city ? (
              <p className="text-base text-slate-700 font-bold bg-orange-50 border-2 border-black p-4 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {t("currentLocation")} <br/><strong className="text-orange-600 font-black text-2xl">{city}</strong>
              </p>
            ) : (
              <p className="text-sm text-slate-600 font-extrabold">
                {t("locationSubtitle")}
              </p>
            )}

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={requestGeoLocation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 border-4 border-black text-black font-black py-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none"
              >
                {loading ? t("locating") : t("autoDetectLocation")}
              </button>
              {/* Static Zip Input Bar & Set Button Below */}
              <div className="space-y-4 w-full">
                <div className="relative rounded-2xl border-4 border-black bg-white p-1 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5">
                  <div className="flex items-center">
                    <span className="pl-4 text-slate-400 shrink-0">
                      <MapPinIcon className="h-6 w-6 text-slate-700 stroke-[2.5px]" />
                    </span>
                    <input
                      type="text"
                      placeholder={t("enterZipOrCity")}
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="w-full bg-transparent pl-3 pr-4 py-4 text-black !text-black caret-orange-500 text-base placeholder-slate-400 focus:outline-none font-bold !border-0 !shadow-none !translate-x-0 !translate-y-0 focus:!shadow-none focus:!translate-x-0 focus:!translate-y-0"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (manualInput.trim()) {
                      setManualCity(manualInput.trim());
                      setManualInput("");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white border-4 border-black text-black font-black py-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200"
                >
                  {t("setLocation")}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-rose-600 font-black text-center">{error}</p>}
          </div>
        </div>
      </section>

      {/* 💼 LinkedIn Pros Finder Section */}
      <section className="px-2 animate-slide-up delay-75">
        <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {language === "es" ? "¿Necesitas ayuda experta?" : language === "zh" ? "需要专家帮助吗？" : "Need expert help?"}
          </h3>
          <p className="text-slate-600 text-xs font-bold leading-relaxed">
            {t("linkedinProsSubtitle")}
          </p>
          <button
            onClick={() => setIsLinkedInModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0077b5] text-white font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#006699] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <LinkedinIcon className="h-5 w-5 fill-white shrink-0" />
            {language === "es" ? "Buscar Profesionales de LinkedIn" : language === "zh" ? "寻找 LinkedIn 认证专家" : "Find Certified LinkedIn Pros"}
          </button>
        </div>
      </section>

      {/* 🔍 Real Pro Search Links */}
      {city && (
        <section className="space-y-4 animate-slide-up delay-75 px-2">
          <h3 className="text-2xl font-black text-slate-900 px-2">
            {language === "es" ? `Profesionales en ${city}` : language === "zh" ? `${city} 的专业人员` : `Professionals in ${city}`}
          </h3>
          <div className="flex flex-col gap-3">
            {defaultProQueries.map((query) => {
              const searchLoc = city || "me";
              const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${query} near ${searchLoc}`)}`;
              return (
                <a
                  key={query}
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:bg-orange-50 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <MagnifyingGlassIcon className="h-6 w-6" />
                    </div>
                    <span className="font-black text-slate-800 text-lg group-hover:text-orange-700 transition-colors">
                      {query}
                    </span>
                  </div>
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-500" />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 🌍 Expanding Network Announcement */}
      <section className="px-2">
        <div className="relative overflow-hidden rounded-3xl border-2 border-orange-200 bg-orange-50 shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-orange-200/50 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 p-6 space-y-6">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white border border-orange-200 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-600 shadow-sm">
                <SparklesIcon className="h-4 w-4" />
                {language === "es" ? "Muy pronto" : language === "zh" ? "即将推出" : "Coming Soon"}
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                {t("joinNewsletter")}
              </h2>
              <p className="text-slate-700 text-sm font-bold leading-relaxed">
                {t("newsletterSubtitle")}
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-400">
                    <EnvelopeIcon className="h-6 w-6" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full pl-14 pr-5 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 text-base shadow-inner"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-slate-900 hover:bg-black shadow-lg px-6 py-4 text-base font-black text-white transition-all duration-300 ease-out active:scale-95 hover:-translate-y-1">
                  {t("subscribe")}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 p-5 text-emerald-900 animate-scale-in shadow-sm">
                <CheckCircleIcon className="h-8 w-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-black text-base">{t("thankYou")}</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">{t("thankYouDesc")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="space-y-6 px-2 pb-12 animate-slide-up delay-100">
        <h3 className="text-2xl font-black text-slate-900 px-2">
          {t("communityPrograms")}
        </h3>
        <div className="flex flex-col gap-6">
          
          <div className="group rounded-3xl border-2 border-slate-200 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-300 flex flex-col h-full">
            <div className="h-40 w-full relative overflow-hidden bg-slate-200">
               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Trade education" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner">
                <AcademicCapIcon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                {t("tradeEducation")}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-bold mb-6">
                {t("tradeEducationDesc")}
              </p>
              <a
                href="https://www.clark.edu/academics/hs-dual-credit/cte/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full inline-flex items-center justify-center rounded-2xl bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-4 text-base font-black transition-all duration-300 shadow-sm active:scale-95"
              >
                {t("explorePrograms")}
              </a>
            </div>
          </div>

          <div className="group rounded-3xl border-2 border-slate-200 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-300 flex flex-col h-full">
            <div className="h-40 w-full relative overflow-hidden bg-slate-200">
               <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Community Repair" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner">
                <WrenchScrewdriverIcon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                {t("startRepairCafe")}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-bold mb-6">
                {t("startRepairCafeDesc")}
              </p>
              <a
                href="https://www.repaircafe.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full inline-flex items-center justify-center rounded-2xl bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-4 text-base font-black transition-all duration-300 shadow-sm active:scale-95"
              >
                {t("learnMore")}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 💼 LinkedIn Pros Modal popup */}
      {mounted && isLinkedInModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsLinkedInModalOpen(false)}>
          <div className="relative w-full max-w-md rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[85vh] animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setIsLinkedInModalOpen(false)}
              className="absolute top-4 right-4 rounded-xl border-2 border-black bg-white p-1.5 hover:bg-slate-100 transition-colors z-10"
            >
              <XMarkIcon className="h-5 w-5 text-black stroke-[2.5px]" />
            </button>

            {/* Header */}
            <div className="space-y-1 mb-4 pr-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0077b5] flex items-center gap-1">
                <LinkedinIcon className="h-4.5 w-4.5 fill-[#0077b5]" /> 
                {language === "es" ? "Cuentas Verificadas" : language === "zh" ? "认证账号" : "Verified Accounts"}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {t("linkedinPros")}
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                {language === "es" 
                  ? "Contrata profesionales independientes certificados de mejor a peor." 
                  : language === "zh" 
                  ? "雇用经过认证的独立修理专家，按评分从高到低排序。" 
                  : "Hire certified trade freelancers sorted best to worst."}
              </p>
            </div>

            {/* Sorting Filter Controls */}
            <div className="flex items-center gap-2 mb-4 bg-slate-50 border-2 border-black rounded-2xl p-2 justify-between">
              <span className="text-xs font-black text-slate-700 pl-1">
                {language === "es" ? "Criterio:" : language === "zh" ? "排序方式:" : "Sort order:"}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setProSort("rating")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black border-2 border-black transition-all ${
                    proSort === "rating"
                      ? "bg-orange-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-slate-700 shadow-none hover:bg-slate-100"
                  }`}
                >
                  {language === "es" ? "Mejor Valorados" : language === "zh" ? "最佳评分" : "Best Rating"}
                </button>
                <button
                  onClick={() => setProSort("reviews")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black border-2 border-black transition-all ${
                    proSort === "reviews"
                      ? "bg-orange-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-slate-700 shadow-none hover:bg-slate-100"
                  }`}
                >
                  {language === "es" ? "Más Reseñas" : language === "zh" ? "最多评论" : "Most Reviews"}
                </button>
              </div>
            </div>

            {/* Scrollable Pro list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {sortedPros.map((pro, index) => (
                <div
                  key={pro.name}
                  className="rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 relative overflow-hidden group hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  {/* Ranking Medal/Badge */}
                  <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-orange-100 border border-black rounded-lg px-2 py-0.5">
                    #{index + 1}
                  </span>

                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-1.5">
                      {pro.name}
                      <CheckCircleSolid className="h-5 w-5 text-[#00B761] shrink-0" />
                    </h4>
                    <p className="text-[10px] text-slate-500 font-extrabold">{pro.title}</p>
                    <p className="text-[10px] text-[#1A2B4C] font-black uppercase tracking-wider">{pro.company}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex items-center text-amber-500 text-xs font-black">
                      ★ {pro.rating.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-extrabold">({pro.reviews} {t("reviews")})</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-black space-y-0.5">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {t("bestUse")}
                    </span>
                    <span className="text-[10px] text-slate-800 font-black">{pro.bestUse}</span>
                  </div>

                  <a
                    href={pro.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-[#FF7A00] text-white font-black py-3 border-4 border-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#E06C00] transition-all"
                  >
                    <LinkedinIcon className="h-4.5 w-4.5 fill-white" />
                    {
                      (() => {
                        const bookProTexts: Record<string, string> = {
                          en: "Book a Pro Now",
                          es: "Reservar Pro Ahora",
                          zh: "立即预约专家",
                          fr: "Réserver un Pro",
                          ar: "احجز محترفًا الآن",
                          hi: "अभी प्रो बुक करें",
                          pt: "Agendar Profissional",
                          ko: "전문가 예약하기",
                          ja: "プロを予約する",
                          vi: "Đặt lịch hẹn ngay",
                          de: "Profi buchen",
                          tl: "Mag-book ng Pro Ngayon"
                        };
                        return bookProTexts[language] || bookProTexts["en"];
                      })()
                    }
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
