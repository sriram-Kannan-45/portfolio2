"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Menu, X, ArrowUpRight, Download, Sparkles } from "lucide-react";

interface NavbarProps {
  visible?: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);
  const scrolledRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    // 1. Listen for video completion event from HeroScrollVideo ScrollTrigger
    const handleVideoScrolled = (e: Event) => {
      const customEvent = e as CustomEvent<{ isVideoDone: boolean }>;
      const isDone = Boolean(customEvent.detail?.isVideoDone);
      if (isDone !== visibleRef.current) {
        visibleRef.current = isDone;
        setInternalVisible(isDone);
      }
    };

    // 2. Direct scroll listener fallback (pinned video hero ends at ~4.8x viewport height)
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 4.7;
      const isPastHero = window.scrollY >= heroThreshold;

      if (isPastHero !== visibleRef.current) {
        visibleRef.current = isPastHero;
        setInternalVisible(isPastHero);
      }
    };

    window.addEventListener("videoScrolledChange", handleVideoScrolled);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("videoScrolledChange", handleVideoScrolled);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isMenuVisible = visible !== undefined ? visible : internalVisible;

  // Automatically close mobile menu if navbar hides
  useEffect(() => {
    if (!isMenuVisible) {
      setMobileMenuOpen(false);
    }
  }, [isMenuVisible]);

  const navLinks = [
    { label: "Awakening", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Founder", href: "#founder" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl transition-[opacity,transform] duration-500 ${
        !isMenuVisible
          ? "opacity-0 -translate-y-[15px] pointer-events-none invisible"
          : "opacity-100 translate-y-0 pointer-events-auto visible"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      aria-hidden={!isMenuVisible}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Identity */}
          <a
            href="#hero"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex-shrink-0">
              <Image
                src={PORTFOLIO_DATA.identity.portrait}
                alt="Sriram K"
                width={32}
                height={32}
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white uppercase group-hover:text-emerald-400 transition-colors">
                SRIRAM K
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-mono">
                Founder // Wave Init
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Status */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Availability Pill */}
            <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Available for AI Build</span>
            </div>

            {/* Resume Button */}
            <a
              href={PORTFOLIO_DATA.links.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition-all"
              id="nav-resume-btn"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Resume</span>
            </a>

            {/* Wave Init Portal CTA */}
            <a
              href={PORTFOLIO_DATA.links.waveInitSolutions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-4 py-1.5 rounded-full transition-all group"
              id="nav-wave-init-cta"
            >
              <span>Wave Init</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-1">
            <a
              href={PORTFOLIO_DATA.links.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-neutral-300 hover:text-white"
              aria-label="Download Resume"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0a0a0e] border-b border-white/10 px-4 pt-4 pb-6 mt-2 shadow-2xl max-h-[calc(100dvh-5rem)] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <div className="px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-400 font-mono mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{PORTFOLIO_DATA.identity.status.text}</span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-neutral-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href={PORTFOLIO_DATA.links.waveInitSolutions}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                <span>Visit Wave Init Solutions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={PORTFOLIO_DATA.links.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 rounded-lg bg-white/5 text-neutral-300 text-xs border border-white/10 flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Full Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
