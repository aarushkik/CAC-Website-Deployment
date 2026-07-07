"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SafetyBadge } from "@/components/SafetyBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Mascot } from "@/components/Mascot";
import { categories } from "@/lib/data";
import type { Item } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";
import { tCategoryName, tItemName, tItemCommonIssue } from "@/lib/dataTranslations";
import {
  MagnifyingGlassIcon,
  CameraIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function ChooseItemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const activeCategory = searchParams.get("category");

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    setApiLoading(true);
    const delayDebounce = setTimeout(() => {
      fetch(`/api/items?category=${activeCategory || ""}&q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setVisibleItems(data);
          setApiLoading(false);
        })
        .catch(() => {
          setApiLoading(false);
        });
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [activeCategory, query]);

  const showSuggestions = isFocused || query.length > 0 || activeCategory !== null;

  function setCategory(id: string | null) {
    const params = new URLSearchParams();
    if (id) params.set("category", id);
    const queryString = params.toString();
    router.push(`/choose-item${queryString ? `?${queryString}` : ""}`);
  }

  function getItemMeta(item: Item) {
    const isRed = item.baseSafety === "red" || item.dangerous;
    const isYellow = item.baseSafety === "yellow";
    return {
      difficulty: isRed ? (language === "es" ? "Experto" : language === "zh" ? "专家" : "Expert") : isYellow ? (language === "es" ? "Moderado" : language === "zh" ? "中等" : "Moderate") : (language === "es" ? "Principiante" : language === "zh" ? "初学者" : "Beginner"),
      difficultyColor: isRed ? "text-rose-600 border-rose-200 bg-rose-50" : isYellow ? "text-amber-600 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50",
      people: isRed ? 2 : item.categoryId === "furniture" || item.categoryId === "bikes" ? 2 : 1,
      estTime: isRed ? "N/A" : isYellow ? (language === "es" ? "1-2 Horas" : language === "zh" ? "1-2 小时" : "1-2 Hours") : (language === "es" ? "30-45 Mins" : language === "zh" ? "30-45 分钟" : "30-45 Mins"),
    };
  }

  return (
    <div className="min-h-[75vh] flex flex-col justify-start py-6 px-2 space-y-4 animate-fade-in relative z-10">
      
      {/* 🧭 Header with Vibrant Appliances Image */}
      <div className="text-center max-w-2xl mx-auto space-y-6 mb-2">
        <div className="relative w-full aspect-[21/9] sm:aspect-[5/2] rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
          <img 
            src="/images/appliances.png" 
            alt="Flatlay of tools and broken household appliances" 
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {t("whatNeedsFixing").split(t("fixingWord"))[0]}
            <span className="text-[#FF7A00]">{t("fixingWord")}</span>
            {t("whatNeedsFixing").split(t("fixingWord"))[1]}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed">
            {t("searchItemsOrUpload")}
          </p>
        </div>
      </div>

      {/* 🔍 Static Search Bar & Scan Button */}
      <div className="max-w-xl w-full mx-auto relative z-20 space-y-4 px-2">
        <div className="relative">
          <div className="relative rounded-2xl border-4 border-black bg-white h-14 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 flex items-center">
            <span className="pl-4 text-slate-700 shrink-0 flex items-center justify-center">
              <MagnifyingGlassIcon className="h-6 w-6 stroke-[2.5px]" />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent px-3 h-full text-black !text-black caret-orange-500 text-sm placeholder-slate-400 focus:outline-none font-bold"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="p-2 text-slate-500 hover:text-slate-800 mr-2 transition-colors shrink-0"
              >
                <XMarkIcon className="h-6 w-6 stroke-[2.5px]" />
              </button>
            )}
          </div>

          {/* 📋 Suggestions Sheet */}
          {showSuggestions && (
            <div className="absolute top-full left-1 right-2.5 mt-3 bg-white border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-scale-in z-30 space-y-6">
              
              {/* Category horizontal scroll container */}
              <div className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">{t("quickFilters")}</span>
                <div className="flex flex-wrap gap-2">
                  <CategoryChip label={t("all")} active={!activeCategory} onClick={() => setCategory(null)} />
                  {categories.map((c) => (
                    <CategoryChip
                      key={c.id}
                      label={tCategoryName(c.id, language)}
                      active={activeCategory === c.id}
                      onClick={() => setCategory(c.id)}
                    />
                  ))}
                </div>
              </div>

              {/* List panel */}
              <div className="space-y-3">
                <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">{t("suggestions")}</span>
                {apiLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 animate-pulse">
                    <Mascot size="sm" variant="thinking" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">{t("searching")}</span>
                  </div>
                ) : visibleItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-fade-in bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <Mascot size="md" variant="sweeping" />
                    <div className="space-y-1">
                      <span className="block text-sm font-black uppercase tracking-widest text-slate-500">{t("nothingFound")}</span>
                      <p className="text-slate-500 text-sm font-bold max-w-xs mx-auto">
                        {t("tryAnotherQuery")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                    {visibleItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="w-full text-left py-4 px-4 flex items-center justify-between bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 group active:scale-95 shadow-sm"
                      >
                        <span className="font-black text-slate-800 text-base group-hover:text-orange-600 transition-colors">
                          {tItemName(item.id, item.name, language)}
                        </span>
                        <ChevronRightIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 📷 Scan Button Below */}
        <Link
          href="/scanner"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] border-4 border-black text-white font-black py-4 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E06C00] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200"
        >
          <CameraIcon className="h-6 w-6 text-white stroke-[2.5px]" />
          <span>{t("scanPhotoOrObject")}</span>
        </Link>
      </div>

      {/* Swipeable Drawer Modal */}
      {selectedItem && (
        <SwipeableDrawer
          item={selectedItem}
          meta={getItemMeta(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

/** Bottom Drawer modal with fully opaque backing and clean grid statistics. */
function SwipeableDrawer({
  item,
  meta,
  onClose,
}: {
  item: Item;
  meta: any;
  onClose: () => void;
}) {
  const { t, language } = useLanguage();
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showProChoices, setShowProChoices] = useState(false);
  const startY = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleStart = (y: number) => {
    startY.current = y - offsetY;
    setIsDragging(true);
  };

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const currentOffset = y - startY.current;
    if (currentOffset > -20) {
      setOffsetY(currentOffset);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (offsetY > 140) {
      onClose();
    } else {
      setOffsetY(0);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    handleStart(e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientY);
  const onTouchEnd = () => handleEnd();

  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    handleStart(e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientY);
  };
  const onMouseUp = () => handleEnd();

  const searchLoc = "me";
  const googleProUrl = `https://www.google.com/search?q=${encodeURIComponent(`${item.name} repair professional near ${searchLoc}`)}`;
  const yelpProUrl = `https://www.yelp.com/search?find_desc=${encodeURIComponent(`${item.name} repair`)}&find_loc=${encodeURIComponent(searchLoc)}`;
  const linkedinProUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${item.name} repair professional`)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 p-4 overflow-y-auto animate-fade-in"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        ref={drawerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        style={{
          transform: `translateY(${offsetY}px)`,
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        className="relative w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl select-none mt-16 cursor-grab active:cursor-grabbing animate-slide-down space-y-5"
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto shrink-0" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          <XMarkIcon className="h-4.5 w-4.5" />
        </button>

        {/* Title */}
        <div className="pr-6 space-y-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-accent-500">
            {language === "es" ? "Resumen" : language === "zh" ? "总览" : "Overview"}
          </span>
          <h3 className="text-xl font-black text-slate-800 leading-tight">
            {tItemName(item.id, item.name, language)}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <SafetyBadge level={item.baseSafety} />
            {item.dangerous && (
              <span className="inline-flex items-center rounded-lg bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-600 border border-rose-100">
                {language === "es" ? "Pro Requerido" : language === "zh" ? "需要专业人员" : "Pro Required"}
              </span>
            )}
          </div>
        </div>

        {/* Grid statistics panel */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <WrenchScrewdriverIcon className="h-3 w-3 text-accent-500/70" /> 
              {language === "es" ? "Dificultad" : language === "zh" ? "难度" : "Difficulty"}
            </span>
            <span className="text-xs font-extrabold text-slate-800">{meta.difficulty}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <UserGroupIcon className="h-3 w-3 text-accent-500/70" />
              {language === "es" ? "Ayudantes" : language === "zh" ? "助手" : "Helpers"}
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              {meta.people} {meta.people === 1 
                ? (language === "es" ? "Persona" : language === "zh" ? "人" : "Person") 
                : (language === "es" ? "Personas" : language === "zh" ? "人" : "People")}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <ClockIcon className="h-3 w-3 text-accent-500/70" />
              {language === "es" ? "Tiempo Activo" : language === "zh" ? "用时" : "Active Time"}
            </span>
            <span className="text-xs font-extrabold text-slate-800">{meta.estTime}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <CurrencyDollarIcon className="h-3 w-3 text-emerald-500/70" />
              {language === "es" ? "Ahorro" : language === "zh" ? "节省" : "Savings"}
            </span>
            <span className="text-xs font-extrabold text-emerald-600">
              {item.estimatedRepairCost && item.estimatedReplacementCost
                ? (language === "es" 
                    ? `Ahorra ~$${item.estimatedReplacementCost - item.estimatedRepairCost}` 
                    : language === "zh" 
                    ? `节省约 ~$${item.estimatedReplacementCost - item.estimatedRepairCost}` 
                    : `Save ~$${item.estimatedReplacementCost - item.estimatedRepairCost}`)
                : (language === "es" ? "Ahorra Dinero" : language === "zh" ? "省钱" : "Saves Money")}
            </span>
          </div>
        </div>

        {/* Common Issue Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
            {language === "es" ? "Problema Común" : language === "zh" ? "常见问题" : "Common Issue"}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {tItemCommonIssue(item.id, item.commonIssue, language)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-1">
          
          {showProChoices ? (
            <div className="grid gap-1.5 grid-cols-3 animate-scale-in">
              <a
                href={googleProUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2.5 px-3 rounded-lg border-2 border-black bg-white hover:bg-slate-50 text-black text-center text-[10px] font-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {language === "es" ? "Mapas" : language === "zh" ? "地图" : "Maps"}
              </a>
              <a
                href={yelpProUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2.5 px-3 rounded-lg border-2 border-black bg-red-100 hover:bg-red-200 text-red-700 text-center text-[10px] font-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Yelp
              </a>
              <a
                href={linkedinProUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2.5 px-3 rounded-lg border-2 border-black bg-sky-100 hover:bg-sky-200 text-sky-700 text-center text-[10px] font-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                LinkedIn
              </a>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProChoices(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-white hover:bg-slate-50 text-slate-800 text-center text-xs font-black transition-all flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {language === "es" ? "Buscar ayuda profesional" : language === "zh" ? "寻找专业帮助" : "Find Professional Help"}
              <ArrowTopRightOnSquareIcon className="h-4 w-4 stroke-[2.5px]" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              router.push(`/safety-checker?item=${item.id}`);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 border-4 border-black text-black font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200 flex items-center justify-center gap-1"
          >
            {language === "es" ? "Iniciar verificación de seguridad" : language === "zh" ? "开始安全检查" : "Start Safety Check"}
            <ArrowRightIcon className="h-4 w-4 stroke-[3px]" />
          </button>
        </div>

        <p className="text-[8px] font-black text-slate-400 text-center pt-1 uppercase tracking-widest">
          {language === "es" ? "↓ Desliza hacia abajo para cerrar ↓" : language === "zh" ? "↓ 向下滑动以关闭 ↓" : "↓ Swipe down to dismiss ↓"}
        </p>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 border-black px-3.5 py-1.5 text-[10px] font-black tracking-wide transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
        active
          ? "bg-orange-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          : "bg-white text-slate-800 hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
      }`}
    >
      {label}
    </button>
  );
}

export default function ChooseItemPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading items…" />}>
      <ChooseItemContent />
    </Suspense>
  );
}
