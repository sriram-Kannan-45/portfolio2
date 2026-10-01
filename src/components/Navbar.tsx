"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";

interface NavbarProps {
  visible?: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const visibleRef = useRef(false);

  const navLinks = [
    { id: "hero", label: "Awakening", href: "#hero" },
    { id: "about", label: "About", href: "#about" },
    { id: "skills", label: "Expertise", href: "#skills" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "founder", label: "Founder", href: "#founder" },
    { id: "experience", label: "Experience", href: "#experience" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

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

    // 2. Direct scroll listener & active section tracker
    const checkScrollAndActive = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 640;
      const heroThreshold = windowHeight * (isMobile ? 4.0 : 4.7);
      const isPastHero = scrollY >= heroThreshold;

      if (isPastHero !== visibleRef.current) {
        visibleRef.current = isPastHero;
        setInternalVisible(isPastHero);
      }

      const docHeight = Math.max(
        document.documentElement ? document.documentElement.scrollHeight : 0,
        document.body ? document.body.scrollHeight : 0
      );

      // If at or near the bottom of the page, activate Contact
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // If before or in the pinned hero video
      if (scrollY < windowHeight * (isMobile ? 3.9 : 4.5)) {
        setActiveSection("hero");
        return;
      }

      // Section tracking for remaining sections
      const sectionIds = ["about", "skills", "projects", "founder", "experience", "contact"];
      let currentActive = "about";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.4) {
            currentActive = id;
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener("videoScrolledChange", handleVideoScrolled);
    window.addEventListener("scroll", checkScrollAndActive, { passive: true });
    window.addEventListener("resize", checkScrollAndActive, { passive: true });

    checkScrollAndActive();

    return () => {
      window.removeEventListener("videoScrolledChange", handleVideoScrolled);
      window.removeEventListener("scroll", checkScrollAndActive);
      window.removeEventListener("resize", checkScrollAndActive);
    };
  }, []);

  const isMenuVisible = visible !== undefined ? visible : internalVisible;

  // Automatically close mobile menu if navbar hides
  useEffect(() => {
    if (!isMenuVisible) {
      setMobileMenuOpen(false);
    }
  }, [isMenuVisible]);

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
          {/* Logo / Identity - Clicking returns to top / Awakening */}
          <a
            href="#hero"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full"
            id="nav-logo"
            aria-label="Return to top - Awakening"
            title="Return to top (Awakening)"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex-shrink-0 group-hover:border-emerald-400/50 transition-colors">
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
          <nav
            className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1.5 backdrop-blur-sm"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 tracking-wide focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                    isActive
                      ? "bg-white/10 text-white font-semibold border border-white/15 shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Actions & Status */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Availability Pill - Functional Link to Contact */}
            <a
              href="#contact"
              className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/20 hover:border-emerald-500/40 text-[11px] text-emerald-400 font-mono transition-all duration-200 cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              title="Available for AI Build — Click to Contact"
              id="nav-availability-status"
              aria-label="Available for AI Build — Navigate to Contact"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-emerald-300">Available for AI Build</span>
            </a>

            {/* Resume Button */}
            <a
              href={PORTFOLIO_DATA.links.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              download="SRIRAMK_RESUME.pdf"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
              id="nav-resume-btn"
              title="View & Download Resume (PDF)"
              aria-label="Open and Download Sriram K Resume (PDF)"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Resume</span>
            </a>

            {/* Wave Init Portal CTA */}
            <a
              href={PORTFOLIO_DATA.links.waveInitSolutions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-4 py-1.5 rounded-full transition-all duration-200 group shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              id="nav-wave-init-cta"
              title="Visit Official Wave Init Solutions Website (opens in new tab)"
              aria-label="Visit Wave Init Solutions (opens in new tab)"
            >
              <span>Wave Init</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle & Resume Quick Action */}
          <div className="flex sm:hidden items-center gap-1">
            <a
              href={PORTFOLIO_DATA.links.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              download="SRIRAMK_RESUME.pdf"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
              aria-label="Download Resume (PDF)"
              title="Resume (PDF)"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded-lg"
              aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0a0a0e]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 mt-2 shadow-2xl max-h-[calc(100dvh-5rem)] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/20 text-xs text-emerald-400 font-mono mb-2 flex items-center gap-2 transition-colors cursor-pointer group"
              title="Available for AI Build — Click to Contact"
              aria-label="Available for AI Build — Navigate to Contact"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-emerald-300">
                {PORTFOLIO_DATA.identity.status.text || "Available for AI Build"}
              </span>
            </a>

            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </a>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href={PORTFOLIO_DATA.links.waveInitSolutions}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
              >
                <span>Visit Wave Init Solutions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={PORTFOLIO_DATA.links.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                download="SRIRAMK_RESUME.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg bg-white/5 text-neutral-300 text-xs border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
