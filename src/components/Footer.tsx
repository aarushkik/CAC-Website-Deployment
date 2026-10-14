import Link from "next/link";
import { Phone } from "lucide-react";

const links = [
  { href: "/scanner", label: "Find a fix" },
  { href: "/choose-item", label: "Browse repairs" },
  { href: "/calculator", label: "Fix or replace" },
  { href: "/log", label: "Repair log" },
  { href: "/dashboard", label: "Impact" },
  { href: "/resources", label: "Local help" },
  { href: "/about", label: "About & safety promise" },
];

/** Footer with the mission, an emergency reminder, and site links. */
export function Footer() {
  return (
    <footer className="no-print mt-16 bg-ink text-concrete-200">
      <div className="hazard-stripes h-1.5 opacity-90" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center">
          <Phone className="h-5 w-5 flex-none text-caution" aria-hidden="true" />
          <p className="text-sm text-white">
            <strong>Smell gas, see smoke, or see sparks?</strong> Leave the area first, then call 911
            or your gas company from outside. Don&apos;t try to fix it.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-2xl font-extrabold text-white">FixIt WA 03</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed">
              A community repair assistant for Southwest Washington. Fix everyday things safely,
              save money, keep usable stuff out of the landfill, and find local help when a repair
              isn&apos;t safe to do yourself.
            </p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-concrete-300">
              Your repair log stays on this device. Guides are for simple, low-risk repairs — when
              in doubt, stop and ask a professional.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-concrete-300">
          Built for the Congressional App Challenge · Washington&apos;s 3rd District. Cost estimates
          are rough national averages; call local shops for real quotes.
        </p>
      </div>
    </footer>
  );
}
