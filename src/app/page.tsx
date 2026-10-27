"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroScrollVideo from "@/components/HeroScrollVideo";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProfessionalSpotlights from "@/components/ProfessionalSpotlights";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ThankYouSection from "@/components/ThankYouSection";
import SmoothScroll from "@/components/SmoothScroll";

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
      const hero = document.getElementById("hero");
      const heroEnd = Number(hero?.dataset.scrollEnd);
      const past =
        (heroEnd > 0 && window.scrollY >= heroEnd) ||
        (hero ? hero.dataset.videoComplete === "true" : false);

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

  return (
    <main className="relative min-h-screen bg-[#050505] text-[#f3f4f6] overflow-x-hidden">
      {/* Global Authoritative Smooth Scroll Controller */}
      <SmoothScroll />

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
        <ThreeCanvas active={isPastVideo} />
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

      {/* Professional and Freelance Experience Spotlights */}
      <ProfessionalSpotlights />

      {/* Career Trajectory & Verifiable Credentials */}
      <ExperienceSection />

      {/* Contact & Collaboration */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Standalone cinematic closing screen after all portfolio content */}
      <ThankYouSection />
    </main>
  );
}
