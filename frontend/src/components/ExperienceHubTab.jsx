import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Heart, 
  Search, 
  Plus, 
  MapPin, 
  Calendar,
  Building2,
  X,
  Send,
  User,
  Filter,
  Users,
  CheckCircle,
  Briefcase,
  Sparkles,
  Bot,
  HelpCircle,
  TrendingUp,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  Loader2
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ExperienceHubTab({ userEmail }) {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Comments expansion state
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  // key: experience id -> comment text
  const [newCommentTexts, setNewCommentTexts] = useState({});
  
  // AI summarization status per experience id
  // commentsSummaries keyed by experience id. Shape: { coreQuestions: [], takeaways: [], prepFocus: [] }
  const [commentsSummaries, setCommentsSummaries] = useState({});
  const [aiLoadingStates, setAiLoadingStates] = useState({});

  // Group AI Summarization states
  const [groupSummary, setGroupSummary] = useState(null);
  const [groupSummaryLoading, setGroupSummaryLoading] = useState(false);
  const [groupSummaryError, setGroupSummaryError] = useState(null);

  // Sorting state (default Popularity: upvotes)
  const [sortBy, setSortBy] = useState("upvotes");

  // High-fidelity preseeded records to match Image 3 exactly!
  const [experiences, setExperiences] = useState([
    {
      id: "exp-1",
      company: "Amazon",
      title: "Amazon SDE-1 Interview Experience",
      author: "Rohan S.",
      timeAgo: "3 days ago",
      description: "Had a great experience overall. The interview process was smooth and the questions were quite relevant. Initial screening was focused on resume projects but subsequent rounds tested robust heap and binary search algorithms.",
      role: "SDE-1",
      rounds: "3 Rounds",
      location: "Bangalore",
      upvotes: 12,
      comments: 4,
      difficulty: "Medium",
      commentsList: [
        { id: "c-1-1", author: "Aman Gupta", text: "Did they ask any questions about leadership principles?", time: "2 days ago" },
        { id: "c-1-2", author: "Rohan S.", text: "Yes, Aman. They focused on 'Customer Obsession' and 'Deliver Results' for about 15 minutes.", time: "1 day ago" },
        { id: "c-1-3", author: "Sneha Nair", text: "Was heap required to be coded from scratch or could we use a library?", time: "12 hours ago" },
        { id: "c-1-4", author: "Rohan S.", text: "Usually inside SDE-1 you can describe heapify conceptually and use standard language packages.", time: "4 hours ago" }
      ]
    },
    {
      id: "exp-2",
      company: "Microsoft",
      title: "Microsoft SDE-2 Interview Experience",
      author: "Priya M.",
      timeAgo: "1 week ago",
      description: "Good experience overall. Focus more on DSA graph algorithms (Dijkstra, DFS grid patterns) and basic system design parameters including rate limiters and relational database sharding.",
      role: "SDE-2",
      rounds: "4 Rounds",
      location: "Noida",
      upvotes: 20,
      comments: 4,
      difficulty: "Hard",
      commentsList: [
        { id: "c-2-1", author: "Aniket Vyas", text: "Was there any system design round for caching?", time: "5 days ago" },
        { id: "c-2-2", author: "Priya M.", text: "Yes, we spent 20 minutes designing an LRU eviction distributed cache.", time: "4 days ago" },
        { id: "c-2-3", author: "Vikram S.", text: "Did they expect fully working code for Dijkstra's?", time: "2 days ago" },
        { id: "c-2-4", author: "Priya M.", text: "Pseudocode was fine, but time complexity analysis had to be exactly O((V+E)logV).", time: "1 day ago" }
      ]
    },
    {
      id: "exp-3",
      company: "Google",
      title: "Google STEP Internship Experience",
      author: "Karan T.",
      timeAgo: "2 weeks ago",
      description: "Amazing learning experience! Got a PPO. Focus heavily on competitive programming, recursive tree traversal, and solid computer science fundamentals.",
      role: "Internship",
      rounds: "2 Rounds",
      location: "Bangalore",
      upvotes: 15,
      comments: 3,
      difficulty: "Hard",
      commentsList: [
        { id: "c-3-1", author: "Harish S.", text: "How hard was the Step OA compared to Leetcode Medium?", time: "1 week ago" },
        { id: "c-3-2", author: "Karan T.", text: "About equivalent, but Google prioritizes strict asymptotic runtime edge-cases.", time: "6 days ago" },
        { id: "c-3-3", author: "Divya Paul", text: "Did they check code readability?", time: "3 days ago" }
      ]
    },
    {
      id: "exp-4",
      company: "TCS",
      title: "TCS Ninja Interview Experience",
      author: "Amit R.",
      timeAgo: "3 weeks ago",
      description: "Easy on core coding questions, but you must focus on basic computer networks, OS scheduling, and DBMS index optimization fundamentals. HR round was conversational.",
      role: "Ninja SDE",
      rounds: "2 Rounds",
      location: "Chennai",
      upvotes: 8,
      comments: 2,
      difficulty: "Easy",
      commentsList: [
        { id: "c-4-1", author: "Rajesh S.", text: "What did they ask in the DBMS round?", time: "2 weeks ago" },
        { id: "c-4-2", author: "Amit R.", text: "Basic SQL queries (joins, group by) and B-tree indexing concepts.", time: "1 week ago" }
      ]
    },
    {
      id: "exp-5",
      company: "Adobe",
      title: "Adobe Member of Technical Staff (MTS) Experience",
      author: "Sanjana K.",
      timeAgo: "1 month ago",
      description: "First round had robust questions regarding Linked Lists, BST operations and memory layouts. Second round focused entirely on design patterns and object oriented programming paradigms.",
      role: "MTS-1",
      rounds: "3 Rounds",
      location: "Noida",
      upvotes: 14,
      comments: 2,
      difficulty: "Medium",
      commentsList: [
        { id: "c-5-1", author: "Anjali K.", text: "Which design patterns did they focus on?", time: "3 weeks ago" },
        { id: "c-5-2", author: "Sanjana K.", text: "Singleton and Observer. Had to write basic class layouts.", time: "2 weeks ago" }
      ]
    },
    {
      id: "exp-6",
      company: "Meta",
      title: "Meta SDE-1 Interview Experience",
      author: "Rahul S.",
      timeAgo: "1 month ago",
      description: "Meta interviews are speed runs. Focus heavily on speed, communication, and Meta-tagged LeetCode lists. Verify and test the optimization parameters of your recursive algorithms immediately.",
      role: "SDE-1",
      rounds: "2 Rounds",
      location: "London",
      upvotes: 31,
      comments: 2,
      difficulty: "Medium",
      commentsList: [
        { id: "c-6-1", author: "Tushar G.", text: "Is the speed requirement really that high?", time: "3 weeks ago" },
        { id: "c-6-2", author: "Rahul S.", text: "Absolutely, had to write and test 2 recursion-heavy problems within 45 mins.", time: "2 weeks ago" }
      ]
    }
  ]);

  // Form states for sharing experience
  const [newCompany, setNewCompany] = useState("Amazon");
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newRounds, setNewRounds] = useState("3 Rounds");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Medium");

  const handleShareSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newRole) return;

    const added = {
      id: `exp-user-${Date.now()}`,
      company: newCompany,
      title: newTitle,
      author: localStorage.getItem("pf_fullName") || "You",
      timeAgo: "Just now",
      description: newDescription,
      role: newRole,
      rounds: newRounds,
      location: newLocation || "Remote",
      upvotes: 1,
      comments: 0,
      difficulty: newDifficulty,
      commentsList: []
    };

    setExperiences([added, ...experiences]);
    setIsShareModalOpen(false);

    // Reset fields
    setNewTitle("");
    setNewRole("");
    setNewRounds("3 Rounds");
    setNewLocation("");
    setNewDescription("");
    setNewDifficulty("Medium");

    // Submit log
    try {
      apiRequest("/api/experience/create", {
        method: "POST",
        body: JSON.stringify(added)
      });
    } catch (e) {
      console.warn("Backend dynamic database bypass logging.");
    }
  };

  // Group Reviews Collective Summarizer
  const handleAIGroupSummary = async (targetExperiences) => {
    if (targetExperiences.length === 0) return;
    setGroupSummaryLoading(true);
    setGroupSummaryError(null);
    setGroupSummary(null);

    try {
      const result = await apiRequest("/api/ai/summarize-group", {
        method: "POST",
        body: JSON.stringify({
          experiences: targetExperiences.map(e => ({
            id: e.id,
            company: e.company,
            title: e.title,
            role: e.role,
            description: e.description,
            difficulty: e.difficulty
          }))
        })
      });
      setGroupSummary(result);
    } catch (err) {
      console.error("AI Group Summary trigger failure:", err);
      setGroupSummaryError(err?.message || "Failed to compile aggregate summary report. Please try again.");
    } finally {
      setGroupSummaryLoading(false);
    }
  };

  // Submit a new discussion comment
  const handleAddComment = (expId) => {
    const text = newCommentTexts[expId]?.trim();
    if (!text) return;

    const loggedUser = localStorage.getItem("pf_fullName") || "Arjun Verma";

    setExperiences(prev =>
      prev.map(exp => {
        if (exp.id === expId) {
          const currentList = exp.commentsList || [];
          const newComment = {
            id: `c-added-${Date.now()}`,
            author: loggedUser,
            text,
            time: "Just now"
          };
          return {
            ...exp,
            comments: exp.comments + 1,
            commentsList: [...currentList, newComment]
          };
        }
        return exp;
      })
    );

    setNewCommentTexts(prev => ({ ...prev, [expId]: "" }));
  };

  // call server-side AI summarize route
  const handleAITranscriptSummary = async (exp) => {
    let currentList = exp.commentsList || [];
    if (currentList.length === 0) {
      currentList = [
        { id: "fallback-c1", author: exp.author, text: exp.description, time: "Just now" }
      ];
    }

    setAiLoadingStates(prev => ({ ...prev, [exp.id]: true }));
    try {
      const result = await apiRequest("/api/ai/summarize-comments", {
        method: "POST",
        body: JSON.stringify({
          title: exp.title,
          comments: currentList
        })
      });
      setCommentsSummaries(prev => ({ ...prev, [exp.id]: result }));
    } catch (err) {
      console.error("AI comment summary failure:", err);
    } finally {
      setAiLoadingStates(prev => ({ ...prev, [exp.id]: false }));
    }
  };

  const handleHeartPopperToggle = (id) => {
    setExperiences(prev =>
      prev.map(exp => {
        if (exp.id === id) {
          const liked = !exp.userLiked;
          return {
            ...exp,
            userLiked: liked,
            upvotes: liked ? exp.upvotes + 1 : exp.upvotes - 1
          };
        }
        return exp;
      })
    );
  };

  // Company tabs filter options
  const companyTabs = ["All", "Amazon", "Microsoft", "Google", "TCS", "Adobe", "Meta"];

  // Filter & Sort experiences by tabs, query & selected sort logic
  const filteredExperiences = [...experiences]
    .filter(exp => {
      const matchesTab = selectedCompanyFilter === "All" || exp.company === selectedCompanyFilter;
      const matchesSearch = searchQuery === "" || 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "upvotes") {
        return b.upvotes - a.upvotes;
      }
      if (sortBy === "comments") {
        const lenA = a.commentsList?.length || 0;
        const lenB = b.commentsList?.length || 0;
        return lenB - lenA;
      }
      if (sortBy === "recent") {
        const scoreA = a.id.startsWith("exp-user-") ? parseFloat(a.id.replace("exp-user-", "")) : (100 - parseInt(a.id.replace("exp-", "") || "0"));
        const scoreB = b.id.startsWith("exp-user-") ? parseFloat(b.id.replace("exp-user-", "")) : (100 - parseInt(b.id.replace("exp-", "") || "0"));
        return scoreB - scoreA;
      }
      if (sortBy === "difficulty") {
        const score = { Easy: 1, Medium: 2, Hard: 3 };
        const valA = score[a.difficulty || "Medium"] || 2;
        const valB = score[b.difficulty || "Medium"] || 2;
        return valB - valA; // Hardest first
      }
      return 0;
    });

  // Render stylized visual brand placeholder logo per company
  const renderCompanyAvatar = (companyName) => {
    switch (companyName) {
      case "Amazon":
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-600 font-black relative overflow-hidden">
            <span className="text-lg tracking-tighter leading-none -mb-1">a</span>
            <span className="text-[9px] font-mono leading-none font-black text-amber-700">➡</span>
          </div>
        );
      case "Microsoft":
        return (
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-150 flex items-center justify-center p-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 bg-red-400" />
              <div className="w-2.5 h-2.5 bg-green-400" />
              <div className="w-2.5 h-2.5 bg-blue-400" />
              <div className="w-2.5 h-2.5 bg-yellow-400" />
            </div>
          </div>
        );
      case "Google":
        return (
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-blue-600 font-extrabold text-xl relative">
            <span className="font-display bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">G</span>
          </div>
        );
      case "TCS":
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-blue-900 font-black text-lg">
            <span>T</span>
          </div>
        );
      case "Adobe":
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-650 font-black text-base">
            <span>A</span>
          </div>
        );
      case "Meta":
        return (
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-650 text-xl font-bold font-mono">
            <span>∞</span>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-205 flex items-center justify-center text-slate-600">
            <Building2 className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div id="experiences_hub_master_scaffold" className="space-y-6">
      
      {/* Title block matching exact screenshot specifications */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-display">
          Interview Experiences
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
          Real interview experiences shared by candidates from top companies.
        </p>
      </div>

      {/* FILTER BUTTON TABS BAR matching image 3 دقیقا */}
      <div className="border-b border-slate-200">
        <div className="flex flex-wrap gap-2 sm:gap-6 text-xs font-semibold select-none pb-1">
          {companyTabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedCompanyFilter(tab)}
              className={`pb-3.5 border-b-2 px-1 transition-all cursor-pointer ${
                selectedCompanyFilter === tab
                  ? "border-violet-650 text-violet-650 font-black"
                  : "border-transparent text-slate-450 hover:text-slate-950"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS ROW: SEARCH & SHARE EXPERIENCE */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-center">
        
        {/* Search bar wrapping */}
        <div className="relative flex-1 w-full font-display">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            className="w-full pl-10.5 pr-4 py-3 bg-white border border-slate-200 focus:border-violet-500 rounded-xl text-xs focus:outline-none transition-all font-sans font-medium hover:bg-slate-50/50"
          />
        </div>

        {/* Share experience CTA button */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full sm:w-auto px-5 py-3 h-[42px] bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer select-none shrink-0"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>Share Experience</span>
        </button>

      </div>

      {/* SORTING & COLLECTIVE GROUP SUMMARY CONTROLS */}
      <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sort parameters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 mr-1 font-extrabold text-slate-700">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Sort Reviews:</span>
          </div>
          {[
            { value: "upvotes", label: "🔥 Popular" },
            { value: "comments", label: "💬 Discussed" },
            { value: "recent", label: "📅 Newest" },
            { value: "difficulty", label: "⚡ Hardest Code" }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setSortBy(item.value);
                setGroupSummary(null); // Clear group summary so it can be re-run on current order
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] font-bold border ${
                sortBy === item.value
                  ? "bg-violet-650 border-violet-650 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Group Intelligence CTA Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={groupSummaryLoading || filteredExperiences.length === 0}
            onClick={() => handleAIGroupSummary(filteredExperiences)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-200" />
            <span>AI Summarize Group ({filteredExperiences.length} {selectedCompanyFilter === "All" ? "Total" : selectedCompanyFilter} Reviews)</span>
          </button>
          
          {groupSummary && (
            <button
              type="button"
              onClick={() => setGroupSummary(null)}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all cursor-pointer"
              title="Clear summary report"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI GROUP SUMMARIZED CARD CONTAINER */}
      <AnimatePresence mode="wait">
        {groupSummaryLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-100 rounded-3xl shadow-sm text-center py-10 space-y-3.5 relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute top-[-30%] right-[-10%] w-[120px] h-[120px] rounded-full bg-indigo-500/15 blur-[35px] pointer-events-none" />
            <Loader2 className="h-9 w-9 text-violet-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-805 tracking-tight">Compiling Collective Review Insights</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Evaluating matching candidate testimonials, extracting coding rounds structure, and optimizing required preparation blueprints with Gemini...</p>
            </div>
          </motion.div>
        )}

        {groupSummaryError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-red-50 border border-red-105 text-red-700 rounded-3xl text-xs font-semibold"
          >
            ⚠ {groupSummaryError}
          </motion.div>
        )}

        {groupSummary && !groupSummaryLoading && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 border border-violet-150 rounded-3xl shadow-md space-y-5 relative overflow-hidden"
          >
            {/* Ambient blur ornament */}
            <div className="absolute top-[-40%] right-[-10%] w-[150px] h-[150px] rounded-full bg-violet-600/10 blur-[40px] pointer-events-none" />
            
            <div className="flex items-center justify-between gap-4 border-b border-violet-100/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-605 text-white shadow-sm shadow-violet-600/10">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5 font-display">
                    AI Collective Review Intelligence
                  </h3>
                  <p className="text-[10px] text-slate-500">Synthesized report across {filteredExperiences.length} filtered {selectedCompanyFilter === "All" ? "SDE" : selectedCompanyFilter} experiences</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 text-[10px] font-mono font-black rounded-lg">
                <span>EVALUATION:</span>
                <span>{groupSummary.difficultyRating?.toUpperCase() || "MEDIUM"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Pattern 1: Rounds structure */}
              <div className="space-y-2.5 bg-white/65 p-4 rounded-2xl border border-violet-100/50">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px] text-violet-650">
                  <CheckCircle className="h-3.5 w-3.5 text-violet-505" />
                  Rounds Structure
                </h4>
                <ul className="space-y-1.5 text-slate-600 font-normal list-none">
                  {groupSummary.commonPatterns?.map((pt, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-violet-500 font-black">•</span>
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pattern 2: Frequently Audited Questions */}
              <div className="space-y-2.5 bg-white/65 p-4 rounded-2xl border border-violet-100/50">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide text-[10px] text-indigo-650">
                  <HelpCircle className="h-3.5 w-3.5 text-indigo-505" />
                  Technical Focus
                </h4>
                <ul className="space-y-1.5 text-slate-600 font-normal list-none">
                  {groupSummary.frequentQuestions?.map((fq, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-500 font-black">•</span>
                      <span className="leading-relaxed">{fq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pattern 3: Custom Prep Actions */}
              <div className="space-y-2.5 bg-white/65 p-4 rounded-2xl border border-violet-100/50">
                <h4 className="font-bold text-slate-805 flex items-center gap-1.5 uppercase tracking-wide text-[10px] text-pink-650">
                  <TrendingUp className="h-3.5 w-3.5 text-pink-505" />
                  Preparation Strategy
                </h4>
                <ul className="space-y-1.5 text-slate-600 font-normal list-none">
                  {groupSummary.optimizedPreparationTips?.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-pink-500 font-black">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setGroupSummary(null)}
                className="text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                Dismiss Synthesized Report <X className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIMARY LIST VIEW CONTAINER */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => {
              const isCommentsOpen = expandedCommentsId === exp.id;
              const commentsList = exp.commentsList || [];
              const commentText = newCommentTexts[exp.id] || "";
              const summary = commentsSummaries[exp.id];
              const aiLoading = aiLoadingStates[exp.id] || false;

              return (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 sm:p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-violet-500/20 hover:shadow-md transition-all flex flex-col gap-5 relative group"
                >
                  
                  {/* Top content row (Avatar + Details + Badges) */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start w-full relative">
                    
                    {/* Visual Company Avatar left element */}
                    <div className="shrink-0">
                      {renderCompanyAvatar(exp.company)}
                    </div>

                    {/* Main Experience textual details */}
                    <div className="flex-1 space-y-2.5">
                      
                      {/* Topic Title */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <span>By {exp.author}</span>
                          <span className="text-slate-300">•</span>
                          <span>{exp.timeAgo}</span>
                        </div>
                      </div>

                      {/* Summary / Snippet */}
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                        {exp.description}
                      </p>

                      {/* Badges parameters Row */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-150 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span>{exp.role}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-150 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{exp.rounds}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-150 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{exp.location}</span>
                        </span>
                        {exp.difficulty && (
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 border shadow-xs ${
                            exp.difficulty === "Easy"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : exp.difficulty === "Hard"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}>
                            <TrendingUp className="h-3 w-3" />
                            <span>{exp.difficulty}</span>
                          </span>
                        )}
                      </div>

                    </div>

                    {/* BOTTOM RIGHT STATS ACTIONS (Hearts & comments) with interactive Spring animations */}
                    <div className="sm:absolute sm:bottom-0 sm:right-0 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 select-none self-end sm:self-auto border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                      
                      <button
                        onClick={() => {
                          setExpandedCommentsId(isCommentsOpen ? null : exp.id);
                          if (!isCommentsOpen) {
                            setTimeout(() => {
                              handleAITranscriptSummary(exp);
                            }, 100);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer outline-none ${
                          isCommentsOpen && commentsSummaries[exp.id]
                            ? "bg-violet-100 border-violet-300 text-violet-700"
                            : "bg-violet-50 hover:bg-violet-100 border-violet-100 text-violet-605 hover:text-violet-750"
                        }`}
                        title="AI Summarize Peer Reviews"
                      >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-505" />
                        <span>Summarize Reviews</span>
                      </button>

                      <button
                        onClick={() => handleHeartPopperToggle(exp.id)}
                        className={`flex items-center gap-1.5 cursor-pointer outline-none transition-all ${
                          exp.userLiked 
                            ? "text-rose-500 scale-105" 
                            : "text-slate-450 hover:text-rose-500 hover:scale-105"
                        }`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${exp.userLiked ? "fill-rose-500 stroke-rose-500" : ""}`} />
                        <span className="font-mono text-[11px]">{exp.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setExpandedCommentsId(isCommentsOpen ? null : exp.id)}
                        className={`flex items-center gap-1.5 cursor-pointer outline-none transition-all ${
                          isCommentsOpen 
                            ? "text-indigo-600 scale-105" 
                            : "text-slate-455 hover:text-indigo-600"
                        }`}
                        title="Toggle Peer Discussions"
                      >
                        <MessageSquare className="h-4.5 w-4.5" />
                        <span className="font-mono text-[11px]">{exp.comments}</span>
                      </button>

                    </div>

                  </div>

                  {/* COMMENTS EXPANDABLE DRAWER */}
                  {isCommentsOpen && (
                    <div className="mt-2 pt-4 border-t border-slate-100 space-y-4">
                      
                      {/* AI Summarizer Trigger block */}
                      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-505"></span>
                            </span>
                            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                              AI Comment Intelligence Summarizer
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                            Synthesize active peer notes, advice, and candidate questions into preparation takeaways.
                          </p>
                        </div>

                        <button
                          onClick={() => handleAITranscriptSummary(exp)}
                          disabled={aiLoading || commentsList.length === 0}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 cursor-pointer select-none self-stretch sm:self-auto text-center justify-center whitespace-nowrap"
                        >
                          <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
                          <span>{aiLoading ? "Summarizing Comments..." : "Summarize Peer Comments"}</span>
                        </button>
                      </div>

                      {/* Display summary loading indicator */}
                      {aiLoading && (
                        <div className="p-5 rounded-2xl border border-dashed border-indigo-200 bg-white space-y-3.5 animate-pulse">
                          <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-indigo-600 animate-bounce" />
                            <span className="text-[11px] font-bold text-indigo-700">Gemini is synthesizing candidate forum comments...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3.5 bg-slate-100 rounded w-4/5"></div>
                            <div className="h-3 bg-slate-100 rounded w-11/12"></div>
                            <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
                          </div>
                        </div>
                      )}

                      {/* Display structured summary */}
                      {summary && !aiLoading && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/20 space-y-4 shadow-sm"
                        >
                          <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                            <Bot className="h-5 w-5 text-indigo-600" />
                            <h5 className="text-xs font-black text-indigo-950 uppercase tracking-wider">AI High-Yield Discussion Summary</h5>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Questions */}
                            <div className="space-y-2 bg-white/50 p-3 rounded-xl border border-violet-100/50">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#c026d3]">
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Core Questions Asked</span>
                              </div>
                              <ul className="space-y-1.5">
                                {summary.coreQuestions.map((q, idx) => (
                                  <li key={idx} className="text-[11px] text-slate-700 leading-normal pl-3 relative">
                                    <span className="absolute left-0 top-1 text-purple-400">•</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Takeaways */}
                            <div className="space-y-2 bg-white/50 p-3 rounded-xl border border-indigo-100/30">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#4f46e5]">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Key Insights / Answers</span>
                              </div>
                              <ul className="space-y-1.5">
                                {summary.takeaways.map((t, idx) => (
                                  <li key={idx} className="text-[11px] text-slate-700 leading-normal pl-3 relative">
                                    <span className="absolute left-0 top-1 text-indigo-400">•</span>
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Prep Focus */}
                            <div className="space-y-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Recommended Prep Focus</span>
                              </div>
                              <ul className="space-y-1.5">
                                {summary.prepFocus.map((f, idx) => (
                                  <li key={idx} className="text-[11px] text-amber-900 leading-normal bg-orange-500/10 rounded px-2 py-1.5 border border-amber-500/10 font-medium">
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Comments Feed list */}
                      <div className="space-y-2.5">
                        <h4 className="text-[11px] font-bold text-slate-450 uppercase tracking-wider select-none">
                          Discussion Feed ({commentsList.length})
                        </h4>

                        {commentsList.length > 0 ? (
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {commentsList.map((c) => (
                              <div key={c.id} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-extrabold text-slate-800">{c.author}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                                </div>
                                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">{c.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No comments posted yet. Start the discussion below!</p>
                        )}
                      </div>

                      {/* Add comment box */}
                      <div className="flex gap-2.5 pt-1">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [exp.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(exp.id);
                          }}
                          placeholder="Type your comment / ask a question..."
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-205 focus:border-violet-500 rounded-xl text-xs focus:outline-none placeholder-slate-400 font-medium font-sans bg-white focus:bg-white"
                        />
                        <button
                          onClick={() => handleAddComment(exp.id)}
                          className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors shadow flex items-center justify-center cursor-pointer select-none"
                        >
                          Send
                        </button>
                      </div>

                    </div>
                  )}

                </motion.div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 space-y-3 min-h-[250px] flex flex-col items-center justify-center">
              <Filter className="h-8 w-8 text-slate-300 animate-pulse" />
              <h4 className="font-extrabold text-sm text-slate-700">No matching experiences found</h4>
              <p className="text-xs text-slate-400 max-w-sm">Try modifying your search filter keywords or select a different company directory tab.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* SHARE MODAL COMPONENT */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 space-y-6"
            >
              
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">Share Interview Experience</h3>
                  <p className="text-xs text-slate-550">Empower colleagues with your authentic interview learnings.</p>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleShareSubmit} className="space-y-4">
                
                {/* Company & Location Rows */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Company</label>
                    <select
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="Amazon">Amazon</option>
                      <option value="Microsoft">Microsoft</option>
                      <option value="Google">Google</option>
                      <option value="TCS">TCS</option>
                      <option value="Adobe">Adobe</option>
                      <option value="Meta">Meta</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Location</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Bangalore, Remote"
                      className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Experience Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Amazon SDE-1 Interview Experience"
                    className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Role, Rounds and Difficulty */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Role / Position</label>
                    <input
                      type="text"
                      required
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. SDE-1, MTS-2"
                      className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Rounds</label>
                    <input
                      type="text"
                      required
                      value={newRounds}
                      onChange={(e) => setNewRounds(e.target.value)}
                      placeholder="e.g. 3 Rounds, 4 Rounds"
                      className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 tracking-tight uppercase">Full Description / Learnings</label>
                  <textarea
                    rows={4}
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details on types of algorithmic rounds, coding questions asked, system design constraints, and team match processes..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none"
                  />
                </div>

                {/* CTA Action button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-705 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                  <span>Submit Interview Experience</span>
                </button>

              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
