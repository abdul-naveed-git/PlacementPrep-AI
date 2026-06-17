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
  Briefcase
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
      note: "Important focus on Topological sort & finding longest cycle. Need to review course schedule."
    },
    {
      id: "b-2",
      title: "Microsoft Placement OA Codility Patterns",
      source: "Crowdsourced logs",
      category: "interview_experience",
      savedDate: "4 days ago",
      note: "OA matches greedy pattern string manipulation questions. Speed parameter is critical."
    },
    {
      id: "b-3",
      title: "Complexity Cheatsheet: Standard Trees & Graphs",
      source: "Curated sheets",
      category: "cheat_sheet",
      savedDate: "1 week ago",
      note: "Contains dynamic visual grids of BFS and DFS stack bounds. Useful for horizontal whiteboard queries."
    }
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
    const updated = bookmarkedProblems.filter(p => p.id !== problemId);
    setBookmarkedProblems(updated);
    localStorage.setItem("pf_bookmarked_problems", JSON.stringify(updated));
  };

  const removeArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const getDifficultyStyles = (diff) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-600 border-emerald-150";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-150";
      default:
        return "bg-rose-50 text-rose-600 border-rose-150";
    }
  };

  return (
    <div id="bookmarks_workspace_view" className="space-y-6">
      
      {/* Visual Header Block */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-600">Saved Library</span>
        <h2 className="text-xl font-black text-slate-900 mt-0.5">Your Saved Problems & References</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          Review saved crowd-sourced articles, reference sheets, or difficult target LeetCode components.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: SAVED PROBLEM CARDS LISTING (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Saved Problems ({bookmarkedProblems.length})</span>
            </h3>
            {bookmarkedProblems.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                Click titles to practice on LeetCode
              </span>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {bookmarkedProblems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-10 text-center rounded-3xl bg-white border border-dashed border-slate-250 text-slate-400 space-y-3 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-150">
                  <Star className="h-5 w-5 text-slate-350" />
                </div>
                <div>
                  <p className="text-semibold text-slate-700 text-sm">No bookmarked problems yet</p>
                  <p className="text-[11.5px] text-slate-450 mt-1 max-w-sm mx-auto">
                    Browse the <strong className="text-indigo-600">DSA Roadmap</strong>, deep dive into topics like Arrays, Graphs, or Heaps, and mark your target questions.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {bookmarkedProblems.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xs transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-650 text-[9px] font-black uppercase font-mono tracking-wider">
                          {p.topic}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono border ${getDifficultyStyles(p.difficulty)}`}>
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
                        <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                      </a>
                    </div>

                    <button 
                      onClick={() => removeProblemBookmark(p.id)}
                      className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-slate-50 transition-all shrink-0 cursor-pointer"
                      title="De-bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COMPONENT: SAVED ARTICLES & REFERENCES (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <span>Reference Items ({articles.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {articles.map((art) => (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-2 relative"
                >
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                      art.category === "interview_experience" 
                        ? "bg-violet-50 text-violet-650 border-violet-100" 
                        : "bg-emerald-50 text-emerald-650 border-emerald-100"
                    }`}>
                      {art.category.replace("_", " ")}
                    </span>

                    <button 
                      onClick={() => removeArticle(art.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed italic">
                      "{art.note}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* QUICK LINKS BENTO CARD */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-100 space-y-3">
            <h4 className="font-extrabold text-[11px] text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>Pre-seeded Quick Reference</span>
            </h4>
            <div className="space-y-2 text-[11.5px] text-slate-600">
              <div className="p-2 sm:p-2.5 bg-white border border-slate-100 rounded-xl leading-normal flex justify-between items-center hover:shadow-xs transition-shadow">
                <span>The ultimate STAR Interview Matrix</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </div>
              <div className="p-2 sm:p-2.5 bg-white border border-slate-100 rounded-xl leading-normal flex justify-between items-center hover:shadow-xs transition-shadow">
                <span>Core Big & Small-O cheatsheets</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
