"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Wrench, X } from "lucide-react";

const navLinks = [
  { href: "/scanner", label: "Find a fix", match: ["/scanner"] },
  {
    href: "/choose-item",
    label: "Browse repairs",
    match: ["/choose-item", "/safety-checker", "/safety-result", "/guide"],
  },
  { href: "/calculator", label: "Fix or replace", match: ["/calculator"] },
  { href: "/log", label: "Repair log", match: ["/log"] },
  { href: "/dashboard", label: "Impact", match: ["/dashboard"] },
  { href: "/resources", label: "Local help", match: ["/resources"] },
  { href: "/about", label: "About", match: ["/about"] },
];

function isActive(pathname: string, match: string[]) {
  return match.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** The FixIt wordmark with its "WA 03" district tag. */
export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
        <Wrench className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="font-display text-2xl font-extrabold leading-none tracking-tight text-ink">FixIt</span>
      <span className="relative rounded-[5px] border border-manila-300 bg-manila-100 py-0.5 pl-3.5 pr-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-manila-700">
        <span
          className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-manila-300 bg-concrete-100"
          aria-hidden="true"
        />
        WA 03
      </span>
    </span>
  );
}

/** Top navigation bar. Collapses to a menu on small screens. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu after navigating (including back/forward).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-concrete-200 bg-concrete-100/90 backdrop-blur supports-[backdrop-filter]:bg-concrete-100/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="FixIt WA 03 home" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "text-brand-700" : "text-ink-soft hover:bg-concrete-200/70 hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-brand-600" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-concrete-300 bg-white px-3 text-sm font-semibold text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          Menu
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-concrete-200 bg-concrete-50 px-4 pb-4 pt-2 shadow-lift lg:hidden"
        >
          <ul className="mx-auto max-w-6xl">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.match);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center rounded-lg px-3 text-base font-semibold ${
                      active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-concrete-200/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
