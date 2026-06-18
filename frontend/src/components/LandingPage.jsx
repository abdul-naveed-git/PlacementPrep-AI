import React from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    CheckCircle,
    AlertCircle,
    ClipboardList,
    Brain,
    Puzzle,
    BarChart3,
    BookOpen,
    Briefcase,
    Lightbulb,
    Link as LinkIcon,
} from "lucide-react";
export default function LandingPage() {
    return (
        <div className="relative min-h-screen text-white overflow-hidden bg-[#04081d]">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-700/20 blur-[160px] rounded-full"></div>

            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-violet-700/20 blur-[160px] rounded-full"></div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[200px] bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 blur-[120px] opacity-40 rounded-full"></div>
            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="text-4xl font-bold text-violet-500">P</div>
                    <h1 className="text-xl font-bold">PlacementPilot AI</h1>
                </div>

                <div className="hidden md:flex gap-10 font-medium text-gray-300">
                    <a
                        href="/"
                        className="relative hover:text-violet-400 transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-violet-500 hover:after:w-full after:transition-all after:duration-300"
                    >
                        Home
                    </a>

                    <a
                        href="/dashboard"
                        className="relative hover:text-violet-400 transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-violet-500 hover:after:w-full after:transition-all after:duration-300"
                    >
                        Dashboard
                    </a>

                    <a
                        href="#about"
                        className="relative hover:text-violet-400 transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-violet-500 hover:after:w-full after:transition-all after:duration-300"
                    >
                        About
                    </a>
                </div>

                <div className="flex gap-4">
                    <Link to="/login">
                        <button className="px-6 py-3 border border-violet-500/30 bg-white/5 backdrop-blur-md rounded-xl hover:bg-violet-500 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/40 transition-all duration-500">
                            Login
                        </button>
                    </Link>

                    <Link to="/signup">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:brightness-110 hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-500">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side */}
                    <div>
                        <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 backdrop-blur-md text-sm mb-8 text-violet-200 shadow-lg hover:shadow-violet-500/30 transition-all duration-500">
                            ✨ AI-Powered Placement Preparation
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                            Your AI Co-pilot for
                            <span className="block bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Placement Success
                            </span>
                        </h1>

                        <p className="text-gray-300 text-lg mt-8 max-w-xl leading-9">
                            Personalized roadmaps, real interview experiences,
                            AI insights and smart analytics to help you crack
                            your dream company.
                        </p>

                        <div className="flex flex-wrap gap-5 mt-10">
                            <Link to="/signup">
                                <button className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/60 hover:brightness-110 transition-all duration-500">
                                    Sign Up for Free
                                </button>
                            </Link>

                            <Link to="/login">
                                <button className="border border-violet-500/40 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-violet-500 hover:border-violet-500 transition-all duration-500">
                                    Login to Your Account
                                </button>
                            </Link>
                        </div>

                        {/* Companies */}
                        <div className="mt-16">
                            <p className="text-gray-500 mb-5">
                                Trusted by 10,000+ students from
                            </p>

                            <div className="flex flex-wrap items-center gap-10 mt-6">

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                                    alt="Google"
                                    className="h-8 object-contain"
                                />

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                    alt="Amazon"
                                    className="h-8 object-contain"
                                />

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                    alt="Microsoft"
                                    className="h-8 object-contain"
                                />

                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg"
                                    alt="Adobe"
                                    className="h-8 object-contain"
                                />

                            </div>
                        </div>
                    </div>

                    {/* Right Side Card */}
                    {/* Right Side Card */}
                    <div className="relative">

                        {/* Bottom neon wave */}
                        <div className="absolute -bottom-8 right-0 w-[450px] h-[140px] bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 blur-[55px] opacity-60"></div>

                        <div className="relative bg-gradient-to-br from-[#0f1837] via-[#131c44] to-[#1b1140] border border-slate-700/70 rounded-[32px] p-8 shadow-[0_0_60px_rgba(59,130,246,0.15)] hover:border-violet-500/50 hover:shadow-[0_0_80px_rgba(139,92,246,0.30)] transition-all duration-500">

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Progress */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-6">
                                        Your Placement Readiness
                                    </h3>

                                    <div className="flex items-center justify-center">
                                        <div className="relative w-48 h-48">

                                            <svg className="w-48 h-48 -rotate-90">
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="75"
                                                    stroke="#374151"
                                                    strokeWidth="16"
                                                    fill="none"
                                                />

                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="75"
                                                    stroke="#facc15"
                                                    strokeWidth="16"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeDasharray="471"
                                                    strokeDashoffset="132"
                                                />
                                            </svg>

                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <h2 className="text-5xl font-bold">72%</h2>
                                                <p className="text-gray-400">Moderate</p>
                                            </div>

                                        </div>
                                    </div>

                                    <p className="text-green-400 text-center mt-5 font-semibold">
                                        ↑ 8% this week
                                    </p>
                                </div>

                                {/* Strengths */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-5">
                                        Top Strengths
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500" />
                                            Arrays
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500" />
                                            TCS
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500" />
                                            SQL
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500" />
                                            System Design
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-700 my-6"></div>

                                    <h3 className="font-semibold text-lg mb-5">
                                        Top Weaknesses
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="text-red-500" />
                                            Dynamic Programming
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="text-red-500" />
                                            Graphs
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="text-red-500" />
                                            Operating Systems
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Recommendation */}
                            <div className="mt-8 bg-slate-900/80 border border-slate-700 rounded-2xl p-5 flex justify-between items-center hover:bg-slate-800 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-500">
                                <div>
                                    <h4 className="font-semibold">
                                        Recommended for you
                                    </h4>
                                    <p className="text-gray-400 mt-1">
                                        Focus on Dynamic Programming
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Solve 15–20 problems to improve
                                    </p>
                                </div>

                                <ArrowRight className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-[#fafafa] text-black mt-24 rounded-t-[48px] border-t border-gray-200">

                {/* How It Works */}
                <section className="max-w-7xl mx-auto px-8 py-20">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-14">
                        How PlacementPilot AI Works
                    </h2>

                    <div className="grid md:grid-cols-5 gap-10 text-center">
                        {[
                            {
                                icon: <LinkIcon size={40} className="text-violet-600" />,
                                title: "Connect",
                                desc: "Connect your profile and preferences",
                            },
                            {
                                icon: <ClipboardList size={40} className="text-violet-600" />,
                                title: "Analyze",
                                desc: "We analyze your skills and readiness",
                            },
                            {
                                icon: <Brain size={40} className="text-violet-600" />,
                                title: "AI Roadmap",
                                desc: "Get a personalized roadmap tailored to your goals",
                            },
                            {
                                icon: <Puzzle size={40} className="text-violet-600" />,
                                title: "Practice",
                                desc: "Solve relevant problems and take mock tests",
                            },
                            {
                                icon: <BarChart3 size={40} className="text-violet-600" />,
                                title: "Track",
                                desc: "Track progress and improve with insights",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-24 h-24 mx-auto bg-violet-100 rounded-3xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Features */}
                <section className="max-w-7xl mx-auto px-8 py-20">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-14 sName=text-4xl font-bold text-center mb-16">
                        Powerful Features for Your Placement Journey
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <BookOpen size={30} />,
                                title: "Personalized Roadmaps",
                                desc: "AI generated roadmap to guide you step-by-step to placement.",
                            },
                            {
                                icon: <Briefcase size={30} />,
                                title: "Company Preparation",
                                desc: "Company-specific insights, top questions, and curated resources.",
                            },
                            {
                                icon: <Brain size={30} />,
                                title: "Interview Experiences",
                                desc: "Real interview experiences shared by students and professionals.",
                            },
                            {
                                icon: <Lightbulb size={30} />,
                                title: "AI Insights & Analytics",
                                desc: "AI summarizes your progress and recommends next steps.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-3 hover:border-violet-300 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-5">
                                    {feature.icon}
                                </div>

                                <h3 className="font-bold text-lg mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Top Companies */}
                <section className="max-w-7xl mx-auto px-8 py-20">
                    <h2 className="text-3xl lg:text-4xl font-bold text-center mb-14" assName="text-4xl font-bold text-center mb-16">
                        Top Company Insights
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Amazon",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                                readiness: "68%",
                                skills: "DSA, System Design, SQL",
                            },
                            {
                                name: "Microsoft",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                                readiness: "72%",
                                skills: "DSA, OOPs, System Design",
                            },
                            {
                                name: "Google",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                                readiness: "65%",
                                skills: "DSA, System Design, OS",
                            },
                            {
                                name: "Adobe",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
                                readiness: "60%",
                                skills: "DSA, Frontend, System Design",
                            },
                        ].map((company, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-3 hover:border-violet-300 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-12 h-12 object-contain"
                                    />

                                    <h3 className="text-xl font-bold">
                                        {company.name}
                                    </h3>
                                </div>

                                <p className="font-medium mb-3">
                                    Readiness {company.readiness}
                                </p>

                                <p className="text-gray-600 text-sm mb-6">
                                    Top Skills: {company.skills}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-xl font-semibold">
                            Explore All Companies
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}