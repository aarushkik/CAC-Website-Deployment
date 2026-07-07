"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "ai",
      text: "Hi! I'm Hammy, your AI repair assistant. Ask me anything about fixing things, local helper search links, or safety checks! 🛠️🐹",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function getAiResponse(userText: string): string {
    const text = userText.toLowerCase();
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello there! How can I help you repair something today? 🐹";
    }
    if (text.includes("safety") || text.includes("safe") || text.includes("danger") || text.includes("hazard")) {
      return "Safety first! If you see a warning badge (yellow or red) on an item, make sure to read the guidelines. For high voltage wiring, microwaves, or swollen batteries, always get professional help! ⚠️";
    }
    if (text.includes("cost") || text.includes("money") || text.includes("save") || text.includes("price")) {
      return "Repairing instead of replacing is a super choice! On average, repairing saves over 70% compared to buying a replacement. Check out the Calculator tab to see exact calculations! 💰";
    }
    if (text.includes("help") || text.includes("pro") || text.includes("shop") || text.includes("yelp") || text.includes("linkedin")) {
      return "Need local assistance? Click on any item suggestion and select 'Find Professional Help' to instantly search Yelp, Google Maps, or LinkedIn for certified trade technicians! 🔍";
    }
    if (text.includes("clothes") || text.includes("sew") || text.includes("shirt") || text.includes("pants") || text.includes("sock")) {
      return "Clothing repairs are usually very safe (Green rating)! You can sew torn seams, attach buttons, or darn socks. Let me know if you need tips! 🧵";
    }
    if (text.includes("bike") || text.includes("tire") || text.includes("chain") || text.includes("brakes")) {
      return "For bikes, we cover flat tires, squeaky chains, and brake alignments. Make sure handlebars are secure before riding! 🚲";
    }
    return "That sounds like a great repair project! You can search for it in our list of 76+ items, run the safety checker survey, or let me know if you want local professional contact details! 🛠️🐹";
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponseText = getAiResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end select-none">
      
      {/* 💬 Compact Floating Chat Screen */}
      {isOpen && (
        <div className="mb-4 w-[330px] sm:w-[360px] h-[450px] bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0">
                <Image
                  src="/mascot/ai_avatar.png"
                  alt="Hammy AI Avatar"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm leading-tight">Hammy</h4>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto chat-scroll bg-slate-50/50 space-y-3">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAi ? "justify-start" : "justify-end"} items-end gap-2 animate-slide-up`}
                >
                  {isAi && (
                    <div className="relative h-7 w-7 rounded-full border border-slate-100 overflow-hidden bg-white shrink-0">
                      <Image
                        src="/mascot/ai_avatar.png"
                        alt="Hammy AI"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed shadow-sm ${
                      isAi
                        ? "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                        : "bg-gradient-to-r from-accent-500 to-orange-600 text-white rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <div className="relative h-7 w-7 rounded-full border border-slate-100 overflow-hidden bg-white shrink-0">
                  <Image
                    src="/mascot/ai_avatar.png"
                    alt="Hammy AI"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none border border-slate-100 px-3.5 py-3 flex gap-1 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot" />
                </div>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Hammy a question..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-accent-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-accent-500 to-orange-600 text-white shadow-md shadow-orange-500/10 hover:opacity-95 transition-opacity"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 🔮 Circular AI Floating Bubble (Hammy Mascot) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
          isOpen ? "border-accent-500 ring-4 ring-accent-500/10" : ""
        }`}
      >
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src="/mascot/ai_avatar.png"
            alt="AI Hamster helper"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        {/* Glow pulsing ring around the button */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full border-2 border-accent-500/30 animate-ping-slow pointer-events-none" />
        )}
      </button>
    </div>
  );
}
