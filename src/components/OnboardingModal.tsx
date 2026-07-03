"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CameraIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";

const ONBOARDING_KEY = "repairbuddy_tutorial_complete";

export function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) setShow(true);
    } catch { /* noop */ }
  }, []);

  function finish() {
    setExiting(true);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch { /* noop */ }
    setTimeout(() => setShow(false), 500);
  }

  if (!show) return null;

  const totalSteps = 4; // Welcome, Scan, Fix, Ready

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-500 p-4 ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2.5 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-orange-500 shadow-sm"
                  : i < step
                  ? "w-2 bg-orange-300"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Step content container */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 sm:p-12 shadow-2xl space-y-6 overflow-hidden">
          
          {/* We use key={step} so React remounts the div, triggering the slide-down animation every time! */}
          <div key={step} className="animate-slide-down-fade">
            
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <div className="relative mx-auto h-28 w-28 animate-bounce">
                  <Image
                    src="/mascot/hero.png"
                    alt="RepairBuddy mascot"
                    width={112}
                    height={112}
                    className="object-contain"
                    priority
                  />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Welcome to <span className="text-orange-500">RepairBuddy</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                  Your personal AI assistant for fixing everyday items safely and saving money. Let&apos;s show you around!
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-10 py-4 font-bold text-white text-lg shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Let&apos;s Go!
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 1: Scan & Diagnose */}
            {step === 1 && (
              <div className="space-y-6 text-center">
                {/* Visual UI Pointer Simulation */}
                <div className="mx-auto w-fit relative bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-2xl mb-8 mt-2">
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-700 shadow-sm font-bold opacity-80 scale-95">
                    <CameraIcon className="h-4.5 w-4.5 text-orange-500" />
                    Scan an item
                  </div>
                  {/* Animated Cursor clicking the button */}
                  <div className="absolute top-1/2 left-1/2 animate-cursor-click z-10 drop-shadow-md text-orange-600">
                    <CursorArrowRaysIcon className="h-10 w-10 fill-white" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Step 1: Scan & Diagnose</h2>
                <p className="text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Got a broken item? Look for the <strong>Scan an item</strong> button. Our AI will instantly identify the problem, check for safety hazards, and tell you if it&apos;s safe to DIY.
                </p>
                <div className="mt-8 pt-6 flex justify-between items-center border-t border-slate-100">
                  <button onClick={() => setStep(0)} className="text-base font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-8 py-3 font-bold text-white text-base shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Get Guided Fixes */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                {/* Visual UI Pointer Simulation */}
                <div className="mx-auto w-fit relative bg-orange-50 border-2 border-dashed border-orange-200 p-6 rounded-2xl mb-8 mt-2">
                  <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 px-6 py-3.5 font-bold opacity-90 scale-95">
                    Start a repair
                  </div>
                  {/* Animated Cursor clicking the button */}
                  <div className="absolute top-1/2 left-1/2 animate-cursor-click z-10 drop-shadow-md text-orange-600">
                    <CursorArrowRaysIcon className="h-10 w-10 fill-white" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Step 2: Guided Fixes</h2>
                <p className="text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Click <strong>Start a repair</strong> to manually search our database of fixes! Follow our step-by-step tutorials to fix your items safely.
                </p>
                <div className="mt-8 pt-6 flex justify-between items-center border-t border-slate-100">
                  <button onClick={() => setStep(1)} className="text-base font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-8 py-3 font-bold text-white text-base shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Ready */}
            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-500 mb-6 shadow-inner animate-pulse">
                  <CheckCircleIcon className="h-12 w-12" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  You&apos;re all set!
                </h2>
                <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto font-medium">
                  You can chat with our AI Hamster assistant anytime using the button in the bottom corner if you have questions!
                </p>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={finish}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-8 py-4 font-bold text-white text-lg shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <SparklesIcon className="h-6 w-6" />
                    Start Repairing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
