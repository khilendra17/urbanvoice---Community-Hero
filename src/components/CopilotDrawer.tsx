import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Bolt, Send, Sparkles, User, Check, AlertCircle, Wrench, RefreshCw, Cpu } from "lucide-react";

interface CopilotDrawerProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export default function CopilotDrawer({ messages, onSendMessage }: CopilotDrawerProps) {
  const [inputText, setInputText] = useState("");
  const [dispatchStates, setDispatchStates] = useState<{ [key: string]: "idle" | "loading" | "complete" }>({
    r1: "idle",
    r2: "idle",
    r3: "idle"
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to latest messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleDispatch = (recId: string) => {
    setDispatchStates((prev) => ({ ...prev, [recId]: "loading" }));
    setTimeout(() => {
      setDispatchStates((prev) => ({ ...prev, [recId]: "complete" }));
    }, 2000);
  };

  return (
    <div className="flex-grow bg-[#0A0A0B] text-[#E2E2E2] min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-3">
      
      {/* 2/3 Conversational AI Panel */}
      <section className="lg:col-span-2 flex flex-col justify-between h-[calc(100vh-64px)] border-r border-white/5">
        
        {/* Chat Panel Header */}
        <div className="p-4 border-b border-white/5 bg-[#0F0F11]/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold tracking-tight text-white">Civic AI Advisor</h2>
              <span className="bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                Active Grounding
              </span>
            </div>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              Optimizing municipal routing & predictive maintenance feeds
            </p>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-3xl animate-in fade-in duration-200 ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Profile image icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                msg.sender === "user"
                  ? "bg-white/10 text-white"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
              }`}>
                {msg.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Cpu className="w-4 h-4 text-amber-500" />
                )}
              </div>

              {/* Message text bubble container */}
              <div className={`space-y-1.5 rounded-2xl p-4 text-xs font-medium md:text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-amber-500 text-black rounded-tr-none font-bold"
                  : "bg-[#121214] border border-white/5 text-[#E2E2E2] rounded-tl-none leading-relaxed"
              }`}>
                {msg.sender === "copilot" && msg.isInsight && (
                  <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2">
                    <Sparkles className="w-3 h-3" />
                    Insight Suggestion
                  </div>
                )}
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div className="text-[9px] text-right text-white/30 font-mono mt-2">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing state */}
          {messages[messages.length - 1]?.sender === "user" && (
            <div className="flex gap-4 max-w-3xl animate-pulse">
              <div className="w-8 h-8 rounded-full shrink-0 bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-500" />
              </div>
              <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center space-x-1.5 h-10">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce duration-300 delay-75"></span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce duration-300 delay-150"></span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce duration-300 delay-300"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Message Input Box Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-[#0F0F11] border-t border-white/5 flex gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot for local risk reports, stats, or dispatch suggestions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow bg-[#121214] text-[#E2E2E2] placeholder-white/30 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-tr from-amber-500 to-orange-600 text-black px-5 py-3 rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </section>

      {/* 1/3 Intelligent Actionable Advisor sidebar */}
      <section className="bg-[#0F0F11]/60 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Civic Advisor Queue
            </h2>
            <p className="text-xs text-white/40">
              Real-time resource recommendations powered by UrbanVoice AI
            </p>
          </div>

          <div className="space-y-4">
            {/* Recommendation A */}
            <div className="bg-[#121214] p-4 rounded-2xl border border-white/5 space-y-3 shadow-sm hover:border-amber-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="bg-amber-500/10 text-amber-500 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Resource Optimization
                </span>
                <span className="text-[10px] text-white/30 font-mono font-bold">Priority: Critical</span>
              </div>
              <h3 className="text-xs font-bold text-white">Re-route Crew B to Sector 7</h3>
              <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                Multiple blocked drains reported within 400m block. Rerouting Crew B from routine mowing reduces estimated flood risk by 42%.
              </p>
              
              {dispatchStates.r1 === "idle" && (
                <button
                  onClick={() => handleDispatch("r1")}
                  className="w-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black py-2 rounded-xl font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Dispatch Team
                </button>
              )}
              {dispatchStates.r1 === "loading" && (
                <button
                  disabled
                  className="w-full bg-[#1A1A1C] text-white/30 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Optimizing Route...
                </button>
              )}
              {dispatchStates.r1 === "complete" && (
                <div className="w-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Team Dispatched Successfully
                </div>
              )}
            </div>

            {/* Recommendation B */}
            <div className="bg-[#121214] p-4 rounded-2xl border border-white/5 space-y-3 shadow-sm hover:border-amber-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="bg-orange-500/10 text-orange-400 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Predictive Maintenance
                </span>
                <span className="text-[10px] text-white/30 font-mono font-bold">Priority: Moderate</span>
              </div>
              <h3 className="text-xs font-bold text-white">Inspect Pump Station 12</h3>
              <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                Thermal sensors register elevated friction ratios on Primary Turbine B. Recommended preemptive inspection within 48h to avoid shutoff.
              </p>
              
              {dispatchStates.r2 === "idle" && (
                <button
                  onClick={() => handleDispatch("r2")}
                  className="w-full bg-white/5 hover:bg-white/10 text-[#E2E2E2] py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Approve Inspection
                </button>
              )}
              {dispatchStates.r2 === "loading" && (
                <button
                  disabled
                  className="w-full bg-[#1A1A1C] text-white/30 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Booking Inspector...
                </button>
              )}
              {dispatchStates.r2 === "complete" && (
                <div className="w-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Approved (Inspection #49)
                </div>
              )}
            </div>

            {/* Recommendation C */}
            <div className="bg-[#121214] p-4 rounded-2xl border border-white/5 space-y-3 shadow-sm hover:border-amber-500/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="bg-red-500/10 text-red-400 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Community Engagement
                </span>
                <span className="text-[10px] text-white/30 font-mono font-bold">Priority: Low</span>
              </div>
              <h3 className="text-xs font-bold text-white">Auto-Update Sector 4 Alerts</h3>
              <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                Compile active utility outages reports into a single neighborhood alert broadcast. Increases transparency and reduces redundant report logs.
              </p>
              
              {dispatchStates.r3 === "idle" && (
                <button
                  onClick={() => handleDispatch("r3")}
                  className="w-full bg-white/5 hover:bg-white/10 text-[#E2E2E2] py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Publish Update
                </button>
              )}
              {dispatchStates.r3 === "loading" && (
                <button
                  disabled
                  className="w-full bg-[#1A1A1C] text-white/30 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Broadcasting Broadcasts...
                </button>
              )}
              {dispatchStates.r3 === "complete" && (
                <div className="w-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Alert Broadcasted Live
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-white/20 font-mono mt-6 text-center">
          UrbanVoice Intelligent System. Secured & Closed Feedback Loop.
        </div>
      </section>

    </div>
  );
}
