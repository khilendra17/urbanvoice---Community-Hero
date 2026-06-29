import { useState } from "react";
import { User, Bell, Shield, Map, Smartphone, LogOut, ChevronRight, X } from "lucide-react";

interface SettingsPageProps {
  onNavigate: (view: any) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
const [name, setName] = useState("Khilendra Porgade");
const [email, setEmail] = useState("24khilendra@gmail.com");
const [ward, setWard] = useState("Nagpur Ward 4");
  return (
    <div className="flex-grow bg-[#0A0A0B] min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Settings</h1>
          <p className="text-xs text-white/40 font-mono">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white/3 border border-white/8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-xl">A</div>
          <div className="flex-1">
           <p className="text-white font-bold">{name}</p>
<p className="text-white/40 text-xs">{email}</p>
<p className="text-amber-500 text-xs mt-1">Citizen · {ward}</p>
          </div>
         <button
  onClick={() => setShowEditProfile(true)}
  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:border-amber-500/30 hover:text-white transition-colors"
>
  Edit Profile
</button>


{showEditProfile && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0F0F11] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Edit Profile</h3>
        <button onClick={() => setShowEditProfile(false)}>
          <X className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-white/40 text-xs uppercase tracking-wider">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs uppercase tracking-wider">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs uppercase tracking-wider">Ward</label>
          <input
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setShowEditProfile(false)}
          className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowEditProfile(false)}
          className="flex-1 py-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white text-sm font-semibold hover:brightness-110 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
        </div>

        {/* Settings Sections */}
        {[
          {
            title: "Account",
            icon: <User className="w-4 h-4" />,
            items: ["Personal Information", "Change Password", "Linked Accounts", "Delete Account"]
          },
          {
            title: "Notifications",
            icon: <Bell className="w-4 h-4" />,
            items: ["Issue Status Updates", "Nearby Issue Alerts", "Community Verification Requests", "Municipal Announcements"]
          },
          {
            title: "Privacy & Security",
            icon: <Shield className="w-4 h-4" />,
            items: ["Privacy Settings", "Data Usage", "Location Permissions", "Two-Factor Authentication"]
          },
          {
            title: "Location & Map",
            icon: <Map className="w-4 h-4" />,
            items: ["Default Ward", "Map Style", "GPS Precision", "Location History"]
          },
          {
            title: "App Preferences",
            icon: <Smartphone className="w-4 h-4" />,
            items: ["Language", "Theme", "Accessibility", "Cache & Storage"]
          }
        ].map((section) => (
          <div key={section.title} className="rounded-2xl bg-white/3 border border-white/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
              <span className="text-amber-500">{section.icon}</span>
              <h2 className="text-white font-semibold text-sm">{section.title}</h2>
            </div>
            <div className="divide-y divide-white/5">
              {section.items.map((item) => (
                <div key={item} className="px-6 py-4 flex items-center justify-between hover:bg-white/3 cursor-pointer transition-colors group">
                  <span className="text-white/60 text-sm group-hover:text-white transition-colors">{item}</span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-amber-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
       <button
  onClick={() => onNavigate("landing")}
  className="w-full p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
>
  <LogOut className="w-4 h-4" />
  <span className="text-sm font-semibold">Sign Out</span>
</button>

        <p className="text-center text-white/20 text-xs">UrbanVoice v1.0.0 · Built for Bharat · Powered by Google AI</p>

      </div>
    </div>
  );
}