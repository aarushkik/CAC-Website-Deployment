"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import {
  CameraIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const ONBOARDING_KEY = "repairbuddy_tutorial_complete";

export function OnboardingModal() {
  const { t, language } = useLanguage();
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

  // Pre-translated chat bubble descriptions for Hammy the Hamster
  const hamsterSpeeches: Record<number, Record<string, string>> = {
    0: {
      en: "Welcome to RepairBuddy! I'm Hammy, your community repair guide. I'll help you diagnose problems, search guide tutorials, and track your landfill impact!",
      es: "¡Bienvenido a RepairBuddy! Soy Hammy, tu guía de reparación comunitaria. ¡Te ayudaré a diagnosticar problemas, buscar tutoriales y ver tu impacto de ahorro!",
      zh: "欢迎使用 RepairBuddy！我是小汉（Hammy），您的社区维修助手。我将帮您诊断问题，搜索分步指南，并统计您的环保贡献！",
    },
    1: {
      en: "First, check out the Scan tab! Just upload or snap a photo of any broken device or garment, and my AI scanner will instantly identify it and fetch the right instructions!",
      es: "¡Primero, revisa la pestaña Escanear! ¡Solo sube o toma una foto de cualquier aparato o prenda rota, y mi escáner IA la identificará y buscará las instrucciones correctas!",
      zh: "首先，去看看‘扫描’页面！只需上传或拍摄任何受损电器或衣物的照片，我的AI扫描器就会立即识别它并拉取匹配的修复说明！",
    },
    2: {
      en: "Next, check out the Fix tab! We have a complete step-by-step database of verified instructions. You can check off steps as you complete them to see a dynamic progress bar!",
      es: "¡Luego, revisa la pestaña Reparar! Tenemos una base de datos completa de instrucciones verificadas. ¡Puedes marcar los pasos completados para ver una barra de progreso real!",
      zh: "接着，去看看‘修复’指南！我们拥有完整的已验证分步数据库。您可以逐步打勾确认，查看实时的安全进度条！",
    },
    3: {
      en: "Finally, check out the resources for pro support, or chat with me anytime by clicking my face in the top header. Happy fixing!",
      es: "¡Finalmente, revisa los recursos para soporte profesional, o chatea conmigo cuando quieras haciendo clic en mi cara en el encabezado superior. ¡Feliz reparación!",
      zh: "最后，您可以查看资源库获得专业人员支持，或随时点击顶部栏的我的头像与我聊天。修复快乐！",
    }
  };

  function getHamsterSpeech(stepIndex: number): string {
    return hamsterSpeeches[stepIndex]?.[language] ?? hamsterSpeeches[stepIndex]?.["en"] ?? "";
  }

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-500 p-4 ${
        exiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative z-10 w-full max-w-md">
        
        {/* Step content container: styled with phone margins matching the neo-brutalist theme */}
        <div className="rounded-3xl border-4 border-black bg-[#F8F9FA] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF7A00]" />
          
          <div key={step} className="animate-slide-down-fade space-y-4">
            {/* Mascot Avatar and Bubble Header */}
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-2xl bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative shrink-0">
                <Image
                  src="/mascot/hero.png"
                  alt="Hammy"
                  width={80}
                  height={80}
                  className="object-contain animate-bounce"
                  priority
                />
                <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#00B761] text-[9px] font-black text-white border border-black animate-pulse">
                  ●
                </span>
              </div>

              <div className="flex-1 space-y-1.5 pt-1">
                <h3 className="text-lg font-black text-[#1A2B4C]">Hammy</h3>
                <span className="inline-block bg-[#00B761]/10 text-[#00B761] border border-[#00B761]/20 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                  {language === "es" ? "Asistente Oficial" : language === "zh" ? "官方助手" : "Official Guide"}
                </span>
              </div>
            </div>

            {/* Simulated Chat Bubble explaining the app */}
            <div className="relative bg-white border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] before:absolute before:top-4 before:-left-3.5 before:w-0 before:h-0 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-black">
              <p className="text-sm text-slate-800 leading-relaxed font-black">
                &ldquo;{getHamsterSpeech(step)}&rdquo;
              </p>
            </div>

            {/* Visual simulation overlay for each card */}
            {step === 1 && (
              <div className="bg-[#1A2B4C] rounded-2xl border-2 border-black p-4 text-white text-center shadow-inner flex items-center justify-center gap-3">
                <CameraIcon className="h-6 w-6 text-[#FF7A00]" />
                <span className="text-sm font-black">{t("scanAndDiagnose")}</span>
              </div>
            )}

            {step === 2 && (
              <div className="bg-[#1A2B4C] rounded-2xl border-2 border-black p-4 text-white text-center shadow-inner flex items-center justify-center gap-3">
                <WrenchScrewdriverIcon className="h-6 w-6 text-[#00B761]" />
                <span className="text-sm font-black">{t("guidedFixes")}</span>
              </div>
            )}

            {step === 3 && (
              <div className="bg-emerald-50 border-2 border-[#00B761] rounded-2xl p-4 text-[#00B761] text-center flex items-center justify-center gap-3">
                <CheckCircleIcon className="h-6 w-6" />
                <span className="text-sm font-black">{t("youreAllSet")}</span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-4 border-t-2 border-dashed border-slate-300 flex justify-between items-center">
              {step > 0 ? (
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="text-sm font-black text-slate-500 hover:text-black border-2 border-transparent hover:border-black rounded-lg px-4 py-2 transition-colors"
                >
                  {t("back")}
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF7A00] border-2 border-black px-6 py-3 font-black text-white text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E06C00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  {t("next")}
                  <ArrowRightIcon className="h-3.5 w-3.5 stroke-[3px]" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00B761] border-2 border-black px-7 py-3 font-black text-white text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00A155] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <SparklesIcon className="h-4 w-4" />
                  {t("startRepairing")}
                </button>
              )}
            </div>

          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-[#FF7A00]" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
