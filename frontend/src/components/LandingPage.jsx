import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
  const titles = [
    "Placement Success",
    "Dream Offers",
    "Interview Mastery",
    "DSA Excellence",
    "Career Growth",
  ];
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-gradient-to-br from-[#050816] via-[#071330] to-[#120033]">
      {/* Navbar */}
      <nav className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl font-bold text-violet-500">P</div>
          <h1 className="text-lg sm:text-xl font-bold">PlacementPilot AI</h1>
        </div>

        <div className="hidden md:flex gap-10 font-medium">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link to="/login">
            <button className="w-full px-5 py-3 border border-gray-700 rounded-xl hover:border-violet-500 transition sm:w-auto">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="w-full px-5 py-3 bg-violet-600 rounded-xl hover:bg-violet-700 transition sm:w-auto">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 hidden sm:block">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full animate-pulse"></div>

          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Side */}
          <div>
            <div className="inline-flex px-4 py-2 rounded-full bg-slate-800 text-xs sm:text-sm mb-5 sm:mb-8 tracking-wide">
              ✨ AI-Powered Placement Preparation
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-violet-500 leading-tight">
              <span className="block">Your AI Co-pilot for</span>

              <span className="relative block min-h-[64px] sm:h-[80px] overflow-hidden text-white">
                {titles.map((title, index) => (
                  <motion.span
                    key={title}
                    className="absolute left-0 top-0 w-full"
                    animate={{
                      y:
                        titleNumber === index
                          ? 0
                          : titleNumber > index
                            ? -100
                            : 100,
                      opacity: titleNumber === index ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 mt-5 sm:mt-6 max-w-xl leading-relaxed">
              Personalized roadmaps, real interview experiences, AI insights and
              smart analytics to help you crack your dream company.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-5">
              <Link to="/signup">
                <button className="w-full bg-violet-600 px-8 py-4 rounded-xl font-semibold hover:bg-violet-700 transition sm:w-auto">
                  Sign Up for Free
                </button>
              </Link>

              <Link to="/login">
                <button className="w-full border border-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-violet-500 transition sm:w-auto">
                  Login to Your Account
                </button>
              </Link>
            </div>

            {/* Companies */}
            {/* Companies Scroller */}
            <div className="mt-12 sm:mt-16">
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">
                Trusted by 10,000+ students from
              </p>

              <div className="flex flex-wrap gap-2 md:hidden">
                {["Google", "Amazon", "Microsoft", "Adobe", "TCS", "Infosys"].map(
                  (company) => (
                    <span
                      key={company}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200"
                    >
                      {company}
                    </span>
                  ),
                )}
              </div>

              <div className="relative hidden overflow-hidden md:block">
                <div className="flex w-max animate-marquee gap-16 text-2xl font-bold text-gray-300">
                  <span>Google</span>
                  <span>Amazon</span>
                  <span>Microsoft</span>
                  <span>Adobe</span>
                  <span>TCS</span>
                  <span>Infosys</span>
                  <span>Wipro</span>
                  <span>Accenture</span>

                  {/* Duplicate for infinite scroll */}
                  <span>Google</span>
                  <span>Amazon</span>
                  <span>Microsoft</span>
                  <span>Adobe</span>
                  <span>TCS</span>
                  <span>Infosys</span>
                  <span>Wipro</span>
                  <span>Accenture</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Card */}
          <div>
            <div className="bg-gradient-to-br from-[#101a3d] to-[#120d35] border border-slate-600 rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                {/* Progress */}
                <div>
                  <h3 className="font-semibold text-lg mb-6">
                    Your Placement Readiness
                  </h3>

                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                      <svg className="w-40 h-40 sm:w-48 sm:h-48 -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="75"
                          stroke="#374151"
                          strokeWidth="16"
                          fill="none"
                        />

                        <circle
                          cx="80"
                          cy="80"
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
                        <h2 className="text-4xl sm:text-5xl font-bold">72%</h2>
                        <p className="text-sm sm:text-base text-gray-400">Moderate</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-green-400 text-center mt-5 font-semibold">
                    ↑ 8% this week
                  </p>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-5">Top Strengths</h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle className="text-green-500" />
                      Arrays
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle className="text-green-500" />
                      TCS
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle className="text-green-500" />
                      SQL
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle className="text-green-500" />
                      System Design
                    </div>
                  </div>

                  <div className="border-t border-slate-700 my-5 sm:my-6"></div>

                  <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-5">Top Weaknesses</h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <AlertCircle className="text-red-500" />
                      Dynamic Programming
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <AlertCircle className="text-red-500" />
                      Graphs
                    </div>

                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <AlertCircle className="text-red-500" />
                      Operating Systems
                    </div>
                  </div>
                </div>
              </div>
              {/* Recommendation */}
              <div className="mt-6 sm:mt-8 bg-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">Recommended for you</h4>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">
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
      <div className="bg-[#fafafa] text-black mt-16 sm:mt-24 rounded-t-[32px] sm:rounded-t-[48px] border-t border-gray-200">
        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-14">
            How PlacementPilot AI Works
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-10 text-center">
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
              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="
    relative
    group
    p-5 sm:p-6
    rounded-3xl
    bg-white
    border
    border-transparent
    transition-all
    duration-300
    hover:border-violet-300
    hover:shadow-[0_15px_40px_rgba(139,92,246,0.18)]
  "
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-violet-100 rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>

                <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-14">
            Powerful Features for Your Placement Journey
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
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
                className="border border-gray-200 rounded-3xl p-5 sm:p-8 bg-white transition-all duration-300  hover:-translate-y-3 hover:shadow-2xl hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-indigo-50"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  {feature.icon}
                </div>

                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{feature.title}</h3>

                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Top Companies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-14"
          >
            Top Company Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 mt-10 sm:mt-16">
            {[
              {
                name: "Amazon",
                logo: "/amazon.webp",
                readiness: "68%",
                skills: "DSA, System Design, SQL",
              },
              {
                name: "Microsoft",
                logo: "/microsoft.jpeg",
                readiness: "72%",
                skills: "DSA, OOPs, System Design",
              },
              {
                name: "Google",
                logo: "/google.jpeg",
                readiness: "65%",
                skills: "DSA, System Design, OS",
              },
              {
                name: "Adobe",
                logo: "/adobe.jpeg",
                readiness: "60%",
                skills: "DSA, Frontend, System Design",
              },
            ].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.04,
                }}
                className="
  group
  overflow-hidden
  rounded-3xl
  bg-white
  border
  border-gray-200
  shadow-md
  hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]
  hover:border-violet-400
  transition-all
  duration-300
  max-w-md
  mx-auto
"
              >
                <div className="h-36 sm:h-40 bg-gray-50 flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="
      h-16
      object-contain
      transition-transform
      duration-500
      group-hover:scale-110
    "
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-black">
                    {company.name}
                  </h3>

                  <p className="text-violet-600 font-semibold mt-2 sm:mt-3">
                    Readiness {company.readiness}
                  </p>

                  <p className="text-gray-600 mt-3 sm:mt-4 text-sm">Top Skills:</p>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {company.skills}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
