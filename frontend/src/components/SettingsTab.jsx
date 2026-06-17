import React, { useState } from "react";
import { motion } from "motion/react";
import { Settings, Check, HelpCircle, Bell, ShieldAlert, BadgeCheck, RotateCcw } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function SettingsTab() {
  const [reminders, setReminders] = useState(true);
  const [freq, setFreq] = useState("realtime");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const handleResetDB = async () => {
    if (!window.confirm("Are you sure you want to restore the sandbox databases to default pre-seeded logs? All manual checklist items and submissions will be reset.")) {
      return;
    }
    setSavingSettings(true);
    try {
      // Create a quick request or simulation to clear client states
      localStorage.clear();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div id="settings_workspace_view" className="space-y-6">
      
      {/* Header card */}
      <div className="p-5 rounded-xl bg-slate-900 border border-white/5">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-violet-400">Environment Config</span>
        <h2 className="text-lg font-black text-white mt-0.5">Workspace Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust preferences, trigger profile diagnostics, and control simulated placement container factors.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main options card list */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Notifications and Reminders */}
          <div className="p-5 rounded-xl bg-slate-900 border border-white/5 space-y-4">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-400" />
              <span>Placement Notifications</span>
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-white/5 hover:bg-slate-950/80 transition-all cursor-pointer">
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-slate-200 block">Daily Activity Reminder Email</span>
                  <span className="text-[11px] text-slate-400">Receive alert matches when daily streak reaches danger levels.</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="rounded border-white/10 text-violet-600 focus:ring-violet-500 bg-slate-950 w-4 h-4 ml-2 cursor-pointer"
                />
              </label>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-white/5 space-y-2">
                <span className="font-bold text-slate-200 block">LeetCode Sync Frequency</span>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: "realtime", label: "Real-time" },
                    { id: "daily", label: "Daily Sync" },
                    { id: "weekly", label: "Weekly Sweep" }
                  ].map((rate) => (
                    <button
                      key={rate.id}
                      onClick={() => setFreq(rate.id)}
                      className={`py-2 rounded-lg text-[10px] uppercase font-mono font-bold transition-all border ${
                        freq === rate.id
                          ? "bg-violet-600/20 border-violet-500 text-white"
                          : "bg-slate-950 border-white/5 text-slate-400 hover:bg-[#0c122c]/50"
                      }`}
                    >
                      {rate.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Sandbox Container Button */}
          <div className="p-5 rounded-xl bg-slate-900 border border-white/5 space-y-4">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span>Extreme Sandbox Actions</span>
            </h3>

            <p className="text-xs text-slate-400 leading-normal">
              Need to clear manual inputs, created crowd experiences, and reset all Leetcode metrics? Perform a sandbox system purge to default starting properties.
            </p>

            {resetSuccess ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/25 text-xs text-emerald-300">
                Purged successfully! Reloading session...
              </div>
            ) : (
              <button
                onClick={handleResetDB}
                disabled={savingSettings}
                className="px-4 py-2.5 rounded-xl bg-red-600/15 border border-red-500/20 hover:bg-red-500 hover:border-red-500 text-xs font-bold text-red-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Sandbox Data</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-950/15 to-transparent border border-violet-500/10 space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-widest flex items-center gap-1.5">
              <BadgeCheck className="h-4.5 w-4.5 text-violet-400" />
              <span>Full Stack Diagnostics</span>
            </h4>
            <div className="text-xs text-slate-400 space-y-2 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Database persistence:</span>
                <span className="text-white">Active (JSON)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Platform Framework:</span>
                <span className="text-white">React 18 + Vite</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>Styling Engine:</span>
                <span className="text-white">Tailwind CSS v4</span>
              </div>
              <div className="flex justify-between">
                <span>Core LLM model:</span>
                <span className="text-violet-300">Gemini 3.5 Flash</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
