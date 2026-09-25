"use client";

import React from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { ArrowUp, ArrowUpRight, Mail, Phone } from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

export default function Footer() {
  const { identity, links } = PORTFOLIO_DATA;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#030305] text-neutral-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Identity */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 relative">
                <Image
                  src={identity.portrait}
                  alt={identity.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-base font-bold text-white tracking-wider">
                {identity.name}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              AI & Data Science graduate, software builder, and founder of Wave Init Solutions.
              Committed to engineering software that survives real users and solves tangible problems.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Built with Next.js, R3F, Three.js &amp; GSAP</span>
            </div>
          </div>

          {/* Quick Sitemap */}
          <div className="md:col-span-3 flex flex-col gap-2.5 text-xs font-mono">
            <span className="text-white font-bold tracking-wider uppercase mb-1">
              Navigation
            </span>
            <a href="#hero" className="hover:text-white transition-colors">
              Cinematic Awakening
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              Identity &amp; Philosophy
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Technical Expertise
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Featured Projects
            </a>
            <a href="#founder" className="hover:text-white transition-colors">
              Wave Init Spotlight
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Experience &amp; Degrees
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Direct Contact
            </a>
          </div>

          {/* Official Ventures & Socials */}
          <div className="md:col-span-4 flex flex-col gap-2.5 text-xs font-mono">
            <span className="text-white font-bold tracking-wider uppercase mb-1">
              Verified Links
            </span>
            <a
              href={links.waveInitSolutions}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <span>Wave Init Solutions Official</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={links.lms}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <span>Wave Init LMS Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={links.personalLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>Personal LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={links.waveInitLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>Company LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>GitHub Repositories</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© {new Date().getFullYear()} Sriram K. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/5 transition-colors"
            id="footer-back-to-top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
