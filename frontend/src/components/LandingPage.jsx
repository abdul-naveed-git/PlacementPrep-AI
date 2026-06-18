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
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-[#050816] via-[#071330] to-[#120033]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-violet-500">P</div>
          <h1 className="text-xl font-bold">PlacementPilot AI</h1>
        </div>

        <div className="hidden md:flex gap-10 font-medium">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <div className="flex gap-4">
          <Link to="/login">
            <button className="px-6 py-3 border border-gray-700 rounded-xl hover:border-violet-500 transition">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="px-6 py-3 bg-violet-600 rounded-xl hover:bg-violet-700 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full animate-pulse"></div>

          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <div className="inline-block px-5 py-2 rounded-full bg-slate-800 text-sm mb-8">
              ✨ AI-Powered Placement Preparation
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-violet-500 leading-tight">
              <span className="block">Your AI Co-pilot for</span>

              <span className="relative block h-[80px] overflow-hidden text-white">
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

            <p className="text-gray-400 text-base mt-6 max-w-xl leading-relaxed">
              Personalized roadmaps, real interview experiences, AI insights and
              smart analytics to help you crack your dream company.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <Link to="/signup">
                <button className="bg-violet-600 px-8 py-4 rounded-xl font-semibold hover:bg-violet-700 transition">
                  Sign Up for Free
                </button>
              </Link>

              <Link to="/login">
                <button className="border border-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-violet-500 transition">
                  Login to Your Account
                </button>
              </Link>
            </div>

            {/* Companies */}
            {/* Companies Scroller */}
            <div className="mt-16">
              <p className="text-gray-500 mb-5">
                Trusted by 10,000+ students from
              </p>

              <div className="overflow-hidden relative">
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
            <div className="bg-gradient-to-br from-[#101a3d] to-[#120d35] border border-slate-600 rounded-[32px] p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
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
                  <h3 className="font-semibold text-lg mb-5">Top Strengths</h3>

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

                  <h3 className="font-semibold text-lg mb-5">Top Weaknesses</h3>

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
              <div className="mt-8 bg-slate-900 rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Recommended for you</h4>
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
    group
    p-6
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
                <div className="w-24 h-24 mx-auto bg-violet-100 rounded-3xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              </motion.div>
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
                className="border border-gray-200 rounded-3xl p-8 bg-white transition-all duration-300  hover:-translate-y-3 hover:shadow-2xl hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-indigo-50"
              >
                <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-5">
                  {feature.icon}
                </div>

                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>

                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Top Companies */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <h2
            className="text-3xl lg:text-4xl font-bold text-center mb-14"
            assName="text-4xl font-bold text-center mb-16"
          >
            Top Company Insights
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
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
"
              >
                <div className="h-40 bg-gray-50 flex items-center justify-center">
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

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black">
                    {company.name}
                  </h3>

                  <p className="text-violet-600 font-semibold mt-3">
                    Readiness {company.readiness}
                  </p>

                  <p className="text-gray-600 mt-4 text-sm">Top Skills:</p>

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
