import { BarChart2, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Star, ArrowLeft } from "lucide-react";

interface AnalyticsDashboardProps {
  onBack: () => void;
  issuesCount: number;
}

export default function AnalyticsDashboard({ onBack, issuesCount }: AnalyticsDashboardProps) {
  // SVG Custom Line Chart coordinates for 30-Day Trend
  // Resolves to beautiful smooth curves
  const linePoints = "0,140 40,110 80,125 120,80 160,95 200,60 240,75 280,40 320,55 360,20 400,30 440,15 480,5";
  const areaPoints = "0,140 40,110 80,125 120,80 160,95 200,60 240,75 280,40 320,55 360,20 400,30 440,15 480,5 480,180 0,180";
  
  const resolutionPoints = "0,160 40,145 80,150 120,110 160,115 200,90 240,85 280,70 320,60 360,45 400,50 440,30 480,15";

  // Category distribution calculation
  const stats = [
    { name: "Infrastructure", percentage: 40, color: "#F59E0B", count: 499 },
    { name: "Sanitation", percentage: 25, color: "#EA580C", count: 312 },
    { name: "Public Safety", percentage: 15, color: "#EF4444", count: 187 },
    { name: "Utilities", percentage: 12, color: "#E2E2E2", count: 150 },
    { name: "Landscaping", percentage: 8, color: "#10B981", count: 100 },
  ];

  return (
    <div className="flex-grow bg-[#0A0A0B] text-[#E2E2E2] min-h-screen pb-16">
      {/* Dashboard container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-amber-500 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Map View
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Civic Intelligence & Analytics
            </h1>
            <p className="text-xs text-white/40 font-mono">
              Live Feed Analytics &bull; Consolidated Ward 1-9 Overview
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#121214] border border-white/5 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
            <Calendar className="w-4 h-4 text-amber-500" />
            Last 30 Days (Active Filter)
          </div>
        </div>

        {/* 4 Core Metric cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Resolution Rate</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">94.2%</h2>
            <p className="text-[10px] text-emerald-400 font-bold">&uarr; 2.4% vs last week</p>
          </div>

          <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">SLA Compliance</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">88.5%</h2>
            <p className="text-[10px] text-emerald-400 font-bold">&uarr; 0.8% vs average</p>
          </div>

          <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Reports</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">1,248</h2>
            <p className="text-[10px] text-white/40 font-bold">{issuesCount} active mock session</p>
          </div>

          <div className="bg-[#121214] p-5 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Civic Intel Score</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">4.8/5</h2>
            <p className="text-[10px] text-amber-400 font-bold">&bigstar; Citizen satisfaction rating</p>
          </div>

        </div>

        {/* Charts & Map split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trend Chart (2/3 width) */}
          <div className="lg:col-span-2 bg-[#121214]/60 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/60">
                  30-Day Volume & Resolution Trend
                </h3>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">
                  Daily Incoming Reports (Amber) vs Dispatched Resolutions (Orange)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#F59E0B] rounded"></span> Incoming</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-orange-500 rounded"></span> Resolved</span>
              </div>
            </div>

            {/* SVG High Fidelity Line Chart */}
            <div className="w-full h-56 pt-2">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  {/* Gradient Area Fill */}
                  <linearGradient id="amber-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid Gridlines */}
                <line x1="0" y1="180" x2="500" y2="180" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="45" x2="500" y2="45" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                
                {/* Shaded Area Under Curve */}
                <polygon points={areaPoints} fill="url(#amber-gradient)" />
                
                {/* Main Incoming Line Curve */}
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />

                {/* Main Resolution Line Curve */}
                <polyline
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 1"
                  points={resolutionPoints}
                />

                {/* Glowing Highlight Circle nodes */}
                <circle cx="280" cy="40" r="5" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="480" cy="5" r="5" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
              {/* X Axis Time Marks */}
              <div className="flex justify-between text-[10px] text-white/30 font-mono mt-2 px-1">
                <span>June 1</span>
                <span>June 10</span>
                <span>June 20</span>
                <span>June 26 (Today)</span>
              </div>
            </div>
          </div>

          {/* Distribution Donut & Stats (1/3 width) */}
          <div className="bg-[#121214]/60 p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/60">
              Incident Category Mix
            </h3>
            
            {/* SVG Interactive Ring Donut Chart */}
            <div className="flex items-center justify-center h-40">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1A1A1C" strokeWidth="3" />
                {/* Infrastructure: 40% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" 
                        strokeDasharray="40 60" strokeDashoffset="25" />
                {/* Sanitation: 25% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EA580C" strokeWidth="3" 
                        strokeDasharray="25 75" strokeDashoffset="85" />
                {/* Public Safety: 15% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="3" 
                        strokeDasharray="15 85" strokeDashoffset="110" />
                {/* Utilities: 12% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E2E2" strokeWidth="3" 
                        strokeDasharray="12 88" strokeDashoffset="122" />
                {/* Landscaping: 8% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3" 
                        strokeDasharray="8 92" strokeDashoffset="130" />
                
                {/* Centered Ring Text */}
                <text x="18" y="16.5" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#ffffff">
                  100%
                </text>
                <text x="18" y="21.5" textAnchor="middle" fontSize="2.8" fontWeight="bold" fill="#64748b" letterSpacing="0.2">
                  CLASSIFIED
                </text>
              </svg>
            </div>

            {/* Legend checklist */}
            <div className="space-y-2">
              {stats.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/80 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white/40">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Heatmap overlay block */}
        <div className="bg-[#121214] rounded-2xl border border-white/5 overflow-hidden relative h-96">
          <div className="absolute inset-0 z-0 opacity-85">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQiJuMQDZUd9P5kCNWTQSML4lqQqYwLIb7N8LAQtpciGdHcoKyXP2SATaihIbICbzdYXtrNvC6QN3ZH6zYppxuA6SeF8pR3FXIj12NbqMWA0uJ0HXYMQ2MDPaWq16LMdMdjeXidWix6LzV6npU6LUeIylflGKN7yK6kGuyrMz2muYj4BY3uLzh57jIxKe8fxqNi9oN9m3ayYQ1TaVkjjwVwWRbc5Vp1uDvD1gw8qpnwPH-QzYzUItW8HCxdKuyu-DObw4pgYnKaUVY" 
              alt="Live statistics heatmap background" 
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Pulsing Heat spots */}
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-orange-500/25 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-slate-900/40 pointer-events-none" />

          {/* Floater overlay details */}
          <div className="absolute top-6 left-6 z-10 bg-slate-950/90 border border-white/5 backdrop-blur-md p-4 rounded-xl max-w-sm space-y-2 shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Heatmap Mode Active</p>
            <h3 className="text-sm font-bold text-white">Urban Density Overlay</h3>
            <p className="text-xs text-[#E2E2E2] leading-relaxed font-sans">
              Visualizing report clusters. High activity centered around Sector 4 (Broadway corridor) and Sector 11 (Lexington crossing). Municipal teams have been auto-alerted.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
