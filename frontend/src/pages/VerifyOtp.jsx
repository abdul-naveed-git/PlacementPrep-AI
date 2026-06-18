import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Rocket,
  ShieldCheck,
  Sparkles,
  Fingerprint,
  MailCheck,
} from "lucide-react";
import { apiRequest } from "../lib/api";
import { getFirstZodErrorMessage, verifyOtpSchema } from "../lib/validation";
export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg("Please start the recovery flow again.");
      navigate("/forgot-password");
      return;
    }

    const parsed = verifyOtpSchema.safeParse({ email, otp });
    if (!parsed.success) {
      setErrorMsg(
        getFirstZodErrorMessage(parsed.error, "Please enter the 6-digit OTP."),
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await apiRequest("/api/auth/verify-reset-otp", {
        method: "POST",

        body: JSON.stringify({
          email,
          otp,
        }),
      });

      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (err) {
      setErrorMsg(err.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden font-sans">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col md:w-[42%] lg:w-[38%] bg-[#080d21] text-white p-10 justify-between relative overflow-hidden shrink-0">
        {/* GRID */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b3f5c_1px,transparent_1px),linear-gradient(to_bottom,#3b3f5c_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* GLOWS */}
        <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-violet-600/15 blur-[100px]" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[90px]" />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="text-3xl font-bold text-violet-500">P</div>

          <span className="font-extrabold text-base tracking-tight">
            PlacementPilot AI
          </span>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 space-y-3.5 my-auto max-w-sm">
          <h1 className="text-3xl font-black tracking-tight leading-tight">
            Verify Your Account
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Enter the verification code sent to your registered email address to
            continue password recovery.
          </p>

          {/* ILLUSTRATION */}
          <div className="relative pt-12 pb-6 flex justify-center">
            <div className="w-48 h-48 rounded-full bg-violet-950/40 border border-violet-500/10 flex items-center justify-center relative shadow-inner">
              <ShieldCheck className="h-16 w-16 text-violet-400" />

              {/* CARD 1 */}
              <div className="absolute top-5 left-[-18px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <div className="p-1.5 bg-violet-500/20 text-violet-400 rounded-lg">
                  <Fingerprint className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-bold text-slate-200">
                  Secure OTP
                </span>
              </div>

              {/* CARD 2 */}
              <div className="absolute top-4 right-[-10px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-bold text-slate-200">
                  AI Protected
                </span>
              </div>

              {/* CARD 3 */}
              <div className="absolute bottom-6 right-[-24px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <MailCheck className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-bold text-slate-200">
                  OTP Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative z-10 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          PRODUCTION GATEWAY SYSTEM
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 sm:px-12 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-2">
            OTP Verification
          </h2>

          <p className="text-slate-500 text-sm mb-8">
            Enter the 6-digit code sent to your email
          </p>

          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Verification Code
              </label>

              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="------"
                className="
                  w-full
                  py-4
                  text-center
                  text-xl
                  font-black
                  tracking-[0.5em]
                  bg-white
                  border
                  border-slate-200
                  rounded-xl
                  focus:ring-2
                  focus:ring-indigo-500/25
                  focus:border-indigo-600
                  focus:outline-none
                  transition-all
                "
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                py-3.5
                rounded-xl
                text-xs
                font-black
                bg-[#4f46e5]
                hover:bg-[#4338ca]
                text-white
                transition-all
                shadow-md
                cursor-pointer
              "
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
