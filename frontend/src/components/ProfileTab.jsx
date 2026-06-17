import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Save, CheckCircle, Sparkles, Building2, Terminal, GraduationCap } from "lucide-react";

const PRESET_COMPANIES = ["Google", "Microsoft", "Meta", "Amazon", "Netflix", "Apple", "Uber", "Stripe", "Airbnb", "Tesla"];

export default function ProfileTab({ user, onSaveProfile, savingProfile, profileSuccess }) {
  // Read extra custom properties from localStorage to persist them safely client-side
  const [fullName, setFullName] = useState(() => localStorage.getItem("pf_fullName") || "Arjun Verma");
  const [academicYear, setAcademicYear] = useState(() => localStorage.getItem("pf_year") || "3rd Year");
  const [department, setDepartment] = useState(() => localStorage.getItem("pf_dept") || "Computer Science Engineering");
  const [leetcodeUsername, setLeetcodeUsername] = useState(user.leetcodeUsername || "");
  const [selectedCompanies, setSelectedCompanies] = useState(user.targetCompanies || []);
  const [targetRole, setTargetRole] = useState(user.targetRole || "Software Development Engineer (SDE)");
  const [manualWeakness, setManualWeakness] = useState("");
  const [weakTopics, setWeakTopics] = useState(user.weakTopics || ["Dynamic Programming", "Graphs"]);

  // Set default profile icon
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName || "Arjun"}`;

  const handleToggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const handleAddWeakness = () => {
    if (!manualWeakness.trim()) return;
    if (!weakTopics.includes(manualWeakness.trim())) {
      setWeakTopics(prev => [...prev, manualWeakness.trim()]);
    }
    setManualWeakness("");
  };

  const handleRemoveWeakness = (topic) => {
    setWeakTopics(prev => prev.filter(t => t !== topic));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Cache custom parameters in localStorage
    localStorage.setItem("pf_fullName", fullName);
    localStorage.setItem("pf_year", academicYear);
    localStorage.setItem("pf_dept", department);

    await onSaveProfile({
      leetcodeUsername,
      targetCompanies: selectedCompanies,
      targetRole,
      weakTopics,
      fullName,
      academicYear,
      department
    });
  };

  return (
    <div id="student_integrated_profile_view" className="space-y-6">
      
      {/* Upper header segment resembling Page 8 screenshot */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c122c] border border-white/5 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-violet-500/30 flex items-center justify-center p-2.5 overflow-hidden">
            <img 
              src={avatarUrl} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold bg-violet-600 text-white animate-pulse">
            Active
          </span>
        </div>

        <div className="text-center md:text-left space-y-1">
          <h2 className="text-xl font-black text-white font-display">{fullName}</h2>
          <p className="text-xs text-slate-400 font-mono flex items-center justify-center md:justify-start gap-1.5">
            <GraduationCap className="h-4 w-4 text-violet-400" />
            <span>{department} • {academicYear} Scholar</span>
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start pt-1.5">
            <span className="text-[10px] bg-white/5 px-2.5 py-0.5 rounded text-slate-300 border border-white/5 font-bold">
              {targetRole}
            </span>
            {user.leetcodeUsername && (
              <span className="text-[10px] bg-slate-950 text-amber-500 px-2 py-0.5 rounded border border-amber-500/10 font-mono">
                @{user.leetcodeUsername}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        
        {/* Academic and Core parameters */}
        <div className="p-6 rounded-xl bg-slate-900 border border-white/5 space-y-4">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
            Academic Information
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Full Student Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs text-slate-350 focus:outline-none focus:border-violet-500"
                >
                  <option value="1st Year">1st Year Scholar</option>
                  <option value="2nd Year">2nd Year Scholar</option>
                  <option value="3rd Year">3rd Year Scholar</option>
                  <option value="4th Year">4th Year Scholar</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Leetcode Username</label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. dsajunkie"
                className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1 font-sans">Target SDE Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-350"
              >
                <option value="Software Development Engineer (SDE)">Software Engineering (SDE-1)</option>
                <option value="Full Stack SDE Intern">Full Stack SDE Intern</option>
                <option value="Systems or Platform Engineer">Systems or Platform Engineer</option>
                <option value="Data Structures Intern">Data Structures Scholar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Targets: Corporations & Weak Topics tagger */}
        <div className="p-6 rounded-xl bg-slate-900 border border-white/5 space-y-4">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider border-b border-white/5 pb-2">
            Placement Focus Targets
          </h3>

          <div className="space-y-4">
            
            {/* Target Corporations */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5 flex justify-between">
                <span>Priority Corporate Targets</span>
                <span className="text-violet-400 text-[9px] lowercase font-mono">({selectedCompanies.length} selected)</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {PRESET_COMPANIES.map((company) => {
                  const isSelected = selectedCompanies.includes(company);
                  return (
                    <button
                      key={company}
                      type="button"
                      onClick={() => handleToggleCompany(company)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-violet-600/20 border-violet-500 text-white"
                          : "bg-slate-950 border-white/5 text-slate-500 hover:border-slate-800"
                      }`}
                    >
                      {company}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weak topics Tagging */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">DSA Weak topics</label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={manualWeakness}
                  onChange={(e) => setManualWeakness(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Trees"
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-white/5 rounded-lg text-xs focus:outline-none focus:border-violet-500 text-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddWeakness}
                  className="px-3 rounded-lg bg-slate-800 border border-white/5 hover:bg-slate-700 text-xs text-white cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto">
                {weakTopics.map((topic) => (
                  <span 
                    key={topic} 
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-405 border border-white/5 flex items-center gap-1 bg-slate-950 text-slate-300"
                  >
                    <span>{topic}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveWeakness(topic)}
                      className="text-red-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Row-wide actions */}
        <div className="md:col-span-2 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-xs">
            {profileSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="h-4 w-4" />
                <span>Profile targets saved successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-slate-950 flex items-center gap-2 cursor-pointer text-slate-900 border border-none shadow-lg active:scale-95 transition-all"
          >
            <Save className="h-4 w-4 text-slate-900" />
            <span>{savingProfile ? "Saving Parameters..." : "Sync Profile Changes"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
