import { useState } from "react";
import { Issue } from "../types";
import { MapPin, Search, Filter, ThumbsUp, MessageSquare, Clock, PlusCircle } from "lucide-react";
import MapComponent from "./MapComponent";

interface CitizenHomeProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onNavigate: (view: "landing" | "home" | "dashboard" | "report" | "copilot" | "operations") => void;
  onUpvote: (id: string) => void;
  searchTerm: string;
}

export default function CitizenHome({
  issues,
  onSelectIssue,
  onNavigate,
  onUpvote,
  searchTerm,
}: CitizenHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Issues");

  const categories = ["All Issues", "Emergency", "Infrastructure", "Sanitation", "Utilities", "Landscaping"];

  // Filter issues based on search term and category tag selection
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Issues" ||
      issue.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Category and status badges
  const getSeverityBadgeColor = (severity: "High" | "Medium" | "Low") => {
    switch (severity) {
      case "High":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Low":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  const getSeverityPinColor = (severity: "High" | "Medium" | "Low") => {
    switch (severity) {
      case "High":
        return "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-bounce";
      case "Medium":
        return "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] animate-pulse";
      case "Low":
        return "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative min-h-[calc(100vh-64px)]">
      {/* 65% Interactive Map Section */}
        <section className="flex-[0.65] relative bg-slate-950 overflow-hidden hidden md:block">
         <div className="absolute inset-0 z-0">
  <MapComponent
    lat={21.1458}
    lng={79.0882}
  />

  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-slate-950/40 pointer-events-none" />
</div>

        {/* Floating Category Filter Bar */}
        <div className="absolute top-4 left-6 z-10">
          <div className="bg-[#121214]/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/5 flex space-x-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Statistics Overlay */}
        <div className="absolute bottom-6 left-6 z-10">
          <div className="bg-[#121214]/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/5 flex flex-col space-y-2 w-52 animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Live Statistics
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Active Reports</span>
              <span className="text-lg font-extrabold text-amber-500">
                {issues.filter(i => i.status !== "Resolved").length}
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[72%] transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Interactive Interactive Pins Layer */}
        {filteredIssues.map((issue) => {
          // Approximate layout points across map
          let posStyle = { top: "50%", left: "50%" };
          if (issue.id === "ISS-001") posStyle = { top: "55%", left: "45%" };
          if (issue.id === "ISS-002") posStyle = { top: "35%", left: "28%" };
          if (issue.id === "ISS-003") posStyle = { top: "45%", left: "68%" };
          if (issue.id === "ISS-004") posStyle = { top: "28%", left: "55%" };
          if (issue.id === "ISS-005") posStyle = { top: "22%", left: "75%" };
          if (issue.id === "ISS-006") posStyle = { top: "68%", left: "38%" };

          return (
            <div
              key={issue.id}
              style={posStyle}
              onClick={() => onSelectIssue(issue)}
              className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
            >
              <div className="flex flex-col items-center group">
                <MapPin className={`w-8 h-8 ${getSeverityPinColor(issue.severity)}`} />
                {/* Micro tooltip label */}
                <div className="absolute bottom-8 bg-slate-900 border border-slate-700 text-white text-[10px] font-bold py-1 px-2 rounded shadow-xl whitespace-nowrap scale-0 group-hover:scale-100 transition-all pointer-events-none z-50">
                  {issue.title}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 35% Vertical Feed Panel */}
      <section className="flex-grow md:flex-[0.35] bg-[#0F0F11] border-l border-white/5 flex flex-col overflow-hidden">
        {/* Feed Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#121214]">
          <div>
            <h2 className="text-base font-bold text-white">Local Feed</h2>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              Ward 4 & 5 Manhattan
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {filteredIssues.length} {filteredIssues.length === 1 ? "Issue" : "Issues"}
          </span>
        </div>

        {/* Scrollable feed cards container */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant dark:text-slate-400">
              <Search className="w-8 h-8 stroke-1 mb-2" />
              <p className="text-xs font-bold">No issues found</p>
              <p className="text-[11px] mt-0.5">Try searching for something else or adjust category filters.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-[#121214] p-4 rounded-2xl border border-white/5 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                {/* Top tags */}
                <div className="flex justify-between items-start mb-3" onClick={() => onSelectIssue(issue)}>
                  <span className="bg-white/5 text-white/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {issue.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeColor(issue.severity)}`}>
                      {issue.severity} Severity
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      issue.status === "Resolved" ? "bg-emerald-500" :
                      issue.status === "In Progress" ? "bg-amber-500 animate-pulse" : "bg-red-500"
                    }`} />
                  </div>
                </div>

                {/* Info */}
                <div onClick={() => onSelectIssue(issue)} className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {issue.description}
                  </p>
                  <p className="text-[10px] text-white/30 font-medium">
                    {issue.location}
                  </p>
                </div>

                {/* Card footer: upvotes and details action */}
                <div className="flex items-center justify-between text-white/40 mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-[11px] font-medium">
                    <Clock className="w-3.5 h-3.5 text-white/30" />
                    <span>{issue.timeAgo}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Thumbs up vote */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvote(issue.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        issue.followed
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "text-white/40 border-transparent hover:bg-white/5"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${issue.followed ? "fill-current" : ""}`} />
                      <span>{issue.votes}</span>
                    </button>

                    <button 
                      onClick={() => onSelectIssue(issue)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{issue.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Floating Action Button for reporting issue */}
      <button
        onClick={() => onNavigate("report")}
        className="fixed bottom-6 right-6 md:right-[calc(35%+24px)] z-50 bg-gradient-to-tr from-amber-500 to-orange-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-orange-500/30 hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer animate-in fade-in"
      >
        <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-xs font-bold uppercase tracking-widest">Report Issue</span>
      </button>
    </div>
  );
}
