import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  Sparkles,
  Trash2,
  ExternalLink,
  BookOpen,
  Star,
  CheckCircle,
  Clock,
  Briefcase,
} from "lucide-react";

export default function BookmarksTab() {
  // Stateful bookmarked problems loaded from localStorage
  const [bookmarkedProblems, setBookmarkedProblems] = useState(() => {
    const saved = localStorage.getItem("pf_bookmarked_problems");
    return saved ? JSON.parse(saved) : [];
  });

  const [articles, setArticles] = useState([
    {
      id: "b-1",
      title: "Google SDE Intern Interview - Graphs & DP Intensive",
      source: "Crowdsourced logs",
      category: "interview_experience",
      savedDate: "2 days ago",
      note: "Important focus on Topological sort & finding longest cycle. Need to review course schedule.",
    },
    {
      id: "b-2",
      title: "Microsoft Placement OA Codility Patterns",
      source: "Crowdsourced logs",
      category: "interview_experience",
      savedDate: "4 days ago",
      note: "OA matches greedy pattern string manipulation questions. Speed parameter is critical.",
    },
    {
      id: "b-3",
      title: "Complexity Cheatsheet: Standard Trees & Graphs",
      source: "Curated sheets",
      category: "cheat_sheet",
      savedDate: "1 week ago",
      note: "Contains dynamic visual grids of BFS and DFS stack bounds. Useful for horizontal whiteboard queries.",
    },
  ]);

  // Synchronize dynamic updates
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("pf_bookmarked_problems");
      if (saved) {
        setBookmarkedProblems(JSON.parse(saved));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeProblemBookmark = (problemId) => {
    const updated = bookmarkedProblems.filter((p) => p.id !== problemId);
    setBookmarkedProblems(updated);
    localStorage.setItem("pf_bookmarked_problems", JSON.stringify(updated));
  };

  const removeArticle = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const getDifficultyStyles = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div id="bookmarks_workspace_view" className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 bg-slate-50/80 min-h-screen">
      {/* Visual Header Block – enhanced with subtle glow */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-5 rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5" /> Saved Library
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-0.5">
          Your Saved Problems & References
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          Review saved crowd-sourced articles, reference sheets, or difficult
          target LeetCode components.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: SAVED PROBLEM CARDS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Saved Problems ({bookmarkedProblems.length})</span>
            </h3>
            {bookmarkedProblems.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                Click titles → LeetCode
              </span>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {bookmarkedProblems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-10 text-center rounded-3xl bg-white border border-dashed border-slate-300 text-slate-400 space-y-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-200">
                  <Star className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    No bookmarked problems yet
                  </p>
                  <p className="text-[11.5px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Browse the <strong className="text-indigo-600">
                      DSA Roadmap
                    </strong>
                    , deep dive into topics like Arrays, Graphs, or Heaps, and
                    mark your target questions.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {bookmarkedProblems.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: idx * 0.03,
                    }}
                    whileHover={{
                      scale: 1.01,
                      borderColor: "#a5b4fc",
                      boxShadow: "0 8px 24px -8px rgba(99, 102, 241, 0.15)",
                      transition: { duration: 0.15 },
                    }}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[9px] font-black uppercase font-mono tracking-wider">
                          {p.topic}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono border ${getDifficultyStyles(
                            p.difficulty
                          )}`}
                        >
                          {p.difficulty}
                        </span>
                      </div>

                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-sm text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1 leading-snug group-hover:underline cursor-pointer"
                      >
                        <span className="truncate">{p.title}</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 shrink-0 group-hover:text-indigo-500 transition-colors" />
                      </a>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeProblemBookmark(p.id)}
                      className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-all shrink-0 cursor-pointer"
                      title="De-bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: SAVED ARTICLES & REFERENCES (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <span>Reference Items ({articles.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {articles.map((art, idx) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    delay: idx * 0.05,
                  }}
                  whileHover={{
                    scale: 1.01,
                    borderColor: "#c4b5fd",
                    boxShadow: "0 8px 24px -8px rgba(139, 92, 246, 0.12)",
                    transition: { duration: 0.12 },
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 transition-all space-y-2 relative"
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${art.category === "interview_experience"
                        ? "bg-violet-50 text-violet-700 border-violet-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                    >
                      {art.category.replace("_", " ")}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeArticle(art.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 leading-snug">
                      {art.title}
                    </h4>
                    <motion.p
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] text-slate-600 mt-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed italic"
                    >
                      "{art.note}"
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* QUICK LINKS BENTO CARD – enhanced with hover glow */}
          <motion.div
            whileHover={{
              boxShadow: "0 12px 32px -12px rgba(99, 102, 241, 0.20)",
              borderColor: "#a5b4fc",
            }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-indigo-50/30 border border-indigo-200/70 space-y-3"
          >
            <h4 className="font-extrabold text-[11px] text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Pre-seeded Quick Reference</span>
            </h4>
            <div className="space-y-2 text-[11.5px] text-slate-700">
              <motion.div
                whileHover={{
                  x: 4,
                  borderColor: "#818cf8",
                  backgroundColor: "#ffffff",
                }}
                className="p-2.5 bg-white/70 border border-slate-200/70 rounded-xl leading-normal flex justify-between items-center hover:shadow-sm transition-all cursor-default"
              >
                <span>The ultimate STAR Interview Matrix</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </motion.div>
              <motion.div
                whileHover={{
                  x: 4,
                  borderColor: "#818cf8",
                  backgroundColor: "#ffffff",
                }}
                className="p-2.5 bg-white/70 border border-slate-200/70 rounded-xl leading-normal flex justify-between items-center hover:shadow-sm transition-all cursor-default"
              >
                <span>Core Big & Small-O cheatsheets</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}