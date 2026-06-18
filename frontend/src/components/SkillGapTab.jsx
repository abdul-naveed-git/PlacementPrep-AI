import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  RefreshCw,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Clock,
  Award,
  BarChart3,
} from "lucide-react";
import { apiRequest } from "../lib/api";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      ease: "easeOut",
      duration: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } },
};

const cardVariants = {
  rest: { scale: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  hover: {
    scale: 1.01,
    boxShadow: "0 8px 30px rgba(99, 102, 241, 0.12)",
    transition: { duration: 0.2 },
  },
};

export default function SkillGapTab({ totalSolved }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSkillGapAnalysis = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await apiRequest("/api/ai/analyze-skills", {
        method: "POST",
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
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return <AlertOctagon className="h-3.5 w-3.5" />;
      case "high":
        return <TrendingDown className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <motion.div
      id="skill_gap_analysis_workspace"
      className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 min-h-screen rounded-3xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header bar */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        whileHover={{ boxShadow: "0 8px 30px rgba(51, 65, 85, 0.08)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-600 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Gemini Powered
            </span>
            <h2 className="text-xl font-black text-slate-800 mt-0.5">
              Skill Gap Analyzer
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Comparing your solved weights against tier-1 target requirements
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => fetchSkillGapAnalysis(true)}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 disabled:opacity-40 flex items-center gap-2 group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          title="Recalculate Gaps with Gemini"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
          />
          <span className="text-xs font-bold">Refresh</span>
        </motion.button>
      </motion.div>

      {loading ? (
        <motion.div
          variants={itemVariants}
          className="p-16 text-center rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Analyzing your skill matrix...
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Gemini AI is comparing your solved statistics against industry benchmarks
          </p>
        </motion.div>
      ) : analysis ? (
        <motion.div
          variants={containerVariants}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Chart column */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50"
            >
              <h3 className="font-extrabold text-sm text-slate-700 mb-5 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Skill Comparison: You vs. Company Expectation
              </h3>

              <div className="h-72 w-full text-xs font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analysis.comparisonChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="topicName"
                      stroke="#94a3b8"
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        color: "#1e293b",
                      }}
                      labelStyle={{
                        color: "#1e293b",
                        fontWeight: "bold",
                        fontSize: "12px"
                      }}
                      itemStyle={{
                        color: "#475569",
                        fontSize: "12px"
                      }}
                      cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <span className="text-xs font-medium text-slate-600">
                          {value}
                        </span>
                      )}
                    />
                    <Bar
                      name="Your Skill Index"
                      dataKey="studentSkill"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      name="Company Expectation"
                      dataKey="companyExpectation"
                      fill="#ec4899"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Identified gap items */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-orange-500" />
                Identified Domain Gaps
              </h3>
              <div className="space-y-3">
                {analysis.identifiedGaps.map((gap, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.1 }}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 4px 20px rgba(51, 65, 85, 0.08)",
                    }}
                    className="p-4 rounded-xl bg-white border border-slate-200 flex gap-4 hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="mt-0.5 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${getPriorityColor(
                          gap.priority
                        )}`}
                      >
                        {getPriorityIcon(gap.priority)}
                        {gap.priority}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-extrabold text-xs text-slate-800">
                        {gap.topic}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {gap.gapDescription}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 shrink-0 mt-1" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            {/* Dynamic gauge box */}
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-slate-200 shadow-sm shadow-slate-200/50 text-center space-y-4"
            >
              <span className="text-[10px] font-extrabold tracking-widest text-blue-600 uppercase flex items-center justify-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Skill Match Index
              </span>

              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-blue-600"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={
                      377 - (377 * analysis.skillLevelPercent) / 100
                    }
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={377}
                      to={377 - (377 * analysis.skillLevelPercent) / 100}
                      dur="1.5s"
                      fill="freeze"
                    />
                  </circle>
                </svg>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span className="text-3xl font-mono font-black text-slate-800">
                    {analysis.skillLevelPercent}%
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Readiness
                  </span>
                </motion.div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Derived from solved counts and weaknesses relative to target
                standards
              </p>
            </motion.div>

            {/* AI Priority recommendations */}
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-black text-xs text-slate-700 uppercase tracking-wider">
                  Priority Tasks
                </h4>
              </div>

              <div className="space-y-3">
                {analysis.priorityRecommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "#f8fafc",
                    }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-slate-200"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 mt-0.5 shrink-0">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-slate-700 leading-normal font-medium">
                      {rec}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <Award className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Strengths</p>
                  <p className="text-lg font-black text-emerald-700">
                    {analysis.strengths || 3}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                  <BarChart3 className="h-5 w-5 text-rose-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Weaknesses</p>
                  <p className="text-lg font-black text-rose-700">
                    {analysis.weaknesses || 2}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="p-16 text-center rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-amber-50 border border-amber-200">
              <AlertOctagon className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Analysis metrics not synced
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Please link your profile attributes to get started
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}