"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import { LinkedinIcon } from "@/components/SocialIcons";

type Spotlight = (typeof PORTFOLIO_DATA.professionalSpotlights)[number];

export default function ProfessionalSpotlights() {
  return <>{PORTFOLIO_DATA.professionalSpotlights.map((spotlight) => (
    <CompanySpotlight key={spotlight.id} spotlight={spotlight} />
  ))}</>;
}

function CompanySpotlight({ spotlight }: { spotlight: Spotlight }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const lastTouchTimeRef = useRef(0);

  const handleEmblemRotate = () => {
    const now = Date.now();
    if (now - lastTouchTimeRef.current < 300) {
      return;
    }
    lastTouchTimeRef.current = now;
    setRotationAngle((prev) => prev + 360);
  };

  const pillarIcons = [Zap, Database, ShieldCheck, Layers];

  return (
    <section
      id={spotlight.id}
      className="relative z-10 py-16 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label={spotlight.title}
    >
      <div className="glass-panel p-5 sm:p-8 md:p-14 rounded-2xl sm:rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Ambient Emerald Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[600px] max-w-[600px] h-[200px] sm:h-[300px] bg-emerald-600/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{spotlight.pill}</span>
        </div>

        {/* Experience Headline */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase mb-3 sm:mb-4 leading-tight break-words">
          {spotlight.title}
        </h2>

        {/* Quote */}
        <p className="text-sm sm:text-xl font-light text-neutral-200 leading-relaxed max-w-3xl mb-8 sm:mb-10 italic">
          &ldquo;{spotlight.quote}&rdquo;
        </p>

        {/* Brand Card & Company Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-6 sm:pt-8 border-t border-white/10 mb-8 sm:mb-12">
          {/* Logo Showcase */}
          <div className="lg:col-span-4 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-black/60 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xl group">
            <button
              type="button"
              onClick={handleEmblemRotate}
              onTouchStart={handleEmblemRotate}
              title="Touch or click to rotate"
              aria-label={`Rotate ${spotlight.companyName} Emblem`}
              className="relative w-28 h-28 xs:w-36 xs:h-36 sm:w-40 sm:h-40 mb-3 sm:mb-4 rounded-full p-1 bg-gradient-to-tr from-emerald-500/40 via-white/20 to-emerald-400/40 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 group/emblem"
            >
              <div
                className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center shadow-inner transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <Image
                  src={spotlight.logo}
                  alt={`${spotlight.companyName} logo`}
                  width={160}
                  height={160}
                  className="object-contain w-full h-full pointer-events-none select-none"
                  style={spotlight.id === "expleo"
                    ? { width: "84%", height: "100%", objectFit: "contain" }
                    : { width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </button>
            <span className="text-xs font-mono text-neutral-300 font-semibold tracking-wide">
              {spotlight.brandLabel}
            </span>
            <div className="mt-2.5 sm:mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-medium">
                {`${spotlight.experienceType} // ${spotlight.period}`}
              </span>
            </div>
          </div>

          {/* Description & Mission */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {spotlight.role}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
              {spotlight.companyDescription}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
              <a
                href={spotlight.actions[0].href}
                target={spotlight.actions[0].href.startsWith("#") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg group w-full sm:w-auto"
                id={spotlight.actions[0].id}
              >
                <span>{spotlight.actions[0].label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={spotlight.actions[1].href}
                target={spotlight.actions[1].href.startsWith("#") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg group w-full sm:w-auto"
                id={spotlight.actions[1].id}
              >
                <span>{spotlight.actions[1].label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={spotlight.actions[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 sm:py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 font-mono text-xs transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                id={spotlight.actions[2].id}
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{spotlight.actions[2].label}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Existing four-card layout for company principles or training focus */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 sm:mb-6">
            {spotlight.principlesLabel}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {spotlight.keyPillars.map((pillar, idx) => {
              const Icon = pillarIcons[idx % pillarIcons.length];
              return (
                <div
                  key={pillar.title}
                  className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5 sm:mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1.5">{pillar.title}</h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-normal">
                    {pillar.desc}
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
