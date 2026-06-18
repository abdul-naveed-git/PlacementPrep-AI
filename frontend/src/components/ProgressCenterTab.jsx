import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Flame, 
  Calendar,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase
} from "lucide-react";

export default function ProgressCenterTab({ roadmap, totalSolved, user }) {
  // Stateful Streak tracker with LocalStorage persistence
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("pf_current_streak");
    return saved ? parseInt(saved, 10) : 7;
  });
  const [hasCheckedInToday, setHasCheckedInToday] = useState(() => {
    const saved = localStorage.getItem("pf_checked_in_today");
    return saved === "true";
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Weekdays tracking configuration
  const weekdays = [
    { name: "Mon", status: "completed" },
    { name: "Tue", status: "completed" },
    { name: "Wed", status: "completed" },
    { name: "Thu", status: "completed" },
    { name: "Fri", status: hasCheckedInToday ? "completed" : "active" },
    { name: "Sat", status: "pending" },
    { name: "Sun", status: "pending" }
  ];

  const handleClaimCheckIn = () => {
    if (hasCheckedInToday) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    setHasCheckedInToday(true);
    setShowConfetti(true);
    localStorage.setItem("pf_current_streak", newStreak.toString());
    localStorage.setItem("pf_checked_in_today", "true");

    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  // Create beautiful progress trends
  const trendData = [
    { day: "Wk 1", rate: 5 },
    { day: "Wk 2", rate: 15 },
    { day: "Wk 3", rate: 28 },
    { day: "Wk 4", rate: 42 },
    { day: "Wk 5", rate: 60 },
    { day: "Wk 6", rate: Math.max(60, Math.min(100, Math.floor(totalSolved / 5) + 30)) }
  ];

  // Calculations for Topic Coverage & problems
  const totalTopics = roadmap?.topics?.length ?? 0;
  const completedTopics = roadmap?.topics?.filter(t => t.status === "completed")?.length ?? 0;
  const inProgressTopics = roadmap?.topics?.filter(t => t.status === "in-progress")?.length ?? 0;
  const topicsCoveragePercent =
    totalTopics > 0
      ? Math.round(((completedTopics + inProgressTopics * 0.5) / totalTopics) * 100)
      : 0;

  const totalProblems = roadmap?.topics?.reduce((acc, t) => acc + t.problems.length, 0) ?? 0;
  const completedProblems = roadmap?.topics?.reduce((acc, t) => acc + t.problems.filter(p => p.completed).length, 0) ?? 0;
  const problemsProgressPercent = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  // LeetCode Stats representation from User Profile or fallbacks
  const easySolved = user?.leetcodeStats?.easySolved ?? 0;
  const mediumSolved = user?.leetcodeStats?.mediumSolved ?? 0;
  const hardSolved = user?.leetcodeStats?.hardSolved ?? 0;
  const totalLeetCode = easySolved + mediumSolved + hardSolved;

  return (
    <div id="progress_center_dashboard_view" className="space-y-6 relative">
      
      {/* SUCCESS CONFETTI EFFECT OVERLAY */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-x-0 top-1/4 flex justify-between px-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -50, x: 0, opacity: 1, scale: Math.random() * 0.8 + 0.4 }}
                  animate={{ 
                    y: window.innerHeight * 0.7, 
                    x: (Math.random() - 0.5) * 300, 
                    rotate: 360,
                    opacity: 0 
                  }}
                  transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.8 }}
                  className={`w-3.5 h-3.5 rounded-full ${
                    i % 3 === 0 ? "bg-amber-400" : i % 3 === 1 ? "bg-violet-500" : "bg-emerald-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-display flex items-center gap-2">
          Progress Center
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
          Monitor your dynamic preparation metrics, interactive daily coding streaks, and roadmap milestone coverages.
        </p>
      </div>

      {/* CORE PROGRESS METRICS CARDS ROW (BENTO-STYLE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* HERO CARD A: DAILY CODING STREAK */}
        <div id="coding_streak_widget_card" className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between min-h-[190px] relative overflow-hidden group hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Daily Coding Streak</span>
              <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 animate-pulse">
                <Flame className="h-4.5 w-4.5 fill-orange-500 stroke-orange-500" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-mono font-black text-slate-900 tracking-tight">{streak}</span>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Days Active</span>
            </div>

            {/* Continuous Weekdays grid tracker */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {weekdays.map((day, i) => (
                <div key={i} className="text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 font-mono block select-none">
                    {day.name}
                  </span>
                  <div 
                    className={`h-6 rounded-md flex items-center justify-center font-mono text-[9px] font-black border transition-all ${
                      day.status === "completed"
                        ? "bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                        : day.status === "active"
                        ? "bg-orange-50 border-orange-200 text-orange-600 animate-pulse"
                        : "bg-slate-50 border-slate-150 text-slate-300"
                    }`}
                  >
                    {day.status === "completed" ? "✔" : "●"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4.5">
            <button
              onClick={handleClaimCheckIn}
              disabled={hasCheckedInToday}
              className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all outline-none flex items-center justify-center gap-1.5 cursor-pointer ${
                hasCheckedInToday 
                  ? "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed" 
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>{hasCheckedInToday ? "Checked in Today!" : "Secure Today's Check-in"}</span>
            </button>
          </div>
        </div>

        {/* HERO CARD B: PROBLEMS SOLVED */}
        <div id="problems_solved_widget_card" className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between min-h-[190px] hover:shadow-md transition-all">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Problems Solved Breakdown</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-mono font-black text-slate-950 tracking-tight">
                {totalLeetCode}
              </span>
              <span className="text-xs font-bold text-slate-500">Solved / 800 Target</span>
            </div>

            {/* Structured progress bars based on difficulty levels */}
            <div className="space-y-2 pt-0.5">
              {/* Easy */}
              <div className="space-y-1">
                <div id="easy_difficulty_solved_row" className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-emerald-600 uppercase tracking-wider font-extrabold">Easy Challenges</span>
                  <span className="text-slate-700 font-mono">{easySolved} / 200</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (easySolved / 200) * 100)}%` }} />
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1">
                <div id="medium_difficulty_solved_row" className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-amber-600 uppercase tracking-wider font-extrabold">Medium Challenges</span>
                  <span className="text-slate-700 font-mono">{mediumSolved} / 450</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (mediumSolved / 450) * 100)}%` }} />
                </div>
              </div>

              {/* Hard */}
              <div className="space-y-1">
                <div id="hard_difficulty_solved_row" className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-rose-600 uppercase tracking-wider font-extrabold">Hard Challenges</span>
                  <span className="text-slate-700 font-mono">{hardSolved} / 150</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (hardSolved / 150) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO CARD C: TOPICS COVERAGE RATIO */}
        <div id="topics_coverage_widget_card" className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between min-h-[190px] hover:shadow-md transition-all">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Topics Coverage Ratio</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Target className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-mono font-black text-slate-900 tracking-tight">{topicsCoveragePercent}%</span>
              <span className="text-xs font-bold text-slate-500">Overall Coverage</span>
            </div>

            {/* Circular representation statistics */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10.5px] text-slate-600 font-medium">Completed: <strong>{completedTopics} Lanes</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-[10.5px] text-slate-600 font-medium">In Progress: <strong>{inProgressTopics} Lanes</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="text-[10.5px] text-slate-500 font-medium font-bold">Unstarted: <strong>{totalTopics - completedTopics - inProgressTopics} Lanes</strong></span>
                </div>
              </div>

              {/* Progress Circle Visual */}
              <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="36" cy="36" r="30" stroke="#f1f5f9" strokeWidth="6.5" fill="transparent" />
                  <circle cx="36" cy="36" r="30" stroke="#4f46e5" strokeWidth="6.5" fill="transparent"
                    strokeDasharray={188.4}
                    strokeDashoffset={188.4 - (188.4 * topicsCoveragePercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[11px] font-mono font-black text-indigo-950">
                  {completedTopics}/{totalTopics}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CHARTS & DETAILED ROADMAP TOPIC PROGRESS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* LEFT COLUMN: TREND PROGRESS CHART (8 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Readiness Progression Matrix</h3>
              <p className="text-[10.5px] text-slate-550 leading-relaxed">Calculated weekly algorithmic confidence score based of solved patterns.</p>
            </div>
            <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 animate-pulse uppercase">
              Active Pace
            </span>
          </div>

          <div className="h-56 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "rgba(226,232,240,0.8)", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
                />
                <Area type="monotone" name="Readiness Score" dataKey="rate" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorConfRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED TOPIC COVERAGE LIST (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Lanes & Modules Coverage</h3>
            <p className="text-[10.5px] text-slate-550">Specific metrics and question completion statuses per milestone category.</p>
          </div>

          <div className="space-y-3.5 max-h-[235px] overflow-y-auto pr-1">
            {roadmap?.topics?.map((topic, id) => {
              const solvedCount = topic.problems.filter(p => p.completed).length;
              const totalCount = topic.problems.length;
              const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

              return (
                <div key={id} className="space-y-1.5 text-xs p-2.5 bg-slate-50/50 hover:bg-slate-50/100 border border-slate-100 rounded-2xl transition-all">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-extrabold truncate max-w-[200px]">{topic.topicName}</span>
                    <span className="font-mono text-[10.5px] text-slate-500 font-bold shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {solvedCount}/{totalCount} Completed
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent === 100 ? "bg-emerald-500" :
                          percent > 0 ? "bg-indigo-600" : "bg-slate-300"
                        }`} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-600 font-black shrink-0 w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            }) || (
              <p className="text-xs text-slate-500 text-center py-6">No topics available in current roadmap layout.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
