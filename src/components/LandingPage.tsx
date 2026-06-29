import { ArrowRight, BarChart2, Bolt, Flame, Shield, Users, MapPin, Brain, Zap, Globe, Mail, Twitter, Github } from "lucide-react";
import { supabase } from "../lib/supabase";

interface LandingPageProps {
  onNavigate: (view: "landing" | "home" | "dashboard" | "report" | "copilot" | "operations") => void;
  user: any;
}

export default function LandingPage({
  onNavigate,
  user,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E2E2E2] flex flex-col overflow-x-hidden">

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm">UV</div>
          <span className="font-bold text-xl text-white">UrbanVoice</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-amber-500 border border-amber-500/20">COMMUNITY HERO</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-white/60 hover:text-amber-500 transition-colors">How it Works</a>
          <a href="#features" className="text-sm text-white/60 hover:text-amber-500 transition-colors">Features</a>
          <a href="#impact" className="text-sm text-white/60 hover:text-amber-500 transition-colors">Impact</a>
        </nav>
        <div className="flex items-center gap-4">
          
 {user ? (
  <div className="flex items-center gap-3">
    <img
      src={user.avatar}
      alt={user.name}
      className="w-9 h-9 rounded-full object-cover border border-white/10"
    />
    <span className="text-sm font-medium text-white hidden md:block">
      {user.name}
    </span>
  </div>
) : (
  <button
    onClick={async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    }}
    className="text-sm text-white/60 hover:text-white transition-colors"
  >
    Sign In
  </button>
)}

          <button
            onClick={() => onNavigate("home")}
            className="bg-white hover:bg-white/90 text-black px-5 py-2 rounded-full text-sm font-semibold active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section - Full Screen Video */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/city.mp4.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/60 via-[#0A0A0B]/40 to-[#0A0A0B] z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Live Civic Network — Nagpur
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-white select-none">
            URBANVOICE
          </h1>
          <p className="text-xl md:text-3xl font-light tracking-tight text-amber-500">
            A Community Hero - Hyperlocal Civic Intelligence
          </p>
          <p className="text-sm md:text-lg max-w-2xl mx-auto text-white/60 leading-relaxed">
            AI-powered civic intelligence for smarter cities. Report issues, track resolutions, and collaborate with your community in real-time.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("report")}
              className="w-full sm:w-auto bg-gradient-to-tr from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-orange-900/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 fill-current" />
              Report an Issue
            </button>
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full sm:w-auto border border-white/10 text-white hover:bg-white/5 px-8 py-3 rounded-full font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BarChart2 className="w-5 h-5 text-amber-500" />
              View City Dashboard
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-px h-8 bg-white/20 animate-pulse"></div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 space-y-3">
          <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest">How it Works</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Three Steps to a Better City</h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm">From reporting to resolution — UrbanVoice handles it all with AI intelligence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: <MapPin className="w-6 h-6" />, title: "Report an Issue", desc: "Snap a photo, drop a pin, and submit in under 60 seconds. Our AI instantly categorizes and prioritizes your report." },
            { step: "02", icon: <Brain className="w-6 h-6" />, title: "AI Takes Over", desc: "Gemini AI analyzes the issue, detects duplicates, assigns severity, and routes it to the right department automatically." },
            { step: "03", icon: <Zap className="w-6 h-6" />, title: "Track Resolution", desc: "Get real-time updates as your issue moves through the system. Citizens verify resolution before the case is closed." }
          ].map((item) => (
            <div key={item.step} className="relative p-8 rounded-2xl bg-white/3 border border-white/8 hover:border-amber-500/30 transition-colors group">
              <div className="text-6xl font-extrabold text-white/5 absolute top-6 right-6 group-hover:text-amber-500/10 transition-colors">{item.step}</div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white/2 border-t border-b border-white/5 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest">Features</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Built for Every Stakeholder</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Flame className="w-5 h-5" />, title: "Fast Action", desc: "Instant alerts sent directly to municipal maintenance teams with GPS precision and automated dispatching." },
              { icon: <Brain className="w-5 h-5" />, title: "AI Insights", desc: "Gemini AI classifies issues, predicts infrastructure failures, and generates budget recommendations automatically." },
              { icon: <Users className="w-5 h-5" />, title: "Citizen Led", desc: "Community verification, upvotes, and transparency timelines keep every citizen informed and engaged." },
              { icon: <Shield className="w-5 h-5" />, title: "Privacy First", desc: "Automatic face and license plate blurring protects citizen privacy in every uploaded photo and video." },
              { icon: <Globe className="w-5 h-5" />, title: "City Health Score", desc: "A live score from 0–100 showing the overall civic health of your city, updated in real time." },
              { icon: <Zap className="w-5 h-5" />, title: "RAG Copilot", desc: "Ask anything about your city's issues. Our AI Copilot retrieves real data and gives grounded answers." }
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 space-y-3">
          <p className="text-amber-500 text-xs font-semibold uppercase tracking-widest">Impact</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Ready for Every City</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "28+", label: "Issues Tracked" },
            { number: "8", label: "AI Agents Active" },
            { number: "5", label: "Departments Connected" },
            { number: "< 60s", label: "Report Time" }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/3 border border-white/8">
              <div className="text-3xl md:text-4xl font-extrabold text-amber-500 mb-2">{stat.number}</div>
              <div className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0B] px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">UV</div>
                <span className="font-bold text-white">UrbanVoice</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">AI-powered civic intelligence platform for smarter, more responsive cities.</p>
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-white/30 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-4 h-4 text-white/30 hover:text-white cursor-pointer transition-colors" />
                <Mail className="w-4 h-4 text-white/30 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold">Platform</h4>
              <ul className="space-y-2">
                {["Report an Issue", "City Dashboard", "AI Copilot", "Analytics", "Municipal Console"].map(item => (
                  <li key={item} className="text-white/30 text-xs hover:text-amber-500 cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold">For Cities</h4>
              <ul className="space-y-2">
                {["Municipal Dashboard", "Department Routing", "SLA Management", "Crisis Mode", "Open Data API"].map(item => (
                  <li key={item} className="text-white/30 text-xs hover:text-amber-500 cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold">Contact</h4>
              <ul className="space-y-2">
                <li className="text-white/30 text-xs">hello@urbanvoice.in</li>
                <li className="text-white/30 text-xs">Nagpur, Maharashtra</li>
                <li className="text-white/30 text-xs">India — 440001</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs">© 2026 UrbanVoice. Built for Bharat. Powered by Google AI.</p>
            <div className="flex items-center gap-6">
              <span className="text-white/20 text-xs hover:text-white/40 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-white/20 text-xs hover:text-white/40 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}