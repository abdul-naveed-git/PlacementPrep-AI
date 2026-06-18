import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Check,
  Rocket,
  Compass,
  BookOpen,
  Star,
  Sparkles,
  Bot,
  Clock
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function DSARoadmapTab({ roadmap, onRoadmapUpdate, weakTopics }) {
  const [activeSubTab, setActiveSubTab] = useState("roadmap");
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [recommendedProblems, setRecommendedProblems] = useState([]);
  const [topPatterns, setTopPatterns] = useState([]);
  const [isLoadingSubTab, setIsLoadingSubTab] = useState(false);
  const [subTabError, setSubTabError] = useState(null);

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

  // High-fidelity preseeded topics to match Image 2 exactly!
  const [topics, setTopics] = useState([
    {
      id: "arrays",
      name: "Arrays",
      status: "completed",
      description: "Learn and practice problems revolving on arrays.",
      problems: [
        { id: "arr-1", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", completed: true, topic: "Arrays" },
        { id: "arr-2", title: "Contains Duplicate", difficulty: "Easy", completed: true, topic: "Arrays" },
        { id: "arr-3", title: "Product of Array Except Self", difficulty: "Medium", completed: true, topic: "Arrays" },
        { id: "arr-4", title: "Maximum Subarray", difficulty: "Medium", completed: true, topic: "Arrays" },
        { id: "arr-5", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", completed: true, topic: "Arrays" },
        { id: "arr-6", title: "3 Sum", difficulty: "Medium", completed: true, topic: "Arrays" },
        { id: "arr-7", title: "Trapping Rain Water", difficulty: "Hard", completed: true, topic: "Arrays" },
        { id: "arr-8", title: "Maximum Product Subarray", difficulty: "Hard", completed: true, topic: "Arrays" }
      ]
    },
    {
      id: "strings",
      name: "Strings",
      status: "completed",
      description: "Master string matching algorithms, manipulations, and frequency maps.",
      problems: [
        { id: "str-1", title: "Valid Anagram", difficulty: "Easy", completed: true, topic: "Strings" },
        { id: "str-2", title: "Valid Palindrome", difficulty: "Easy", completed: true, topic: "Strings" },
        { id: "str-3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", completed: true, topic: "Strings" },
        { id: "str-4", title: "Longest Repeating Character Replacement", difficulty: "Medium", completed: true, topic: "Strings" }
      ]
    },
    {
      id: "twopointers",
      name: "Two Pointers",
      status: "completed",
      description: "Solve linear scanning problems efficiently using dual runners.",
      problems: [
        { id: "tp-1", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", completed: true, topic: "Two Pointers" },
        { id: "tp-2", title: "Container With Most Water", difficulty: "Medium", completed: true, topic: "Two Pointers" }
      ]
    },
    {
      id: "stackqueue",
      name: "Stack & Queue",
      status: "completed",
      description: "Solve nested parsing, monotonic tracking, and FIFO buffers.",
      problems: [
        { id: "sq-1", title: "Valid Parentheses", difficulty: "Easy", completed: true, topic: "Stack & Queue" },
        { id: "sq-2", title: "Min Stack", difficulty: "Medium", completed: true, topic: "Stack & Queue" }
      ]
    },
    {
      id: "dp",
      name: "Dynamic Programming",
      status: "in-progress",
      progressPercent: 68,
      description: "Unravel recursive memoization and bottom-up SDE dynamic programming equations.",
      problems: [
        { id: "dp-1", title: "Climbing Stairs", difficulty: "Easy", completed: true, topic: "Dynamic Programming" },
        { id: "dp-2", title: "Min Cost Climbing Stairs", difficulty: "Easy", completed: true, topic: "Dynamic Programming" },
        { id: "dp-3", title: "House Robber", difficulty: "Medium", completed: true, topic: "Dynamic Programming" },
        { id: "dp-4", title: "House Robber II", difficulty: "Medium", completed: true, topic: "Dynamic Programming" },
        { id: "dp-5", title: "Longest Palindromic Substring", difficulty: "Medium", completed: false, topic: "Dynamic Programming" },
        { id: "dp-6", title: "Coin Change", difficulty: "Medium", completed: false, topic: "Dynamic Programming" },
        { id: "dp-7", title: "Longest Common Subsequence", difficulty: "Medium", completed: false, topic: "Dynamic Programming" }
      ]
    },
    {
      id: "graphs",
      name: "Graphs",
      status: "locked",
      description: "Traverse spatial relations via BFS, DFS, Dijkstra, and MST Kruskal algorithms.",
      problems: [
        { id: "gr-1", title: "Number of Islands", difficulty: "Medium", completed: false, topic: "Graphs" },
        { id: "gr-2", title: "Clone Graph", difficulty: "Medium", completed: false, topic: "Graphs" },
        { id: "gr-3", title: "Course Schedule", difficulty: "Medium", completed: false, topic: "Graphs" }
      ]
    },
    {
      id: "tree",
      name: "Tree",
      status: "locked",
      description: "Deconstruct hierarchic recursion, binary tree pathways, and BST rules.",
      problems: [
        { id: "tr-1", title: "Invert Binary Tree", difficulty: "Easy", completed: false, topic: "Tree" },
        { id: "tr-2", title: "Maximum Depth of Binary Tree", difficulty: "Easy", completed: false, topic: "Tree" },
        { id: "tr-3", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", completed: false, topic: "Tree" }
      ]
    },
    {
      id: "trie",
      name: "Trie",
      status: "locked",
      description: "Manipulate localized alphabetic search directories and prefix parameters.",
      problems: [
        { id: "tri-1", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", completed: false, topic: "Trie" },
        { id: "tri-2", title: "Design Add and Search Words Data Structure", difficulty: "Medium", completed: false, topic: "Trie" }
      ]
    }
  ]);

  const buildRoadmapPayload = (nextTopics) => ({
    ...(roadmap || {}),
    topics: nextTopics.map((topic) => {
      const total = topic.problems.length;
      const solved = topic.problems.filter((problem) => problem.completed).length;
      const progressPercent = total > 0 ? Math.round((solved / total) * 100) : 0;

      return {
        topicName: topic.name,
        description: topic.description,
        status: topic.status === "locked" ? "pending" : topic.status,
        progressPercent,
        problems: topic.problems.map((problem) => ({
          ...problem,
          completed: Boolean(problem.completed),
          topic: problem.topic || topic.name,
        })),
      };
    }),
  });

  // Sync state with prop
  useEffect(() => {
    if (roadmap && roadmap.topics && roadmap.topics.length > 0) {
      const mapped = roadmap.topics.map((t, index) => {
        const mappedProblems = t.problems.map((p, pIdx) => ({
          id: p.id || `prob-${index}-${pIdx}`,
          title: p.title,
          difficulty: p.difficulty || "Easy",
          completed: p.completed || false,
          topic: p.topic || t.topicName
        }));

        let mappedStatus = "in-progress";
        const total = mappedProblems.length;
        const solved = mappedProblems.filter(p => p.completed).length;

        if (total > 0 && solved === total) {
          mappedStatus = "completed";
        } else if (solved > 0) {
          mappedStatus = "in-progress";
        } else if (index > 0 && roadmap.topics[index - 1].problems?.every((p) => p.completed) === false) {
          mappedStatus = "locked";
        }

        return {
          id: `topic-${index}`,
          name: t.topicName,
          status: mappedStatus,
          description: `Custom deep dive SDE curriculum module targeted for your profiles and companies.`,
          progressPercent: total > 0 ? Math.round((solved / total) * 100) : 0,
          problems: mappedProblems
        };
      });
      setTopics(mapped);
    }
  }, [roadmap]);

  useEffect(() => {
    const loadSubTabData = async () => {
      if (activeSubTab === "recommended" && recommendedProblems.length === 0) {
        setIsLoadingSubTab(true);
        setSubTabError(null);
        try {
          const data = await apiRequest("/api/roadmap/recommended");
          setRecommendedProblems(Array.isArray(data) ? data : []);
        } catch (err) {
          setSubTabError(err?.message || "Failed to load recommended problems.");
        } finally {
          setIsLoadingSubTab(false);
        }
      }

      if (activeSubTab === "patterns" && topPatterns.length === 0) {
        setIsLoadingSubTab(true);
        setSubTabError(null);
        try {
          const data = await apiRequest("/api/roadmap/patterns");
          setTopPatterns(Array.isArray(data) ? data : []);
        } catch (err) {
          setSubTabError(err?.message || "Failed to load top patterns.");
        } finally {
          setIsLoadingSubTab(false);
        }
      }
    };

    loadSubTabData();
  }, [activeSubTab, recommendedProblems.length, topPatterns.length]);

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

  const toggleRecommendedProblem = async (problemId, completed) => {
    const previousProblems = recommendedProblems;
    const nextProblems = recommendedProblems.map((problem) =>
      problem.id === problemId ? { ...problem, completed } : problem
    );

    setRecommendedProblems(nextProblems);
    try {
      const data = await apiRequest("/api/roadmap/recommended/toggle", {
        method: "POST",
        body: JSON.stringify({ problemId, completed }),
      });
      setRecommendedProblems(Array.isArray(data) ? data : nextProblems);
    } catch (err) {
      setRecommendedProblems(previousProblems);
      setSubTabError(err?.message || "Failed to update recommended problem.");
    }
  };

  const togglePatternMastered = async (patternId, mastered) => {
    const previousPatterns = topPatterns;
    const nextPatterns = topPatterns.map((pattern) =>
      pattern.id === patternId ? { ...pattern, mastered } : pattern
    );

    setTopPatterns(nextPatterns);
    try {
      const data = await apiRequest("/api/roadmap/patterns/toggle", {
        method: "POST",
        body: JSON.stringify({ patternId, mastered }),
      });
      setTopPatterns(Array.isArray(data) ? data : nextPatterns);
    } catch (err) {
      setTopPatterns(previousPatterns);
      setSubTabError(err?.message || "Failed to update pattern status.");
    }
  };

  // Toggle problem status locally with backend proxy sync
  const toggleProblemCompleted = async (topicId, problemId) => {
    const currentProblem = topics
      .find((topic) => topic.id === topicId)
      ?.problems.find((problem) => problem.id === problemId);
    const nextCompleted = !currentProblem?.completed;

    const nextTopics = topics.map(t => {
        if (t.id === topicId) {
          const updatedProblems = t.problems.map(p => {
            if (p.id === problemId) {
              return { ...p, completed: nextCompleted };
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
      });

    const previousTopics = topics;
    const fallbackPayload = buildRoadmapPayload(nextTopics);

    setTopics(nextTopics);
    onRoadmapUpdate?.(fallbackPayload);

    const problemExistsInRoadmap = roadmap?.topics?.some((topic) =>
      topic.problems?.some((problem) => problem.id === problemId)
    );

    if (roadmap?._id && problemExistsInRoadmap) {
      try {
        const savedRoadmap = await apiRequest("/api/roadmap/problem/toggle", {
          method: "POST",
          body: JSON.stringify({
            roadmapId: roadmap._id,
            problemId,
            completed: nextCompleted,
          })
        });
        onRoadmapUpdate?.(savedRoadmap || fallbackPayload);
      } catch (err) {
        setTopics(previousTopics);
        onRoadmapUpdate?.(buildRoadmapPayload(previousTopics));
        setGenerationError(err?.message || "Failed to save roadmap progress.");
      }
    }
  };

  // Turn active topic completed/not completed
  const toggleTopicStatus = async (topicId) => {
    const nextTopics = topics.map(t => {
        if (t.id === topicId) {
          const targetStatus = t.status === "completed" ? "in-progress" : "completed";
          const targetProblems = t.problems.map(p => ({
            ...p,
            completed: targetStatus === "completed"
          }));
          const totalPr = targetProblems.length;
          const solvedPr = targetProblems.filter(p => p.completed).length;
          return {
            ...t,
            status: targetStatus,
            problems: targetProblems,
            progressPercent: totalPr > 0 ? Math.round((solvedPr / totalPr) * 100) : 0
          };
        }
        return t;
      });

    const previousTopics = topics;
    const fallbackPayload = buildRoadmapPayload(nextTopics);

    setTopics(nextTopics);
    onRoadmapUpdate?.(fallbackPayload);

    const updatedTopic = nextTopics.find((topic) => topic.id === topicId);
    const topicExistsInRoadmap = roadmap?.topics?.some((topic) =>
      topic.problems?.some((problem) =>
        updatedTopic?.problems.some((updatedProblem) => updatedProblem.id === problem.id)
      )
    );

    if (roadmap?._id && updatedTopic && topicExistsInRoadmap) {
      try {
        await Promise.all(
          updatedTopic.problems.map((problem) =>
            apiRequest("/api/roadmap/problem/toggle", {
              method: "POST",
              body: JSON.stringify({
                roadmapId: roadmap._id,
                problemId: problem.id,
                completed: problem.completed,
              }),
            })
          )
        );
      } catch (err) {
        setTopics(previousTopics);
        onRoadmapUpdate?.(buildRoadmapPayload(previousTopics));
        setGenerationError(err?.message || "Failed to save topic progress.");
      }
    }
  };

  // Find the currently selected topic details
  const activeTopic = topics.find(t => t.id === selectedTopicId);

  // Get status config for styling
  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        progressColor: "bg-emerald-500",
        borderColor: "border-emerald-500/20",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        iconBg: "bg-emerald-50 border-emerald-500 text-emerald-600",
        statusLabel: "Completed"
      },
      "in-progress": {
        progressColor: "bg-indigo-600",
        borderColor: "border-indigo-600/20",
        badgeBg: "bg-indigo-50",
        badgeText: "text-indigo-700",
        iconBg: "bg-indigo-50 border-indigo-600 text-indigo-600",
        statusLabel: "In Progress"
      },
      locked: {
        progressColor: "bg-slate-300",
        borderColor: "border-slate-200/20",
        badgeBg: "bg-slate-50",
        badgeText: "text-slate-500",
        iconBg: "bg-slate-100 border-slate-200 text-slate-400",
        statusLabel: "Locked"
      }
    };
    return configs[status || "locked"];
  };

  return (
    <div id="dsa_roadmap_master_container" className="relative isolate space-y-6">

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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 font-display">
                    DSA Roadmap
                  </h1>
                  <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                    Your roadmap for mastering DSA and ace interviews. Level up your skills and track your progress.
                  </p>
                  {weakTopics?.length > 0 && (
                    <p className="text-[11px] text-indigo-600 font-bold mt-1">
                      Focus areas: {weakTopics.slice(0, 3).join(", ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAILoadmap}
                  disabled={isGeneratingRoadmap}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isGeneratingRoadmap ? "Generating..." : "Generate AI Roadmap"}</span>
                </button>
              </div>
              {generationError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {generationError}
                </div>
              )}
            </div>

            {/* TAB SELECTORS matching list view screenshot */}
            <div className="border-b border-slate-200">
              <div className="flex gap-8 text-xs font-semibold select-none">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("roadmap")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "roadmap"
                    ? "border-indigo-600 text-indigo-600 font-black"
                    : "border-transparent text-slate-450 hover:text-slate-900"
                    }`}
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("recommended")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "recommended"
                    ? "border-indigo-600 text-indigo-600 font-black"
                    : "border-transparent text-slate-450 hover:text-slate-900"
                    }`}
                >
                  Recommended Problems
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("patterns")}
                  className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${activeSubTab === "patterns"
                    ? "border-indigo-600 text-indigo-600 font-black"
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

                    {/* Vertical connect line with animated progress */}
                    <div className="pointer-events-none absolute top-4 bottom-4 left-[15px] w-0.5 bg-slate-200" />
                    <motion.div
                      className="pointer-events-none absolute top-4 left-[15px] w-0.5 bg-indigo-600 origin-top"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      style={{ height: `${(topics.filter(t => t.status === "completed").length / topics.length) * 100}%` }}
                    />

                    {topics.map((topic, index) => {
                      const isCompleted = topic.status === "completed";
                      const isInProgress = topic.status === "in-progress";
                      const isLocked = topic.status === "locked";
                      const config = getStatusConfig(topic.status);

                      return (
                        <motion.div
                          key={topic.id}
                          onClick={() => {
                            if (!isLocked) {
                              setSelectedTopicId(topic.id);
                            }
                          }}
                          className={`group relative flex items-center justify-between p-4.5 rounded-2xl border transition-all cursor-pointer ${isLocked
                            ? "bg-slate-50/50 border-slate-100 opacity-60 cursor-not-allowed"
                            : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/[0.02]"
                            }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.08 }}
                          whileHover={!isLocked ? { scale: 1.01, transition: { duration: 0.2 } } : {}}
                        >
                          {/* LEFT ELEMENT: TIMELINE ICON BADGE */}
                          <div className="absolute left-[-32px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                            <motion.div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-sm z-10 ${config.iconBg}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.08 + 0.2, type: "spring" }}
                              whileHover={{ scale: 1.15 }}
                            >
                              {isCompleted && <Check className="h-4.5 w-4.5 stroke-[3]" />}
                              {isInProgress && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                  <Clock className="h-4 w-4" />
                                </motion.div>
                              )}
                              {isLocked && <Lock className="h-3.5 w-3.5" />}
                            </motion.div>
                          </div>

                          {/* MIDDLE LABELS */}
                          <div className="flex-1 pl-4">
                            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {topic.name}
                            </h3>
                            <span className={`text-[11px] font-bold block mt-0.5 ${config.badgeText}`}>
                              {config.statusLabel}
                            </span>
                          </div>

                          {/* RIGHT PARAMETERS */}
                          <div className="flex items-center gap-3">
                            {isInProgress && topic.progressPercent && (
                              <motion.span
                                className="font-mono text-xs font-black text-indigo-600 tracking-tight"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.08 + 0.4 }}
                              >
                                {topic.progressPercent}%
                              </motion.span>
                            )}
                            {!isLocked && (
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-all" />
                              </motion.div>
                            )}
                          </div>

                          {/* Progress bar for in-progress items */}
                          {isInProgress && (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
                              <motion.div
                                className="h-full bg-indigo-600 rounded-b-2xl"
                                initial={{ width: 0 }}
                                animate={{ width: `${topic.progressPercent || 0}%` }}
                                transition={{ duration: 1, delay: index * 0.08 + 0.4, ease: "easeOut" }}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    {/* Animated end dot */}
                    <motion.div
                      className="pointer-events-none absolute left-[15px] -bottom-6 transform -translate-x-1/2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: topics.length * 0.08 + 0.3, type: "spring" }}
                    >
                      <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-sm" />
                    </motion.div>

                  </div>

                </div>
              </div>
            ) : activeSubTab === "recommended" ? (
              <motion.div
                className="space-y-4 w-full max-w-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-black text-lg text-slate-900">Recommended Problems</h2>
                    <p className="text-xs text-slate-500">Targeted practice generated from your weak topics and company goals.</p>
                  </div>
                  <Bot className="h-5 w-5 text-indigo-600" />
                </div>

                {isLoadingSubTab ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400 space-y-3">
                    <Compass className="h-8 w-8 mx-auto animate-spin" />
                    <p className="text-xs font-bold">Loading recommendations...</p>
                  </div>
                ) : subTabError ? (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700">
                    {subTabError}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendedProblems.map((problem) => (
                      <div key={problem.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <a
                              href={problem.url || "https://leetcode.com/"}
                              target="_blank"
                              rel="noreferrer"
                              className="font-extrabold text-sm text-slate-900 hover:text-indigo-600"
                            >
                              {problem.title}
                            </a>
                            <p className="text-[11px] text-slate-500 mt-1">{problem.topic}</p>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                            problem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600" :
                            problem.difficulty === "Medium" ? "bg-amber-50 text-amber-600" :
                            "bg-red-50 text-red-600"
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{problem.rationale}</p>
                        <button
                          type="button"
                          onClick={() => toggleRecommendedProblem(problem.id, !problem.completed)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            problem.completed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-200"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{problem.completed ? "Completed" : "Mark Completed"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4 w-full max-w-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-black text-lg text-slate-900">Top Patterns</h2>
                    <p className="text-xs text-slate-500">Reusable interview patterns to master for your target companies.</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>

                {isLoadingSubTab ? (
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-400 space-y-3">
                    <Compass className="h-8 w-8 mx-auto animate-spin" />
                    <p className="text-xs font-bold">Loading patterns...</p>
                  </div>
                ) : subTabError ? (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700">
                    {subTabError}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {topPatterns.map((pattern) => (
                      <div key={pattern.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                        <div className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-900">{pattern.patternName}</h3>
                            <p className="text-[11px] text-slate-500 mt-1">{pattern.sampleProblem}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{pattern.description}</p>
                        <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{pattern.keyInsight}</p>
                        <button
                          type="button"
                          onClick={() => togglePatternMastered(pattern.id, !pattern.mastered)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            pattern.mastered
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-200"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{pattern.mastered ? "Mastered" : "Mark Mastered"}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
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
            <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* BREADCRUMB BARS */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <button
                  type="button"
                  onClick={() => setSelectedTopicId(null)}
                  className="-m-2 rounded-lg p-2 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors cursor-pointer select-none"
                >
                  DSA Roadmap
                </button>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <motion.span
                  className="text-indigo-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTopic?.name}
                </motion.span>
              </div>

              {/* MARK AS COMPLETED BUTTON */}
              <motion.button
                type="button"
                onClick={() => activeTopic && toggleTopicStatus(activeTopic.id)}
                className="px-4 py-2 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 className={`h-4 w-4 ${activeTopic?.status === "completed" ? "text-emerald-500 fill-emerald-500/10" : "text-slate-400"}`} />
                <span>
                  {activeTopic?.status === "completed" ? "Mark completed" : "Mark"}
                </span>
              </motion.button>
            </div>

            {/* TOP TITLE JUMBOTRON */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5">
                {activeTopic?.status === "completed" && (
                  <motion.div
                    className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.4 }}
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </motion.div>
                )}
                <h1 className="text-3xl font-black text-slate-900 font-display">
                  {activeTopic?.name}
                </h1>
              </div>
              <motion.span
                className={`text-xs uppercase font-extrabold tracking-wider block ${activeTopic?.status === "completed" ? "text-emerald-600" : "text-indigo-600"
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {activeTopic?.status === "completed" ? "Completed" : "In Progress"}
              </motion.span>
              <motion.p
                className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {activeTopic?.description}
              </motion.p>
            </div>

            {/* PROBLEMS TABLE CONTAINER CARD */}
            <motion.div
              className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header column layout */}
              <div className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-widest font-mono font-black text-slate-450 select-none">
                <div className="col-span-2 sm:col-span-1 text-center">#</div>
                <div className="col-span-6 sm:col-span-7">Topic / Problem Name</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-center">Status</div>
              </div>

              {/* Problem listing rows */}
              <div className="divide-y divide-slate-100">
                {activeTopic?.problems.map((prob, idx) => {
                  const isBookmarked = isProblemBookmarked(prob.id);
                  return (
                    <motion.div
                      key={prob.id}
                      className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-4 items-center hover:bg-slate-50/60 transition-all duration-150"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.8)" }}
                    >
                      {/* Index */}
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <div className="w-6.5 h-6.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-650">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Problem Name + Star Bookmark Toggle */}
                      <div className="col-span-6 sm:col-span-7 pr-2 flex items-center gap-2">
                        <motion.button
                          onClick={() => toggleBookmarkProblem(prob, activeTopic.name)}
                          className={`p-1 hover:scale-115 transition-transform shrink-0 cursor-pointer outline-none ${isBookmarked
                            ? "text-amber-500 scale-105"
                            : "text-slate-300 hover:text-amber-400"
                            }`}
                          title={isBookmarked ? "Remove Bookmark" : "Save Problem"}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star className={`h-4 w-4 ${isBookmarked ? "fill-amber-400 stroke-amber-500" : "stroke-slate-400"}`} />
                        </motion.button>

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
                        <motion.span
                          className={`text-[9px] sm:text-[10px] font-black uppercase font-mono px-1.5 sm:px-2 py-0.5 rounded-md ${prob.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            prob.difficulty === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-red-50 text-red-650 border border-red-100"
                            } border`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {prob.difficulty}
                        </motion.span>
                      </div>

                      {/* Completion Status checkmark button */}
                      <div className="col-span-2 flex justify-center">
                        <motion.button
                          onClick={() => toggleProblemCompleted(activeTopic.id, prob.id)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${prob.completed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm hover:opacity-90"
                            : "bg-white border-slate-205 text-transparent hover:border-emerald-500 hover:text-emerald-500/50"
                            }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* ACTION FOOTER BAR */}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                type="button"
                onClick={() => {
                  alert(`Dispatched all ${activeTopic?.problems.length} targeted algorithmic tasks! Re-routing standard playground variables.`);
                }}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-550 text-white transition-all shadow-md font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 cursor-pointer"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="h-4.5 w-4.5 text-white" />
                </motion.div>
                <span>Practice All Problems</span>
              </motion.button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
