import React, { useState } from "react";
import {
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");

    const handleConfirm = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Reset Password API

        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-slate-900 overflow-hidden font-sans">
            {/* LEFT PANEL */}
            <div className="hidden md:flex flex-col md:w-[42%] lg:w-[38%] bg-[#080d21] text-white p-10 justify-between relative overflow-hidden shrink-0">

                {/* GRID */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b3f5c_1px,transparent_1px),linear-gradient(to_bottom,#3b3f5c_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* GLOW EFFECTS */}
                <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-violet-600/15 blur-[100px]" />

                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[90px]" />

                {/* LOGO */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="text-3xl font-bold text-violet-500">
                        P
                    </div>

                    <span className="font-extrabold text-base tracking-tight">
                        PlacementPilot AI
                    </span>
                </div>

                {/* CONTENT */}
                <div className="relative z-10 space-y-3.5 my-auto max-w-sm">

                    <h1 className="text-3xl font-black tracking-tight leading-tight">
                        Create New Password
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        Your account has been verified successfully.
                        Create a strong password to continue.
                    </p>

                    {/* ILLUSTRATION */}
                    <div className="relative pt-12 pb-6 flex justify-center">

                        <div className="w-48 h-48 rounded-full bg-violet-950/40 border border-violet-500/10 flex items-center justify-center relative shadow-inner">

                            <ShieldCheck className="h-16 w-16 text-violet-400" />

                            {/* VERIFIED */}
                            <div className="absolute top-5 left-[-18px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>

                                <span className="text-[10px] font-bold text-slate-200">
                                    Verified
                                </span>
                            </div>

                            {/* SECURE */}
                            <div className="absolute top-4 right-[-10px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                                    <Sparkles className="h-3.5 w-3.5" />
                                </div>

                                <span className="text-[10px] font-bold text-slate-200">
                                    Secure Account
                                </span>
                            </div>

                            {/* PASSWORD */}
                            <div className="absolute bottom-6 right-[-24px] p-2 bg-slate-900 border border-white/10 rounded-xl shadow-lg flex items-center gap-2">
                                <div className="p-1.5 bg-violet-500/20 text-violet-400 rounded-lg">
                                    <Lock className="h-3.5 w-3.5" />
                                </div>

                                <span className="text-[10px] font-bold text-slate-200">
                                    New Password
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
                        Reset Password
                    </h2>

                    <p className="text-slate-500 text-sm mb-8">
                        Create a new password for your account
                    </p>

                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleConfirm} className="space-y-4">

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="
                    w-full
                    pl-10.5
                    pr-11
                    py-3
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    text-xs
                    focus:ring-2
                    focus:ring-indigo-500/25
                    focus:border-indigo-600
                    focus:outline-none
                    transition-all
                  "
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4.5 w-4.5" />
                                    ) : (
                                        <Eye className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />

                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="
                    w-full
                    pl-10.5
                    pr-11
                    py-3
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    text-xs
                    focus:ring-2
                    focus:ring-indigo-500/25
                    focus:border-indigo-600
                    focus:outline-none
                    transition-all
                  "
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirm ? (
                                        <EyeOff className="h-4.5 w-4.5" />
                                    ) : (
                                        <Eye className="h-4.5 w-4.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
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
                mt-2
              "
                        >
                            Confirm Password
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}