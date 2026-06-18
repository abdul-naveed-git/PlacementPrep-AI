import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  Map,
  Building2,
  MessageSquare,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Sparkles,
  Bot,
  Terminal,
  Volume2
} from "lucide-react";
import { apiRequest } from "../lib/api";

// Import tabs
import HomeTab from "./HomeTab";
import DSARoadmapTab from "./DSARoadmapTab";
import CompanyPrepTab from "./CompanyPrepTab";
import ExperienceHubTab from "./ExperienceHubTab";
import ProgressCenterTab from "./ProgressCenterTab";
import BookmarksTab from "./BookmarksTab";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";
import SkillGapTab from "./SkillGapTab";

export default function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("home");
  const [roadmap, setRoadmap] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  // Profile update state
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Fetch current user active roadmap
  const fetchUserRoadmap = async () => {
    try {
      const data = await apiRequest("/api/roadmap");
      setRoadmap(data);
    } catch (err) {
      console.error("Failed to load active roadmap:", err);
    }
  };

  useEffect(() => {
    fetchUserRoadmap();
  }, []);

  const handleSaveProfile = async (updatedParams) => {
    setSavingProfile(true);
    setProfileSuccess(false);
    try {
      const updatedUser = await apiRequest("/api/user/profile", {
        method: "POST",
        body: JSON.stringify(updatedParams)
      });
      setUser(updatedUser);
      setProfileSuccess(true);

      // Auto refetch roadmap since parameters modified
      await fetchUserRoadmap();

      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save student profile params:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Dynamically calculate our elite placement readiness index score
  const totalProblems = roadmap?.topics?.reduce((acc, t) => acc + (t.problems?.length || 0), 0) || 0;
  const completedProblems = roadmap?.topics?.reduce((acc, t) => acc + (t.problems?.filter(p => p.completed).length || 0), 0) || 0;
  const leetcodeSolved = user?.leetcodeStats?.totalSolved || 842;

  // Let's weights: Leetcode solved items (up to 40%), Roadmap checklist solved tasks (up to 40%), Target specs filled (up to 20%)
  const leetcodeWeight = Math.min(40, Math.floor((leetcodeSolved / 400) * 40));
  const roadmapWeight = totalProblems > 0 ? Math.min(40, Math.round((completedProblems / totalProblems) * 40)) : 0;
  const profileWeight =
    user?.leetcodeUsername &&
      user?.targetCompanies?.length > 0
      ? 20
      : 12;
  const readinessIndexPercent = Math.min(100, Math.max(10, leetcodeWeight + roadmapWeight + profileWeight));

  const localFullName = localStorage.getItem("pf_fullName") || "Arjun Verma";
  const localLeetcodeUsername = user?.leetcodeUsername || "arjun_2003";

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dsa_roadmap", label: "DSA Roadmap", icon: Map },
    { id: "company_prep", label: "Company Preparation", icon: Building2 },
    { id: "experiences", label: "Interview Experiences", icon: MessageSquare },
    { id: "progress", label: "Progress Center", icon: TrendingUp },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div id="placementpilot_scaffold_shell"
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/30 text-slate-800 flex font-sans w-full overflow-hidden">
      <div className="absolute top-20 left-40 w-72 h-72 bg-violet-500/10 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"></div>
      {/* LEFT SIDEBAR - Desktop Mode */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-xl shadow-violet-500/5 shrink-0 sticky top-0 h-screen z-30 justify-between p-6">
        <div className="space-y-6">

          {/* Brand Identity / Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/10">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block font-display">
                PlacementPilot AI
              </span>
              <span className="text-[10px] text-slate-400 font-bold block leading-none font-mono tracking-wider">
                SDE PREPARATION
              </span>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1 pt-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 cursor-pointer group ${isSelected
                    ? "bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-l-4 border-violet-600 text-violet-700 shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/70 hover:translate-x-1"
                    }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-all duration-300 group-hover:scale-110 ${isSelected ? "text-violet-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom logout component widget */}
        <div className="border-t border-slate-100 pt-5 space-y-2">
          <button
            onClick={() => {
              onLogout();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-bold transition-all flex items-center gap-3 cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BAR AND NAVIGATION DROPDOWN */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 rounded-lg bg-violet-600 font-extrabold text-white text-xs block font-display">P</div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 font-display">PlacementPilot AI</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-550/5 hover:bg-slate-550/10 rounded-lg text-slate-550"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* MOBILE PANEL OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "just" }}
              className="relative w-64 bg-white border-r border-slate-200 h-full p-6 flex flex-col justify-between"
            >
              <div className="space-y-6 pt-12">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 ${isSelected ? "bg-violet-50 text-violet-600 font-black" : "text-slate-500 hover:bg-slate-50"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <button
                  onClick={() => {
                    onLogout();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER AREA */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

          {/* HEADER ROW - EXACTLY MATCHING SECOND SCREENSHOT */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-white/40">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
                Welcome back, {localFullName.split(" ")[0]} 👋
              </h1>
              <p className="text-slate-500 text-xs mt-1.5">
                Let's continue your placement preparation
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              {/* Notification Bell */}
              <button
                className="p-2 h-10 w-10 bg-white/70 backdrop-blur-xl hover:bg-white border border-white/40 rounded-full text-slate-500 hover:text-violet-600 transition-all duration-300 cursor-pointer relative flex items-center justify-center hover:scale-105 shadow-md"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
              </button>

              {/* User profile info dropdown widget matching mockup */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 h-10"><div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-md hover:shadow-violet-500/10 hover:scale-[1.02] transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-violet-100 overflow-hidden shrink-0 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"
                    alt="Arjun Verma Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <span className="font-bold text-xs text-slate-900 block">{localFullName}</span>
                  <span className="text-[10px] text-slate-450 font-mono block">@{localLeetcodeUsername}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "home" && (
                <HomeTab
                  user={user}
                  roadmap={roadmap}
                  onNavigateTab={(tabId) => setActiveTab(tabId)}
                  readinessIndexPercent={readinessIndexPercent}
                />
              )}
              {activeTab === "dsa_roadmap" && (
                <DSARoadmapTab
                  roadmap={roadmap}
                  onRoadmapUpdate={(updated) => setRoadmap(updated)}
                  weakTopics={user?.weakTopics || []}
                />
              )}
              {activeTab === "company_prep" && (
                <CompanyPrepTab initialCompanies={user?.targetCompanies || []} />
              )}
              {activeTab === "experiences" && (
                <ExperienceHubTab userEmail={user?.email || ""} />
              )}
              {activeTab === "progress" && (
                <ProgressCenterTab roadmap={roadmap} totalSolved={leetcodeSolved} />
              )}
              {activeTab === "bookmarks" && (
                <BookmarksTab />
              )}
              {activeTab === "profile" && (
                <ProfileTab
                  user={user}
                  onSaveProfile={handleSaveProfile}
                  savingProfile={savingProfile}
                  profileSuccess={profileSuccess}
                />
              )}
              {activeTab === "settings" && (
                <SettingsTab />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

    </div>
  );
}

