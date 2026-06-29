import { Home, FileText, BarChart2, Users, Bolt, Settings, MapPin, ClipboardList, ShieldAlert } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (
  view:
    | "landing"
    | "home"
    | "dashboard"
    | "report"
    | "copilot"
    | "operations"
    | "settings"
) => void;
  userType?: "citizen" | "municipal";
}

export default function Sidebar({ currentView, onNavigate, userType = "citizen" }: SidebarProps) {
  const isSelected = (views: string[]) => views.includes(currentView);

  return (
    <aside className="hidden md:flex flex-col items-center py-6 space-y-8 fixed left-0 top-16 h-[calc(100vh-64px)] w-16 bg-[#0F0F11] border-r border-white/5 z-40 shadow-md select-none">
      {/* Brand Icon or Agency Icon */}
      <div className="text-amber-500 group relative">
        <ShieldAlert className="w-6 h-6 animate-pulse" />
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
          Civic Intelligence System
        </div>
      </div>

      <nav className="flex flex-col items-center space-y-6 w-full">
        {/* Home */}
        <button
          onClick={() => onNavigate("home")}
          className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
            isSelected(["home"])
              ? "text-amber-500 bg-amber-500/10 border-l-2 border-amber-500"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Citizen Home Map
          </div>
        </button>

        {/* Report Flow */}
        <button
          onClick={() => onNavigate("report")}
          className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
            isSelected(["report"])
              ? "text-amber-500 bg-amber-500/10 border-l-2 border-amber-500"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Report New Issue
          </div>
        </button>

        {/* Dashboard / Analytics */}
        <button
          onClick={() => onNavigate("dashboard")}
          className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
            isSelected(["dashboard"])
              ? "text-amber-500 bg-amber-500/10 border-l-2 border-amber-500"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Analytics & Heatmaps
          </div>
        </button>

        {/* Municipal Operations */}
        <button
          onClick={() => onNavigate("operations")}
          className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
            isSelected(["operations"])
              ? "text-amber-500 bg-amber-500/10 border-l-2 border-amber-500"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Active Issues Queue
          </div>
        </button>

        {/* Copilot Chat */}
        <button
          onClick={() => onNavigate("copilot")}
          className={`p-2.5 rounded-xl transition-all relative group cursor-pointer ${
            isSelected(["copilot"])
              ? "text-amber-500 bg-amber-500/10 border-l-2 border-amber-500"
              : "text-white/40 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Bolt className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Civic AI Copilot
          </div>
        </button>
      </nav>

      {/* Sidebar Footer Settings Button */}
      <div className="mt-auto pt-6 border-t border-white/5 w-full flex justify-center">
        <button
  onClick={() => onNavigate("settings")}
  className="p-2.5 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all relative group cursor-pointer"
>
          <Settings className="w-5 h-5" />
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md border border-white/5 scale-0 group-hover:scale-100 transition-all pointer-events-none whitespace-nowrap z-50">
            Console Settings
          </div>
        </button>
      </div>
    </aside>
  );
}
