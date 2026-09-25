"use client";

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
  return (
    <main className="relative min-h-screen bg-[#050505] text-[#f3f4f6] overflow-x-hidden">
      {/* Background Interactive 3D Depth Layer */}
      <ThreeCanvas />

      {/* Top Navigation */}
      <Navbar />

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
