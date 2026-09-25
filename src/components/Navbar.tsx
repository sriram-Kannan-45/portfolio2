"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Menu, X, ArrowUpRight, Download, Sparkles } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
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
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={PORTFOLIO_DATA.links.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-300 hover:text-white"
              aria-label="Download Resume"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
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
        <div className="sm:hidden bg-[#0a0a0e] border-b border-white/10 px-4 pt-4 pb-6 mt-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
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
