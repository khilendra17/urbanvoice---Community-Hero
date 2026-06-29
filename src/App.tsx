import { useState, useEffect } from "react";
import { Issue, ChatMessage, Comment } from "./types";
import { INITIAL_ISSUES, INITIAL_MESSAGES } from "./data";
import { supabase } from "./lib/supabase";

// Component imports
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CitizenHome from "./components/CitizenHome";
import IssueDetail from "./components/IssueDetail";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CopilotDrawer from "./components/CopilotDrawer";
import ReportWizard from "./components/ReportWizard";
import MunicipalConsole from "./components/MunicipalConsole";
import SettingsPage from "./components/SettingsPage";
import { Info, Check, ShieldAlert } from "lucide-react";

export default function App() {
  // Navigation Router states
  const [currentView, setCurrentView] = useState<"landing" | "home" | "dashboard" | "report" | "copilot" | "operations"|"settings">("landing");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  
  // User Profile state
  const [userType, setUserType] = useState<"citizen" | "municipal">("citizen");
  
  // Global state for issues & messages
  // Global state for issues & messages
const [issues, setIssues] = useState<Issue[]>([]);

useEffect(() => {
  const fetchIssues = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/`);
      const data = await response.json();
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category || "Uncategorized",
        severity: item.severity || 3,
        status: item.status || "Pending",
        location: item.address || "Unknown Location",
        latitude: item.latitude,
longitude: item.longitude,
coordinates: `${item.latitude}° N, ${item.longitude}° E`,
        timeAgo: "Recently",
        description: item.ai_summary || item.description || "",
        imageUrl: item.image_url || "",
        votes: 1,
        followed: false,
        comments: [],
        timeline: [],
        assignedDept: item.department || "Public Works",
        officer: { name: "TBD", avatar: "", role: "Officer", verified: false },
        slaCountdown: "48:00:00",
        slaPercentage: 100
      }));
      setIssues(mapped);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  };

  fetchIssues();
}, []);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
}, []);

useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

const [user, setUser] = useState(null);
const userProfile = user
  ? {
      name: user.user_metadata?.full_name || "User",
      email: user.email || "",
      avatar: user.user_metadata?.avatar_url || "",
    }
  : null;
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [cityHealthScore, setCityHealthScore] = useState<number>(0);
const [analyticsData, setAnalyticsData] = useState<any>(null);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/summary`);
      const data = await response.json();
      setAnalyticsData(data);
      setCityHealthScore(data.city_health_score);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };
  fetchAnalytics();
}, []);

  useEffect(() => {
    localStorage.setItem("urbanvoice_messages", JSON.stringify(messages));
  }, [messages]);

  const showToastMessage = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // State modification actions
  const handleUpvote = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const followed = !issue.followed;
          const votes = followed ? issue.votes + 1 : issue.votes - 1;
          
          if (followed) {
            showToastMessage(`Report verified! Increased priority for ${issue.title}.`);
          }
          
          return { ...issue, followed, votes };
        }
        return issue;
      })
    );
  };

  const handleUpdateStatus = async (id: string, status: "Pending" | "In Progress" | "Resolved") => {
  try {
    const dbStatus = status.toLowerCase().replace(" ", "_");
    
    await fetch(`${import.meta.env.VITE_API_URL}/api/issues/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: dbStatus })
    });

    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          showToastMessage(`Work Order updated for ${issue.title} to ${status}!`);
          const nextTimeline = [...issue.timeline];
          if (status === "In Progress") {
            nextTimeline.unshift({
              id: "t-progress-" + Date.now(),
              title: "Repair Work Dispatched",
              description: `Supervisor marked work as actively in progress.`,
              timeAgo: "Just now",
              icon: "Wrench"
            });
          } else if (status === "Resolved") {
            nextTimeline.unshift({
              id: "t-resolved-" + Date.now(),
              title: "Resolution Complete",
              description: `Inspection approved. Issue resolved and cleared.`,
              timeAgo: "Just now",
              icon: "CheckCircle"
            });
          }
          return { ...issue, status, timeline: nextTimeline };
        }
        return issue;
      })
    );
  } catch (error) {
    console.error("Failed to update status:", error);
    showToastMessage("Failed to update status. Please try again.");
  }
};

  const handleAddComment = (issueId: string, comment: Comment) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updatedComments = [...issue.comments, comment];
          return { ...issue, comments: updatedComments };
        }
        return issue;
      })
    );
    showToastMessage("Discussion comment published live!");
  };

    const handleSendMessage = async (text: string) => {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const userMsg: ChatMessage = {
    id: "user-" + Date.now(),
    sender: "user",
    text,
    timestamp
  };

  setMessages((prev) => [...prev, userMsg]);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/copilot/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: text,
        user_role: userType,
        current_page: currentView
      })
    });

    const data = await response.json();

    const aiMsg: ChatMessage = {
      id: "copilot-" + Date.now(),
      sender: "copilot",
      text: data.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);

  } catch (error) {
    const aiMsg: ChatMessage = {
      id: "copilot-" + Date.now(),
      sender: "copilot",
      text: "I'm having trouble connecting right now. Please try again.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, aiMsg]);
  }
};

  const handleSubmitReport = (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setCurrentView("home");
    showToastMessage(`Report registered successfully! Local ID: ${newIssue.id}`, "success");
  };

  // Safe router selection
  const handleSelectIssueDetail = (issue: Issue) => {
    setSelectedIssue(issue);
    // Move to a local state holding the issue, while keeping active tab context
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E2E2E2] flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Toast Notification slide in */}
      {toast && (
        <div className="fixed top-20 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
            toast.type === "success" 
              ? "bg-[#121214]/95 text-[#E2E2E2] border-amber-500/30" 
              : "bg-[#0F0F11]/95 text-slate-100 border-white/5"
          }`}>
            {toast.type === "success" ? (
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white font-extrabold text-sm shadow">
                &check;
              </div>
            ) : (
              <Info className="w-5 h-5 text-amber-500" />
            )}
            <span className="text-xs font-bold leading-none">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Primary view controller */}
      {currentView === "landing" ? (
        <LandingPage
  onNavigate={setCurrentView}
  user={userProfile}
/>
      ) : (
        <div className="flex-grow flex flex-col pt-16 md:pl-16">
          
          {/* Global Header */}
          <Header
            currentView={currentView}
            onNavigate={(v) => {
              setSelectedIssue(null);
              setCurrentView(v);
            }}
            onSearch={setSearchTerm}
            userType={userType}
            setUserType={setUserType}
            user={userProfile}
          />

          {/* Global Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={(v) => {
              setSelectedIssue(null);
              setCurrentView(v);
            }}
            userType={userType}
          />

          {/* Router Content Switchboard */}
          <main className="flex-1 flex flex-col relative">
            {selectedIssue ? (
              <IssueDetail
                issue={issues.find((i) => i.id === selectedIssue.id) || selectedIssue}
                onBack={() => setSelectedIssue(null)}
                onUpvote={handleUpvote}
                onAddComment={handleAddComment}
              />
            ) : (
              <>
                {currentView === "home" && (
                  <CitizenHome
                    issues={issues}
                    onSelectIssue={handleSelectIssueDetail}
                    onNavigate={setCurrentView}
                    onUpvote={handleUpvote}
                    searchTerm={searchTerm}
                  />
                )}

                {currentView === "dashboard" && (
                      <AnalyticsDashboard
     onBack={() => setCurrentView("home")}
    issuesCount={issues.length}
    analyticsData={analyticsData}
  />
                )}

                {currentView === "copilot" && (
                  <CopilotDrawer
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                )}

                {currentView === "report" && (
                  <ReportWizard
                    onBack={() => setCurrentView("home")}
                    onSubmitReport={handleSubmitReport}
                  />
                )}

                {currentView === "operations" && (
                  <MunicipalConsole
                  issues={issues}
                   onUpdateStatus={handleUpdateStatus}
                   onSelectIssue={handleSelectIssueDetail}
                    cityHealthScore={cityHealthScore}
                  />
                )}
                {currentView === "settings" && (
  <SettingsPage onNavigate={setCurrentView} />
)}
              </>
            )}
          </main>

        </div>
      )}
    </div>
  );
}
