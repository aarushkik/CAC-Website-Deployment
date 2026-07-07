"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, use, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useLanguage } from "@/lib/LanguageContext";
import { guides, getGuide } from "@/lib/data";
import {
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  ListBulletIcon,
  CalculatorIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

export default function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const guide = getGuide(id);
  
  const { t, language } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!guide) notFound();

  const progressPercent = guide.steps.length > 0 
    ? Math.round((completedSteps.length / guide.steps.length) * 100) 
    : 0;

  function toggleStep(index: number) {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((stepIndex) => stepIndex !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  }

  // Pre-translated strings for step guides
  const guideTexts: Record<string, Record<string, string>> = {
    "readBeforeStart": {
      es: "Leer antes de comenzar",
      zh: "开始前必读",
      en: "Read before you start"
    },
    "findHelp": {
      es: "si algo parece inseguro o diferente, detente y busca ayuda profesional.",
      zh: "如果觉得不安全或步骤不符，请停止并寻找专业帮助。",
      en: "If anything feels unsafe or looks different from these steps, stop and find professional help."
    },
    "whatYouNeed": {
      es: "Lo que necesitarás",
      zh: "您需要的工具",
      en: "What you'll need"
    },
    "stepGuide": {
      es: "Guía paso a paso",
      zh: "分步维修指南",
      en: "Step-by-Step Guide"
    },
    "readyWrap": {
      es: "¿Listo para terminar?",
      zh: "准备好结束了吗？",
      en: "Ready to wrap up?"
    },
    "readyWrapDesc": {
      es: "¡Excelente trabajo llegando hasta aquí! Cuando termines la reparación, regístrala para ver tu impacto de ahorro.",
      zh: "太棒了！完成修理后，记得在仪表盘中记录它，以便我们统计您的环境贡献和节省的资金！",
      en: "Awesome job getting this far! Once you complete the repair, make sure to log it in your private dashboard so we can track the landfill waste and money you saved!"
    },
    "logRepair": {
      es: "Lo logré — registrar esta reparación",
      zh: "我修好了 — 记录此项修理",
      en: "I did it — log this repair"
    },
    "compareFix": {
      es: "Comparar reparación vs reemplazo",
      zh: "对比修理与重置费用",
      en: "Compare fix vs. replace"
    },
    "shop": {
      es: "Comprar",
      zh: "购买",
      en: "Shop"
    }
  };

  function getGuideText(key: string): string {
    return guideTexts[key]?.[language] ?? guideTexts[key]?.["en"] ?? key;
  }

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in relative pb-16">
      
      {/* 📊 Safety Amber Progress Bar Sticky Top */}
      <div className="sticky top-[80px] left-0 right-0 z-40 bg-white border-b-4 border-black p-3 -mx-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/choose-item" className="p-1 rounded-lg border-2 border-black hover:bg-slate-50 transition-colors">
            <ChevronLeftIcon className="h-5 w-5 text-black stroke-[3px]" />
          </Link>
          <span className="text-xs font-black text-[#212529] uppercase tracking-wider">
            {language === "es" ? "Paso" : language === "zh" ? "步骤" : "Step"} {completedSteps.length} {language === "es" ? "de" : language === "zh" ? "共" : "of"} {guide.steps.length}
          </span>
        </div>
        <div className="flex-1 max-w-xs mx-4 bg-slate-200 h-4 border-2 border-black rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#FF7A00] transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-sm font-black text-[#FF7A00] whitespace-nowrap">
          {progressPercent}%
        </span>
      </div>

      {/* Title Header */}
      <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A2B4C] leading-tight">
          {guide.title}
        </h1>
        <div className="flex flex-wrap gap-2.5 text-xs font-black uppercase tracking-wider">
          <span className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#F8F9FA] px-3.5 py-1.5 text-[#212529] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ClockIcon className="h-4 w-4 text-[#FF7A00] stroke-[2.5px]" />
            {guide.time}
          </span>
          <span className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#F8F9FA] px-3.5 py-1.5 text-[#212529] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <AcademicCapIcon className="h-4 w-4 text-[#FF7A00] stroke-[2.5px]" />
            {guide.difficulty}
          </span>
        </div>
      </div>

      {/* 🛑 Safety Warnings: A bright variation of the orange/red for any warnings so they absolutely cannot be missed */}
      <div className="rounded-3xl border-4 border-black bg-[#FFE5E5] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF3333]" />
        <div className="flex items-center gap-3 mb-3 mt-1">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FF3333] border-2 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ExclamationTriangleIcon className="h-6 w-6 text-white stroke-[2.5px]" />
          </div>
          <h2 className="text-lg font-black text-[#FF3333] uppercase tracking-wide">
            {getGuideText("readBeforeStart")}
          </h2>
        </div>
        <ul className="list-inside list-disc space-y-2 text-sm text-[#212529] font-bold leading-relaxed">
          {guide.safetyTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-rose-800 leading-relaxed font-black uppercase tracking-wide">
          {getGuideText("findHelp")}
        </p>
      </div>

      {/* Tools vs Steps Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr,2fr]">
        
        {/* Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <BriefcaseIcon className="h-5 w-5 text-[#FF7A00]" />
            <h2 className="text-lg font-black text-[#212529]">{getGuideText("whatYouNeed")}</h2>
          </div>
          <ul className="space-y-3">
            {guide.tools.map((tool, i) => {
              const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(tool)}`;
              return (
                <li key={i} className="flex items-center justify-between gap-4 p-4 rounded-2xl border-4 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-black text-[#212529] text-sm">{tool}</span>
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-black bg-[#FF7A00] border-2 border-black rounded-lg px-2.5 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E06C00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 shrink-0"
                    title={`Search for "${tool}" on Amazon`}
                  >
                    <ShoppingBagIcon className="h-3.5 w-3.5 text-black stroke-[2.5px]" />
                    {getGuideText("shop")}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Steps Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ListBulletIcon className="h-5 w-5 text-[#FF7A00]" />
            <h2 className="text-lg font-black text-[#212529]">{getGuideText("stepGuide")}</h2>
          </div>
          <ol className="border-4 border-black bg-white rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] divide-y-4 divide-black">
            {guide.steps.map((step, i) => {
              const isDone = completedSteps.includes(i);
              return (
                <li 
                  key={i} 
                  onClick={() => toggleStep(i)}
                  className={`flex gap-5 p-6 hover:bg-[#F8F9FA] transition-all cursor-pointer select-none group relative ${isDone ? 'bg-emerald-50/50' : ''}`}
                >
                  <button 
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 border-black font-black text-sm transition-all duration-300 ${
                      isDone 
                        ? 'bg-[#00B761] text-white shadow-none' 
                        : 'bg-[#F8F9FA] text-[#212529] group-hover:bg-[#FF7A00] group-hover:text-white group-hover:scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </button>
                  <div className="flex-1">
                    <p className={`font-black text-base transition-colors ${isDone ? 'text-slate-500 line-through' : 'text-[#212529]'}`}>
                      {step.title}
                    </p>
                    <p className={`text-sm mt-1.5 leading-relaxed font-bold transition-colors ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Completion Section */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-black bg-[#F8F9FA] p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-[#1A2B4C] tracking-tight leading-tight">
            {getGuideText("readyWrap")}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-bold">
            {getGuideText("readyWrapDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link 
              href="/log" 
              className="w-full sm:w-auto px-8 py-4 bg-[#FF7A00] border-4 border-black text-white font-black text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E06C00] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <ClipboardDocumentCheckIcon className="h-5 w-5 stroke-[2.5px]" />
              {getGuideText("logRepair")}
            </Link>
            <Link 
              href="/calculator" 
              className="w-full sm:w-auto px-8 py-4 bg-white border-4 border-black text-black font-black text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <CalculatorIcon className="h-5 w-5 text-black stroke-[2.5px]" />
              {getGuideText("compareFix")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
