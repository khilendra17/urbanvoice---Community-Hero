import { useState } from "react";
import { Issue } from "../types";
import { ShieldCheck, Clock, CheckCircle, Wrench, AlertTriangle, Play, Check, ChevronRight } from "lucide-react";

interface MunicipalConsoleProps {
  cityHealthScore?: number;
  issues: Issue[];
  onUpdateStatus: (id: string, status: "Pending" | "In Progress" | "Resolved") => void;
  onSelectIssue: (issue: Issue) => void;
}

export default function MunicipalConsole({ issues, onUpdateStatus, onSelectIssue }: MunicipalConsoleProps) {
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All");

  const departments = ["All Departments", "Road Maintenance", "Electrical Services", "Sanitation Dept", "Sidewalk Division"];

  const filteredIssues = issues.filter((issue) => {
    const matchesDept = deptFilter === "All Departments" || issue.assignedDept === deptFilter;
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: "Pending" | "In Progress" | "Resolved") => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "In Progress":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      default:
        return "bg-white/5 text-white/40";
    }
  };

  return (
    <div className="flex-grow bg-[#0A0A0B] text-[#E2E2E2] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* Header Block */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Municipal Operations Console 
            - Municipal Worker Access only page
          </h1>
          <p className="text-xs text-white/40 font-mono">
            Dispatcher Queue &bull; Live Work Order Synchronization
          </p>
        </div>

        {/* Console Filters Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F0F11]/50 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  deptFilter === dept
                    ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-black shadow-md shadow-amber-500/20"
                    : "bg-white/5 hover:bg-white/10 text-[#E2E2E2]"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["All", "Pending", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-[#121214]/50 hover:bg-[#121214] text-white/40"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Active Work Queue List */}
        <div className="bg-[#121214]/50 rounded-2xl border border-white/5 overflow-hidden shadow-md">
          <div className="p-4 border-b border-white/5 bg-[#121214] flex justify-between items-center">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/40">
              Active Dispatches Queue ({filteredIssues.length})
            </h3>
            <span className="text-[10px] text-white/30 font-mono">
              Live updates with 2-second polling simulation
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {filteredIssues.length === 0 ? (
              <div className="p-16 text-center text-white/30 space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-white/20" />
                <p className="text-xs font-bold">Queue is empty</p>
                <p className="text-[10px]">No pending civic reports match the active filters.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#121214] transition-all group"
                >
                  
                  {/* Left Column Description */}
                  <div className="flex gap-4 items-start min-w-0 flex-grow cursor-pointer" onClick={() => onSelectIssue(issue)}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0F0F11] shrink-0 border border-white/5">
                      <img 
                        src={issue.imageUrl} 
                        alt={issue.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-white/40">
                          {issue.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="text-[10px] text-white/30 font-bold">
                          &bull; {issue.assignedDept}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#E2E2E2] group-hover:text-amber-500 transition-colors truncate">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-white/40 truncate">
                        {issue.location} &bull; Reported {issue.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-4 shrink-0 justify-end">
                    
                    {/* SLA countdown badge */}
                    {issue.status !== "Resolved" && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A0A0B] border border-white/5 text-[11px] font-mono font-bold text-amber-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>SLA: {issue.slaCountdown}</span>
                      </div>
                    )}

                    {/* Work order state buttons */}
                    <div className="flex items-center gap-2">
                      {issue.status === "Pending" && (
                        <button
                          onClick={() => onUpdateStatus(issue.id, "In Progress")}
                          className="bg-gradient-to-tr from-amber-500 to-orange-600 text-black px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Start Repair
                        </button>
                      )}
                      {issue.status === "In Progress" && (
                        <button
                          onClick={() => onUpdateStatus(issue.id, "Resolved")}
                          className="bg-emerald-500 hover:brightness-110 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          Complete Work
                        </button>
                      )}
                      {issue.status === "Resolved" && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/20 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Work Complete
                        </span>
                      )}

                      {/* Detail navigations */}
                      <button
                        onClick={() => onSelectIssue(issue)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all cursor-pointer"
                        title="View Full Issue Record"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
