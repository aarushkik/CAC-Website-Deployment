import Link from "next/link";
import { Button } from "@/components/Button";
import { categories } from "@/lib/data";
import {
  CameraIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  ScissorsIcon,
  BoltIcon,
  InboxStackIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const categoryIcons: Record<string, any> = {
  clothing: ScissorsIcon,
  "small-appliances": BoltIcon,
  furniture: InboxStackIcon,
  bikes: WrenchScrewdriverIcon,
  electronics: DevicePhoneMobileIcon,
  home: HomeIcon,
};

const categoryColors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  clothing: { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
  "small-appliances": { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
  furniture: { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
  bikes: { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
  electronics: { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
  home: { bg: "bg-orange-50", text: "text-orange-500", border: "border-slate-200", hover: "card-hover-orange" },
};

export default function HomePage() {
  return (
    <div className="space-y-14 py-2 pb-12">
      
      {/* 🚀 Hero Section with Neo-Brutalist Layout */}
      <section className="relative overflow-hidden rounded-3xl border-4 border-black bg-orange-500 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-scale-in flex flex-col items-center">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white border-2 border-black px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pop-in">
            <SparklesIcon className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            Your Community Repair Assistant
          </p>
          
          <h1 className="text-3xl font-black tracking-tight text-white leading-[1.15] animate-pop-in delay-75">
            Fix it yourself, safely — or find someone <span className="underline decoration-white decoration-4 underline-offset-4">local who can.</span>
          </h1>
          
          <p className="text-sm text-orange-50 leading-relaxed font-black max-w-sm animate-pop-in delay-150">
            RepairBuddy helps you repair everyday items, save money, and reduce waste. We check every repair for safety first.
          </p>

          <div className="flex flex-col gap-4 w-full mt-3 animate-pop-in delay-250">
            <Button href="/choose-item" className="w-full py-4 text-lg bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50">
              Start a repair
            </Button>
            <Button href="/scanner" className="w-full py-4 text-lg bg-black text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 group">
              <CameraIcon className="h-6 w-6 text-orange-400 mr-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
              Scan an item
            </Button>
          </div>
        </div>

        {/* Hero Photo */}
        <div className="relative z-10 w-full flex justify-center mt-8 animate-pop-in delay-350">
          <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-[1.03]">
            <img 
              src="/images/hero.png" 
              alt="Person performing electronics repair safely" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🗺️ How it Works — Vibrant Image Cards */}
      <section className="space-y-8 px-1">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">How it <span className="text-gradient">works</span></h2>
          <p className="text-slate-600 text-sm font-bold">From broken item to safe fix in four stages.</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          
          {/* Step 1 */}
          <div className="group rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange opacity-0 animate-slide-up delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="h-36 w-full bg-orange-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Camera lens for scanning" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-black text-white/90 uppercase tracking-widest bg-orange-500/80 rounded-full px-3 py-1">Step 1</span>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-xl mb-2">Choose or Scan Item</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Select a category or snap a photo to automatically locate your item.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange opacity-0 animate-slide-up delay-200" style={{ animationFillMode: 'forwards' }}>
            <div className="h-36 w-full bg-orange-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Safety equipment" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-black text-white/90 uppercase tracking-widest bg-orange-500/80 rounded-full px-3 py-1">Step 2</span>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-xl mb-2">Run Safety Check</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Answer key safety questions about chemical, electrical, or structural hazards.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange opacity-0 animate-slide-up delay-300" style={{ animationFillMode: 'forwards' }}>
            <div className="h-36 w-full bg-orange-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Result checking" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-black text-white/90 uppercase tracking-widest bg-orange-500/80 rounded-full px-3 py-1">Step 3</span>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-xl mb-2">Get Safety Result</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Receive a clear safety badge rating (green, yellow, or red) with comprehensive guidelines.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="group rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange opacity-0 animate-slide-up delay-400" style={{ animationFillMode: 'forwards' }}>
            <div className="h-36 w-full bg-orange-100 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Repairing" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-black text-white/90 uppercase tracking-widest bg-orange-500/80 rounded-full px-3 py-1">Step 4</span>
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-900 text-xl mb-2">Repair or Request Help</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Walk through detailed DIY guides or request certified professional support.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🍱 Category Grid — Each Category Has a Unique Vivid Color */}
      <section className="space-y-6 px-1">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">What are you <span className="text-gradient">fixing?</span></h2>
            <p className="text-slate-600 text-xs font-bold">Select a category to browse items.</p>
          </div>
          <Link href="/choose-item" className="inline-flex items-center gap-1 text-sm font-black text-black bg-orange-100 border-2 border-black rounded-xl px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
            Browse all <ArrowRightIcon className="h-4 w-4 stroke-[3px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, i) => {
            const Icon = categoryIcons[category.id] || BoltIcon;
            const colors = categoryColors[category.id] || categoryColors["home"];
            return (
              <Link
                key={category.id}
                href={`/choose-item?category=${category.id}`}
                className="group rounded-3xl border-4 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex flex-col justify-between min-h-[160px] opacity-0 animate-pop-in transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 border-2 border-black text-orange-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${i % 2 === 0 ? 'animate-float' : 'animate-float-slow'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed font-bold">{category.description}</p>
                </div>
                <span className="text-[10px] font-black text-orange-600 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  Explore →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 📊 Why Repair — Bold Colored Cards */}
      <section className="space-y-6 px-1">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Why <span className="text-gradient">repair?</span></h2>
          <p className="text-slate-600 text-xs font-bold">Every fix yields positive impact.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Save Money */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/20 p-5 card-hover-orange opacity-0 animate-slide-up delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Save money</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-bold">
              Repairs cost a fraction compared to buying replacements. Compare expenses using our integrated calculator.
            </p>
          </div>

          {/* Reduce Waste */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/20 p-5 card-hover-orange opacity-0 animate-slide-up delay-200" style={{ animationFillMode: 'forwards' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm">
              <GlobeAmericasIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Reduce waste</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-bold">
              Every item repaired keeps plastic, metal, and electronic waste out of our landfills.
            </p>
          </div>

          {/* Support Local */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/20 p-5 card-hover-orange opacity-0 animate-slide-up delay-300" style={{ animationFillMode: 'forwards' }}>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Support local</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-bold">
              If a repair is too advanced, we link you to local trade freelancers and repair shops near you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
