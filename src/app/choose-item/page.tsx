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
  const activeCategory = searchParams.get("category");

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(activeCategory !== null);

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

  const showSuggestions = isSearchActive && (isFocused || query.length > 0 || activeCategory !== null);

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
      difficulty: isRed ? "Expert" : isYellow ? "Moderate" : "Beginner",
      difficultyColor: isRed ? "text-rose-600 border-rose-200 bg-rose-50" : isYellow ? "text-amber-600 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50",
      people: isRed ? 2 : item.categoryId === "furniture" || item.categoryId === "bikes" ? 2 : 1,
      estTime: isRed ? "N/A" : isYellow ? "1-2 Hours" : "30-45 Mins",
    };
  }

  return (
    <div className="min-h-[75vh] flex flex-col justify-start py-6 px-2 space-y-10 animate-fade-in relative z-10">
      
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
            What needs <span className="text-orange-500">fixing</span>?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed">
            Search items or upload a photo to verify safety guidelines and cost stats.
          </p>
        </div>
      </div>

      {/* 🔍 Animated Expanding Search Bar Wrapper */}
      <div className="max-w-xl w-full mx-auto relative z-20 h-16 flex items-center justify-center">
        <div
          className={`relative rounded-3xl border-4 border-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isSearchActive
              ? "w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              : "w-14 h-14 bg-white text-black hover:bg-orange-50 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          }`}
          onClick={() => {
            if (!isSearchActive) {
              setIsSearchActive(true);
            }
          }}
        >
          <div className="flex items-center h-full w-full justify-between">
            <button
              onClick={(e) => {
                if (isSearchActive) {
                  e.stopPropagation();
                  setIsSearchActive(false);
                  setQuery("");
                  setCategory(null);
                }
              }}
              className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ${
                isSearchActive ? "text-white pl-1" : "text-black pl-0 hover:scale-110"
              }`}
            >
              {isSearchActive ? (
                <XMarkIcon className="h-6 w-6 font-bold" />
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6 font-bold" />
              )}
            </button>

            <input
              type="text"
              value={query}
              onFocus={() => {
                setIsSearchActive(true);
                setIsFocused(true);
              }}
              onBlur={() => {
                if (!query) {
                  setIsFocused(false);
                }
              }}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search appliances, clothing, gear..."
              className={`bg-transparent outline-none font-bold text-base transition-all duration-500 pl-2 ${
                isSearchActive
                  ? "w-full text-white placeholder-white/70 opacity-100 pr-4"
                  : "w-0 opacity-0 pointer-events-none"
              } !border-0 !shadow-none !translate-x-0 !translate-y-0 focus:!shadow-none focus:!translate-x-0 focus:!translate-y-0`}
            />

            {isSearchActive && (
              <Link
                href="/scanner"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-xl bg-white border-2 border-black hover:bg-orange-100 text-black px-4 py-2 text-sm font-black tracking-wide transition-all duration-200 shrink-0 mr-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none group"
              >
                <CameraIcon className="h-4.5 w-4.5 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Scan</span>
              </Link>
            )}
          </div>
        </div>

      {/* 📋 Vibrant Suggestions Sheet */}
      {showSuggestions && (
        <div className="absolute top-[220px] left-2 right-2 mt-3 bg-white border-4 border-black rounded-3xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-scale-in z-30 space-y-6">
            
            {/* Category horizontal scroll container */}
            <div className="space-y-3">
              <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">Quick Filters</span>
              <div className="flex flex-wrap gap-2">
                <CategoryChip label="All" active={!activeCategory} onClick={() => setCategory(null)} />
                {categories.map((c) => (
                  <CategoryChip
                    key={c.id}
                    label={c.name}
                    active={activeCategory === c.id}
                    onClick={() => setCategory(c.id)}
                  />
                ))}
              </div>
            </div>

            {/* List panel */}
            <div className="space-y-3">
              <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">Suggestions</span>
              {apiLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 animate-pulse">
                  <Mascot size="sm" variant="thinking" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">Searching...</span>
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-fade-in bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <Mascot size="md" variant="sweeping" />
                  <div className="space-y-1">
                    <span className="block text-sm font-black uppercase tracking-widest text-slate-500">Nothing found</span>
                    <p className="text-slate-500 text-sm font-bold max-w-xs mx-auto">
                      Try another query or scan a photo!
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
                        {item.name}
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
          <span className="text-[9px] font-black uppercase tracking-widest text-accent-500">Overview</span>
          <h3 className="text-xl font-black text-slate-800 leading-tight">{item.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <SafetyBadge level={item.baseSafety} />
            {item.dangerous && (
              <span className="inline-flex items-center rounded-lg bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-600 border border-rose-100">
                Pro Required
              </span>
            )}
          </div>
        </div>

        {/* Grid statistics panel */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <WrenchScrewdriverIcon className="h-3 w-3 text-accent-500/70" /> Difficulty
            </span>
            <span className="text-xs font-extrabold text-slate-800">{meta.difficulty}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <UserGroupIcon className="h-3 w-3 text-accent-500/70" /> Helpers
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              {meta.people} {meta.people === 1 ? "Person" : "People"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <ClockIcon className="h-3 w-3 text-accent-500/70" /> Active Time
            </span>
            <span className="text-xs font-extrabold text-slate-800">{meta.estTime}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-0.5">
              <CurrencyDollarIcon className="h-3 w-3 text-emerald-500/70" /> Savings
            </span>
            <span className="text-xs font-extrabold text-emerald-600">
              {item.estimatedRepairCost && item.estimatedReplacementCost
                ? `Save ~$${item.estimatedReplacementCost - item.estimatedRepairCost}`
                : "Saves Money"}
            </span>
          </div>
        </div>

        {/* Common Issue Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">Common Issue</span>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">{item.commonIssue}</p>
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
                Maps
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
              Find Professional Help
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
            Start Safety Check
            <ArrowRightIcon className="h-4 w-4 stroke-[3px]" />
          </button>
        </div>

        <p className="text-[8px] font-black text-slate-400 text-center pt-1 uppercase tracking-widest">
          ↓ Swipe down to dismiss ↓
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
