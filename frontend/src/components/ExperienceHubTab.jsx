import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Heart,
  Search,
  Plus,
  MapPin,
  Building2,
  X,
  Send,
  Users,
  CheckCircle,
  Briefcase,
  Sparkles,
  Bot,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  Filter,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ExperienceHubTab({ userEmail }) {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [commentsSummaries, setCommentsSummaries] = useState({});
  const [aiLoadingStates, setAiLoadingStates] = useState({});
  const [groupSummary, setGroupSummary] = useState(null);
  const [groupSummaryLoading, setGroupSummaryLoading] = useState(false);
  const [groupSummaryError, setGroupSummaryError] = useState(null);
  const [sortBy, setSortBy] = useState("upvotes");
  const [experiences, setExperiences] = useState([]);

  // Share Experience Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [workExperience, setWorkExperience] = useState("0-1 years");
  const [currentRole, setCurrentRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [aboutYourself, setAboutYourself] = useState("");
  const [company, setCompany] = useState("Amazon");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [rounds, setRounds] = useState("3 Rounds");
  const [difficulty, setDifficulty] = useState("Medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await apiRequest("/api/experience");
        setExperiences(
          data.map((experience) => ({
            id: experience._id,

            company: experience.company,
            title: experience.title,

            author: experience.authorEmail,

            description: experience.content,

            role: experience.role,

            difficulty: experience.difficulty,

            upvotes: experience.upvotes || 0,

            upvotedBy: experience.upvotedBy || [],

            userLiked: experience.upvotedBy?.includes(userEmail) || false,

            comments: 0,
            commentsList: [],
          })),
        );
      } catch (err) {
        console.error("Failed to load shared experiences:", err);
      }
    };
    loadExperiences();
  }, []);

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !role || !fullName || !email) return;

    const added = {
      id: `exp-user-${Date.now()}`,
      company: company,
      title: title,
      author: fullName,
      timeAgo: "Just now",
      description: description,
      role: role,
      rounds: rounds,
      location: location || "Remote",
      upvotes: 1,
      comments: 0,
      difficulty: difficulty,
      commentsList: [],
    };

    setExperiences([added, ...experiences]);
    setIsShareModalOpen(false);
    // Reset fields
    setFullName("");
    setEmail("");
    setWorkExperience("0-1 years");
    setCurrentRole("");
    setLinkedinUrl("");
    setAboutYourself("");
    setCompany("Amazon");
    setLocation("");
    setTitle("");
    setRole("");
    setRounds("3 Rounds");
    setDifficulty("Medium");
    setDescription("");

    try {
      const saved = await apiRequest("/api/experience/create", {
        method: "POST",
        body: JSON.stringify({
          company: company,
          role: role,
          difficulty: difficulty,
          title: title,
          content: description,
        }),
      });
      setExperiences((prev) =>
        prev.map((experience) =>
          experience.id === added.id
            ? { ...experience, id: saved._id, author: saved.authorEmail }
            : experience,
        ),
      );
    } catch (e) {
      console.warn("Failed to persist shared experience:", e);
    }
  };

  const handleAIGroupSummary = async (targetExperiences) => {
    if (targetExperiences.length === 0) return;
    setGroupSummaryLoading(true);
    setGroupSummaryError(null);
    setGroupSummary(null);

    try {
      const result = await apiRequest("/api/ai/summarize-group", {
        method: "POST",
        body: JSON.stringify({
          experiences: targetExperiences.map((e) => ({
            id: e.id,
            company: e.company,
            title: e.title,
            role: e.role,
            description: e.description,
            difficulty: e.difficulty,
          })),
        }),
      });
      setGroupSummary(result);
    } catch (err) {
      console.error("AI Group Summary trigger failure:", err);
      setGroupSummaryError(
        err?.message ||
          "Failed to compile aggregate summary report. Please try again.",
      );
    } finally {
      setGroupSummaryLoading(false);
    }
  };

  const handleAddComment = (expId) => {
    const text = newCommentTexts[expId]?.trim();
    if (!text) return;

    const loggedUser = localStorage.getItem("pf_fullName") || "Arjun Verma";
    setExperiences((prev) =>
      prev.map((exp) => {
        if (exp.id === expId) {
          const currentList = exp.commentsList || [];
          const newComment = {
            id: `c-added-${Date.now()}`,
            author: loggedUser,
            text,
            time: "Just now",
          };
          return {
            ...exp,
            comments: exp.comments + 1,
            commentsList: [...currentList, newComment],
          };
        }
        return exp;
      }),
    );
    setNewCommentTexts((prev) => ({ ...prev, [expId]: "" }));
  };

  const handleAITranscriptSummary = async (exp) => {
    let currentList = exp.commentsList || [];
    if (currentList.length === 0) {
      currentList = [
        {
          id: "fallback-c1",
          author: exp.author,
          text: exp.description,
          time: "Just now",
        },
      ];
    }

    setAiLoadingStates((prev) => ({ ...prev, [exp.id]: true }));
    try {
      const result = await apiRequest("/api/ai/summarize-comments", {
        method: "POST",
        body: JSON.stringify({ title: exp.title, comments: currentList }),
      });
      setCommentsSummaries((prev) => ({ ...prev, [exp.id]: result }));
    } catch (err) {
      console.error("AI comment summary failure:", err);
    } finally {
      setAiLoadingStates((prev) => ({ ...prev, [exp.id]: false }));
    }
  };

  const handleHeartPopperToggle = async (id) => {
    try {
      const updated = await apiRequest(`/api/experience/${id}/upvote`, {
        method: "POST",
      });

      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === id
            ? {
                ...exp,

                upvotes: updated.upvotes,

                upvotedBy: updated.upvotedBy,

                userLiked: updated.upvotedBy?.includes(userEmail) || false,
              }
            : exp,
        ),
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const companyTabs = [
    "All",
    "Amazon",
    "Microsoft",
    "Google",
    "TCS",
    "Adobe",
    "Meta",
  ];

  const filteredExperiences = [...experiences]
    .filter((exp) => {
      const matchesTab =
        selectedCompanyFilter === "All" ||
        exp.company === selectedCompanyFilter;
      const matchesSearch =
        searchQuery === "" ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "upvotes") return b.upvotes - a.upvotes;
      if (sortBy === "comments")
        return (b.commentsList?.length || 0) - (a.commentsList?.length || 0);
      if (sortBy === "recent") {
        const scoreA = a.id.startsWith("exp-user-")
          ? parseFloat(a.id.replace("exp-user-", ""))
          : 0;
        const scoreB = b.id.startsWith("exp-user-")
          ? parseFloat(b.id.replace("exp-user-", ""))
          : 0;
        return scoreB - scoreA;
      }
      if (sortBy === "difficulty") {
        const score = { Easy: 1, Medium: 2, Hard: 3 };
        return (
          (score[b.difficulty || "Medium"] || 2) -
          (score[a.difficulty || "Medium"] || 2)
        );
      }
      return 0;
    });

  const renderCompanyAvatar = (companyName) => {
    const styles = {
      container: {
        width: 48,
        height: 48,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      },
    };
    switch (companyName) {
      case "Amazon":
        return (
          <div
            style={{
              ...styles.container,
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#d97706",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            a
          </div>
        );
      case "Microsoft":
        return (
          <div
            style={{
              ...styles.container,
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              gap: 2,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              padding: 8,
            }}
          >
            {["#f87171", "#4ade80", "#60a5fa", "#facc15"].map((c) => (
              <div
                key={c}
                style={{
                  width: 10,
                  height: 10,
                  background: c,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        );
      case "Google":
        return (
          <div
            style={{
              ...styles.container,
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6, #ef4444, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              G
            </span>
          </div>
        );
      case "TCS":
        return (
          <div
            style={{
              ...styles.container,
              background: "rgba(30,58,138,0.1)",
              border: "1px solid rgba(30,58,138,0.2)",
              color: "#1e3a8a",
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            T
          </div>
        );
      case "Adobe":
        return (
          <div
            style={{
              ...styles.container,
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.2)",
              color: "#dc2626",
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            A
          </div>
        );
      case "Meta":
        return (
          <div
            style={{
              ...styles.container,
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#4f46e5",
              fontSize: 22,
              fontFamily: "monospace",
            }}
          >
            ∞
          </div>
        );
      default:
        return (
          <div
            style={{
              ...styles.container,
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            <Building2 size={20} />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          Interview Experiences
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              background: "#ede9fe",
              color: "#6d28d9",
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            community
          </span>
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Real interview experiences shared by candidates from top companies.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          marginBottom: 20,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {companyTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedCompanyFilter(tab)}
            style={{
              paddingBottom: 12,
              borderBottom:
                selectedCompanyFilter === tab
                  ? "2px solid #4f46e5"
                  : "2px solid transparent",
              color: selectedCompanyFilter === tab ? "#4f46e5" : "#94a3b8",
              fontWeight: selectedCompanyFilter === tab ? 900 : 600,
              fontSize: 12,
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (selectedCompanyFilter !== tab)
                e.target.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              if (selectedCompanyFilter !== tab)
                e.target.style.color = "#94a3b8";
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Share */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiences..."
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              fontSize: 13,
              outline: "none",
              transition: "all 0.2s ease",
              background: "white",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#4f46e5";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          onClick={() => setIsShareModalOpen(true)}
          style={{
            padding: "10px 20px",
            background: "#4f46e5",
            color: "white",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#4338ca";
            e.target.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#4f46e5";
            e.target.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1.02)";
          }}
        >
          <Plus size={18} /> Share Experience
        </button>
      </div>

      {/* Sort & AI Summary */}
      <div
        style={{
          padding: 16,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          <SlidersHorizontal
            size={14}
            style={{ color: "#64748b", marginRight: 4 }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              marginRight: 4,
            }}
          >
            Sort:
          </span>
          {[
            { value: "upvotes", label: "🔥 Popular" },
            { value: "comments", label: "💬 Discussed" },
            { value: "recent", label: "📅 Newest" },
            { value: "difficulty", label: "⚡ Hardest" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setSortBy(item.value);
                setGroupSummary(null);
              }}
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                border: "1px solid",
                background: sortBy === item.value ? "#4f46e5" : "white",
                borderColor: sortBy === item.value ? "#4f46e5" : "#e2e8f0",
                color: sortBy === item.value ? "white" : "#475569",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (sortBy !== item.value) {
                  e.target.style.background = "#f8fafc";
                  e.target.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (sortBy !== item.value) {
                  e.target.style.background = "white";
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleAIGroupSummary(filteredExperiences)}
          disabled={groupSummaryLoading || filteredExperiences.length === 0}
          style={{
            padding: "6px 16px",
            background: "#7c3aed",
            color: "white",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            transition: "all 0.2s ease",
            opacity:
              groupSummaryLoading || filteredExperiences.length === 0 ? 0.5 : 1,
            pointerEvents:
              groupSummaryLoading || filteredExperiences.length === 0
                ? "none"
                : "auto",
          }}
          onMouseEnter={(e) => {
            if (!groupSummaryLoading && filteredExperiences.length > 0) {
              e.target.style.background = "#6d28d9";
              e.target.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#7c3aed";
            e.target.style.transform = "scale(1)";
          }}
        >
          <Sparkles size={14} /> AI Summarize ({filteredExperiences.length})
        </button>
      </div>

      {/* Group Summary Display */}
      <AnimatePresence>
        {groupSummaryLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: 24,
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.05))",
              borderRadius: 16,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <Loader2
              size={32}
              style={{
                color: "#7c3aed",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <p
              style={{
                marginTop: 12,
                fontWeight: 700,
                color: "#1e293b",
                fontSize: 14,
              }}
            >
              Analyzing collective insights...
            </p>
          </motion.div>
        )}
        {groupSummary && !groupSummaryLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: 20,
              background:
                "linear-gradient(135deg, rgba(238,242,255,0.5), white)",
              border: "1px solid #c4b5fd",
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bot size={20} color="#7c3aed" />
                <h3 style={{ fontWeight: 900, fontSize: 14 }}>
                  AI Collective Review
                </h3>
              </div>
              <button
                onClick={() => setGroupSummary(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
              }}
            >
              {groupSummary.commonPatterns && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    padding: 12,
                    borderRadius: 12,
                  }}
                >
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#6d28d9",
                      marginBottom: 6,
                    }}
                  >
                    📋 Rounds Structure
                  </h4>
                  {groupSummary.commonPatterns.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        padding: "2px 0",
                      }}
                    >
                      • {p}
                    </div>
                  ))}
                </div>
              )}
              {groupSummary.frequentQuestions && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    padding: 12,
                    borderRadius: 12,
                  }}
                >
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#4f46e5",
                      marginBottom: 6,
                    }}
                  >
                    🎯 Technical Focus
                  </h4>
                  {groupSummary.frequentQuestions.map((q, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        padding: "2px 0",
                      }}
                    >
                      • {q}
                    </div>
                  ))}
                </div>
              )}
              {groupSummary.optimizedPreparationTips && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    padding: 12,
                    borderRadius: 12,
                  }}
                >
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#db2777",
                      marginBottom: 6,
                    }}
                  >
                    🚀 Prep Strategy
                  </h4>
                  {groupSummary.optimizedPreparationTips.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        padding: "2px 0",
                      }}
                    >
                      • {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {groupSummaryError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: 12,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              color: "#dc2626",
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            ⚠ {groupSummaryError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AnimatePresence mode="popLayout">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => {
              const isCommentsOpen = expandedCommentsId === exp.id;
              const commentsList = exp.commentsList || [];
              const summary = commentsSummaries[exp.id];
              const aiLoading = aiLoadingStates[exp.id] || false;

              return (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    padding: 20,
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.2)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    {renderCompanyAvatar(exp.company)}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontWeight: 800,
                          fontSize: 15,
                          color: "#0f172a",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                        onMouseLeave={(e) => (e.target.style.color = "#0f172a")}
                      >
                        {exp.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          fontSize: 12,
                          color: "#64748b",
                          marginTop: 2,
                        }}
                      >
                        <span>By {exp.author}</span>
                        <span>•</span>
                        <span>{exp.timeAgo}</span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#475569",
                          marginTop: 8,
                          lineHeight: 1.6,
                        }}
                      >
                        {exp.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginTop: 10,
                        }}
                      >
                        <span
                          style={{
                            padding: "2px 10px",
                            background: "#f8fafc",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Briefcase size={12} /> {exp.role}
                        </span>
                        <span
                          style={{
                            padding: "2px 10px",
                            background: "#f8fafc",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Users size={12} /> {exp.rounds}
                        </span>
                        <span
                          style={{
                            padding: "2px 10px",
                            background: "#f8fafc",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <MapPin size={12} /> {exp.location}
                        </span>
                        {exp.difficulty && (
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 700,
                              background:
                                exp.difficulty === "Easy"
                                  ? "#ecfdf5"
                                  : exp.difficulty === "Hard"
                                    ? "#fef2f2"
                                    : "#fffbeb",
                              color:
                                exp.difficulty === "Easy"
                                  ? "#059669"
                                  : exp.difficulty === "Hard"
                                    ? "#dc2626"
                                    : "#d97706",
                              border: `1px solid ${exp.difficulty === "Easy" ? "#a7f3d0" : exp.difficulty === "Hard" ? "#fecaca" : "#fde68a"}`,
                            }}
                          >
                            {exp.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: "1px solid #f1f5f9",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        setExpandedCommentsId(isCommentsOpen ? null : exp.id);
                        if (!isCommentsOpen)
                          setTimeout(() => handleAITranscriptSummary(exp), 100);
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        border: "1px solid #ede9fe",
                        background:
                          isCommentsOpen && summary ? "#ede9fe" : "#f5f3ff",
                        color:
                          isCommentsOpen && summary ? "#6d28d9" : "#7c3aed",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCommentsOpen || !summary) {
                          e.target.style.background = "#ede9fe";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCommentsOpen || !summary) {
                          e.target.style.background = "#f5f3ff";
                        }
                      }}
                    >
                      <Sparkles size={12} /> Summarize
                    </button>
                    <button
                      onClick={() => handleHeartPopperToggle(exp.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: exp.userLiked ? "#f43f5e" : "#94a3b8",
                        transition: "all 0.2s ease",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        if (!exp.userLiked) {
                          e.target.style.color = "#f43f5e";
                          e.target.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!exp.userLiked) {
                          e.target.style.color = "#94a3b8";
                          e.target.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <Heart
                        size={18}
                        fill={exp.userLiked ? "#f43f5e" : "none"}
                      />{" "}
                      {exp.upvotes}
                    </button>
                    <button
                      onClick={() =>
                        setExpandedCommentsId(isCommentsOpen ? null : exp.id)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isCommentsOpen ? "#4f46e5" : "#94a3b8",
                        transition: "all 0.2s ease",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        if (!isCommentsOpen) {
                          e.target.style.color = "#4f46e5";
                          e.target.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCommentsOpen) {
                          e.target.style.color = "#94a3b8";
                          e.target.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <MessageSquare size={18} /> {exp.comments}
                    </button>
                  </div>

                  {/* Comments Section */}
                  {isCommentsOpen && (
                    <div
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      {aiLoading && (
                        <div
                          style={{
                            padding: 16,
                            background: "#f8fafc",
                            borderRadius: 12,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Bot size={16} color="#4f46e5" />
                            <span style={{ fontSize: 12, fontWeight: 600 }}>
                              Analyzing comments...
                            </span>
                          </div>
                        </div>
                      )}
                      {summary && !aiLoading && (
                        <div
                          style={{
                            padding: 16,
                            background: "rgba(238,242,255,0.3)",
                            borderRadius: 12,
                            marginBottom: 12,
                          }}
                        >
                          <h4
                            style={{
                              fontWeight: 700,
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 8,
                            }}
                          >
                            <Bot size={16} /> AI Summary
                          </h4>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(150px, 1fr))",
                              gap: 12,
                            }}
                          >
                            <div>
                              <strong
                                style={{ fontSize: 11, color: "#6d28d9" }}
                              >
                                Questions
                              </strong>
                              {summary.coreQuestions?.map((q, i) => (
                                <div
                                  key={i}
                                  style={{ fontSize: 12, padding: "2px 0" }}
                                >
                                  • {q}
                                </div>
                              ))}
                            </div>
                            <div>
                              <strong
                                style={{ fontSize: 11, color: "#4f46e5" }}
                              >
                                Insights
                              </strong>
                              {summary.takeaways?.map((t, i) => (
                                <div
                                  key={i}
                                  style={{ fontSize: 12, padding: "2px 0" }}
                                >
                                  • {t}
                                </div>
                              ))}
                            </div>
                            <div>
                              <strong
                                style={{ fontSize: 11, color: "#db2777" }}
                              >
                                Prep Focus
                              </strong>
                              {summary.prepFocus?.map((p, i) => (
                                <div
                                  key={i}
                                  style={{ fontSize: 12, padding: "2px 0" }}
                                >
                                  • {p}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          maxHeight: 200,
                          overflowY: "auto",
                          marginBottom: 12,
                        }}
                      >
                        {commentsList.map((c) => (
                          <div
                            key={c.id}
                            style={{
                              padding: 10,
                              background: "#f8fafc",
                              borderRadius: 8,
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <strong style={{ fontSize: 12 }}>
                                {c.author}
                              </strong>
                              <span style={{ fontSize: 10, color: "#94a3b8" }}>
                                {c.time}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: 13,
                                color: "#475569",
                                marginTop: 2,
                              }}
                            >
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          type="text"
                          value={newCommentTexts[exp.id] || ""}
                          onChange={(e) =>
                            setNewCommentTexts((prev) => ({
                              ...prev,
                              [exp.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(exp.id);
                          }}
                          placeholder="Add a comment..."
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: 13,
                            outline: "none",
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#4f46e5";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(exp.id)}
                          style={{
                            padding: "8px 16px",
                            background: "#4f46e5",
                            color: "white",
                            borderRadius: 8,
                            border: "none",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#4338ca";
                            e.target.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#4f46e5";
                            e.target.style.transform = "scale(1)";
                          }}
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
            <div
              style={{
                padding: 48,
                textAlign: "center",
                background: "white",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
              }}
            >
              <Filter
                size={32}
                style={{ color: "#cbd5e1", margin: "0 auto 8px" }}
              />
              <h4 style={{ fontWeight: 700, color: "#334155" }}>
                No experiences found
              </h4>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal - Blog Style Single Page Form */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: 16,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              style={{
                position: "relative",
                background: "white",
                borderRadius: 24,
                padding: 32,
                maxWidth: 600,
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <div>
                  <h3
                    style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}
                  >
                    Share Your Interview Experience
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    Help other candidates prepare better by sharing your
                    interview journey
                  </p>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#0f172a")}
                  onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                >
                  <X size={20} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleShareSubmit}>
                {/* Personal Information Section */}
                <div style={{ marginBottom: 24 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: 16,
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                    }}
                  >
                    Personal Information
                  </h4>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Full name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Email <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Work Experience
                    </label>
                    <select
                      value={workExperience}
                      onChange={(e) => setWorkExperience(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                        background: "white",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="Your current role"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="Your LinkedIn profile URL"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      About yourself
                    </label>
                    <textarea
                      value={aboutYourself}
                      onChange={(e) => setAboutYourself(e.target.value)}
                      rows={4}
                      placeholder="Write about your current role, previous experience, skills, etc. (30-40 words recommended)."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        resize: "vertical",
                        transition: "all 0.2s ease",
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Interview Details Section */}
                <div style={{ marginBottom: 24 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: 16,
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                    }}
                  >
                    Interview Details
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Company <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <select
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          transition: "all 0.2s ease",
                          background: "white",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#4f46e5";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(79,70,229,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        {[
                          "Amazon",
                          "Microsoft",
                          "Google",
                          "TCS",
                          "Adobe",
                          "Meta",
                        ].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bangalore, Remote"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#4f46e5";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(79,70,229,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Title <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Amazon SDE-1 Interview Experience"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 14,
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Role <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="SDE-1"
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#4f46e5";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(79,70,229,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Rounds
                      </label>
                      <input
                        type="text"
                        value={rounds}
                        onChange={(e) => setRounds(e.target.value)}
                        placeholder="3 Rounds"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#4f46e5";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(79,70,229,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#334155",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          transition: "all 0.2s ease",
                          background: "white",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#4f46e5";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(79,70,229,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Description <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Share your interview experience in detail..."
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        resize: "vertical",
                        transition: "all 0.2s ease",
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#4f46e5";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(79,70,229,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#4338ca";
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 6px 16px rgba(79,70,229,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#4f46e5";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = "scale(1.02)";
                  }}
                >
                  <Send size={16} /> Submit Experience
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
