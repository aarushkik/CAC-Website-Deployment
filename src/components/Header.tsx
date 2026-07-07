"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  WrenchScrewdriverIcon, 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  GlobeAltIcon,
  XMarkIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export function Header() {
  const { t, changeLanguage, language } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "hamster" | "user"; text: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize hamster greetings based on selected language
  useEffect(() => {
    const greeting = language === "es" 
      ? "¡Hola! ¡Soy Hammy, tu asistente de RepairBuddy! ¡Pregúntame cualquier cosa sobre reparaciones!"
      : language === "zh"
      ? "您好！我是小汉，您的 RepairBuddy 助手！问我任何关于维修的问题吧！"
      : "Hello! I'm Hammy, your RepairBuddy assistant! Ask me any questions about fixing things safely!";
    
    setMessages([{ sender: "hamster", text: greeting }]);
  }, [language]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#1A2B4C]/95 backdrop-blur-md border-b border-white/10 pb-2.5 pt-3 px-4 flex flex-col gap-2 shadow-lg">
      {/* Top Row: AI Helper and Animated Search */}
      <div className={`flex items-center justify-between w-full gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'h-12' : 'h-9'}`}>
        {/* AI Helper Hamster Button */}
        {!isSearchOpen && (
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center justify-center rounded-full bg-white/10 border-2 border-orange-500/30 p-1 text-[10px] font-black text-white transition-all duration-300 active:scale-90 whitespace-nowrap shadow-md hover:shadow-orange-500/10 shrink-0 h-9 w-9"
          >
            {/* Hamster face in AI Helper */}
            <img src="/mascot/ai_avatar.png" className="h-6 w-6 rounded-full object-contain shrink-0" alt="Hammy" />
          </button>
        )}

        {/* Right side controls: Search and Language */}
        <div className={`flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'w-full' : 'w-auto ml-auto'}`}>
          {/* Globe/Language Button */}
          {!isSearchOpen && (
            <button
              onClick={changeLanguage}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shrink-0"
              title="Change Language"
            >
              <GlobeAltIcon className="h-5 w-5 text-white stroke-[2.5px]" />
            </button>
          )}

          {/* Search Bar / Icon */}
          <div className={`relative flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isSearchOpen ? 'w-full h-12 bg-[#FF7A00]/90 rounded-2xl shadow-lg border border-[#FF7A00]/60 shadow-orange-500/20' : 'w-9 h-9 bg-white/10 rounded-full hover:bg-white/20 border border-white/5'}`}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ${isSearchOpen ? 'h-12 w-12 text-white' : 'text-white hover:scale-110'}`}
            >
              <MagnifyingGlassIcon className={`transition-all duration-500 ${isSearchOpen ? 'h-6 w-6' : 'h-5 w-5'}`} />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              placeholder={t("searchPlaceholderHeader")} 
              onBlur={() => setIsSearchOpen(false)}
              className={`bg-transparent text-white !text-white caret-white placeholder-white/70 outline-none font-bold transition-all duration-500 ${isSearchOpen ? 'w-full pr-4 text-base opacity-100' : 'w-0 opacity-0 text-xs'}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Name */}
      <div className={`transition-all duration-500 ${isSearchOpen ? 'opacity-0 -translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative flex items-center justify-between'}`}>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm sm:text-base font-black tracking-tight group w-fit"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FF7A00] border border-white/20 text-white shadow-sm transition-all duration-300 group-hover:scale-110">
            <WrenchScrewdriverIcon className="h-4.5 w-4.5" />
          </div>
          <span className="font-black text-white transition-colors">
            {language === "en" ? (
              <>
                Repair<span className="text-gradient">Buddy</span>
              </>
            ) : (
              t("repairBuddy")
            )}
          </span>
        </Link>
      </div>

      {/* Hamster dropdown chat container */}
      {isChatOpen && (
        <div className="absolute top-[100%] left-0 right-0 z-50 bg-[#1A2B4C]/95 backdrop-blur-md border-b border-t border-white/10 p-4 text-white shadow-2xl flex flex-col gap-3 h-[460px] max-h-[460px] animate-slide-down">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00B761] inline-block animate-pulse" />
              {language === "es" ? "Chateando con Hammy" : language === "zh" ? "与小汉聊天中" : "Chatting with Hammy"}
            </span>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
            </button>
          </div>

          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-bold leading-normal max-h-[300px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.sender === 'hamster' ? (
                  <img src="/mascot/ai_avatar.png" className="h-8 w-8 object-contain rounded-xl bg-white/10 border border-white/20 p-0.5 shrink-0 shadow-sm" alt="Hammy" />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-[#FF7A00] border border-white/20 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    U
                  </div>
                )}
                <div className={`p-3 rounded-2xl border border-white/10 max-w-[75%] ${m.sender === 'user' ? 'bg-[#FF7A00]/80 text-white shadow-md' : 'bg-white/10 text-white shadow-md'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (chatInput.trim().length === 0) return;
              const userText = chatInput;
              setMessages((prev) => [...prev, { sender: "user", text: userText }]);
              setChatInput("");
              
              setTimeout(() => {
                const words = userText.toLowerCase();
                let reply = language === "es"
                  ? "¡Eso suena como un gran proyecto! Intenta buscar conexiones sueltas, limpia el polvo o busca en la pestaña Reparar."
                  : language === "zh"
                  ? "这听起来是个有趣的维修项目！试试检查接口连接，清理灰尘，或者去‘修复’页面查看教程！"
                  : "That sounds like an interesting fix! Try looking for loose hardware, clean any dusty components, or ask a verified Pro in the Marketplace tab!";
                
                if (words.includes("toast") || words.includes("tostad") || words.includes("面包")) {
                  reply = language === "es"
                    ? "¿Problemas de calentamiento del tostador? ¡Desenchúfalo primero! Luego limpia la bandeja de migas."
                    : language === "zh"
                    ? "烤面包机加热故障？请先拔掉电源！清理底部的面包屑托盘，碎屑堆积会妨碍安全加热！"
                    : "Toaster heating issues? Unplug first! Then clear out the bottom crumb tray. A build-up of crumbs can stop heating filaments from functioning safely.";
                } else if (words.includes("zip") || words.includes("crema") || words.includes("tela") || words.includes("拉链")) {
                  reply = language === "es"
                    ? "Para cierres atascados, frota cera de vela o grafito de lápiz en los dientes. ¡Lubricará el cierre!"
                    : language === "zh"
                    ? "拉链卡住了？用铅笔芯石墨或蜡烛涂抹拉链齿，可以润滑拉链！如果是衣物破损，请看‘缝补’教程。"
                    : "For zipper fixes, try rubbing a graphite pencil or candle wax along the teeth to lubricate it. For fabric tears, check the sewing guide!";
                } else if (words.includes("wire") || words.includes("cable") || words.includes("electr") || words.includes("电线")) {
                  reply = language === "es"
                    ? "¡Peligro! Los cables pelados son de alto riesgo. Nunca uses cinta adhesiva en cables de alto voltaje."
                    : language === "zh"
                    ? "警报！破损电线非常危险。千万不要用普通胶带粘高压线。请在服务中心联系认证专家！"
                    : "Warning! Frayed wires are dangerous. Never tape a high-voltage cord. If a cord is broken, seek professional help from the Marketplace!";
                } else if (words.includes("bike") || words.includes("bici") || words.includes("rued") || words.includes("自行车")) {
                  reply = language === "es"
                    ? "¿Neumático desinflado? Sumerge la cámara en agua para buscar burbujas de aire y usa un parche de reparación."
                    : language === "zh"
                    ? "自行车爆胎？将内胎浸入水中看气泡来找破口。使用补胎工具包贴上胶布修好它！"
                    : "Flat tire? Submerge the inner tube in water to find leaks by watching for bubbles. Use a patch kit to fix it!";
                }
                setMessages((prev) => [...prev, { sender: "hamster", text: reply }]);
              }, 800);
            }} 
            className="flex items-center gap-2 mt-1"
          >
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === "es" ? "Pregúntale a Hammy..." : language === "zh" ? "向小汉提问..." : "Ask Hammy a question..."} 
              className="flex-1 bg-white/10 text-white font-black placeholder-white/30 text-xs px-3.5 py-2.5 rounded-xl border border-white/20 focus:border-[#FF7A00]/50 focus:outline-none"
            />
            <button type="submit" className="bg-[#FF7A00] hover:bg-[#E06C00] border border-white/10 p-2.5 rounded-xl text-white shadow-md active:translate-y-0.5 transition-all">
              <ArrowRightIcon className="h-4.5 w-4.5 stroke-[3px]" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
