import Link from "next/link";
import Image from "next/image";

/** Simple footer with the project's mission and safety reminder. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative h-6 w-6">
                <Image
                  src="/mascot/hero.png"
                  alt="RepairBuddy Mascot"
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <p className="font-bold text-black text-base">
              Repair<span className="text-gradient">Buddy</span>
            </p>
            </div>
            <p className="mt-1">
              Your community repair assistant. Fix everyday items safely, save money, and keep usable things out of the landfill.
            </p>
            <p className="mt-4 text-xs">
              Safety first: RepairBuddy never gives instructions for dangerous repairs. For those, we help you find professional help.
            </p>
          </div>
          <div className="text-xs text-slate-500 whitespace-nowrap self-end sm:self-auto">
            © {new Date().getFullYear()} RepairBuddy
          </div>
        </div>
      </div>
    </footer>
  );
}

