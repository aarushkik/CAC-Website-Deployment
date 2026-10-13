"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./AppShell";
import { Icon, type IconName } from "./Icon";

/** The five places people go most. On a phone these are the bottom tab bar. */
const tabs: Array<{ href: string; label: string; icon: IconName; match: string[] }> = [
  { href: "/", label: "Home", icon: "home", match: ["/"] },
  {
    href: "/choose-item",
    label: "Fix",
    icon: "wrench",
    match: ["/choose-item", "/scanner", "/safety-checker", "/safety-result", "/guide", "/guides", "/calculator"],
  },
  { href: "/resources", label: "Local help", icon: "pin", match: ["/resources"] },
  { href: "/log", label: "Log", icon: "list", match: ["/log"] },
  { href: "/dashboard", label: "Impact", icon: "chart", match: ["/dashboard"] },
];

const moreLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/models", label: "3D" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, match: string[]) {
  return match.some((m) => (m === "/" ? pathname === "/" : pathname === m || pathname.startsWith(m + "/")));
}

/**
 * Navigation. A laptop gets one bar across the top. A phone gets a slim top bar
 * with the name and a tab bar at the bottom, where a thumb can reach it.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="toolbox sticky top-0 z-30 bg-workshop-50 text-workshop-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Link href="/" className="display flex items-center gap-2.5 rounded-lg text-xl text-workshop-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card">
              <Icon name="wrench" size={19} />
            </span>
            <span>
              Fix<span className="text-brand-500">It</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden flex-1 items-center justify-end gap-1 md:flex">
            {tabs.slice(1).map((tab) => (
              <DesktopLink key={tab.href} href={tab.href} active={isActive(pathname, tab.match)}>
                {tab.label === "Fix" ? "Start a repair" : tab.label === "Log" ? "Repair log" : tab.label}
              </DesktopLink>
            ))}
            {moreLinks.map((link) => (
              <DesktopLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </DesktopLink>
            ))}
          </nav>

          <div className="flex items-center">
            <ThemeToggle />
            <Link
              href="/about"
              aria-label="About FixIt"
              className="rounded-full p-2 text-workshop-800 hover:bg-workshop-100 md:hidden"
            >
              <Icon name="info" size={22} />
            </Link>
          </div>
        </div>
        <div className="hazard-tape" aria-hidden="true" />
      </header>

      <nav
        aria-label="Main"
        className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-workshop-200 bg-surface/95 backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.match);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-0.5 px-1 pb-1.5 pt-2 text-[11px] font-semibold transition-colors ${
                    active ? "text-brand-700" : "text-workshop-600"
                  }`}
                >
                  <span
                    className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-brand-100" : ""
                    }`}
                  >
                    <Icon name={tab.icon} size={21} />
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function DesktopLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
        active ? "bg-brand-100 text-brand-800" : "text-workshop-800 hover:bg-workshop-100"
      }`}
    >
      {children}
    </Link>
  );
}
