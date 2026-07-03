import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DANGEROUS_REPAIRS } from "@/lib/safety";
import {
  ShieldCheckIcon,
  HeartIcon,
  AcademicCapIcon,
  LightBulbIcon,
  GlobeAmericasIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "About — RepairBuddy",
};

export default function AboutPage() {
  return (
    <div className="space-y-10 animate-fade-in pb-12 px-2 pt-2">
      <div className="text-center space-y-3 px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          About <span className="text-orange-500">RepairBuddy</span>
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          A community repair assistant designed to make repairing everyday items safe, easy, and rewarding.
        </p>
      </div>

      {/* 🧡 Why We Built This */}
      <section>
        <div className="rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden flex flex-col group hover:shadow-xl hover:border-orange-300 transition-all duration-300">
          <div className="h-40 w-full relative overflow-hidden bg-orange-100">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
              alt="Community working together" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
            />
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Why we built this</h2>
            <p className="text-slate-700 text-sm leading-relaxed font-bold">
              Too many working items are thrown away because fixing them feels complicated or unsafe. RepairBuddy helps neighbors repair everyday items with confidence — saving cash, reducing landfill waste, and promoting community resilience.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Our Mission */}
      <section>
        <div className="rounded-3xl border-2 border-blue-200 bg-white shadow-md overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-300 transition-all duration-300">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <GlobeAmericasIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Our Mission</h2>
            <p className="text-slate-700 text-sm leading-relaxed font-bold">
              To build a self-reliant community where fixing is preferred over dumping. Reduce carbon footprints, one item at a time.
            </p>
          </div>
        </div>
      </section>

      {/* 🛑 Safety Promise */}
      <section>
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-200 text-rose-600 shadow-inner shrink-0">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Safety Promise</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-6">
            RepairBuddy will <strong className="text-rose-600 font-black">never</strong> give step-by-step instructions for dangerous repairs. For anything on this list, we recommend professional help:
          </p>
          <div className="flex flex-wrap gap-2">
            {DANGEROUS_REPAIRS.map((d) => (
              <span
                key={d}
                className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-rose-600 shadow-sm"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 What It Does */}
      <section>
        <div className="rounded-3xl border-2 border-emerald-200 bg-white p-6 sm:p-8 shadow-md flex flex-col hover:border-emerald-300 transition-colors">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
            <LightBulbIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-5">What it does</h2>
          <ul className="space-y-4 mb-8">
            {[
              "Checks whether a repair is safe for beginners",
              "Provides clear green, yellow, and red safety signals",
              "Offers beginner-safe, step-by-step guides",
              "Compares repair cost vs replacement cost",
              "Tracks money saved and waste avoided",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-bold leading-relaxed">
                <div className="rounded-full bg-emerald-100 p-1 shrink-0 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-emerald-600 font-black" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <Button href="/choose-item" className="w-full flex items-center justify-center py-4 text-base shadow-lg active:scale-95 hover:-translate-y-1 transition-all duration-300 ease-out">
            Start a repair
          </Button>
        </div>
      </section>

      {/* 🎓 Learn the Trades */}
      <section>
        <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-md flex flex-col group hover:border-orange-300 transition-colors">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            <AcademicCapIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Learn the trades</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-6">
            Repair habits connect directly to professional careers in electrical work, HVAC, automotive engineering, machining, and electronics. CTE credentials are a solid pathway to rewarding technical careers.
          </p>
          <a
            href="https://www.clark.edu/academics/hs-dual-credit/cte/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-black px-6 py-4 text-base font-black text-white shadow-lg active:scale-95 hover:-translate-y-1 transition-all duration-300 ease-out"
          >
            Explore CTE Credits
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
