"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/choose-item", label: "Choose Item" },
  { href: "/scanner", label: "AI Scanner" },
  { href: "/calculator", label: "Fix or Replace" },
  { href: "/log", label: "Repair Log" },
  { href: "/dashboard", label: "Impact" },
  { href: "/resources", label: "Local Help" },
  { href: "/about", label: "About" },
];

/** Top navigation bar. Collapses to a toggle menu on small screens. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-workshop-200 bg-workshop-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold text-workshop-900"
          onClick={() => setOpen(false)}
        >
          <span aria-hidden="true">🛠️</span>
          <span>
            FixIt <span className="text-brand-600">WA 03</span>
          </span>
        </Link>

        <button
          type="button"
          className="rounded-lg border border-workshop-200 p-2 text-workshop-900 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-workshop-800 hover:bg-workshop-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="border-t border-workshop-200 bg-workshop-50 px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-3 text-base font-medium ${
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-workshop-800 hover:bg-workshop-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
