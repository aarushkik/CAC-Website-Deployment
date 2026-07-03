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
  { href: "/", label: "Home", outline: HomeIcon, solid: HomeSolid },
  { href: "/scanner", label: "Scan", outline: CameraIcon, solid: CameraSolid },
  { href: "/choose-item", label: "Fix", outline: WrenchScrewdriverIcon, solid: WrenchSolid },
  { href: "/resources", label: "Local", outline: MapPinIcon, solid: MapPinSolid },
  { href: "/about", label: "About", outline: QuestionMarkCircleIcon, solid: QuestionSolid },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-4 pb-6 z-40">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.solid : item.outline;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300 ${
                  isActive ? "text-orange-500 scale-110 shadow-sm bg-orange-50" : "text-slate-400 hover:text-black hover:bg-slate-50"
                }`}
              >
                <Icon className="h-8 w-8" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
