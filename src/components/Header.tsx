import { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, LogOut, ChevronDown } from "lucide-react";


interface HeaderProps {
  currentView: string;
  onNavigate: (view: "landing" | "home" | "dashboard" | "report" | "copilot" | "operations"|"settings") => void;
  onSearch?: (term: string) => void;
  user: {
  name: string;
  email: string;
  avatar: string;
} | null;
  userType?: "citizen" | "municipal";
  setUserType?: (type: "citizen" | "municipal") => void;
}

export default function Header({ currentView, onNavigate, onSearch, userType = "citizen", user, setUserType }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  const citizenAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4KW6rIAOGn3WWCPeNU9t3LK5N9GQ6dbg8MYL8vEfkgGhOmxZHncBqWZcZm5H37BWEMX_uHdmZFLMLfz6qO2FEpOBKKg4urSua-CGXl3SKLfRlRCGpI0xM8pxakgOhTlg6cw4CywVjAiBvB4pZvLUloerdjVnjJLE0-w6gpOHTNhOHvWpXcc0X-PPOOellDt53vkVF5lfP4amSoQnjGweup5YgNrxrD6QUbKnZOOpYA9yUnFmeMmJYuUOJEbGNRAYWhaxncD2yqsH";
  const municipalAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCAz-Ei4F_lhylEnJ-_WoRYSqH83mNtDW4VAwVm2NvarCpAaBDmYN5iwHwGZk4U8n4Yy4PudvcbUjTSxi1-dHiR_N2_DaMLzXPi5IGFibwRfemD7KAkAIAH-mgXv7vsRVNfQinqrnGh6128YWPxJnrxIhbGqU-cEzWU3UotLwwDp1kxDxrcdPH7URP7ZCvgKygnoTpT1N4PfMzMhiWDYlfikSCw_tqtTXlgYPBoLmL2fyyGMk8Uf3dEJvpD4M73JgyHsk1c9jyh7eEV";

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setShowNotifications(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F0F11]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 shadow-sm select-none">
      {/* Brand area */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-900/20">
            UV
          </div>
          <span className="font-sans text-xl font-extrabold tracking-tight text-[#E2E2E2]">
            UrbanVoice
          </span>
        </div>
        
        <div className="hidden md:block h-6 w-px bg-white/5"></div>
        
        {/* Portal Tag */}
        <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-amber-500/80">
          {userType === "citizen" ? "Citizen Portal" : "Municipal Console"}
        </span>

        {/* Primary nav desktop */}
        <nav className="hidden lg:flex items-center gap-6 ml-6">
          
          <button 
            onClick={() => onNavigate("dashboard")}
            className={`text-xs font-bold transition-all border-b-2 py-5 -mb-5 ${
              currentView === "dashboard" 
                ? "text-amber-500 border-amber-500 font-extrabold" 
                : "text-white/60 border-transparent hover:text-amber-500"
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate("home")}
            className={`text-xs font-bold transition-all border-b-2 py-5 -mb-5 ${
              currentView === "home" 
                ? "text-amber-500 border-amber-500 font-extrabold" 
                : "text-white/60 border-transparent hover:text-amber-500"
            }`}
          >
            Explore Issues
          </button>
        </nav>
      </div>

      {/* Center search bar (resizes on focus) */}
      {(currentView === "home" || currentView === "operations") && (
        <div className="flex-1 max-w-sm md:max-w-md mx-6 relative group hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search issues, streets, or markers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-[#121214] text-[#E2E2E2] placeholder-white/30 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
          />
        </div>
      )}

      {/* Right notifications and user menu */}
      <div className="flex items-center gap-4">
        {/* Quick User Role Switcher */}
           {setUserType && userType === "municipal" && (
  <button
    onClick={() => setUserType(userType === "citizen" ? "municipal" : "citizen")}
    
            className="text-[10px] font-bold tracking-wider uppercase border border-white/5 hover:bg-white/10 px-2 py-1 rounded text-white/60 hover:text-white transition-all cursor-pointer"
            title="Toggle between Citizen View and Municipal Worker View"
          >
            Switch to {userType === "citizen" ? "Worker" : "Citizen"}
          </button>
        )}

       <button
  onClick={() => setShowNotifications(!showNotifications)}
  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors relative cursor-pointer"
>
  <Bell className="w-5 h-5" />

  {showNotifications && (
    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-[#0F0F11] animate-pulse" />
  )}
</button>

{showNotifications && (
  <div
     ref={notificationRef} 
     className="absolute right-0 top-12 w-80 bg-[#121214] border border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden">

    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <h3 className="text-sm font-semibold text-white">
        Notifications
      </h3>

      <button
        onClick={() => setShowNotifications(false)}
        className="text-white/40 hover:text-white"
      >
        ✕
      </button>
    </div>

    <div className="max-h-72 overflow-y-auto">

      <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
        <p className="text-sm text-white">
          New pothole reported in Ward 12
        </p>
        <p className="text-xs text-white/40 mt-1">
          2 minutes ago
        </p>
      </div>

      <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
        <p className="text-sm text-white">
          Garbage issue has been assigned
        </p>
        <p className="text-xs text-white/40 mt-1">
          15 minutes ago
        </p>
      </div>

      <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
        <p className="text-sm text-white">
          Water leakage resolved successfully
        </p>
        <p className="text-xs text-white/40 mt-1">
          Yesterday
        </p>
      </div>

    </div>

  </div>
)}

        {/* User avatar dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/5">
              <img 
                src={user?.avatar || citizenAvatar}
                alt="User Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="hidden md:block text-xs font-semibold text-[#E2E2E2]">
              {user ? user.name : "Guest"}
            </span>
            <ChevronDown className="w-3 h-3 text-white/40 hidden md:block" />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#121214] border border-white/5 rounded-xl shadow-lg py-1 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white">
                  {userType === "citizen" ? "Khilendra Porgade" : "David K."}
                </p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">
                  {userType === "citizen" ? "Citizen Hero" : "Supervisor #4"}
                </p>
              </div>
              <button 
                onClick={() => { setShowDropdown(false); onNavigate("landing"); }}
                className="w-full text-left px-4 py-2 text-xs text-[#E2E2E2] hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
