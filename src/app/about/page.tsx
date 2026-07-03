import { Button } from "@/components/Button";
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
    <div className="space-y-8 animate-fade-in pb-12 px-2 pt-2">
      <div className="text-center space-y-3 px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          About <span className="text-gradient">RepairBuddy</span>
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          Making repair safe, easy, and rewarding.
        </p>
      </div>

      {/* 🧡 Why We Built This — Orange Gradient */}
      <section className="opacity-0 animate-pop-in delay-75" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange group">
          <div className="h-36 w-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
              alt="Community working together" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 to-transparent" />
          </div>
          <div className="p-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Why we built this</h2>
            <p className="text-slate-700 text-sm leading-relaxed font-bold">
              Too many working items are thrown away because fixing them feels complicated or unsafe. RepairBuddy helps neighbors repair with confidence — saving cash, reducing waste, and promoting community resilience.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Our Mission — Orange Accent */}
      <section className="opacity-0 animate-pop-in delay-150" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/20 p-6 shadow-md card-hover-orange group">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <GlobeAmericasIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Our Mission</h2>
          <p className="text-slate-700 text-sm leading-relaxed font-bold">
            To build a self-reliant community where fixing is preferred over dumping. Reduce carbon footprints, one item at a time.
          </p>
        </div>
      </section>

      {/* 🛑 Safety Promise — Red Accent (For Danger Alert) */}
      <section className="opacity-0 animate-pop-in delay-250" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-red-200 bg-red-50/10 p-6 shadow-md">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500 shadow-sm shrink-0">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Safety Promise</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-5">
            RepairBuddy will <strong className="text-red-500 font-black">never</strong> give step-by-step instructions for dangerous repairs:
          </p>
          <div className="flex flex-wrap gap-2">
            {DANGEROUS_REPAIRS.map((d) => (
              <span
                key={d}
                className="rounded-xl border-2 border-red-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-red-500 shadow-sm hover:bg-red-50 hover:scale-105 transition-all duration-300 cursor-default"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 What It Does — Orange Accent */}
      <section className="opacity-0 animate-pop-in delay-350" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md card-hover-orange">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm">
            <LightBulbIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-5">What it does</h2>
          <ul className="space-y-4 mb-6">
            {[
              "Checks whether a repair is safe for beginners",
              "Provides clear green, yellow, and red safety signals",
              "Offers beginner-safe, step-by-step guides",
              "Compares repair cost vs replacement cost",
              "Tracks money saved and waste avoided",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-bold leading-relaxed">
                <div className="rounded-full bg-orange-200 p-1 shrink-0 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-orange-700 font-black" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <Button href="/choose-item" className="w-full py-4 text-base shadow-lg">
            Start a repair
          </Button>
        </div>
      </section>

      {/* 🎓 Learn the Trades — Orange Accent */}
      <section className="opacity-0 animate-pop-in delay-450" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/20 p-6 shadow-md card-hover-orange group">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <AcademicCapIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Learn the trades</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-6">
            Repair habits connect directly to professional careers in electrical work, HVAC, automotive engineering, and electronics.
          </p>
          <a
            href="https://www.clark.edu/academics/hs-dual-credit/cte/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/30 active:scale-90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            Explore CTE Credits
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
