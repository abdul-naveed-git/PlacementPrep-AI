import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Target,
  ClipboardList,
  Fingerprint,
} from "lucide-react";
import { apiRequest } from "../lib/api";
import {
  getFirstZodErrorMessage,
  loginSchema,
  signupEmailSchema,
  signupVerificationSchema,
} from "../lib/validation";

import { useLocation, useNavigate } from "react-router-dom";

export default function Signup({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState(
    location.pathname === "/signup" ? "signup" : "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    const parsed = signupEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setErrorMsg(
        getFirstZodErrorMessage(parsed.error, "Please enter a valid email address."),
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessInfo(null);
    try {
      const res = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setIsOtpSent(true);
      setSuccessInfo(
        res.message || "Verification code dispatched successfully.",
      );
    } catch (err) {
      setErrorMsg(err.message || "Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSignUp = async (e) => {
    e.preventDefault();

    const parsed = signupVerificationSchema.safeParse({
      email,
      otp,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      setErrorMsg(
        getFirstZodErrorMessage(parsed.error, "Please check your signup details."),
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiRequest("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email, otp, password }),
      });

      if (onLoginSuccess) {
        onLoginSuccess(res.user, res.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid validation parameters or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductionLogin = async (e) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrorMsg(
        getFirstZodErrorMessage(parsed.error, "Please check your login details."),
      );
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (onLoginSuccess) {
        onLoginSuccess(res.user, res.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Login authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="landing_auth_split_root"
      className="min-h-screen flex bg-slate-900 overflow-hidden font-sans"
    >
      {/* LEFT PANEL DECORATION */}
      <div className="hidden md:flex flex-col md:w-[42%] lg:w-[38%] bg-[#080d21] text-white p-10 justify-between relative overflow-hidden shrink-0 select-none">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b3f5c_1px,transparent_1px),linear-gradient(to_bottom,#3b3f5c_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[90px] pointer-events-none" />

        {/* LOGO */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="text-3xl font-bold text-violet-500">P</div>
          <span className="font-extrabold text-base tracking-tight text-white font-display">
            PlacementPilot AI
          </span>
        </div>

        {/* ILLUSTRATIONS */}
        <div className="relative z-10 space-y-3.5 my-auto max-w-sm">
          <AnimatePresence mode="wait">
            {authMode === "login" ? (
              <motion.div
                key="login-left-heading"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-3xl font-black tracking-tight leading-tight text-white font-display">
                  Welcome back!
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Login to continue your placement preparation journey.
                </p>

                <div className="relative pt-12 pb-6 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-indigo-950/40 border border-indigo-500/10 flex items-center justify-center relative shadow-inner">
                    <Rocket className="h-16 w-16 text-indigo-400" />

                    <div className="absolute top-5 left-[-16px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        Arrays Ready
                      </span>
                    </div>

                    <div className="absolute bottom-6 right-[-24px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-violet-500/20 text-violet-400 rounded-lg">
                        <TrendingUp className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        SDE Metric: 94%
                      </span>
                    </div>

                    <div className="absolute top-4 right-[-10px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
                        <Target className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        Meta Prep
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup-left-heading"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-3xl font-black tracking-tight leading-tight text-white font-display">
                  Start your journey <br /> to placement success
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                  Create your account and get personalized preparation.
                </p>

                <div className="relative pt-12 pb-6 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-violet-950/40 border border-violet-500/10 flex items-center justify-center relative shadow-inner">
                    <Fingerprint className="h-16 w-16 text-violet-400" />

                    <div className="absolute top-4 left-[-18px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-violet-500/20 text-violet-400 rounded-lg">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        Secure OTP
                      </span>
                    </div>

                    <div className="absolute bottom-6 right-[-24px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                        <ClipboardList className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        Custom Roadmap
                      </span>
                    </div>

                    <div className="absolute top-5 right-[-14px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">
                        IntelliPilot
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          Production Gateway System
        </div>
      </div>

      {/* RIGHT AUTH WORKSPACE */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-6 sm:px-12 py-12 relative overflow-y-auto">
        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white text-xs font-black">
            <Rocket className="h-3.5 w-3.5" />
          </div>
          <span className="font-black text-sm tracking-tight text-slate-900 font-display">
            PlacementPilot AI
          </span>
        </div>

        <div className="w-full max-w-md space-y-7 py-6">
          <div>
            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.h2
                  key="login-heading"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display"
                >
                  Login to your account
                </motion.h2>
              ) : (
                <motion.h2
                  key="signup-heading"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display"
                >
                  Create your account
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-semibold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.form
                  key="login-form"
                  onSubmit={handleProductionLogin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 tracking-tight">
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

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 tracking-tight">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-10.5 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-slate-800 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end -mt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs font-semibold text-[#4f46e5] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl text-xs font-black bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-all shadow-md flex items-center justify-center disabled:opacity-50 mt-5 cursor-pointer font-bold"
                  >
                    {isLoading ? "Authenticating..." : "Login"}
                  </button>

                  <div className="text-center pt-2 text-xs text-slate-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setErrorMsg(null);
                        setSuccessInfo(null);
                        setIsOtpSent(false);
                      }}
                      className="text-[#4f46e5] font-extrabold hover:underline cursor-pointer"
                    >
                      Sign up
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="signup-otp-flow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {!isOtpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-705 tracking-tight">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email to register"
                            className="w-full pl-10.5 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-slate-800 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl text-xs font-black bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50 font-bold"
                      >
                        {isLoading ? "Generating Secure Token..." : "Verify"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleFinalSignUp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-705 tracking-tight">
                          Enter 6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="------"
                          className="w-full text-center py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-md font-black tracking-[0.2em] focus:outline-none focus:border-indigo-600 text-slate-800 focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-705 tracking-tight">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password definition"
                            className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-slate-800 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-705 tracking-tight">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password structure"
                            className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-600 focus:outline-none text-slate-800 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtpSent(false);
                            setSuccessInfo(null);
                            setErrorMsg(null);
                            setOtp("");
                          }}
                          className="w-1/3 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-2/3 py-3 rounded-xl text-xs font-black bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-all shadow-md disabled:opacity-50 flex items-center justify-center cursor-pointer font-bold"
                        >
                          {isLoading ? "Provisioning Profile..." : "Sign Up"}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="text-center pt-2 text-xs text-slate-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMsg(null);
                        setSuccessInfo(null);
                      }}
                      className="text-[#4f46e5] font-extrabold hover:underline cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
