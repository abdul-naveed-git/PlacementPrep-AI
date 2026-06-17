import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  Award
} from "lucide-react";
import { apiRequest } from "../lib/api";

export default function CompanyPrepTab({ initialCompanies }) {
  const companiesList = initialCompanies.length > 0 ? initialCompanies : ["Google", "Microsoft", "Meta", "Amazon"];
  const [selectedCompany, setSelectedCompany] = useState(companiesList[0]);
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
    fetchCompanySummary(selectedCompany);
  }, [selectedCompany]);

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="company_preparation_workspace" className="space-y-6">
      
      {/* Target Companies selector row */}
      <div className="flex flex-wrap gap-2.5">
        {companiesList.map((company) => (
          <button
            key={company}
            onClick={() => setSelectedCompany(company)}
            className={`px-5 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedCompany === company
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500 shadow-md shadow-violet-500/10"
                : "bg-slate-900 border-white/5 text-slate-300 hover:border-white/10"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{company} Preparation</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left column: Checklists and Target Objectives */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <CheckSquare className="h-4 w-4 text-violet-400" />
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Prep Checklists</h3>
            </div>

            <p className="text-xs text-slate-400">
              Track essential checkpoints for completing your targeted <span className="text-slate-200 mt-1">{selectedCompany}</span> run.
            </p>

            <div className="space-y-2">
              {[
                { key: "study-company-tag", label: "Study LeetCode company tag problems (past 6 months)" },
                { key: "solve-top-30", label: "Solve the top 30 most-frequently asked problems" },
                { key: "mock-timer-interview", label: "Complete 3 random mock interviews on a timer" },
                { key: "behavioral-star-review", label: "Prepare STAR format answers for Leadership Principles" },
                { key: "system-design-basics", label: "Review horizontal vs vertical scalability diagrams" },
              ].map((item) => (
                <label 
                  key={item.key} 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer text-xs ${
                    checklist[item.key] 
                      ? "bg-slate-950/40 border-violet-500/20 text-slate-300" 
                      : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-950/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key] || false}
                    onChange={() => toggleChecklistItem(item.key)}
                    className="mt-0.5 rounded border-rose-500 text-violet-600 focus:ring-violet-500 bg-slate-950 w-3.5 h-3.5"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/10 to-transparent border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 animate-pulse" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Placement Readiness Score Impact</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Checking items off your {selectedCompany} checklist dynamically advances your placement readiness index on the main panel by up to 20%.
            </p>
          </div>
        </div>

        {/* Right column: Dynamic Live summaries with Gemini */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-white/5 space-y-3">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Gemini AI assembling target interview schemas...</p>
            </div>
          ) : summary ? (
            <div className="space-y-6">
              
              {/* Core summary banner */}
              <div className="p-6 rounded-xl bg-slate-900 border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
                    <h3 className="font-black text-sm text-slate-100 uppercase tracking-wider">
                      Target Interview Stages for {summary.companyName}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Updated {summary.lastUpdated}
                  </span>
                </div>

                <div className="space-y-4">
                  {summary.roundWiseSummaries.map((round, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-950/40 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-violet-300">{round.roundName}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{round.details}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {round.focusTopics.map((topic, i) => (
                          <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra insights columns: mistakes and frequency */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Frequently Asked Topics list */}
                <div className="p-5 rounded-xl bg-slate-900 border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <TrendingUp className="h-4 w-4 text-violet-400" />
                    <h4 className="font-black text-xs text-white uppercase tracking-wider">Hot DSA Topics</h4>
                  </div>
                  <div className="space-y-2">
                    {summary.frequentlyAskedTopics.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-950/20 border border-white/5">
                        <span className="font-mono text-slate-300">{topic.topic}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          topic.frequency === "High" ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20"
                        }`}>
                          {topic.frequency} Frequency
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Pitfalls layout */}
                <div className="p-5 rounded-xl bg-slate-900 border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <h4 className="font-black text-xs text-white uppercase tracking-wider">Common Pitfalls</h4>
                  </div>
                  <ul className="space-y-3.5 pl-2">
                    {summary.commonMistakes.map((mistake, i) => (
                      <li key={i} className="relative pl-5 text-xs text-slate-400 leading-relaxed before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-500">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-white/5 text-slate-400">
              Insights could not be retrieved. Please click on other premier tabs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
