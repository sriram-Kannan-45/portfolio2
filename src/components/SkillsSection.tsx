"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { TechIcon } from "@/components/TechIcon";
import {
  Brain,
  Code,
  Cpu,
  Layers,
  CheckCircle2,
  Sparkles,
  Terminal,
  ShieldCheck,
} from "lucide-react";

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    {
      id: "all",
      label: "All Expertise",
      icon: Layers,
    },
    {
      id: "ai",
      label: "AI & Deep Learning",
      icon: Brain,
    },
    {
      id: "languages",
      label: "Languages & OOP",
      icon: Code,
    },
    {
      id: "quality",
      label: "QA & Verification",
      icon: ShieldCheck,
    },
    {
      id: "portfolio",
      label: "Portfolio Stack",
      icon: Cpu,
    },
  ];

  const skillGroups = [
    {
      id: "ai",
      title: "AI, Machine Learning & Computer Vision",
      description:
        "Neural network training, real-time diagnostic object detection, multimodal pipelines, and audio accessibility.",
      items: [
        ...PORTFOLIO_DATA.skills.aiAndMl,
        ...PORTFOLIO_DATA.skills.libraries,
      ],
      icon: Brain,
      tag: "Deep Tech",
    },
    {
      id: "languages",
      title: "Core Programming Languages & Architecture",
      description:
        "Object-oriented design, strongly typed backends, relational data models, and clean API contracts.",
      items: [
        ...PORTFOLIO_DATA.skills.languages,
        ...PORTFOLIO_DATA.skills.engineeringAndDevOps,
      ],
      icon: Code,
      tag: "Software Engineering",
    },
    {
      id: "quality",
      title: "Quality Assurance & Test Automation",
      description:
        "End-to-end browser automation, continuous integration pipelines, and defect mitigation.",
      items: PORTFOLIO_DATA.skills.qualityAndVerification,
      icon: ShieldCheck,
      tag: "System Reliability",
    },
    {
      id: "portfolio",
      title: "Website Engineering Architecture",
      description:
        "The modern, high-performance stack deployed for this personal digital portfolio experience.",
      items: PORTFOLIO_DATA.skills.portfolioTechStack,
      icon: Cpu,
      tag: "Site Architecture",
      isSiteStack: true,
    },
  ];

  const filteredGroups =
    activeCategory === "all"
      ? skillGroups
      : skillGroups.filter((g) => g.id === activeCategory);

  return (
    <section
      id="skills"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Technical Expertise and Skills"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 // TECHNICAL PROFICIENCY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Rigorous Tools &amp; <br className="hidden sm:block" />
            <span className="text-neutral-400">Verifiable Engineering Stack</span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
          Ground-truth technologies supported by academic specialization, real-world
          internships, and enterprise development.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-10 pb-2 overflow-x-auto">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                isActive
                  ? "bg-white text-black font-bold shadow-lg"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="glass-panel p-7 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-white/[0.04] text-neutral-400 border border-white/5 uppercase">
                    {group.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {group.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-normal">
                  {group.description}
                </p>
              </div>

              {/* Skills Logos */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-2.5 items-center">
                  {group.items.map((skill) => (
                    <div
                      key={skill}
                      className="relative group/skill flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/50 hover:scale-110 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-emerald-500/10 hover:shadow-lg cursor-pointer"
                      title={skill}
                      aria-label={skill}
                      tabIndex={0}
                    >
                      <TechIcon
                        name={skill}
                        className="w-6 h-6 transition-transform duration-200 group-hover/skill:scale-110"
                      />

                      {/* Tooltip */}
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-neutral-900/95 border border-white/20 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover/skill:opacity-100 group-focus/skill:opacity-100 pointer-events-none transition-all duration-200 z-30 shadow-xl backdrop-blur-md">
                        {skill}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 border-r border-b border-white/20 rotate-45" />
                      </div>
                    </div>
                  ))}
                </div>

                {group.isSiteStack && (
                  <p className="mt-4 text-[11px] text-neutral-500 font-mono italic">
                    * Next.js, R3F, Three.js, and GSAP reflect the architectural stack
                    powering this portfolio without claiming prior professional mastery.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
