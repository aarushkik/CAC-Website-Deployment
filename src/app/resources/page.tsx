"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { useLocation } from "@/hooks/useLocation";
import {
  SparklesIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function ResourcesPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const { city, loading, error, requestGeoLocation, setManualCity } = useLocation();
  const [manualInput, setManualInput] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  const defaultProQueries = ["Appliance Repair", "Electronics Repair", "Bicycle Mechanic", "Furniture Repair"];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-center space-y-3 pt-2 px-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Local repair <span className="text-gradient">help</span>
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          Find trusted shops, repair cafes, and certified trade professionals in your neighborhood.
        </p>
      </div>

      {/* 📍 Geolocation Section */}
      <section className="px-2">
        <div className="rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden flex flex-col animate-pop-in">
          {/* Header Image */}
          <div className="h-32 w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
              alt="Map and navigation" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/70 to-transparent flex items-end p-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <MapPinIcon className="h-6 w-6 text-orange-300" />
                Service Locator
              </h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {city ? (
              <p className="text-base text-slate-700 font-bold bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                Current location: <br/><strong className="text-orange-600 font-black text-2xl">{city}</strong>
              </p>
            ) : (
              <p className="text-sm text-slate-600 font-bold">
                Identify your neighborhood to filter local directories and professional services.
              </p>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={requestGeoLocation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 px-6 py-4 text-lg font-black text-white transition-all duration-300 ease-out disabled:opacity-50 active:scale-90 hover:-translate-y-1"
              >
                {loading ? "Locating..." : "Auto-Detect Location"}
              </button>
              
              <div className="flex items-center rounded-2xl border-2 border-slate-200 bg-slate-50 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/20 transition-all duration-300 overflow-hidden shadow-inner">
                <input
                  type="text"
                  placeholder="Enter Zip or City"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full bg-transparent px-5 py-4 text-slate-800 font-bold text-base focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (manualInput.trim()) {
                      setManualCity(manualInput.trim());
                      setManualInput("");
                    }
                  }}
                  className="bg-slate-200 text-slate-800 hover:bg-slate-300 px-6 py-4 font-black transition-colors"
                >
                  Set
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-rose-500 font-bold text-center">{error}</p>}
          </div>
        </div>
      </section>

      {/* 🔍 Real Pro Search Links */}
      {city && (
        <section className="space-y-4 animate-slide-up delay-75 px-2">
          <h3 className="text-2xl font-black text-slate-900 px-2">Professionals in {city}</h3>
          <div className="flex flex-col gap-3">
            {defaultProQueries.map((query) => {
              const searchLoc = city || "me";
              const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${query} near ${searchLoc}`)}`;
              return (
                <a
                  key={query}
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-5 hover:bg-orange-50 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <MagnifyingGlassIcon className="h-6 w-6" />
                    </div>
                    <span className="font-black text-slate-800 text-lg group-hover:text-orange-700 transition-colors">
                      {query}
                    </span>
                  </div>
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-400 group-hover:text-orange-500" />
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 🌍 Expanding Network Announcement */}
      <section className="px-2">
        <div className="relative overflow-hidden rounded-3xl border-2 border-orange-200 bg-orange-50 shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-orange-200/50 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          <div className="relative z-10 p-6 space-y-6">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white border border-orange-200 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-600 shadow-sm">
                <SparklesIcon className="h-4 w-4" />
                Coming Soon
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                Localized directories!
              </h2>
              <p className="text-slate-700 text-sm font-bold leading-relaxed">
                We are curating a list of vetted local repair cafes and trade professionals. Sign up to get notified when we launch resources in your city!
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-slate-400">
                    <EnvelopeIcon className="h-6 w-6" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-14 pr-5 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 text-base shadow-inner"
                  />
                </div>
                <button type="submit" className="w-full rounded-2xl bg-slate-900 hover:bg-black shadow-lg px-6 py-4 text-base font-black text-white transition-all duration-300 ease-out active:scale-95 hover:-translate-y-1">
                  Keep me updated
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 p-5 text-emerald-900 animate-scale-in shadow-sm">
                <CheckCircleIcon className="h-8 w-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-black text-base">Subscribed!</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">We&apos;ll keep you posted.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🛠️ Trade Programs Info */}
      <section className="space-y-6 px-2 pb-12 animate-slide-up delay-100">
        <h3 className="text-2xl font-black text-slate-900 px-2">Community Programs</h3>
        <div className="flex flex-col gap-6">
          
          <div className="group rounded-3xl border-2 border-slate-200 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-300 flex flex-col h-full">
            <div className="h-40 w-full relative overflow-hidden bg-slate-200">
               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Trade education" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner">
                <AcademicCapIcon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Trade Education & CTE</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-bold mb-6">
                Interested in professional repair skills? Trade Dual Credits link high school students directly to college credit programs.
              </p>
              <a
                href="https://www.clark.edu/academics/hs-dual-credit/cte/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full inline-flex items-center justify-center rounded-2xl bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-4 text-base font-black transition-all duration-300 shadow-sm active:scale-95"
              >
                Explore Programs
              </a>
            </div>
          </div>

          <div className="group rounded-3xl border-2 border-slate-200 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-orange-300 flex flex-col h-full">
            <div className="h-40 w-full relative overflow-hidden bg-slate-200">
               <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Community Repair" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner">
                <WrenchScrewdriverIcon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Start a Repair Cafe</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-bold mb-6">
                Can&apos;t find a repair center nearby? You can organize your own local Repair Cafe! Bring neighbors together and fix items side-by-side.
              </p>
              <a
                href="https://www.repaircafe.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full inline-flex items-center justify-center rounded-2xl bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white px-6 py-4 text-base font-black transition-all duration-300 shadow-sm active:scale-95"
              >
                Learn More
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
