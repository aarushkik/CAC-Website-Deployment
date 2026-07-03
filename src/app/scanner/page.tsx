"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { items } from "@/lib/data";
import { isDangerousText } from "@/lib/safety";
import { Mascot } from "@/components/Mascot";
import {
  PhotoIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function ScannerPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [dangerWarning, setDangerWarning] = useState(false);
  const [guessIds, setGuessIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setGuessIds(null);
    }
  }

  function analyze() {
    setLoading(true);
    setDangerWarning(false);
    setGuessIds(null);

    // Simulate scanning analysis latency with the hamster mascot spinner
    setTimeout(() => {
      setDangerWarning(isDangerousText(description));

      const words = description.toLowerCase();
      const matches = items
        .filter((item) =>
          item.name
            .toLowerCase()
            .split(/\s+/)
            .some((word) => word.length > 3 && words.includes(word)),
        )
        .map((item) => item.id);

      setGuessIds(matches);
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 px-2 pt-2">
      <div className="text-center space-y-3 px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          AI <span className="text-orange-500">Scanner</span>
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          Capture a photo and describe the problem. We&apos;ll suggest likely matches and run a safety check.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Step 1: Add Photo & Describe */}
        <div className={`rounded-3xl border-2 bg-white p-6 shadow-md flex flex-col gap-6 transition-all duration-500 ${loading ? 'border-orange-400 animate-analyze-pulse' : 'border-slate-200'}`}>
          
          <div className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 text-sm">1</span>
              Add a photo
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50 px-3 py-6 rounded-2xl cursor-pointer text-center transition-all duration-300 group shadow-inner">
                <div className="bg-white p-3 rounded-full shadow-md mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:text-orange-500 text-slate-400">
                  <PhotoIcon className="h-7 w-7 transition-colors" />
                </div>
                <span className="text-sm font-black text-slate-700 group-hover:text-orange-700 transition-colors">Upload</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50 px-3 py-6 rounded-2xl cursor-pointer text-center transition-all duration-300 group shadow-inner">
                <div className="bg-white p-3 rounded-full shadow-md mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:text-orange-500 text-slate-400">
                  <CameraIcon className="h-7 w-7 transition-colors" />
                </div>
                <span className="text-sm font-black text-slate-700 group-hover:text-orange-700 transition-colors">Camera</span>
                <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="sr-only" />
              </label>
            </div>

            {preview && (
              <div className="relative mt-4 p-2 border-2 border-slate-200 bg-slate-50 rounded-2xl flex items-center justify-center max-h-64 overflow-hidden shadow-inner">
                {loading && <div className="scan-line" />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Captured preview" className={`max-h-56 rounded-xl object-contain animate-scale-in shadow-md transition-all duration-500 ${loading ? 'brightness-110 saturate-150' : ''}`} />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 text-sm">2</span>
              Describe problem
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="e.g. My kitchen chair is wobbly, or my desk lamp won't turn on"
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold placeholder-slate-400 rounded-2xl px-5 py-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 shadow-inner"
            />
          </div>

          <button 
            onClick={analyze} 
            disabled={description.trim().length === 0 || loading} 
            className={`w-full flex justify-center items-center gap-2 rounded-2xl border-4 border-black font-black py-4 text-lg transition-all duration-200 mt-2 ${
              loading 
                ? 'bg-orange-600 text-white shadow-none animate-pulse cursor-not-allowed' 
                : 'bg-orange-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-400 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none'
            }`}
          >
            <SparklesIcon className={`h-6 w-6 ${loading ? 'animate-spin text-white' : 'text-black'}`} />
            {loading ? "Analyzing..." : "Analyze item"}
          </button>
        </div>

        {/* Step 2: Suggested Matches */}
        <div className={`rounded-3xl border-2 bg-white p-6 shadow-md min-h-[250px] flex flex-col transition-all duration-500 ${loading ? 'border-orange-300 bg-orange-50/30' : 'border-slate-200'}`}>
          <h2 className="text-xl font-black text-slate-900 mb-6">Suggested Matches</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 flex-1">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 blur-xl opacity-40 animate-pulse scale-150" />
                <Mascot size="xl" variant="scanning" className="relative z-10 animate-look-around" />
              </div>
              <p className="text-base font-black text-orange-600 uppercase tracking-widest mt-4 animate-pulse">Scanning & Analyzing...</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Matching against our database</p>
            </div>
          ) : (
            <>
              {dangerWarning && (
                <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 text-rose-800 flex gap-4 animate-scale-in shadow-sm mb-6">
                  <ExclamationTriangleIcon className="h-8 w-8 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-black text-rose-900 text-base">⚠️ High risk detected</p>
                    <p className="text-sm font-bold text-rose-700 mt-1">
                      This sounds like a dangerous repair. We highly recommend connecting with a professional instead of attempting a DIY fix.
                    </p>
                  </div>
                </div>
              )}

              {guessIds && guessIds.length > 0 && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Likely matches</p>
                  {guessIds.map((id) => {
                    const item = items.find((i) => i.id === id);
                    if (!item) return null;
                    return (
                      <Link
                        key={id}
                        href={`/guide/${id}`}
                        className="group flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 shadow-sm active:scale-95"
                      >
                        <span className="font-black text-slate-800 text-lg group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                           <ArrowRightIcon className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {guessIds && guessIds.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 flex-1 animate-fade-in">
                  <Mascot size="md" variant="sweeping" />
                  <p className="mt-4 text-base font-black text-slate-900">No matching guides found</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">Try rewording your description.</p>
                </div>
              )}

              {!guessIds && !loading && (
                <div className="flex flex-col items-center justify-center py-10 flex-1 opacity-50">
                  <PhotoIcon className="h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-500 text-center max-w-[200px]">
                    Upload a photo and describe the problem to see matches.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
