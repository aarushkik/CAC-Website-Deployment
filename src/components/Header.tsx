"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { WrenchScrewdriverIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pb-4 pt-10 px-5 flex flex-col gap-4">
      {/* Top Row: AI Helper and Animated Search */}
      <div className="flex items-center justify-between w-full h-12">
        {/* AI Helper Button */}
        <button 
          className={`flex items-center gap-1.5 rounded-full bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 hover:border-slate-300 px-4 py-2 text-sm font-black text-slate-800 transition-all duration-300 active:scale-95 whitespace-nowrap ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none w-0 overflow-hidden px-0 border-none' : 'opacity-100 scale-100'}`}
        >
          <SparklesIcon className="h-5 w-5 text-orange-500" />
          AI Helper
        </button>

        {/* Search Bar / Icon */}
        <div className={`flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'w-full' : 'w-12'}`}>
          <div className={`relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-sm ${isSearchOpen ? 'w-full bg-orange-500 rounded-2xl' : 'w-12 bg-slate-100 rounded-full'}`}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full transition-colors duration-300 ${isSearchOpen ? 'text-white' : 'text-slate-800 hover:bg-slate-200'}`}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search appliances, parts..." 
              onBlur={() => setIsSearchOpen(false)}
              className={`bg-transparent text-white placeholder-white/80 outline-none font-bold text-base transition-all duration-500 ${isSearchOpen ? 'w-full pr-5 opacity-100' : 'w-0 opacity-0'}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Name dropped lower */}
      <div className={`transition-all duration-500 ${isSearchOpen ? 'opacity-0 -translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative'}`}>
        <Link
          href="/"
          className="flex items-center gap-3 text-3xl font-black tracking-tight group w-fit"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-orange-500 text-white shadow-md shadow-orange-500/20 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-orange-500/30">
            <WrenchScrewdriverIcon className="h-6 w-6" />
          </div>
          <span className="font-black text-slate-900 transition-colors group-hover:text-orange-600">
            RepairBuddy
          </span>
        </Link>
      </div>
    </header>
  );
}
