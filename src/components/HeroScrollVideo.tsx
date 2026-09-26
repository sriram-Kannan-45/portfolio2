"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  ChevronDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// Register ScrollTrigger safely in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;

// Master native resolution of extracted HD WebP frames
const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 720;
const MOBILE_WIDTH = 1280;
const MOBILE_HEIGHT = 720;

// Ratio of total scroll dedicated to video playback before holding on the final frame
const VIDEO_PLAYBACK_RATIO = 0.75;

export default function HeroScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  // Direct DOM refs for high-performance scroll scrub (0 React re-renders)
  const heroRevealRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Performance tracking refs (avoiding React re-renders)
  const isMobileRef = useRef<boolean>(false);
  const loadedFramesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const requestedFramesRef = useRef<Set<number>>(new Set());
  const targetFrameRef = useRef<number>(0);
  const lastDrawnIndexRef = useRef<number>(-1);
  const rafPendingRef = useRef<boolean>(false);
  const hudRafPendingRef = useRef<boolean>(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPreloadedFrameRef = useRef<number>(-999);

  // HUD state tracking refs to eliminate redundant DOM mutations
  const heroRevealedRef = useRef<boolean>(false);
  const pendingProgressRef = useRef<number>(0);

  // Master frame asset paths: Always serve crisp HD 1280x720 frames on both desktop & mobile
  const getFrameUrl = useCallback((index: number) => {
    const frameNumber = String(index + 1).padStart(4, "0");
    return `/frames/desktop/frame_${frameNumber}.webp`;
  }, []);

  // 1:1 hardware-accelerated canvas paint with O(1) local fallback lookup
  const paintFrameToCanvas = useCallback((indexToPaint: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Direct lookup first
    let img = loadedFramesRef.current.get(indexToPaint);
    let paintedIdx = indexToPaint;

    // Fast local neighborhood lookup (checks closest frames first within +/- 25 range)
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = undefined;
      for (let offset = 1; offset <= 25; offset++) {
        const lower = indexToPaint - offset;
        if (lower >= 0) {
          const candidate = loadedFramesRef.current.get(lower);
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            img = candidate;
            paintedIdx = lower;
            break;
          }
        }
        const upper = indexToPaint + offset;
        if (upper < TOTAL_FRAMES) {
          const candidate = loadedFramesRef.current.get(upper);
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            img = candidate;
            paintedIdx = upper;
            break;
          }
        }
      }

      // If still not found, fallback to last painted frame
      if (!img && lastDrawnIndexRef.current >= 0) {
        img = loadedFramesRef.current.get(lastDrawnIndexRef.current);
        paintedIdx = lastDrawnIndexRef.current;
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Match canvas internal resolution to natural image resolution
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctxRef.current = null;
    }

    if (!ctxRef.current || ctxRef.current.canvas !== canvas) {
      // Use standard alpha:false context without desynchronized
      ctxRef.current = canvas.getContext("2d", { alpha: false });
      if (ctxRef.current) {
        ctxRef.current.imageSmoothingEnabled = true;
        ctxRef.current.imageSmoothingQuality = "high";
      }
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Exact blit to canvas internal dimensions
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastDrawnIndexRef.current = paintedIdx;

    // Hide fallback poster once canvas has painted successfully
    if (posterRef.current && posterRef.current.style.opacity !== "0") {
      posterRef.current.style.opacity = "0";
    }
  }, []);

  // Memory management: Prune distant frames on mobile to prevent memory pressure
  const pruneMobileFrameCache = useCallback((currentCenter: number) => {
    if (!isMobileRef.current || loadedFramesRef.current.size < 70) return;
    const KEEP_RADIUS = 30;
    for (const key of Array.from(loadedFramesRef.current.keys())) {
      // Always keep frame 0 and last frame
      if (key === 0 || key === TOTAL_FRAMES - 1) continue;
      if (Math.abs(key - currentCenter) > KEEP_RADIUS) {
        loadedFramesRef.current.delete(key);
        requestedFramesRef.current.delete(key);
      }
    }
  }, []);

  // Bulletproof asynchronous image loader (attaches event listeners BEFORE src to avoid cache race)
  const requestFrame = useCallback(
    (index: number, mobileMode: boolean, onLoaded?: () => void) => {
      if (index < 0 || index >= TOTAL_FRAMES) return;
      if (loadedFramesRef.current.has(index) || requestedFramesRef.current.has(index)) return;

      requestedFramesRef.current.add(index);
      const img = new Image();

      const commitFrame = () => {
        loadedFramesRef.current.set(index, img);
        if (onLoaded) {
          onLoaded();
        } else if (Math.abs(targetFrameRef.current - index) <= 2) {
          paintFrameToCanvas(targetFrameRef.current);
        }
      };

      // CRITICAL: Attach handlers BEFORE setting src so cached loads never fire before handlers are attached
      img.onload = () => {
        commitFrame();
        // Warm texture cache in background without blocking display
        if (typeof img.decode === "function") {
          img.decode().catch(() => {});
        }
      };

      img.onerror = () => {
        requestedFramesRef.current.delete(index);
      };

      img.src = getFrameUrl(index);

      // Handle synchronously cached images
      if (img.complete && img.naturalWidth > 0) {
        commitFrame();
      }
    },
    [getFrameUrl, paintFrameToCanvas]
  );

  // Progressive directional preloader (prioritizes current frame and immediate neighborhood)
  const preloadNeighborhood = useCallback(
    (center: number, direction: number, mobileMode: boolean) => {
      const WINDOW_AHEAD = mobileMode ? 14 : 22;
      const WINDOW_BEHIND = mobileMode ? 6 : 10;

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

      // 3. Prune old frames on mobile
      pruneMobileFrameCache(center);
    },
    [requestFrame, paintFrameToCanvas, pruneMobileFrameCache]
  );

  // Sync canvas resolution to exact frame dimensions imperatively
  const syncCanvasDimensions = useCallback(
    (mobileMode: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const nativeW = mobileMode ? MOBILE_WIDTH : DESKTOP_WIDTH;
      const nativeH = mobileMode ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

      if (canvas.width !== nativeW || canvas.height !== nativeH) {
        canvas.width = nativeW;
        canvas.height = nativeH;
        ctxRef.current = null;
        paintFrameToCanvas(targetFrameRef.current);
      }
    },
    [paintFrameToCanvas]
  );

  // Handle Resize and Device Check
  const handleResize = useCallback(() => {
    const mobileCheck =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        (("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
          window.innerWidth < 1024));
    isMobileRef.current = mobileCheck;
    syncCanvasDimensions(mobileCheck);
  }, [syncCanvasDimensions]);

  // Initial setup & Frame 0 immediate load
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotion);

    const mobileCheck =
      window.innerWidth < 768 ||
      (("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
        window.innerWidth < 1024);
    isMobileRef.current = mobileCheck;
    syncCanvasDimensions(mobileCheck);

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    // Instantly load and render Frame 0 (or last frame if reduced motion)
    const initialFrame = motionQuery.matches ? TOTAL_FRAMES - 1 : 0;
    targetFrameRef.current = initialFrame;

    requestFrame(initialFrame, mobileCheck, () => {
      paintFrameToCanvas(initialFrame);
      if (!motionQuery.matches) {
        preloadNeighborhood(initialFrame, 1, mobileCheck);
      }
    });

    // Progressive background preloader during browser idle slices
    let idleHandle: number | ReturnType<typeof setTimeout>;
    let currentBatchIndex = 0;
    const scheduleNextIdleBatch = () => {
      const BATCH_SIZE = mobileCheck ? 8 : 16;
      const end = Math.min(currentBatchIndex + BATCH_SIZE, TOTAL_FRAMES);
      for (let i = currentBatchIndex; i < end; i++) {
        requestFrame(i, isMobileRef.current);
      }
      currentBatchIndex = end;

      if (currentBatchIndex < TOTAL_FRAMES) {
        if (typeof requestIdleCallback !== "undefined") {
          idleHandle = requestIdleCallback(scheduleNextIdleBatch, { timeout: 1200 });
        } else {
          idleHandle = setTimeout(scheduleNextIdleBatch, 100);
        }
      }
    };

    if (typeof requestIdleCallback !== "undefined") {
      idleHandle = requestIdleCallback(scheduleNextIdleBatch, { timeout: 1500 });
    } else {
      idleHandle = setTimeout(scheduleNextIdleBatch, 800);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotion);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (typeof requestIdleCallback !== "undefined") {
        cancelIdleCallback(idleHandle as number);
      } else {
        clearTimeout(idleHandle as ReturnType<typeof setTimeout>);
      }
    };
  }, [handleResize, preloadNeighborhood, requestFrame, syncCanvasDimensions, paintFrameToCanvas]);

  // Update state upon video scroll completion directly with dirty-checking
  const updateHUD = useCallback((progress: number) => {
    pendingProgressRef.current = progress;
    if (hudRafPendingRef.current) return;
    hudRafPendingRef.current = true;

    requestAnimationFrame(() => {
      hudRafPendingRef.current = false;
      const p = pendingProgressRef.current;
      const isVideoDone = p >= VIDEO_PLAYBACK_RATIO;

      // Final Hero Reveal Panel & Navbar visibility trigger
      if (heroRevealRef.current && heroRevealedRef.current !== isVideoDone) {
        heroRevealedRef.current = isVideoDone;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("videoScrolledChange", { detail: { isVideoDone } })
          );
        }
        if (isVideoDone) {
          heroRevealRef.current.classList.remove(
            "opacity-0",
            "translate-y-8",
            "pointer-events-none"
          );
          heroRevealRef.current.classList.add(
            "opacity-100",
            "translate-y-0",
            "pointer-events-auto"
          );
        } else {
          heroRevealRef.current.classList.remove(
            "opacity-100",
            "translate-y-0",
            "pointer-events-auto"
          );
          heroRevealRef.current.classList.add(
            "opacity-0",
            "translate-y-8",
            "pointer-events-none"
          );
        }
      }
    });
  }, []);

  // GSAP ScrollTrigger Setup with Smooth Interpolation & Scrub Damping
  useEffect(() => {
    if (!containerRef.current || !pinSectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Playhead proxy object smoothly scrubbed by GSAP
      const playhead = { frame: 0, progress: 0 };

      gsap.to(playhead, {
        frame: TOTAL_FRAMES - 1,
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 6.0)}`,
          pin: pinSectionRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
        },
        onUpdate: () => {
          const currentProgress = playhead.progress;
          const videoProgress = Math.min(1, Math.max(0, currentProgress / VIDEO_PLAYBACK_RATIO));
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(videoProgress * (TOTAL_FRAMES - 1)))
          );

          targetFrameRef.current = targetIndex;

          // Paint locked to display refresh rate
          if (!rafPendingRef.current) {
            rafPendingRef.current = true;
            requestAnimationFrame(() => {
              rafPendingRef.current = false;
              paintFrameToCanvas(targetFrameRef.current);
            });
          }

          // Video completion check & Hero reveal
          updateHUD(currentProgress);

          // Directional preloading only when frame changes
          const dist = Math.abs(targetIndex - lastPreloadedFrameRef.current);
          if (dist >= 2) {
            const dir = targetIndex >= lastPreloadedFrameRef.current ? 1 : -1;
            lastPreloadedFrameRef.current = targetIndex;
            preloadNeighborhood(targetIndex, dir, isMobileRef.current);
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [updateHUD, preloadNeighborhood, paintFrameToCanvas, prefersReducedMotion]);

  // Automatic soundtrack audio playback when inside the website (no visible UI)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;
    audio.muted = false;

    // Attempt immediate autoplay
    const tryAutoplay = () => {
      audio
        .play()
        .catch(() => {
          // If browser restricts initial unprompted autoplay,
          // start audio immediately upon the very first user interaction (scroll, touch, click, wheel, key)
          const onFirstInteraction = () => {
            audio.play().catch(() => {});
            window.removeEventListener("scroll", onFirstInteraction);
            window.removeEventListener("pointerdown", onFirstInteraction);
            window.removeEventListener("touchstart", onFirstInteraction);
            window.removeEventListener("wheel", onFirstInteraction);
            window.removeEventListener("keydown", onFirstInteraction);
          };

          window.addEventListener("scroll", onFirstInteraction, { passive: true });
          window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
          window.addEventListener("touchstart", onFirstInteraction, { passive: true });
          window.addEventListener("wheel", onFirstInteraction, { passive: true });
          window.addEventListener("keydown", onFirstInteraction, { passive: true });
        });
    };

    tryAutoplay();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative z-10 w-full bg-[#050505] text-white"
      style={{ height: prefersReducedMotion ? "100vh" : "auto" }}
      aria-label="Cinematic Awakening Experience"
    >
      {/* Background Soundtrack Audio */}
      <audio ref={audioRef} src="/awakening_audio.mp3" loop preload="auto" />

      {/* Pinned Viewport Container (h-screen with h-[100dvh] fallback for exact mobile browser viewport fit) */}
      <div
        ref={pinSectionRef}
        className="w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-end relative z-10"
      >
        {/* Full-screen Media Layer (Hardware-Accelerated Canvas with Instant Fallback Poster) */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
          {/* Instant poster image — visible immediately so mobile screen is NEVER black before first frame render */}
          <picture className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              ref={posterRef}
              src="/frames/desktop/frame_0001.webp"
              alt="Awakening cinematic inception"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.05) saturate(1.06) brightness(1.02)",
              }}
              fetchPriority="high"
            />
          </picture>

          <canvas
            ref={canvasRef}
            width={DESKTOP_WIDTH}
            height={DESKTOP_HEIGHT}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-[filter] duration-700 ease-out"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.05) saturate(1.06) brightness(1.02)",
            }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none cinematic-vignette" />

          {/* Gradient Overlays for Visual Depth */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-[#050505]/70 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Hero Reveal Area: Positioned strictly in the bottom-left empty space to never obstruct the face */}
        <div
          ref={heroRevealRef}
          className={`relative z-10 pb-6 sm:pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-700 ease-out ${
            prefersReducedMotion
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          {/* Glass Card: Compact size in bottom-left negative space */}
          <div
            className="hero-glass-card p-4 sm:p-5 rounded-xl max-w-sm sm:max-w-[400px] border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-md"
            style={{
              backdropFilter: "blur(12px) saturate(140%)",
              WebkitBackdropFilter: "blur(12px) saturate(140%)",
            }}
          >
            {/* Subtle background glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono text-neutral-300 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Awakening Complete // Final Reveal</span>
            </div>

            {/* Identity & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-0.5 uppercase">
              SRIRAM K
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide mb-2">
              AI &amp; Software Builder | Founder, Wave Init Solutions
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3 max-w-xs sm:max-w-sm">
              Transforming artificial intelligence, deep learning, and software architecture into practical, scalable digital experiences.
            </p>

            {/* CTAs: Compact, clean row in empty bottom-left space */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#projects"
                className="px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md"
                id="hero-explore-work-cta"
              >
                <span>Explore Work</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </a>

              <a
                href={PORTFOLIO_DATA.links.waveInitSolutions}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md group"
                id="hero-wave-init-cta"
              >
                <span>Wave Init Solutions</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#contact"
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-semibold text-xs transition-all flex items-center gap-1.5"
                id="hero-get-in-touch-cta"
              >
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
