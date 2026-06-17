import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Building2,
  ChevronRight,
  ArrowRight,
  Workflow,
  CheckCircle2,
  Bot
} from "lucide-react";

export default function HomeTab({ user, roadmap, onNavigateTab, readinessIndexPercent }) {
  // Extract stats or default to match mockup 
  const leetcodeSolved = user?.leetcodeStats?.totalSolved || 842;
  const easySolved = user?.leetcodeStats?.easySolved || 320;
  const mediumSolved = user?.leetcodeStats?.mediumSolved || 380;
  const hardSolved = user?.leetcodeStats?.hardSolved || 142;

  const trackedCompaniesCount = Math.max(
    user?.targetCompanies?.length || 0,
    6
  );
  const trackedCompaniesList =
    user?.targetCompanies?.length
      ? user.targetCompanies
      : ["Amazon", "Microsoft", "Google", "Meta", "Adobe", "Apple"];

  // Weak focus progress matches mockup exactly
  const weakFocusProgress = [
    { topic: "Dynamic Programming", rate: 25, color: "bg-red-500" },
    { topic: "Graphs", rate: 30, color: "bg-red-500" },
    { topic: "System Design", rate: 20, color: "bg-red-500" }
  ];

  return (
    <div id="home_dashboard_welcome_view" className="space-y-6">

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Placement Readiness */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Placement Readiness</span>
          <div className="space-y-1">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{readinessIndexPercent}%</span>
            <span className="text-[11px] font-semibold text-emerald-600 font-mono flex items-center gap-1 select-none pt-1">
              ↑ 8% this week
            </span>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Problems Solved</span>
          <div className="space-y-2">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{leetcodeSolved}</span>
            <div className="text-[10px] text-slate-405 font-mono font-medium block">
              Easy <span className="font-bold text-slate-700">{easySolved}</span>
              <span className="mx-1 text-slate-300">|</span>
              Medium <span className="font-bold text-slate-700">{mediumSolved}</span>
              <span className="mx-1 text-slate-300">|</span>
              Hard <span className="font-bold text-slate-700">{hardSolved}</span>
            </div>
          </div>
        </div>

        {/* Companies Tracking */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Companies Tracking</span>
          <div className="space-y-1">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{trackedCompaniesCount}</span>
            <p className="text-[10px] text-slate-400 font-mono pt-1.5 truncate">
              {trackedCompaniesList.slice(0, 3).join(", ")} +{trackedCompaniesCount - 3}
            </p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 flex justify-between items-start gap-2">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Current Streak</span>
            <div className="space-y-1.5">
              <span className="text-3xl font-sans font-black text-slate-900 block leading-none">12</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-extrabold text-amber-700 font-mono">
                🔥 days
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 mt-2">
            <Flame className="h-6 w-6 fill-amber-500" />
          </div>
        </div>

      </div>

      {/* Middle Grid: Your Roadmap Progress (2/3 width) vs AI Recommendation (1/3 width) */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Your Roadmap Progress Card (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="font-extrabold text-[15px] text-slate-900 font-display">Your Roadmap Progress</h2>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">

            {/* Left Column: Overall Progress & CTA Button */}
            <div className="space-y-4 pr-0 sm:pr-4 sm:border-r border-slate-100 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Overall Progress</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0">
                    <div className="bg-violet-600 h-full rounded-full transition-all duration-500" style={{ width: "65%" }} />
                  </div>
                  <span className="font-mono text-slate-900 font-extrabold text-xs">65%</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">42 / 65 topics completed</span>
              </div>

              <button
                onClick={() => onNavigateTab("dsa_roadmap")}
                className="w-full sm:w-fit px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Continue Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right Column: Weak Topics list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Weak Topics (Focus Area)</span>
              </div>

              <div className="space-y-3.5">
                {weakFocusProgress.map((item, id) => (
                  <div key={id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-semibold text-slate-800">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.rate}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-450 font-bold shrink-0">Progress {item.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right pt-2">
                <button
                  onClick={() => onNavigateTab("skill_gap")}
                  className="text-[11px] text-violet-600 hover:text-violet-750 font-bold transition-colors inline-flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* AI Recommendation Card (Spans 1 column on desktop) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="font-extrabold text-[15px] text-slate-900 font-display">AI Recommendation</h2>
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <Bot className="h-6 w-6" />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              You should focus on <span className="font-semibold text-slate-900 font-sans">Dynamic Programming</span> and <span className="font-semibold text-slate-900 font-sans">Graphs</span>. Solve 15-20 problems from the recommended list to improve your readiness.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("skill_gap")}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Recommended Problems</span>
          </button>
        </div>

      </div>

      {/* Bottom Row Section: Company Preparation Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider font-display">Company Preparation Overview</h2>
            <p className="text-[10px] text-slate-450 mt-1">Status index across currently prioritized company checklist lanes.</p>
          </div>
          <button
            onClick={() => onNavigateTab("company_prep")}
            className="text-[11px] text-violet-600 hover:text-violet-500 font-bold transition-colors flex items-center gap-0.5"
          >
            <span>View All Companies</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { name: "Amazon", rate: 68, logo: "a", logoBg: "bg-slate-950 text-white font-sans font-black leading-none", progressColor: "bg-emerald-500" },
            { name: "Microsoft", rate: 72, logo: "M", logoBg: "bg-[#00a4ef] text-white font-extrabold", progressColor: "bg-emerald-500" },
            { name: "Google", rate: 65, logo: "G", logoBg: "bg-slate-950 text-white font-serif font-black", progressColor: "bg-orange-500" }
          ].map((comp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${comp.logoBg} flex items-center justify-center text-xs shrink-0 select-none`}>
                  {comp.logo}
                </div>
                <div className="leading-tight text-left">
                  <span className="font-bold text-xs text-slate-900 block">{comp.name}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Readiness {comp.rate}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${comp.progressColor}`} style={{ width: `${comp.rate}%` }} />
              </div>
            </div>
          ))}

          {/* Combined "View All Companies" card matching layout exactly */}
          <button
            onClick={() => onNavigateTab("company_prep")}
            className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-200 border-dashed hover:border-violet-300 transition-all space-y-2 flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group"
          >
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 transition-all group-hover:scale-105 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-xs text-violet-600 block">View All Companies</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">6 companies</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}

