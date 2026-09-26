"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroScrollVideo from "@/components/HeroScrollVideo";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import FounderSection from "@/components/FounderSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// Lazy-load Three.js WebGL background with SSR disabled to prevent hydration errors
const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), {
  ssr: false,
});

export default function Home() {
  const [isPastVideo, setIsPastVideo] = useState(false);
  const isPastVideoRef = useRef(false);

  // Monitor scroll progress: hide smoke and 3D diamond during video hero,
  // fade them in only after the user completes scrolling through the awakening video.
  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const aboutEl = document.getElementById("about");
      if (!aboutEl) return;
      const rect = aboutEl.getBoundingClientRect();
      // When the About section enters the viewport, user has scrolled past the pinned video
      const past = rect.top <= window.innerHeight * 0.85;

      if (past !== isPastVideoRef.current) {
        isPastVideoRef.current = past;
        setIsPastVideo(past);
      }
    };

    const handleVideoScrolled = (e: Event) => {
      const customEvent = e as CustomEvent<{ isVideoDone: boolean }>;
      const isDone = Boolean(customEvent.detail?.isVideoDone);
      if (isDone !== isPastVideoRef.current) {
        isPastVideoRef.current = isDone;
        setIsPastVideo(isDone);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("videoScrolledChange", handleVideoScrolled);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    // Check initial position on mount
    checkScroll();

    return () => {
      window.removeEventListener("videoScrolledChange", handleVideoScrolled);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Smooth scroll for in-page anchor clicks without forcing global scroll-behavior: smooth
  // which causes scrollbar thumb drag lag
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      try {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      } catch {
        // Ignore invalid selectors
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505] text-[#f3f4f6] overflow-x-hidden">
      {/* 
        Background Visual Atmosphere (3D Diamond Depth Layer):
        Hidden completely while scrolling through the Awakening video hero.
        Smoothly fades in once the video scroll completes and portfolio content begins.
      */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ease-out ${
          isPastVideo ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {/* Background Interactive 3D Depth Layer */}
        <ThreeCanvas />
      </div>

      {/* Top Navigation - revealed only after video frames are fully scrolled */}
      <Navbar visible={isPastVideo} />

      {/* Pinned Scroll-Controlled Awakening Cinematic Experience */}
      <HeroScrollVideo />

      {/* Identity & About */}
      <AboutSection />

      {/* Technical Proficiency */}
      <SkillsSection />

      {/* Featured Projects */}
      <ProjectsSection />

      {/* Founder's Vision Spotlight */}
      <FounderSection />

      {/* Career Trajectory & Verifiable Credentials */}
      <ExperienceSection />

      {/* Contact & Collaboration */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
