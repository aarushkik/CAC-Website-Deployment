import {
  ArchiveBoxIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  FireIcon,
  HomeIcon,
  PowerIcon,
  PuzzlePieceIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  SunIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

/** The Heroicon for each icon name used in src/data/categories.json. */
const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  scissors: ScissorsIcon,
  power: PowerIcon,
  "archive-box": ArchiveBoxIcon,
  cog: Cog6ToothIcon,
  phone: DevicePhoneMobileIcon,
  home: HomeIcon,
  "shopping-bag": ShoppingBagIcon,
  fire: FireIcon,
  sun: SunIcon,
  puzzle: PuzzlePieceIcon,
  truck: TruckIcon,
};

/** Draws a category's icon. An unknown name gets the wrench, so a new category never shows a gap. */
export function CategoryIcon({ name, className = "h-6 w-6" }: { name?: string; className?: string }) {
  const Drawn = (name && ICONS[name]) || WrenchScrewdriverIcon;
  return <Drawn className={className} aria-hidden="true" />;
}
