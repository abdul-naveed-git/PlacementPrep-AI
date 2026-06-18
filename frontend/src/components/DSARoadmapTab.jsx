import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowLeft,
  Check,
  Rocket,
  Compass,
  FileCode,
  Flame,
  Award,
  BookOpen,
  Eye,
  Star,
  Sparkles,
  Bot
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function DSARoadmapTab({ roadmap, onRoadmapUpdate, weakTopics }) {
  const [activeSubTab, setActiveSubTab] = useState("roadmap");
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [topPatterns, setTopPatterns] = useState([]);
  const [subTabLoading, setSubTabLoading] = useState(false);
  const [subTabError, setSubTabError] = useState(null);

  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Bookmarked problems synced with localStorage
  const [bookmarkedProblems, setBookmarkedProblems] = useState(() => {
    const saved = localStorage.getItem("pf_bookmarked_problems");
    return saved ? JSON.parse(saved) : [];
  });

  const isProblemBookmarked = (problemId) => {
    return bookmarkedProblems.some((p) => p.id === problemId);
  };

  const toggleBookmarkProblem = (prob, topicName) => {
    let list = [...bookmarkedProblems];
    const exists = list.some((p) => p.id === prob.id);
    if (exists) {
      list = list.filter((p) => p.id !== prob.id);
    } else {
      list.push({
        id: prob.id,
        title: prob.title,
        topic: topicName,
        difficulty: prob.difficulty,
        savedDate: "Just now",
        url: "https://leetcode.com/"
      });
    }
    setBookmarkedProblems(list);
    localStorage.setItem("pf_bookmarked_problems", JSON.stringify(list));
  };

  const [topics, setTopics] = useState([]);

  const mapRoadmapTopics = (roadmapData) => {
    if (!roadmapData?.topics?.length) {
      return [];
    }

    return roadmapData.topics.map((t, index) => {
      const mappedProblems = t.problems.map((p, pIdx) => ({
        id: p.id || `prob-${index}-${pIdx}`,
        title: p.title,
        url: p.url || "https://leetcode.com/",
        difficulty: p.difficulty || "Easy",
        completed: p.completed || false,
        topic: p.topic || t.topicName,
      }));

      const total = mappedProblems.length;
      const solved = mappedProblems.filter((p) => p.completed).length;
      const previousTopicCompleted =
        index === 0 ||
        roadmapData.topics[index - 1].problems?.every((p) => p.completed);
      let mappedStatus = "in-progress";

      if (!previousTopicCompleted) {
        mappedStatus = "locked";
      } else if (total > 0 && solved === total) {
        mappedStatus = "completed";
      } else if (solved > 0) {
        mappedStatus = "in-progress";
      }

      return {
        id: `topic-${index}`,
        name: t.topicName,
        status: mappedStatus,
        description: `Custom deep dive SDE curriculum module targeted for your profile and companies.`,
        progressPercent: total > 0 ? Math.round((solved / total) * 100) : 0,
        problems: mappedProblems,
      };
    });
  };

  useEffect(() => {
    setTopics(mapRoadmapTopics(roadmap));
  }, [roadmap]);

  useEffect(() => {
    const fetchSubTabData = async () => {
      if (activeSubTab === "roadmap") return;

      setSubTabLoading(true);
      setSubTabError(null);
      try {
        if (activeSubTab === "recommended") {
          const data = await apiRequest("/api/roadmap/recommended");
          setRecommendedProblems(data);
        } else if (activeSubTab === "patterns") {
          const data = await apiRequest("/api/roadmap/patterns");
          setTopPatterns(data);
        }
      } catch (err) {
        setSubTabError(err?.message || "Failed to load AI recommendations.");
      } finally {
        setSubTabLoading(false);
      }
    };

    fetchSubTabData();
  }, [activeSubTab]);

  const handleGenerateAILoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setGenerationError(null);
    try {
      const data = await apiRequest("/api/roadmap/generate", {
        method: "POST"
      });
      if (data && onRoadmapUpdate) {
        onRoadmapUpdate(data);
      }
    } catch (err) {
      setGenerationError(err?.message || "Failed to generate personalized roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Toggle problem status locally with backend proxy sync
  const toggleProblemCompleted = async (topicId, problemId) => {
    const topic = topics.find((item) => item.id === topicId);
    const problem = topic?.problems.find((item) => item.id === problemId);
    const nextCompleted = !problem?.completed;

    setTopics(prevTopics =>
      prevTopics.map(t => {
        if (t.id === topicId) {
          const updatedProblems = t.problems.map(p => {
            if (p.id === problemId) {
              return { ...p, completed: !p.completed };
            }
            return p;
          });
          const totalPr = updatedProblems.length;
          const solvedPr = updatedProblems.filter(p => p.completed).length;

          let newStatus = t.status;
          if (t.status !== "locked") {
            if (solvedPr === totalPr) {
              newStatus = "completed";
            } else if (solvedPr > 0) {
              newStatus = "in-progress";
            } else {
              newStatus = "in-progress";
            }
          }
          const finalPercent = totalPr > 0 ? Math.round((solvedPr / totalPr) * 100) : 0;
          return {
            ...t,
            problems: updatedProblems,
            status: newStatus,
            progressPercent: finalPercent
          };
        }
        return t;
      })
    );

    // Call server to persist if connected
    try {
      const updatedRoadmap = await apiRequest("/api/roadmap/problem/toggle", {
        method: "POST",
        body: JSON.stringify({ problemId, completed: nextCompleted })
      });
      onRoadmapUpdate?.(updatedRoadmap);
    } catch (e) {
      console.warn("Backend state stored sync bypass.");
    }
  };

  // Turn active topic completed/not completed
  const toggleTopicStatus = async (topicId) => {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic || topic.status === "locked") return;

    const nextCompleted = topic.status !== "completed";
    let latestRoadmap = null;

    setTopics((prevTopics) =>
      prevTopics.map((item) =>
        item.id === topicId
          ? {
              ...item,
              status: nextCompleted ? "completed" : "in-progress",
              progressPercent: nextCompleted ? 100 : 0,
              problems: item.problems.map((problem) => ({
                ...problem,
                completed: nextCompleted,
              })),
            }
          : item,
      ),
    );

    try {
      for (const problem of topic.problems) {
        latestRoadmap = await apiRequest("/api/roadmap/problem/toggle", {
          method: "POST",
          body: JSON.stringify({ problemId: problem.id, completed: nextCompleted }),
        });
      }

      if (latestRoadmap) {
        onRoadmapUpdate?.(latestRoadmap);
      }
    } catch (err) {
      console.warn("Failed to persist topic completion:", err);
      setTopics(mapRoadmapTopics(roadmap));
    }
  };

  const toggleRecommendedProblem = async (problemId, completed) => {
    setRecommendedProblems((prev) =>
      prev.map((problem) =>
        problem.id === problemId ? { ...problem, completed } : problem,
      ),
    );

    try {
      const data = await apiRequest("/api/roadmap/recommended/toggle", {
        method: "POST",
        body: JSON.stringify({ problemId, completed }),
      });
      setRecommendedProblems(data);
    } catch (err) {
      setSubTabError(err?.message || "Failed to update recommended problem.");
    }
  };

  const togglePattern = async (patternId, mastered) => {
    setTopPatterns((prev) =>
      prev.map((pattern) =>
        pattern.id === patternId ? { ...pattern, mastered } : pattern,
      ),
    );

    try {
      const data = await apiRequest("/api/roadmap/patterns/toggle", {
        method: "POST",
        body: JSON.stringify({ patternId, mastered }),
      });
      setTopPatterns(data);
    } catch (err) {
      setSubTabError(err?.message || "Failed to update pattern.");
    }
  };

  // Find the currently selected topic details
  const activeTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div id="dsa_roadmap_master_container" className="space-y-6">

      <AnimatePresence mode="wait">
        {!selectedTopicId ? (

          // ==================== LIST VIEW (LEFT HALF) ====================
          <motion.div
            key="list-view-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header copy precisely matching layout */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 font-display">
                DSA Roadmap
              </h1>
              <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                Your roadmap for mastering DSA and ace interviews. Level up your skills and track your progress.
              </p>
            </div>

            {/* TAB SELECTORS matching list view screenshot */}
            <div className="border-b border-slate-200">
              <div className="flex gap-8 text-xs font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("roadmap")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "roadmap"
                    ? "border-violet-650 text-violet-650 font-black"
                    : "border-transparent text-slate-450 hover:text-slate-900"
                    }`}
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("recommended")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "recommended"
                    ? "border-violet-650 text-violet-650 font-black"
                    : "border-transparent text-slate-450 hover:text-slate-900"
                    }`}
                >
                  Recommended Problems
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("patterns")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "patterns"
                    ? "border-violet-650 text-violet-650 font-black"
                    : "border-transparent text-slate-450 hover:text-slate-900"
                    }`}
                >
                  Top Patterns
                </button>
              </div>
            </div>

            {/* MAIN CONTENT BLOCK */}
            {activeSubTab === "roadmap" ? (
              <div className="space-y-6 w-full max-w-3xl">


                <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                  {/* TIMELINE GRID CONTAINER */}
                  <div className="relative pl-8 space-y-5">

                    {/* Vertical connect line */}
                    <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-slate-200" />

                    {topics.length === 0 && (
                      <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-3">
                        <p className="text-xs text-slate-500">
                          No live roadmap topics found yet. Generate a personalized roadmap to start tracking progress.
                        </p>
                        <button
                          type="button"
                          onClick={handleGenerateAILoadmap}
                          disabled={isGeneratingRoadmap}
                          className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 text-xs font-bold text-white transition-all inline-flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>{isGeneratingRoadmap ? "Generating..." : "Generate AI Roadmap"}</span>
                        </button>
                        {generationError && (
                          <p className="text-xs text-red-500">{generationError}</p>
                        )}
                      </div>
                    )}

                    {topics.map((topic, index) => {
                      const isCompleted = topic.status === "completed";
                      const isInProgress = topic.status === "in-progress";
                      const isLocked = topic.status === "locked";

                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            if (!isLocked) {
                              setSelectedTopicId(topic.id);
                            }
                          }}
                          className={`group relative flex items-center justify-between p-4.5 rounded-2xl border transition-all cursor-pointer ${isLocked
                            ? "bg-slate-50/50 border-slate-100 opacity-60 pointer-events-none"
                            : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/[0.02]"
                            }`}
                        >
                          {/* LEFT ELEMENT: TIMELINE ICON BADGE */}
                          <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {isCompleted && (
                              <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-sm z-10">
                                <Check className="h-4.5 w-4.5 stroke-[3]" />
                              </div>
                            )}
                            {isInProgress && (
                              <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-600 text-indigo-650 flex items-center justify-center font-bold text-xs select-none z-10">
                                {index + 1}
                              </div>
                            )}
                            {isLocked && (
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center z-10">
                                <Lock className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>

                          {/* MIDDLE LABELS */}
                          <div className="flex-1 pl-4">
                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {topic.name}
                            </h3>
                            <span className={`text-[11px] font-bold block mt-0.5 ${isCompleted ? "text-emerald-600" :
                              isInProgress ? "text-indigo-600" :
                                "text-slate-400"
                              }`}>
                              {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Locked"}
                            </span>
                          </div>

                          {/* RIGHT PARAMETERS */}
                          <div className="flex items-center gap-3">
                            {isInProgress && topic.progressPercent && (
                              <span className="font-mono text-xs font-black text-indigo-600 tracking-tight">
                                {topic.progressPercent}%
                              </span>
                            )}
                            {!isLocked && (
                              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
                            )}
                          </div>

                        </div>
                      );
                    })}

                  </div>

                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {subTabLoading && (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400">
                    <Compass className="h-10 w-10 text-slate-350 animate-spin mx-auto mb-3" />
                    <p className="text-xs font-bold">Loading AI recommendations...</p>
                  </div>
                )}

                {subTabError && (
                  <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600">
                    {subTabError}
                  </div>
                )}

                {!subTabLoading && activeSubTab === "recommended" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendedProblems.map((problem) => (
                      <div key={problem.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <a href={problem.url} target="_blank" rel="noreferrer" className="font-black text-sm text-slate-900 hover:text-indigo-600">
                              {problem.title}
                            </a>
                            <p className="text-[11px] text-slate-500 mt-1">{problem.topic} - {problem.difficulty}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleRecommendedProblem(problem.id, !problem.completed)}
                            className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                              problem.completed
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white border-slate-200 text-slate-300"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{problem.rationale}</p>
                      </div>
                    ))}
                    {recommendedProblems.length === 0 && (
                      <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                        No recommended problems yet.
                      </div>
                    )}
                  </div>
                )}

                {!subTabLoading && activeSubTab === "patterns" && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {topPatterns.map((pattern) => (
                      <div key={pattern.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-black text-sm text-slate-900">{pattern.patternName}</h3>
                          <button
                            type="button"
                            onClick={() => togglePattern(pattern.id, !pattern.mastered)}
                            className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                              pattern.mastered
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white border-slate-200 text-slate-300"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{pattern.description}</p>
                        <p className="text-[11px] font-bold text-indigo-600">{pattern.keyInsight}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Sample: {pattern.sampleProblem}</p>
                      </div>
                    ))}
                    {topPatterns.length === 0 && (
                      <div className="md:col-span-3 p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                        No top patterns yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        ) : (

          // ==================== DISK TOPIC PROBLEMS AREA (RIGHT HALF) ====================
          <motion.div
            key="topic-problems-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Nav and completions toggle block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* BREADCRUMB BARS */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <button
                  onClick={() => setSelectedTopicId(null)}
                  className="hover:text-indigo-600 transition-colors cursor-pointer select-none"
                >
                  DSA Roadmap
                </button>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span className="text-indigo-600">{activeTopic?.name}</span>
              </div>

              {/* MARK AS COMPLETED BUTTON */}
              <button
                onClick={() => activeTopic && toggleTopicStatus(activeTopic.id)}
                className="px-4 py-2 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className={`h-4 w-4 ${activeTopic?.status === "completed" ? "text-emerald-500 fill-emerald-500/10" : "text-slate-400"}`} />
                <span>
                  {activeTopic?.status === "completed" ? "Mark completed" : "Mark"}
                </span>
              </button>
            </div>

            {/* TOP TITLE JUMBOTRON */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5">
                {activeTopic?.status === "completed" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                )}
                <h1 className="text-3xl font-black text-slate-900 font-display">
                  {activeTopic?.name}
                </h1>
              </div>
              <span className={`text-xs uppercase font-extrabold tracking-wider block ${activeTopic?.status === "completed" ? "text-emerald-600" : "text-indigo-600"
                }`}>
                {activeTopic?.status === "completed" ? "Completed" : "In Progress"}
              </span>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-medium leading-relaxed">
                {activeTopic?.description}
              </p>
            </div>

            {/* PROBLEMS TABLE CONTAINER CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* Header column layout */}
              <div className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-widest font-mono font-black text-slate-450 select-none">
                <div className="col-span-2 sm:col-span-1 text-center">Problem</div>
                <div className="col-span-6 sm:col-span-7">Topic / Problem Name</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-center">Status</div>
              </div>

              {/* Problem listing rows */}
              <div className="divide-y divide-slate-100">
                {activeTopic?.problems.map((prob, idx) => {
                  const isBookmarked = isProblemBookmarked(prob.id);
                  return (
                    <div
                      key={prob.id}
                      className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-4 items-center hover:bg-slate-50/60 transition-all duration-150"
                    >

                      {/* Index */}
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <div className="w-6.5 h-6.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-650">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Problem Name + Star Bookmark Toggle */}
                      <div className="col-span-6 sm:col-span-7 pr-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmarkProblem(prob, activeTopic.name)}
                          className={`p-1 hover:scale-115 transition-transform shrink-0 cursor-pointer outline-none ${isBookmarked
                            ? "text-amber-500 scale-105"
                            : "text-slate-300 hover:text-amber-400"
                            }`}
                          title={isBookmarked ? "Remove Bookmark" : "Save Problem"}
                        >
                          <Star className={`h-4 w-4 ${isBookmarked ? "fill-amber-400 stroke-amber-500" : "stroke-slate-400"}`} />
                        </button>

                        <a
                          href="https://leetcode.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs sm:text-[13px] font-extrabold text-slate-800 hover:text-indigo-650 transition-colors block leading-tight hover:underline cursor-pointer break-words min-w-0"
                        >
                          {prob.title}
                        </a>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="col-span-2 flex justify-center">
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded-md ${prob.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          prob.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-red-50 text-red-650 border border-red-100"
                          } border`}>
                          {prob.difficulty}
                        </span>
                      </div>

                      {/* Completion Status checkmark button */}
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleProblemCompleted(activeTopic.id, prob.id)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${prob.completed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm hover:opacity-90"
                            : "bg-white border-slate-205 text-transparent hover:border-emerald-500 hover:text-emerald-500/50"
                            }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION FOOTER BAR */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Dispatched all ${activeTopic?.problems.length} targeted algorithmic tasks! Re-routing standard playground variables.`);
                }}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-550 text-white transition-all shadow-md font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.015]"
              >
                <Rocket className="h-4.5 w-4.5 text-white animate-pulse" />
                <span>Practice All Problems</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
