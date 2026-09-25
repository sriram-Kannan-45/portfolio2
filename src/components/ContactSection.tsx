"use client";

import React, { useState } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  Mail,
  Phone,
  Copy,
  Check,
  Download,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Building,
} from "lucide-react";
import { LinkedinIcon, GithubIcon } from "@/components/SocialIcons";

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const { links } = PORTFOLIO_DATA;

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const directInquiries = [
    {
      title: "AI Product Architecture",
      desc: "Discuss custom computer vision pipelines, neural model deployments, or intelligent workflow automation.",
      subject: "AI Product Inquiry // Sriram K",
    },
    {
      title: "Full-Stack Web Engineering",
      desc: "Architect modern, high-concurrency web platforms with sub-second latency and enterprise security.",
      subject: "Web Platform Development // Wave Init Solutions",
    },
    {
      title: "Engineering Opportunities",
      desc: "Connect regarding AI engineering roles, technical advisory, or enterprise collaborations.",
      subject: "Engineering Opportunity // Sriram K",
    },
  ];

  return (
    <section
      id="contact"
      className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Contact and Collaboration"
    >
      <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>05 // INITIATE COLLABORATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
            HAVE AN IDEA? <br />
            <span className="text-emerald-400">LET&apos;S BUILD SOMETHING INTELLIGENT.</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Whether you are exploring custom AI model integration, building an
            enterprise web platform with Wave Init Solutions, or discussing software
            engineering opportunities — I am always open to high-impact technical dialogues.
          </p>
        </div>

        {/* Primary Contact Channels 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Email Action Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Direct Email
              </span>
              <p className="text-xs font-mono text-white font-bold truncate mt-1">
                {links.email}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2 mt-4">
              <a
                href={`mailto:${links.email}`}
                className="flex-1 text-center py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
                id="contact-send-email-btn"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(links.email, "email")}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors"
                title="Copy email to clipboard"
                aria-label="Copy email"
                id="contact-copy-email-btn"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Telephone Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Direct Telephone
              </span>
              <p className="text-xs font-mono text-white font-bold truncate mt-1">
                {links.phone}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2 mt-4">
              <a
                href={`tel:${links.phoneTel}`}
                className="flex-1 text-center py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
                id="contact-call-phone-btn"
              >
                Call Direct
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(links.phone, "phone")}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 transition-colors"
                title="Copy phone number"
                aria-label="Copy phone"
                id="contact-copy-phone-btn"
              >
                {copiedPhone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Personal LinkedIn Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
                <LinkedinIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Professional Network
              </span>
              <p className="text-xs font-mono text-white font-bold truncate mt-1">
                linkedin.com/in/sriram-k...
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 mt-4">
              <a
                href={links.personalLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                id="contact-personal-linkedin-btn"
              >
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-4">
                <GithubIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase text-neutral-400">
                Source Repositories
              </span>
              <p className="text-xs font-mono text-white font-bold truncate mt-1">
                github.com/sriram-Kannan-45
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 mt-4">
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                id="contact-github-btn"
              >
                <span>Follow on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Real Inquiries Starters (Direct mailto with specific subject) */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
            Select a Topic to Start a Direct Conversation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {directInquiries.map((inq) => (
              <a
                key={inq.title}
                href={`mailto:${links.email}?subject=${encodeURIComponent(inq.subject)}`}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
              >
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
                    {inq.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-normal leading-relaxed mb-4">
                    {inq.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span>Start Email Draft</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
