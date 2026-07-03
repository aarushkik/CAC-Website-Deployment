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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl pb-3 pt-10 px-5 flex flex-col gap-3">
      {/* Top Row: AI Helper and Animated Search */}
      <div className="flex items-center justify-between w-full h-12">
        {/* AI Helper Button */}
        <button 
          className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 hover:from-orange-100 hover:to-orange-200 px-4 py-2 text-sm font-black text-orange-700 transition-all duration-300 active:scale-90 whitespace-nowrap hover:shadow-md hover:shadow-orange-500/10 hover-jelly ${isSearchOpen ? 'opacity-0 scale-75 pointer-events-none w-0 overflow-hidden px-0 border-none' : 'opacity-100 scale-100'}`}
        >
          <SparklesIcon className="h-5 w-5 text-orange-500" />
          AI Helper
        </button>

        {/* Search Bar / Icon */}
        <div className={`flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'w-full' : 'w-12'}`}>
          <div className={`relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isSearchOpen ? 'w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/30' : 'w-12 bg-slate-100 rounded-full hover:bg-slate-200'}`}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ${isSearchOpen ? 'text-white' : 'text-slate-800 hover:scale-110'}`}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search appliances, parts..." 
              onBlur={() => setIsSearchOpen(false)}
              className={`bg-transparent text-white placeholder-white/70 outline-none font-bold text-base transition-all duration-500 ${isSearchOpen ? 'w-full pr-5 opacity-100' : 'w-0 opacity-0'}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Name */}
      <div className={`transition-all duration-500 ${isSearchOpen ? 'opacity-0 -translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative'}`}>
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-black tracking-tight group w-fit"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-orange-500/30 hover-jelly">
            <WrenchScrewdriverIcon className="h-5 w-5" />
          </div>
          <span className="font-black text-slate-900 transition-colors group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:bg-clip-text">
            RepairBuddy
          </span>
        </Link>
      </div>
    </header>
  );
}
