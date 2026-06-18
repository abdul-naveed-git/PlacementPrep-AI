import React, { useState } from "react";
import {
  Mail,
  Rocket,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",

        body: JSON.stringify({
          email,
        }),
      });

      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col md:w-[42%] lg:w-[38%] bg-[#080d21] text-white p-10 justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b3f5c_1px,transparent_1px),linear-gradient(to_bottom,#3b3f5c_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-violet-600/15 blur-[100px]" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[90px]" />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="text-3xl font-bold text-violet-500">P</div>

          <span className="font-extrabold text-base tracking-tight text-white">
            PlacementPilot AI
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 space-y-3 my-auto max-w-sm">
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            Forgot Password?
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Recover your account securely through OTP verification.
          </p>

          <div className="relative pt-12 pb-6 flex justify-center">
            <div className="w-48 h-48 rounded-full bg-indigo-950/40 border border-indigo-500/10 flex items-center justify-center relative shadow-inner">
              <ShieldCheck className="h-16 w-16 text-indigo-400" />

              {/* CARD 1 */}
              <div className="absolute top-5 left-[-16px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-200">
                  Secure OTP
                </span>
              </div>

              {/* CARD 2 */}
              <div className="absolute top-4 right-[-10px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-[10px] font-bold text-slate-200">
                  AI Security
                </span>
              </div>

              {/* CARD 3 */}
              <div className="absolute bottom-6 right-[-24px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-200">
                  Fast Recovery
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          PRODUCTION GATEWAY SYSTEM
        </div>
      </div>

      {/* RIGHT PANEL */}
      {/* RIGHT PANEL */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 sm:px-12 py-12">
        <div className="w-full max-w-md space-y-7">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Password Recovery
          </h2>

          <p className="text-sm text-slate-500">
            Enter your registered email address
          </p>

          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10.5 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-slate-800 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-black bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-all shadow-md cursor-pointer"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
