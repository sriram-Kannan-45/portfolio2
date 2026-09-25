"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  Brain,
  Code2,
  Cpu,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function AboutSection() {
  const highlights = [
    {
      icon: Brain,
      title: "AI & Computer Vision",
      desc: "Architecting real-time inference pipelines, medical image localization with YOLO, and multimodal audio systems.",
    },
    {
      icon: Code2,
      title: "Full-Stack Product Engineering",
      desc: "Transforming product concepts into production platforms like Wave Init LMS with modular microservices.",
    },
    {
      icon: Cpu,
      title: "AI-Assisted Development",
      desc: "Leveraging generative pipelines and modern toolchains to accelerate software velocity without sacrificing rigor.",
    },
    {
      icon: ShieldCheck,
      title: "Reliability & Quality Mindset",
      desc: "Professional QA foundation ensuring architectures survive unpredictable edge cases and scale cleanly.",
    },
  ];

  return (
    <section
      id="about"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="About Sriram K"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01 // IDENTITY & PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Architecting at the Edge of <br className="hidden sm:block" />
            <span className="text-neutral-400">AI and Software Engineering</span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed font-normal">
          Building production-grade applications that turn intelligent algorithms
          into robust, measurable software.
        </p>
      </div>

      {/* Main Grid: Portrait Card + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Portrait & Verifiable Credentials Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 bg-neutral-900 border border-white/10">
            <Image
              src={PORTFOLIO_DATA.identity.portrait}
              alt="Sriram K — Founder of Wave Init Solutions"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white font-semibold">
                Sriram K
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400">
                Founder, Wave Init
              </span>
            </div>
          </div>

          {/* Quick Verifiable Roles */}
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Wave Init Solutions</span>
              </div>
              <span className="text-emerald-400 font-medium">Founder</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                <span>Expleo Solutions</span>
              </div>
              <span className="text-neutral-400">QA Engineer</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <GraduationCap className="w-4 h-4 text-neutral-400" />
                <span>Knowledge Inst. of Tech.</span>
              </div>
              <span className="text-neutral-400">B.Tech AI & DS (22–26)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Philosophy & Narrative */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Pull Quote Box */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative">
            <div className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
              Core Statement
            </div>
            <blockquote className="text-xl sm:text-2xl font-light text-white leading-relaxed mb-6">
              &ldquo;{PORTFOLIO_DATA.identity.aboutBio}&rdquo;
            </blockquote>

            <p className="text-sm text-neutral-400 leading-relaxed">
              My engineering philosophy focuses on building reliable, testable software solutions.
              While I currently work as a Quality Assurance Engineer at Expleo Solutions, my primary
              creative drive and technical venture is building intelligent software products — from
              deep learning diagnostics like the Bone Fracture Detection system to full-scale web
              architectures like Wave Init LMS and our venture studio Wave Init Solutions.
            </p>
          </div>

          {/* Core Capabilities 2x2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-3.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
