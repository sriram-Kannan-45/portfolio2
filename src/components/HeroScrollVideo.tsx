"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

// Register ScrollTrigger safely in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;
const VIDEO_DURATION = 10.0;

// Exact native resolutions of extracted WebP frames
const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 720;
const MOBILE_WIDTH = 720;
const MOBILE_HEIGHT = 405;

export default function HeroScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // HUD and Content direct DOM refs (bypass React state on scroll ticks)
  const heroRevealRef = useRef<HTMLDivElement>(null);
  const stageBadgeRef = useRef<HTMLSpanElement>(null);
  const stageDescRef = useRef<HTMLParagraphElement>(null);
  const timeCodeRef = useRef<HTMLSpanElement>(null);
  const scrollPromptRef = useRef<HTMLSpanElement>(null);
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);

  // Reactive UI state only for user interactive actions
  const [isMuted, setIsMuted] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Frame Cache & Drawing tracking
  const loadedFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const requestedFramesRef = useRef<Set<number>>(new Set());
  const targetFrameRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafPendingRef = useRef<boolean>(false);
  const lastStageIndexRef = useRef<number>(-1);

  // Format frame asset paths responsively
  const getFrameUrl = useCallback((index: number, mobileMode: boolean) => {
    const frameNumber = String(index + 1).padStart(4, "0");
    const subfolder = mobileMode ? "mobile" : "desktop";
    return `/frames/${subfolder}/frame_${frameNumber}.webp`;
  }, []);

  // Fast 1:1 hardware-accelerated canvas paint
  const paintFrameToCanvas = useCallback((indexToPaint: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Direct lookup or find nearest loaded frame so screen is NEVER black
    let img = loadedFramesRef.current.get(indexToPaint);
    let paintedIdx = indexToPaint;

    if (!img) {
      let minDistance = Infinity;
      let closestIdx = -1;
      for (const [cachedIdx, cachedImg] of loadedFramesRef.current.entries()) {
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          const dist = Math.abs(cachedIdx - indexToPaint);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = cachedIdx;
          }
        }
      }
      if (closestIdx !== -1) {
        img = loadedFramesRef.current.get(closestIdx);
        paintedIdx = closestIdx;
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // 1:1 exact native blit (1280x720 or 720x405) - CSS object-cover handles display scaling
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastDrawnIndexRef.current = paintedIdx;
  }, []);

  // Request a single frame via browser standard Image loader (cached by browser HTTP layer)
  const requestFrame = useCallback(
    (index: number, mobileMode: boolean, onLoaded?: () => void) => {
      if (index < 0 || index >= TOTAL_FRAMES) return;
      if (loadedFramesRef.current.has(index) || requestedFramesRef.current.has(index)) return;

      requestedFramesRef.current.add(index);
      const img = new Image();
      img.src = getFrameUrl(index, mobileMode);
      img.onload = () => {
        loadedFramesRef.current.set(index, img);
        if (onLoaded) {
          onLoaded();
        } else if (Math.abs(targetFrameRef.current - index) <= 2) {
          paintFrameToCanvas(targetFrameRef.current);
        }
      };
      img.onerror = () => {
        requestedFramesRef.current.delete(index);
      };
    },
    [getFrameUrl, paintFrameToCanvas]
  );

  // Progressive directional preloader (prioritizes target and immediate neighborhood)
  const preloadNeighborhood = useCallback(
    (center: number, direction: number, mobileMode: boolean) => {
      const WINDOW_AHEAD = 16;
      const WINDOW_BEHIND = 6;

      // 1. Target frame priority
      requestFrame(center, mobileMode, () => paintFrameToCanvas(center));

      // 2. Directional window
      if (direction >= 0) {
        for (let i = 1; i <= WINDOW_AHEAD; i++) {
          const idx = center + i;
          if (idx < TOTAL_FRAMES) requestFrame(idx, mobileMode);
        }
        for (let i = 1; i <= WINDOW_BEHIND; i++) {
          const idx = center - i;
          if (idx >= 0) requestFrame(idx, mobileMode);
        }
      } else {
        for (let i = 1; i <= WINDOW_AHEAD; i++) {
          const idx = center - i;
          if (idx >= 0) requestFrame(idx, mobileMode);
        }
        for (let i = 1; i <= WINDOW_BEHIND; i++) {
          const idx = center + i;
          if (idx < TOTAL_FRAMES) requestFrame(idx, mobileMode);
        }
      }
    },
    [requestFrame, paintFrameToCanvas]
  );

  // Set internal canvas resolution to match exact native frames (no upscaling lag)
  const syncCanvasDimensions = useCallback((mobileMode: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nativeW = mobileMode ? MOBILE_WIDTH : DESKTOP_WIDTH;
    const nativeH = mobileMode ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

    if (canvas.width !== nativeW || canvas.height !== nativeH) {
      canvas.width = nativeW;
      canvas.height = nativeH;
      // Repaint current frame on dimension change
      paintFrameToCanvas(targetFrameRef.current);
    }
  }, [paintFrameToCanvas]);

  // Handle Resize and Device Check
  const handleResize = useCallback(() => {
    const mobileCheck =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024));
    setIsMobile(mobileCheck);
    syncCanvasDimensions(mobileCheck);
  }, [syncCanvasDimensions]);

  // Initial setup & Frame 0 immediate load
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    const mobileCheck = window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);
    setIsMobile(mobileCheck);
    syncCanvasDimensions(mobileCheck);

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    // Instantly load and render Frame 0 (or last frame if reduced motion)
    const initialFrame = motionQuery.matches ? TOTAL_FRAMES - 1 : 0;
    targetFrameRef.current = initialFrame;

    requestFrame(initialFrame, mobileCheck, () => {
      paintFrameToCanvas(initialFrame);
      // Preload initial batch
      if (!motionQuery.matches) {
        preloadNeighborhood(initialFrame, 1, mobileCheck);
      }
    });

    // Background preload the rest smoothly during idle periods
    const preloadTimer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i += 4) {
        requestFrame(i, mobileCheck);
      }
    }, 1500);

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      clearTimeout(preloadTimer);
    };
  }, [handleResize, preloadNeighborhood, requestFrame, syncCanvasDimensions, paintFrameToCanvas]);

  // Update HUD text and metrics directly on the DOM (0 React re-renders during active scroll)
  const updateHUD = useCallback((progress: number) => {
    // 1. Timecode display
    const time = (progress * VIDEO_DURATION).toFixed(1);
    if (timeCodeRef.current) {
      timeCodeRef.current.textContent = `${time}s`;
    }

    // 2. Timeline bar & percentage
    const pct = Math.round(progress * 100);
    if (percentageRef.current) {
      percentageRef.current.textContent = `${pct}%`;
    }
    if (timelineBarRef.current) {
      timelineBarRef.current.style.width = `${pct}%`;
    }

    // 3. Scroll prompt instruction text
    if (scrollPromptRef.current) {
      const prompt =
        progress < 0.2
          ? "Scroll down to advance awakening"
          : progress < 0.75
          ? "Keep scrolling — awakening in progress"
          : "Tie adjusted — scroll forward to explore portfolio";
      if (scrollPromptRef.current.textContent !== prompt) {
        scrollPromptRef.current.textContent = prompt;
      }
    }

    // 4. Awakening stage indicators
    const stageIdx = PORTFOLIO_DATA.heroStages.findIndex(
      (stage) => progress >= stage.scrollRange[0] && progress <= stage.scrollRange[1]
    );
    const activeIdx = stageIdx !== -1 ? stageIdx : progress < 0.5 ? 0 : PORTFOLIO_DATA.heroStages.length - 1;
    if (activeIdx !== lastStageIndexRef.current) {
      lastStageIndexRef.current = activeIdx;
      const stage = PORTFOLIO_DATA.heroStages[activeIdx];
      if (stageBadgeRef.current) {
        stageBadgeRef.current.textContent = `${stage.indicator} — ${stage.title}`;
      }
      if (stageDescRef.current) {
        stageDescRef.current.textContent = stage.desc;
      }
    }

    // 5. Final Hero Reveal Panel (tie adjustment onwards: 0.75 - 1.0)
    if (heroRevealRef.current) {
      if (progress >= 0.75) {
        heroRevealRef.current.classList.remove("opacity-0", "translate-y-8", "pointer-events-none");
        heroRevealRef.current.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
      } else {
        heroRevealRef.current.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
        heroRevealRef.current.classList.add("opacity-0", "translate-y-8", "pointer-events-none");
      }
    }
  }, []);

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (!containerRef.current || !pinSectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinSectionRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5, // Cinematic smooth scrub damping to prevent abrupt fast scrolling
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress));
          const targetIndex = Math.round(progress * (TOTAL_FRAMES - 1));

          targetFrameRef.current = targetIndex;

          // Throttle painting through requestAnimationFrame for 60-120fps lock
          if (!rafPendingRef.current) {
            rafPendingRef.current = true;
            requestAnimationFrame(() => {
              rafPendingRef.current = false;
              paintFrameToCanvas(targetFrameRef.current);
            });
          }

          // Direct DOM HUD update (0 React state overhead)
          updateHUD(progress);

          // Preload neighborhood based on scrolling direction
          preloadNeighborhood(targetIndex, self.direction || 1, isMobile);
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [updateHUD, preloadNeighborhood, paintFrameToCanvas, isMobile, prefersReducedMotion]);

  // Audio Toggle
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    if (!nextMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    setIsMuted(nextMuted);
  };

  const initialStage = PORTFOLIO_DATA.heroStages[0];

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full bg-[#050505] text-white"
      style={{ height: prefersReducedMotion ? "100vh" : "750vh" }}
      aria-label="Cinematic Awakening Experience"
    >
      {/* Background Audio */}
      <audio ref={audioRef} src="/awakening_audio.mp3" loop preload="none" />

      {/* Pinned Viewport Container (GSAP handles pinning) */}
      <div
        ref={pinSectionRef}
        className="w-full h-screen overflow-hidden flex flex-col justify-between relative"
      >
        {/* Full-screen Media Layer (Hardware-Accelerated 1:1 Canvas) */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH}
            height={isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none cinematic-vignette" />

          {/* Gradient Overlays for Visual Depth */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505]/80 to-transparent pointer-events-none" />
        </div>

        {/* Top HUD: Awakening Stage & Scrub Telemetry */}
        <div className="relative z-10 pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-start justify-between">
          {/* Phase Badge & Stage Title */}
          <div className="flex flex-col gap-1.5 backdrop-blur-md bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span
                ref={stageBadgeRef}
                className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase"
              >
                {initialStage.indicator} — {initialStage.title}
              </span>
            </div>
            <p ref={stageDescRef} className="text-xs text-neutral-300 max-w-sm hidden sm:block">
              {initialStage.desc}
            </p>
          </div>

          {/* Telemetry & Controls */}
          <div className="flex items-center gap-2">
            {/* Engine Telemetry Pill */}
            <div className="hidden md:flex items-center gap-2 backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-[11px] font-mono text-neutral-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-semibold">24 FPS Cinematic Canvas</span>
              <span className="text-neutral-500">|</span>
              <span className="text-emerald-400">
                {isMobile ? "Mobile (720x405)" : "Native 720p (1280x720)"}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="backdrop-blur-md bg-black/40 border border-white/10 hover:border-white/20 p-2.5 rounded-xl text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute Cinematic Audio" : "Mute Audio"}
              aria-label="Toggle Audio"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Time Code Pill */}
            <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-[11px] font-mono text-neutral-300">
              <span ref={timeCodeRef} className="text-white font-bold">
                0.0s
              </span>
              <span className="text-neutral-500"> / {VIDEO_DURATION.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Bottom Hero Reveal Area: Smoothly reveals at the final tie-adjustment moment */}
        <div
          ref={heroRevealRef}
          className={`relative z-10 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-700 ${
            prefersReducedMotion
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          {/* Glass Card positioned in the lower-third, safely clear of the portrait */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl max-w-3xl backdrop-blur-xl border border-white/15 shadow-2xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-neutral-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Awakening Complete // Final Reveal</span>
            </div>

            {/* Identity & Subtitle */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-2 uppercase">
              SRIRAM K
            </h1>
            <p className="text-sm sm:text-lg font-medium text-emerald-400 tracking-wide mb-3">
              AI & Software Builder | Founder, Wave Init Solutions
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 max-w-2xl">
              Transforming artificial intelligence, deep learning, and robust
              software architecture into practical, scalable digital experiences.
              From computer vision models to enterprise SaaS platforms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg"
                id="hero-explore-work-cta"
              >
                <span>Explore My Work</span>
                <ChevronDown className="w-4 h-4" />
              </a>

              <a
                href={PORTFOLIO_DATA.links.waveInitSolutions}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg group"
                id="hero-wave-init-cta"
              >
                <span>Wave Init Solutions</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                id="hero-get-in-touch-cta"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Progress & Prompt Footer */}
        <div className="relative z-10 pb-4 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-neutral-400 font-mono">
          {/* Scroll Prompt & Mouse Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span ref={scrollPromptRef}>
              {prefersReducedMotion
                ? "Awakening Complete — scroll down to explore portfolio"
                : "Scroll down to advance awakening"}
            </span>
          </div>

          {/* Timeline Bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={timelineBarRef}
                className="h-full bg-gradient-to-r from-neutral-400 via-emerald-400 to-white transition-all duration-75"
                style={{ width: prefersReducedMotion ? "100%" : "0%" }}
              />
            </div>
            <span ref={percentageRef} className="text-[11px] text-neutral-300">
              {prefersReducedMotion ? "100%" : "0%"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
