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

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      
      <section className="relative overflow-hidden rounded-3xl border border-orange-100 bg-orange-50/50 p-6 sm:p-10 shadow-sm animate-scale-in flex flex-col md:flex-row items-center gap-10">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-400/5 blur-[100px] pointer-events-none" />
        <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-start text-left max-w-xl space-y-6">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-200 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700 shadow-sm">
            <SparklesIcon className="h-3.5 w-3.5" />
            Your Community Repair Assistant
          </p>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Fix it yourself, safely — or find someone local who can.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-lg">
            RepairBuddy helps you repair everyday items, save money, and reduce waste. We check every repair for safety first.
          </p>

          <div className="pt-2 flex flex-col gap-4 w-full mt-2">
            <Button href="/choose-item" className="w-full flex items-center justify-center py-4 shadow-xl shadow-orange-500/20 text-lg transition-all duration-300 ease-out hover:-translate-y-1 active:scale-95 active:shadow-sm">Start a repair</Button>
            <Button href="/scanner" variant="secondary" className="w-full flex items-center justify-center py-4 bg-white border-2 border-slate-200 text-slate-800 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-300 ease-out group shadow-sm text-lg active:scale-95 hover:-translate-y-1">
              <CameraIcon className="h-6 w-6 text-orange-500 mr-2 group-hover:scale-110 transition-transform" />
              Scan an item
            </Button>
          </div>
        </div>

        {/* Real Non-AI Photograph */}
        <div className="relative z-10 w-full flex justify-center mt-6">
          <div className="relative w-full aspect-square sm:max-w-md lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
            {/* Using a high-quality generated photograph representing repair/fixing */}
            <img 
              src="/images/hero.png" 
              alt="Person performing electronics repair safely" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🗺️ How it Works — Image Cards */}
      <section className="space-y-8 animate-slide-up delay-100 px-2">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">How it works</h2>
          <p className="text-slate-600 text-sm font-bold">RepairBuddy takes you from a broken item to a safe fix in four stages.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          {/* Step 1 */}
          <div className="group rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200">
            <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Camera lens for scanning" />
            </div>
            <div className="p-6">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-2">Step 1</span>
              <h3 className="font-black text-slate-900 text-xl mb-2">Choose or Scan Item</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Select a category or snap a photo to automatically locate your item in our database.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200">
            <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Safety equipment" />
            </div>
            <div className="p-6">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-2">Step 2</span>
              <h3 className="font-black text-slate-900 text-xl mb-2">Run Safety Check</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Answer key checklist safety questions regarding chemical, electrical, or structural hazards.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200">
            <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Result checking" />
            </div>
            <div className="p-6">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-2">Step 3</span>
              <h3 className="font-black text-slate-900 text-xl mb-2">Get Safety Result</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Receive a clear safety badge rating (green, yellow, or red) with comprehensive safety guidelines.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="group rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-200">
            <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Repairing" />
            </div>
            <div className="p-6">
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-2">Step 4</span>
              <h3 className="font-black text-slate-900 text-xl mb-2">Repair or Request Help</h3>
              <p className="text-sm text-slate-600 font-bold leading-relaxed">Walk through detailed DIY guides or request certified professional support if needed.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 🍱 Unified Consistent Categories Grid */}
      <section className="space-y-6 animate-slide-up delay-200">
        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight text-slate-800">What are you fixing?</h2>
            <p className="text-slate-500 text-xs font-semibold">Select a category to browse local database items.</p>
          </div>
          <Link href="/choose-item" className="text-xs font-bold text-accent-600 hover:text-accent-500 underline transition-colors flex items-center gap-0.5">
            Browse all <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id] || BoltIcon;
            return (
              <Link
                key={category.id}
                href={`/choose-item?category=${category.id}`}
                className="group rounded-2xl border border-slate-100 bg-white p-5 hover:border-accent-500/20 hover:shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[170px]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-500 border border-accent-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-800 group-hover:text-accent-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed font-semibold">{category.description}</p>
                </div>
                <span className="text-[10px] font-black text-accent-500 mt-4 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Explore category →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 📊 Values Billboard Showcase (Light Mode Asymmetrical) */}
      <section className="space-y-6 animate-slide-up delay-300">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Why repair?</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold font-semibold">Every fix yields positive environmental and economic impact.</p>
        </div>

        <div className="grid gap-4">
          {/* Card 1: Save Money */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-5 flex flex-col justify-between transition-all duration-300 hover:border-emerald-200">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <CurrencyDollarIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Save money</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-semibold">
                Repairs cost a small fraction compared to buying replacement products. Compare expenses using our integrated calculator before making your choice.
              </p>
            </div>
          </div>

          {/* Card 2: Reduce Waste */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/20 p-5 flex flex-col justify-between transition-all duration-300 hover:border-orange-200">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                <GlobeAmericasIcon className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Reduce waste</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-semibold">
                Every single item repaired keeps plastic, metal, and electronic waste out of our municipal landfills. Log your completions to track avoided waste weight.
              </p>
            </div>
          </div>

          {/* Card 3: Support Local */}
          <div className="rounded-2xl border border-sky-100 bg-sky-50/20 p-5 flex flex-col justify-between transition-all duration-300 hover:border-sky-200">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
                <UserGroupIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Support local</h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-semibold">
                If a repair is too advanced or dangerous to complete yourself, we directly link you to local trade freelancers, directories, and repair shops near you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
