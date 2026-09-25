"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "certifications">("experience");

  return (
    <section
      id="experience"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Experience & Academic Background"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>04 // CAREER & EDUCATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Trajectory &amp; <br className="hidden sm:block" />
            <span className="text-neutral-400">Verifiable Credentials</span>
          </h2>
        </div>

        <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed font-normal">
          An honest account of founding initiatives, engineering roles, and
          specialized deep learning internships.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-10 pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
            activeTab === "experience"
              ? "bg-white text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience ({PORTFOLIO_DATA.experience.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
            activeTab === "education"
              ? "bg-white text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education ({PORTFOLIO_DATA.education.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("certifications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
            activeTab === "certifications"
              ? "bg-white text-black font-bold shadow-md"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({PORTFOLIO_DATA.certifications.length})</span>
        </button>
      </div>

      {/* Experience Tab Content */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          {PORTFOLIO_DATA.experience.map((item, index) => (
            <div
              key={`${item.company}-${item.role}`}
              className="glass-panel p-7 sm:p-9 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span className="text-xl font-bold text-white">
                      {item.role}
                    </span>
                    <span className="text-sm font-semibold text-emerald-400">
                      @ {item.company}
                    </span>
                    {item.verifiedNote && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-white/[0.05] border border-white/10 text-neutral-300">
                        {item.verifiedNote}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`self-start px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    item.type === "Founding"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : item.type === "Employment"
                      ? "bg-blue-950/40 text-blue-300 border border-blue-500/20"
                      : "bg-purple-950/40 text-purple-300 border border-purple-500/20"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 mb-5 leading-relaxed font-normal">
                {item.summary}
              </p>

              <div className="space-y-2 mb-6">
                {item.responsibilities.map((resp, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex items-start gap-2.5 text-xs text-neutral-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] text-[11px] font-mono text-neutral-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Tab Content */}
      {activeTab === "education" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.education.map((edu) => (
            <div
              key={edu.degree}
              className="glass-panel p-7 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {edu.degree}
                </h3>
                <p className="text-xs text-neutral-300 font-medium mb-3">
                  {edu.institution}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4">
                  <span>{edu.period}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                    {edu.score}
                  </span>
                </div>
              </div>

              {edu.highlight && (
                <div className="pt-4 border-t border-white/5 text-xs text-neutral-400 font-mono">
                  {edu.highlight}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Tab Content */}
      {activeTab === "certifications" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.certifications.map((cert) => (
            <div
              key={cert.name}
              className="glass-panel p-7 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs text-emerald-400 font-mono mb-2">
                  Issued by: {cert.issuer}
                </p>
                <p className="text-xs text-neutral-400 font-normal">
                  {cert.focus}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Credential</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
