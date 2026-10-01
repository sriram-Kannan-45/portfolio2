"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import {
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

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
// Lower = faster video, Higher = slower video. Target: medium speed
const VIDEO_PLAYBACK_RATIO = 0.85;

export default function HeroScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Sequential text reveal refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineOneRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

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

    // Skip drawing if already on this exact frame
    if (paintedIdx === lastDrawnIndexRef.current && lastDrawnIndexRef.current >= 0) {
      return;
    }

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

      // Notify Navbar & ThreeCanvas when video completes
      if (heroRevealedRef.current !== isVideoDone) {
        heroRevealedRef.current = isVideoDone;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("videoScrolledChange", { detail: { isVideoDone } })
          );
        }
      }
    });
  }, []);

  // GSAP ScrollTrigger Setup with Smooth Sequential Scroll-Driven Reveals
  useEffect(() => {
    if (!containerRef.current || !pinSectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            lineOneRef.current,
            nameRef.current,
            taglineRef.current,
            ctasRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            filter: "none",
          }
        );
        return;
      }

      // Master timeline linked directly to ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (isMobileRef.current ? 4.1 : 4.8))}`,
          pin: pinSectionRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
          onUpdate: (self) => {
            const currentProgress = self.progress;
            const videoProgress = Math.min(1, Math.max(0, currentProgress / VIDEO_PLAYBACK_RATIO));
            const targetIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.max(0, Math.round(videoProgress * (TOTAL_FRAMES - 1)))
            );

            targetFrameRef.current = targetIndex;

            // Paint frame directly when index changes
            if (targetIndex !== lastDrawnIndexRef.current) {
              paintFrameToCanvas(targetIndex);

              // Directional preloading only when frame changes
              const dist = Math.abs(targetIndex - lastPreloadedFrameRef.current);
              if (dist >= 2) {
                const dir = targetIndex >= lastPreloadedFrameRef.current ? 1 : -1;
                lastPreloadedFrameRef.current = targetIndex;
                preloadNeighborhood(targetIndex, dir, isMobileRef.current);
              }
            }

            // Video completion check & Hero reveal
            updateHUD(currentProgress);
          },
        },
      });

      // Initial states for sequential reveal:
      // Mobile uses tighter offsets and subtle blur to remain entirely below the chin and keep 60fps silky smooth
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const eyebrowY = isMobile ? 10 : 20;
      const lineOneY = isMobile ? 14 : 28;
      const nameY = isMobile ? 16 : 32;
      const taglineY = isMobile ? 10 : 20;
      const ctasY = isMobile ? 10 : 18;
      const blurAmount = isMobile ? 4 : 10;

      gsap.set(eyebrowRef.current, {
        opacity: 0,
        y: eyebrowY,
        filter: `blur(${blurAmount}px)`,
      });

      gsap.set(lineOneRef.current, {
        opacity: 0,
        y: lineOneY,
        filter: `blur(${blurAmount}px)`,
      });

      gsap.set(nameRef.current, {
        opacity: 0,
        y: nameY,
        scale: isMobile ? 0.97 : 0.95,
        filter: `blur(${blurAmount}px)`,
      });

      gsap.set(taglineRef.current, {
        opacity: 0,
        y: taglineY,
        filter: `blur(${blurAmount}px)`,
      });

      gsap.set(ctasRef.current, {
        opacity: 0,
        y: ctasY,
      });

      gsap.set(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
      });

      // 0.00 -> 0.06: Initial scroll indicator fades out immediately upon scrolling
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 12,
          duration: 0.06,
          ease: "power2.out",
        },
        0.00
      );

      // 0.06 -> 0.20: Step 1 - Eyebrow smoothly emerges
      tl.to(
        eyebrowRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.14,
          ease: "power2.out",
        },
        0.06
      );

      // 0.20 -> 0.38: Step 2 - "THIS IS" reveals in white serif
      tl.to(
        lineOneRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.18,
          ease: "power2.out",
        },
        0.20
      );

      // 0.38 -> 0.58: Step 3 - "SRIRAM K" reveals in golden italic serif
      tl.to(
        nameRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.20,
          ease: "power2.out",
        },
        0.38
      );

      // 0.58 -> 0.74: Step 4 - Tagline unveils below the headline
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.16,
          ease: "power2.out",
        },
        0.58
      );

      // 0.74 -> 0.88: Step 5 - Action CTAs appear cleanly
      tl.to(
        ctasRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "power2.out",
        },
        0.74
      );

      // 0.88 -> 1.00: Hold fully revealed state until end of pin
      tl.to({}, { duration: 0.12 }, 0.88);
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
        className="w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between relative z-10 pt-14 sm:pt-20"
      >
        {/* Full-screen Media Layer (Hardware-Accelerated Canvas with Instant Fallback Poster) */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
          {/* Instant poster image — visible immediately so mobile screen is NEVER black before first frame render */}
          <picture className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              ref={posterRef}
              src="/frames/desktop/frame_0001.webp"
              alt="Awakening cinematic inception"
              className="hero-media-cover absolute inset-0 w-full h-full object-cover object-[54.5%_center] sm:object-center transition-opacity duration-500 ease-out"
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
            className="hero-media-cover absolute inset-0 w-full h-full object-cover object-[54.5%_center] sm:object-center pointer-events-none transition-[filter] duration-700 ease-out"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.05) saturate(1.06) brightness(1.02)",
            }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none cinematic-vignette" />

          {/* Dark gradient on the left side for cinematic typography contrast (desktop only) */}
          <div className="hidden sm:block absolute inset-y-0 left-0 sm:w-4/5 lg:w-3/5 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none z-[1]" />

          {/* Mobile-specific bottom gradient: provides contrast for lower text while keeping the face in the upper half completely clear and bright */}
          <div className="block sm:hidden absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#050505] via-[#050505]/85 via-50% to-transparent pointer-events-none z-[1]" />

          {/* Gradient Overlays for Visual Depth */}
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-10 sm:h-28 bg-gradient-to-b from-[#050505]/30 sm:from-[#050505]/70 to-transparent pointer-events-none" />
        </div>

        {/* Main Cinematic Typography Overlay: positioned in lower section on mobile so face remains completely unobstructed */}
        <div className="relative z-10 px-4 xs:px-5 sm:px-12 lg:px-20 max-w-7xl w-full mt-auto mb-2 sm:my-auto sm:mb-0 flex flex-col justify-end sm:justify-center items-start">
          {/* Eyebrow with horizontal line divider */}
          <div
            ref={eyebrowRef}
            className="flex items-center gap-2 sm:gap-4 mb-1.5 sm:mb-4 will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            <span className="text-[9px] min-[380px]:text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] sm:tracking-[0.28em] text-neutral-400">
              AI &amp; SOFTWARE BUILDER
            </span>
            <span className="w-6 sm:w-16 h-[1px] bg-white/20" />
          </div>

          {/* Main Cinematic Serif Headline: Cormorant Garamond */}
          <h1 className="font-cinematic font-black tracking-tight text-white uppercase text-3xl min-[380px]:text-4xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.94] sm:leading-[0.92] mb-2 sm:mb-4">
            <span
              ref={lineOneRef}
              className="block will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              THIS IS
            </span>
            <span
              ref={nameRef}
              className="block italic font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fef3c7] via-[#e5c07b] to-[#d4af37] drop-shadow-[0_4px_28px_rgba(229,192,123,0.30)] will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              SRIRAM K
            </span>
          </h1>

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="font-mono text-[10px] min-[380px]:text-[11px] sm:text-sm tracking-[0.12em] sm:tracking-[0.2em] text-neutral-300 uppercase max-w-sm sm:max-w-xl leading-relaxed mb-3 sm:mb-8 will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            BUILDING INTELLIGENT DIGITAL EXPERIENCES THAT TRANSFORM REALITY.
          </p>

          {/* Action CTAs */}
          <div
            ref={ctasRef}
            className="flex flex-wrap items-center gap-1.5 sm:gap-4 will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            <a
              href="#projects"
              className="px-3.5 sm:px-6 py-1.5 sm:py-3 rounded-full bg-white text-black font-semibold text-[11px] sm:text-sm hover:bg-neutral-200 transition-all flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl"
              id="hero-explore-work-cta"
            >
              <span>Explore Work</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>

            <a
              href={PORTFOLIO_DATA.links.waveInitSolutions}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 sm:px-6 py-1.5 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] sm:text-sm transition-all flex items-center gap-1 sm:gap-2 shadow-lg group"
              id="hero-wave-init-cta"
            >
              <span>Wave Init Solutions</span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-3.5 sm:px-6 py-1.5 sm:py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/20 font-semibold text-[11px] sm:text-sm transition-all flex items-center gap-1 sm:gap-2 backdrop-blur-md"
              id="hero-get-in-touch-cta"
            >
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Indicators and Social links */}
        <div className="relative z-10 w-full px-4 xs:px-5 sm:px-12 lg:px-20 pb-3 xs:pb-4 sm:pb-8 flex items-center justify-between pointer-events-none">
          {/* Bottom Left: SCROLL indicator */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="w-6 sm:w-12 h-[1px] bg-white/20" />
            <span className="text-[9px] min-[380px]:text-[10px] font-mono tracking-[0.22em] sm:tracking-[0.25em] text-neutral-400 uppercase">
              SCROLL
            </span>
          </div>

          {/* Bottom Center: SCROLL TO EXPLORE indicator */}
          <div
            ref={scrollIndicatorRef}
            className="hidden sm:flex flex-col items-center gap-2 text-center -translate-x-1/2 left-1/2 absolute transition-opacity duration-500"
          >
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              SCROLL TO EXPLORE
            </span>
            <div className="w-4 h-7 rounded-full border border-white/25 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-amber-400 animate-bounce" />
            </div>
          </div>

          {/* Bottom Right: Social icons */}
          <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
            <a
              href={PORTFOLIO_DATA.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href={PORTFOLIO_DATA.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
