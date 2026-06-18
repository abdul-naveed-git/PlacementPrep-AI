import {
  Flame,
  Building2,
  ChevronRight,
  ArrowRight,
  Bot
} from "lucide-react";

export default function HomeTab({ user, roadmap, onNavigateTab, readinessIndexPercent }) {
  const leetcodeSolved = user?.leetcodeStats?.totalSolved ?? 0;
  const easySolved = user?.leetcodeStats?.easySolved ?? 0;
  const mediumSolved = user?.leetcodeStats?.mediumSolved ?? 0;
  const hardSolved = user?.leetcodeStats?.hardSolved ?? 0;

  const trackedCompaniesList = user?.targetCompanies || [];
  const trackedCompaniesCount = trackedCompaniesList.length;
  const roadmapTopics = roadmap?.topics || [];
  const getTopicName = (topic) => topic?.topicName || topic?.name || topic?.title || "";
  const getTopicProblems = (topic) => topic?.problems || [];
  const getTopicProgress = (topic) => {
    const problems = getTopicProblems(topic);
    const total = problems.length;
    const completed = problems.filter((problem) => Boolean(problem.completed)).length;

    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const totalRoadmapProblems = roadmapTopics.reduce((acc, topic) => acc + getTopicProgress(topic).total, 0);
  const completedRoadmapProblems = roadmapTopics.reduce((acc, topic) => acc + getTopicProgress(topic).completed, 0);
  const roadmapProgressPercent =
    totalRoadmapProblems > 0
      ? Math.round((completedRoadmapProblems / totalRoadmapProblems) * 100)
      : 0;

  const weakFocusProgress = (user?.weakTopics || [])
    .map((topic) => {
      const normalizedWeakTopic = topic.toLowerCase().trim();
      const matchedRoadmapTopic = roadmapTopics.find((roadmapTopic) => {
        const roadmapTopicName = getTopicName(roadmapTopic).toLowerCase().trim();

        return (
          roadmapTopicName === normalizedWeakTopic ||
          roadmapTopicName.includes(normalizedWeakTopic) ||
          normalizedWeakTopic.includes(roadmapTopicName)
        );
      });
      const progress = matchedRoadmapTopic ? getTopicProgress(matchedRoadmapTopic) : null;
      const rate = progress?.percent ?? 0;

      return {
        topic,
        rate,
        completed: progress?.completed ?? 0,
        total: progress?.total ?? 0,
        color: rate >= 100 ? "bg-emerald-500" : rate > 0 ? "bg-amber-500" : "bg-red-500",
      };
    })
    .sort((a, b) => a.rate - b.rate);

  return (
    <div id="home_dashboard_welcome_view" className="space-y-6">

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Placement Readiness */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Placement Readiness</span>
          <div className="space-y-1">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{readinessIndexPercent}%</span>
            <span className="text-[11px] font-semibold text-emerald-600 font-mono flex items-center gap-1 select-none pt-1">
              ↑ 8% this week
            </span>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Problems Solved</span>
          <div className="space-y-2">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{leetcodeSolved}</span>
            <div className="text-[10px] text-slate-405 font-mono font-medium block">
              Easy <span className="font-bold text-slate-700">{easySolved}</span>
              <span className="mx-1 text-slate-300">|</span>
              Medium <span className="font-bold text-slate-700">{mediumSolved}</span>
              <span className="mx-1 text-slate-300">|</span>
              Hard <span className="font-bold text-slate-700">{hardSolved}</span>
            </div>
          </div>
        </div>

        {/* Companies Tracking */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Companies Tracking</span>
          <div className="space-y-1">
            <span className="text-3xl font-sans font-black text-slate-900 block leading-none">{trackedCompaniesCount}</span>
            <p className="text-[10px] text-slate-400 font-mono pt-1.5 truncate">
              {trackedCompaniesCount > 0
                ? `${trackedCompaniesList.slice(0, 3).join(", ")}${trackedCompaniesCount > 3 ? ` +${trackedCompaniesCount - 3}` : ""}`
                : "No companies selected"}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Your Roadmap Progress (2/3 width) vs AI Recommendation (1/3 width) */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Your Roadmap Progress Card (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <h2 className="font-extrabold text-[15px] text-slate-900 font-display">Your Roadmap Progress</h2>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">

            {/* Left Column: Overall Progress & CTA Button */}
            <div className="space-y-4 pr-0 sm:pr-4 sm:border-r border-slate-100 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Overall Progress</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0">
                    <div className="bg-violet-600 h-full rounded-full transition-all duration-500" style={{ width: `${roadmapProgressPercent}%` }} />
                  </div>
                  <span className="font-mono text-slate-900 font-extrabold text-xs">{roadmapProgressPercent}%</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono block">
                  {completedRoadmapProblems} / {totalRoadmapProblems} problems completed
                </span>
              </div>

              <button
                onClick={() => onNavigateTab("dsa_roadmap")}
                className="w-full sm:w-fit px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Continue Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right Column: Weak Topics list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Weak Topics (Focus Area)</span>
              </div>

              <div className="space-y-3.5">
                {weakFocusProgress.length > 0 ? weakFocusProgress.map((item, id) => (
                  <div key={id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-semibold text-slate-800">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.rate}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-450 font-bold shrink-0">
                        {item.total > 0 ? `${item.completed}/${item.total}` : "Not in roadmap"} · {item.rate}%
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400">Add weak topics in your profile to track focus areas.</p>
                )}
              </div>

              <div className="text-right pt-2">
                <button
                  onClick={() => onNavigateTab("skill_gap")}
                  className="text-[11px] text-violet-600 hover:text-violet-750 font-bold transition-colors inline-flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* AI Recommendation Card (Spans 1 column on desktop) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="font-extrabold text-[15px] text-slate-900 font-display">AI Recommendation</h2>
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <Bot className="h-6 w-6" />
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {weakFocusProgress.length > 0
                ? <>You should focus on <span className="font-semibold text-slate-900 font-sans">{weakFocusProgress[0].topic}</span>. Generate your roadmap to receive targeted problem recommendations.</>
                : "Complete your profile to unlock tailored AI recommendations."}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("skill_gap")}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-violet-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Recommended Problems</span>
          </button>
        </div>

      </div>

      {/* Bottom Row Section: Company Preparation Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider font-display">Company Preparation Overview</h2>
            <p className="text-[10px] text-slate-450 mt-1">Status index across currently prioritized company checklist lanes.</p>
          </div>
          <button
            onClick={() => onNavigateTab("company_prep")}
            className="text-[11px] text-violet-600 hover:text-violet-500 font-bold transition-colors flex items-center gap-0.5"
          >
            <span>View All Companies</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {trackedCompaniesList.slice(0, 3).map((company, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white font-sans font-black leading-none flex items-center justify-center text-xs shrink-0 select-none">
                  {company.charAt(0)}
                </div>
                <div className="leading-tight text-left">
                  <span className="font-bold text-xs text-slate-900 block">{company}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Checklist ready</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-slate-300" style={{ width: "0%" }} />
              </div>
            </div>
          ))}

          {/* Combined "View All Companies" card matching layout exactly */}
          <button
            onClick={() => onNavigateTab("company_prep")}
            className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-200 border-dashed hover:border-violet-300 transition-all space-y-2 flex flex-col items-center justify-center text-center cursor-pointer min-h-[96px] group"
          >
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 transition-all group-hover:scale-105 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-xs text-violet-600 block">View All Companies</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{trackedCompaniesCount} companies</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
