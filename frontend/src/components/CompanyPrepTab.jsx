import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  HelpCircle,
  Calendar,
  Code,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target,
  Layers,
  Shield
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function CompanyPrepTab({ initialCompanies }) {
  const companiesList = initialCompanies || [];
  const [selectedCompany, setSelectedCompany] = useState(companiesList[0] || "");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    "study-company-tag": true,
    "solve-top-30": false,
    "mock-timer-interview": false,
    "behavioral-star-review": false,
    "system-design-basics": false,
  });

  const fetchCompanySummary = async (company) => {
    setLoading(true);
    setSummary(null);
    try {
      const data = await apiRequest("/api/ai/summarize-company", {
        method: "POST",
        body: JSON.stringify({ companyName: company })
      });
      setSummary(data);
    } catch (err) {
      console.error("Failed to load company prep insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanySummary(selectedCompany);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedCompany && companiesList.length > 0) {
      setSelectedCompany(companiesList[0]);
    }
  }, [companiesList, selectedCompany]);

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistItems = [
    { key: "study-company-tag", label: "Study LeetCode company tag problems (past 6 months)", icon: Code },
    { key: "solve-top-30", label: "Solve the top 30 most-frequently asked problems", icon: Target },
    { key: "mock-timer-interview", label: "Complete 3 random mock interviews on a timer", icon: Zap },
    { key: "behavioral-star-review", label: "Prepare STAR format answers for Leadership Principles", icon: Shield },
    { key: "system-design-basics", label: "Review horizontal vs vertical scalability diagrams", icon: Layers },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const progressPercentage = Object.values(checklist).filter(v => v).length / Object.values(checklist).length * 100;

  return (
    <motion.div
      id="company_preparation_workspace"
      className="space-y-8 p-6 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with gradient */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Company Preparation
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track your progress and ace your target company interviews</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-600">Live Updates</span>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="w-full bg-white/70 rounded-full h-2.5 overflow-hidden border border-gray-200/50"
        variants={itemVariants}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Target Companies selector row */}
      <motion.div
        className="flex flex-wrap gap-3"
        variants={itemVariants}
      >
        {companiesList.length > 0 ? companiesList.map((company, idx) => (
          <motion.button
            key={company}
            onClick={() => setSelectedCompany(company)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${selectedCompany === company
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/25"
              : "bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200/50 hover:border-indigo-300 hover:shadow-md hover:bg-white/90"
              }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{company}</span>
            {selectedCompany === company && (
              <motion.span
                className="ml-1 text-xs opacity-80"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ● Active
              </motion.span>
            )}
          </motion.button>
        )) : (
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 text-sm text-gray-500">
            Add target companies in your profile to generate company preparation insights.
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left column: Checklists */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          variants={itemVariants}
        >
          <motion.div
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-purple-500/5 space-y-5"
            whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.1)" }}
          >
            <div className="flex items-center gap-3 border-b border-gray-200/50 pb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Prep Checklist</h3>
                <p className="text-xs text-gray-500">{Math.round(progressPercentage)}% Complete</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Track essential checkpoints for your <span className="font-semibold text-indigo-600">{selectedCompany}</span> preparation.
            </p>

            <div className="space-y-3">
              {checklistItems.map((item, idx) => {
                const Icon = item.icon;
                const isChecked = checklist[item.key] || false;
                return (
                  <motion.label
                    key={item.key}
                    whileHover={{ x: 4 }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-sm ${isChecked
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-gray-700 shadow-sm"
                      : "bg-white/50 border-gray-200/50 text-gray-600 hover:border-indigo-200 hover:bg-gray-50/50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecklistItem(item.key)}
                      className="mt-0.5 rounded border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${isChecked ? 'text-indigo-500' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isChecked && (
                        <motion.span
                          className="text-xs text-indigo-500 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          ✓ Completed
                        </motion.span>
                      )}
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/30 backdrop-blur-sm space-y-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/25">
                <Award className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-gray-800">Placement Readiness</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Complete your checklist to boost your placement readiness score by up to <span className="font-bold text-indigo-600">20%</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage * 0.2}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">{Math.round(progressPercentage * 0.2)}%</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right column: Dynamic summaries */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-16 text-center rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Gemini AI is preparing your interview strategy...</p>
                <p className="text-xs text-gray-400">Analyzing company patterns and creating personalized insights</p>
              </motion.div>
            ) : summary ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Core summary banner */}
                <motion.div
                  className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-purple-500/5 space-y-5"
                  whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.08)" }}
                >
                  <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Interview Stages for {summary.companyName}
                        </h3>
                        <p className="text-xs text-gray-500">Personalized breakdown of each round</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      Updated {summary.lastUpdated}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {summary.roundWiseSummaries.map((round, idx) => (
                      <motion.div
                        key={idx}
                        className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            Round {idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">{round.roundName}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{round.details}</p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {round.focusTopics.map((topic, i) => (
                            <motion.span
                              key={i}
                              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-indigo-200/50 text-gray-700 shadow-sm"
                              whileHover={{ scale: 1.05, y: -1 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {topic}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Extra insights columns */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Frequently Asked Topics */}
                  <motion.div
                    className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-purple-500/5 space-y-4"
                    whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.08)" }}
                  >
                    <div className="flex items-center gap-3 border-b border-gray-200/50 pb-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-gray-800">Hot DSA Topics</h4>
                    </div>
                    <div className="space-y-3">
                      {summary.frequentlyAskedTopics.map((topic, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200/50"
                          whileHover={{ x: 4 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <span className="font-medium text-gray-700">{topic.topic}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${topic.frequency === "High"
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : "bg-amber-100 text-amber-600 border border-amber-200"
                            }`}>
                            {topic.frequency}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Common Pitfalls */}
                  <motion.div
                    className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-purple-500/5 space-y-4"
                    whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.08)" }}
                  >
                    <div className="flex items-center gap-3 border-b border-gray-200/50 pb-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-gray-800">Common Pitfalls</h4>
                    </div>
                    <ul className="space-y-3">
                      {summary.commonMistakes.map((mistake, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100/50"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ x: -4 }}
                        >
                          <span className="text-amber-500 text-lg mt-0.5">⚠</span>
                          <span className="text-sm text-gray-700 leading-relaxed">{mistake}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-16 text-center rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg"
              >
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-600 font-medium">Insights could not be retrieved</p>
                <p className="text-sm text-gray-400 mt-1">Please try selecting a different company</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}