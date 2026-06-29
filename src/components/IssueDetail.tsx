import React, { useState, useEffect } from "react";
import { Issue, Comment } from "../types";
import { ArrowLeft, Clock, MapPin, Wrench, Cpu, Megaphone, CheckCircle, Send, Plus, Users, ThumbsUp } from "lucide-react";
import MapComponent from "./MapComponent";

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
  onUpvote: (id: string) => void;
  onAddComment: (issueId: string, comment: Comment) => void;
}

export default function IssueDetail({ issue, onBack, onUpvote, onAddComment }: IssueDetailProps) {
  const [newComment, setNewComment] = useState("");
  const [countdown, setCountdown] = useState(issue.slaCountdown);

  // SLA countdown timer simulation
  useEffect(() => {
    if (countdown === "00:00:00" || issue.status === "Resolved") return;

    const parts = countdown.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parseInt(parts[2], 10);

    const timer = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      }

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
      ].join(":");

      setCountdown(formatted);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, issue.status]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: "comment-" + Date.now(),
      user: "Khilendra Porgade",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4KW6rIAOGn3WWCPeNU9t3LK5N9GQ6dbg8MYL8vEfkgGhOmxZHncBqWZcZm5H37BWEMX_uHdmZFLMLfz6qO2FEpOBKKg4urSua-CGXl3SKLfRlRCGpI0xM8pxakgOhTlg6cw4CywVjAiBvB4pZvLUloerdjVnjJLE0-w6gpOHTNhOHvWpXcc0X-PPOOellDt53vkVF5lfP4amSoQnjGweup5YgNrxrD6QUbKnZOOpYA9yUnFmeMmJYuUOJEbGNRAYWhaxncD2yqsH",
      text: newComment.trim(),
      timeAgo: "Just now"
    };

    onAddComment(issue.id, commentObj);
    setNewComment("");
  };

  const renderTimelineIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-amber-500" />;
      case "Megaphone":
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      case "CheckCircle":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex-grow bg-[#0A0A0B] min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* Top Back Action Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Issues
          </button>
          
          <span className="text-[10px] font-mono font-bold text-white/40">
            ID: {issue.id} | Department: {issue.assignedDept}
          </span>
        </div>

        {/* Master Details Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main details content section (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Status Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-white/5 text-white/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {issue.category}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  issue.severity === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  issue.severity === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                }`}>
                  {issue.severity} Priority
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  issue.status === "Resolved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  issue.status === "In Progress" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse" :
                  "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {issue.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                {issue.title}
              </h1>
              <p className="text-xs text-white/40 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {issue.location} &bull; {issue.coordinates}
              </p>
            </div>

            {/* Evidence Image Card */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 shadow-md relative bg-[#121214]">
              <img 
                src={issue.imageUrl} 
                alt={issue.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* AI Summary Block */}
            <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500">
                <Cpu className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  AI Summary & Risk Assessment
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed font-sans">
                {issue.description}
              </p>
            </div>

            {/* Citizen Verification Block */}
            <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Overlapping Avatar Row */}
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiKlZ4mJIbQ9Y2ScmeDf0XwTgim0CI_1WcHVYJPm6sPhskqBrGpMI07WDj7RVlczeFpYo0Pe9H2wy1voCKXyjSldODMCHdUojY6ivQmw8zvqbYI543XeZ0V3KT9lcQRE-fbVNYJ0RhzbWDzHv6b3XkPqPkXIHx0-95DePoT4EbKkB8v51HGBPJR7K0jPnCzgfiB_u3T6TheRTm-wxfSOHKRs3HtxIvZaPsagmRfB6YwVt_POOVnmQpBc-UyjPLFADAaa4xt2wW3O9Q"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121214] object-cover"
                    alt="Citizen Avatar"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuADFk2DXUGNz06ZQHwf-n0-ggg_yy5TZYkYsV1bJ94ECOSuY2yVf1xlFKjXe2OpK7eAkChTgIghYJkF-zcOS_VezSFjxJQXB2haru_ocs9N78yVnj6SHselK4gXz6wswLgIYhxTnKRKNBAgbaO5ROWbBdqQQOlmrkxZVnmnqhRnzpxgB5SQaVo2Ag5LrPl8c8-HR3a_jiO6CFPgSZ6dXjhQaQRitDHyuaKDQSiGnnnT3nDeOKZkeLeOdVHTmf0EwC9rZFN4cntV5cea"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121214] object-cover"
                    alt="Citizen Avatar"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeFmuchrTGVgj_x_b5V-bwFsizno5bs4zMssCXhmBDR5L8ZwFkHqVFZ21ukVNCjLC2VDW7p6mn3OwnSaSLJWDjGG8wGaycHnhQMntVB-FhNzYdw7JErcFIvVWbayk35m0oLAbH1N55rRMIR1GXcHCrqx6HYs0dR-OS3C2JWk-93vqjdEbtsPP2MRsUxALfoDM6YfE40Uz-30cyRoLjU2kE6auLURP_gGYM8hVYVWER2mhUNDVQO8GSymUd-hC3fy78U1T7M6xGqyof"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121214] object-cover"
                    alt="Citizen Avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verified by Citizens</h4>
                  <p className="text-[11px] text-white/40">
                    Sarah Jenkins and {issue.votes - 1} others verified this priority.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onUpvote(issue.id)}
                className={`w-full md:w-auto px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  issue.followed
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-amber-500 text-black hover:bg-amber-400 border-transparent"
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${issue.followed ? "fill-current" : ""}`} />
                {issue.followed ? "Verified" : "Verify This Issue"}
              </button>
            </div>

            {/* Workflow Timeline Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/40">
                Activity Timeline
              </h3>
              <div className="relative border-l border-white/5 pl-6 ml-3 space-y-6">
                {issue.timeline.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Floating circle indicator */}
                    <span className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-[#121214] border border-white/5 flex items-center justify-center shadow-md">
                      {renderTimelineIcon(event.icon)}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">
                          {event.title}
                        </h4>
                        <span className="text-[10px] text-white/40 font-mono">
                          {event.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-white/80">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dialogue Hub comments section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#E2E2E2]">
                Discussion Hub ({issue.comments.length})
              </h3>
              
              <div className="space-y-3">
                {issue.comments.length === 0 ? (
                  <p className="text-xs text-white/40 italic py-2">
                    No comments yet. Be the first to start the discussion!
                  </p>
                ) : (
                  issue.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 bg-[#121214] p-3.5 rounded-2xl border border-white/5 shadow-sm animate-in fade-in duration-200">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/5 shrink-0">
                        <img 
                          src={comment.avatar} 
                          alt={comment.user} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#E2E2E2]">
                            {comment.user}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {comment.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-sans">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleSendComment} className="flex gap-3 pt-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/5 shrink-0 hidden sm:block">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg4KW6rIAOGn3WWCPeNU9t3LK5N9GQ6dbg8MYL8vEfkgGhOmxZHncBqWZcZm5H37BWEMX_uHdmZFLMLfz6qO2FEpOBKKg4urSua-CGXl3SKLfRlRCGpI0xM8pxakgOhTlg6cw4CywVjAiBvB4pZvLUloerdjVnjJLE0-w6gpOHTNhOHvWpXcc0X-PPOOellDt53vkVF5lfP4amSoQnjGweup5YgNrxrD6QUbKnZOOpYA9yUnFmeMmJYuUOJEbGNRAYWhaxncD2yqsH" 
                    alt="User Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow flex gap-2">
                  <input
                    type="text"
                    placeholder="Add to the discussion or report updates..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow bg-[#121214] text-[#E2E2E2] placeholder-white/30 border border-white/5 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-tr from-amber-500 to-orange-600 text-black px-4 py-2 rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right sidebar column info (1/3 width) */}
          <div className="space-y-6">
            
            {/* SLA Countdown Clock */}
            <div className="bg-[#121214] text-white p-5 rounded-2xl border border-white/5 shadow-md flex flex-col space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="flex items-center gap-1.5 text-amber-500">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">SLA Deadline Countdown</span>
              </div>
              <p className="text-3xl font-mono font-extrabold tracking-widest text-amber-500">
                {countdown}
              </p>
              <div className="space-y-1">
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-1000"
                    style={{ width: `${issue.slaPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 font-mono">
                  <span>In Progress</span>
                  <span>Target: 48 hr resolution</span>
                </div>
              </div>
            </div>

            {/* Location & Mini Map Panel */}
           
            <div className="h-40 rounded-xl overflow-hidden border border-white/5">
  
  <MapComponent
  lat={21.1458}
  lng={79.0882}
/>
</div>

            {/* Assigned Officer / Team */}
            <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                Officer In Charge
              </h3>
              <div className="flex items-center gap-3 bg-[#0F0F11] p-3 rounded-xl border border-white/5">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-white/5 shrink-0">
                  <img 
                    src={issue.officer.avatar} 
                    alt={issue.officer.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-extrabold text-white truncate">
                      {issue.officer.name}
                    </h4>
                    {issue.officer.verified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-black flex items-center justify-center text-[8px] font-bold">
                        &check;
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 truncate font-medium">
                    {issue.officer.role}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white/5 hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-white/80 text-center transition-colors cursor-pointer">
                  Request Callback
                </button>
                <button className="bg-white/5 hover:bg-white/10 py-2 rounded-xl text-xs font-bold text-white/80 text-center transition-colors cursor-pointer">
                  Direct Escalation
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
