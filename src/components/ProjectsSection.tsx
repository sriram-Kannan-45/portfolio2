"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA, Project } from "@/data/portfolioData";
import { TechIcon } from "@/components/TechIcon";
import {
  ExternalLink,
  Layers,
  Sparkles,
  Activity,
  CheckCircle,
  FileCode,
  Shield,
  ArrowUpRight,
} from "lucide-react";

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "AI & Computer Vision",
    "Enterprise Platform",
    "Software Architecture",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? PORTFOLIO_DATA.projects
      : PORTFOLIO_DATA.projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="projects"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Featured Projects"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>03 // FEATURED WORK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Intelligent Systems &amp; <br className="hidden sm:block" />
            <span className="text-neutral-400">Production Platforms</span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed font-normal">
          A showcase of verifiable computer vision research, accessible AI
          applications, and deployed platforms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              selectedCategory === cat
                ? "bg-white text-black font-bold shadow-lg"
                : "bg-white/[0.04] text-neutral-400 hover:text-white border border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="glass-panel p-7 sm:p-9 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-md text-[11px] font-mono tracking-wider bg-white/[0.05] border border-white/10 text-emerald-400 uppercase">
                  {project.category}
                </span>

                {project.liveUrl && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Deployment</span>
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-2xl font-black text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mb-4">
                {project.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
                {project.description}
              </p>

              {/* Technical Highlights */}
              <div className="space-y-2 mb-6">
                {project.longDescription.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Technical Metrics Pill Group */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 mb-6 text-center font-mono">
                {project.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 uppercase">
                      {m.label}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags & Action Link Footer */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="relative group/tag flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/50 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-emerald-500/10 cursor-pointer"
                    title={tag}
                    aria-label={tag}
                    tabIndex={0}
                  >
                    <TechIcon
                      name={tag}
                      className="w-5 h-5 transition-transform duration-200 group-hover/tag:scale-110"
                    />

                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-neutral-900/95 border border-white/20 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover/tag:opacity-100 group-focus/tag:opacity-100 pointer-events-none transition-all duration-200 z-30 shadow-xl backdrop-blur-md">
                      {tag}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-900 border-r border-b border-white/20 rotate-45" />
                    </div>
                  </div>
                ))}
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex-shrink-0 shadow-md group/btn"
                >
                  <span>Launch Official Site</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
