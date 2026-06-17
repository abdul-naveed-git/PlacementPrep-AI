import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function SkillGapTab({ totalSolved }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSkillGapAnalysis = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await apiRequest("/api/ai/analyze-skills", {
        method: "POST"
      });
      setAnalysis(data);
    } catch (err) {
      console.error("Failed to load skill gap matrix:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSkillGapAnalysis();
  }, [totalSolved]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "critical": return "text-red-400 bg-red-500/10 border-red-500/25";
      case "high": return "text-orange-400 bg-orange-500/10 border-orange-500/25";
      default: return "text-yellow-400 bg-yellow-500/10 border-yellow-500/25";
    }
  };

  return (
    <div id="skill_gap_analysis_workspace" className="space-y-6">
      
      {/* Header bar */}
      <div className="p-5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-violet-400">Expectation Matrix</span>
          <h2 className="text-lg font-black text-white mt-0.5">Gemini Skill Gap Analyzer</h2>
          <p className="text-xs text-slate-400 mt-1">Comparing LeetCode baseline solved weights against tier-1 target requirements.</p>
        </div>

        <button 
          onClick={() => fetchSkillGapAnalysis(true)}
          disabled={refreshing}
          className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer disabled:opacity-40"
          title="Recalculate Gaps with Gemini"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-xl bg-slate-900 border border-white/5 space-y-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Comparing solved statistics via Gemini AI engines...</p>
        </div>
      ) : analysis ? (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Chart column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
              <h3 className="font-extrabold text-sm text-slate-300 mb-5 uppercase tracking-wide">
                Comparison Grid: Student Skill vs Company expectation
              </h3>

              <div className="h-72 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analysis.comparisonChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis dataKey="topicName" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff", fontWeight: "bold" }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar name="Your Skill Index" dataKey="studentSkill" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar name="Company Bar Expectation" dataKey="companyExpectation" fill="#1e1b4b" stroke="#4f46e5" strokeWidth={1} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Identified gap items */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Identified Domain Gaps</h3>
              <div className="space-y-3">
                {analysis.identifiedGaps.map((gap, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex gap-4">
                    <div className="mt-0.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityColor(gap.priority)}`}>
                        {gap.priority}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-white">{gap.topic}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {gap.gapDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priorities right column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Dynamic gauge box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-950/20 to-indigo-950/20 border border-violet-500/10 text-center space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest text-violet-400 uppercase block">Skill Match Index</span>
              
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-violet-500"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * analysis.skillLevelPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-black text-white">{analysis.skillLevelPercent}%</span>
                  <span className="text-[10px] text-violet-300">Composite Readiness</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Derived dynamically based on solved counts and manual weaknesses relative to target standards.
              </p>
            </div>

            {/* AI Priority recommendations */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <h4 className="font-black text-xs text-white uppercase tracking-wider">Priority Tasks</h4>
              </div>

              <div className="space-y-3">
                {analysis.priorityRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-white/5">
                    <div className="p-1 rounded bg-violet-600/10 text-violet-400 mt-0.5 shrink-0">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-slate-300 leading-normal">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400">Analysis metrics not synced. Please link profile attributes.</div>
      )}

    </div>
  );
}
