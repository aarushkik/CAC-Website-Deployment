"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navItems = [
  { href: "/", label: "Home", outline: HomeIcon, solid: HomeSolid, color: "text-black", bg: "bg-slate-100", glow: "shadow-slate-950/10" },
  { href: "/scanner", label: "Scan", outline: CameraIcon, solid: CameraSolid, color: "text-black", bg: "bg-slate-100", glow: "shadow-slate-950/10" },
  { href: "/choose-item", label: "Fix", outline: WrenchScrewdriverIcon, solid: WrenchSolid, color: "text-black", bg: "bg-slate-100", glow: "shadow-slate-950/10" },
  { href: "/resources", label: "Local", outline: MapPinIcon, solid: MapPinSolid, color: "text-black", bg: "bg-slate-100", glow: "shadow-slate-950/10" },
  { href: "/about", label: "About", outline: QuestionMarkCircleIcon, solid: QuestionSolid, color: "text-black", bg: "bg-slate-100", glow: "shadow-slate-950/10" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-6 z-40">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.solid : item.outline;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover-jelly ${
                  isActive 
                    ? `${item.color} ${item.bg} scale-110 shadow-lg ${item.glow}` 
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 hover:scale-105"
                }`}
              >
                <Icon className={`h-7 w-7 transition-transform duration-300 ${isActive ? 'drop-shadow-sm' : ''}`} />
                {isActive && (
                  <span className={`block w-1.5 h-1.5 rounded-full mt-1.5 ${item.color.replace('text-', 'bg-')} animate-scale-in`} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
