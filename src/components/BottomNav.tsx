"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import {
  HomeIcon,
  CameraIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  CameraIcon as CameraSolid,
  WrenchScrewdriverIcon as WrenchSolid,
  MapPinIcon as MapPinSolid,
  QuestionMarkCircleIcon as QuestionSolid,
} from "@heroicons/react/24/solid";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t("navHome"), outline: HomeIcon, solid: HomeSolid, color: "text-[#FF7A00]", bg: "bg-white/10 border border-[#FF7A00]/40", glow: "shadow-[0_0_12px_rgba(255,122,0,0.15)]" },
    { href: "/scanner", label: t("navScan"), outline: CameraIcon, solid: CameraSolid, color: "text-[#FF7A00]", bg: "bg-white/10 border border-[#FF7A00]/40", glow: "shadow-[0_0_12px_rgba(255,122,0,0.15)]" },
    { href: "/choose-item", label: t("navFix"), outline: WrenchScrewdriverIcon, solid: WrenchSolid, color: "text-[#FF7A00]", bg: "bg-white/10 border border-[#FF7A00]/40", glow: "shadow-[0_0_12px_rgba(255,122,0,0.15)]" },
    { href: "/resources", label: t("navLocal"), outline: MapPinIcon, solid: MapPinSolid, color: "text-[#FF7A00]", bg: "bg-white/10 border border-[#FF7A00]/40", glow: "shadow-[0_0_12px_rgba(255,122,0,0.15)]" },
    { href: "/about", label: t("navAbout"), outline: QuestionMarkCircleIcon, solid: QuestionSolid, color: "text-[#FF7A00]", bg: "bg-white/10 border border-[#FF7A00]/40", glow: "shadow-[0_0_12px_rgba(255,122,0,0.15)]" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#1A2B4C]/95 backdrop-blur-md border-t border-white/10 px-3 py-2 pb-3.5 z-40 shadow-2xl">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.solid : item.outline;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover-jelly ${
                  isActive 
                    ? `${item.color} ${item.bg} scale-110 shadow-lg ${item.glow}` 
                    : "text-slate-300 hover:text-white hover:bg-white/5 hover:scale-105"
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'drop-shadow-sm' : ''}`} />
                {isActive && (
                  <span className={`block w-1 h-1 rounded-full mt-1 bg-[#FF7A00] animate-scale-in`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
