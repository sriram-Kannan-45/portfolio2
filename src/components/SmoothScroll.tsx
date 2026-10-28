"use client";

import { useEffect, useRef } from "react";

// Desktop tuned parameters: smooth, responsive, premium
const KEYBOARD_SCROLL_SPEED = 850;     // Continuous scroll speed when holding ArrowDown/Up (px/second)
const KEY_SINGLE_STEP = 72;            // Single tap discrete step (px)
const ACTIVE_KEY_DECAY = 14.0;         // Snappy, responsive tracking
const INTRO_SCROLL_DECAY = 9;
const INTRO_MAX_CONTROLLED_LEAD = 180;

// Mobile touch-tuned parameters: fast, tactile, and responsive
const MOBILE_TOUCH_MOVE_MULT = 1.35;    // Tactile dragging responsiveness on touch screens

export default function SmoothScroll() {
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const maxScrollRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isTouchRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Keyboard long-press tracking
  const activeKeyRef = useRef<"ArrowDown" | "ArrowUp" | null>(null);
  const keyPressTimeRef = useRef(0);

  // Manual scroll virtual drive tracking (shares exact same velocity & decay as down button)
  const virtualDriveRef = useRef<{ dir: 1 | -1; speed?: number; expiry: number } | null>(null);
  const lastWheelTimeRef = useRef(0);
  const wheelDirRef = useRef<1 | -1>(1);

  // Dedicated anchor navigation state for navbar and in-page CTA links
  const isAnchorNavigatingRef = useRef(false);

  // Mobile touch gesture tracking
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchLastYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const isTouchDraggingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Live calculation of maximum scrollable distance (handles ScrollTrigger pins, dynamic DOM expansions)
    const getMaxScroll = () => {
      const docHeight = document.documentElement ? document.documentElement.scrollHeight : 0;
      const bodyHeight = document.body ? document.body.scrollHeight : 0;
      const totalHeight = Math.max(docHeight, bodyHeight);
      const calculated = Math.max(0, totalHeight - window.innerHeight);
      maxScrollRef.current = calculated;
      return calculated;
    };

    // Track programmatic writes so onScroll does not mistake them for external user drag
    const lastProgrammaticScrollTimeRef = { current: 0 };

    // Initialize positions
    const initialY = window.scrollY;
    currentScrollRef.current = initialY;
    targetScrollRef.current = initialY;
    getMaxScroll();

    // Follow the actual pin distance, including viewport changes, instead of
    // switching to faster content scrolling partway through the introduction.
    const isInIntro = () => {
      const hero = document.getElementById("hero");
      const end = Number(hero?.dataset.scrollEnd);
      if (Number.isFinite(end) && end > 0) {
        return currentScrollRef.current < end;
      }
      return currentScrollRef.current < (window.innerHeight || 800) * 3.8;
    };

    const getLeadCap = () => isInIntro()
      ? INTRO_MAX_CONTROLLED_LEAD
      : Math.max(850, Math.round(window.innerHeight * 0.9));

    const getIntroSpeed = () => Math.min(650, Math.max(320, window.innerHeight * 0.6));

    const writeScroll = (position: number) => {
      lastProgrammaticScrollTimeRef.current = performance.now();
      window.scrollTo(0, position);
    };

    const stopAnimation = (position = window.scrollY) => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      isAnimatingRef.current = false;
      isAnchorNavigatingRef.current = false;
      activeKeyRef.current = null;
      virtualDriveRef.current = null;
      lastTimeRef.current = 0;
      currentScrollRef.current = position;
      targetScrollRef.current = position;
    };

    // Authoritative Single Animation Loop: Shared between Keyboard, Anchor, and Wheel Scrolling
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05); // Clamp dt to max 50ms
      lastTimeRef.current = time;

      const maxScroll = getMaxScroll();

      // 1. Dedicated Smooth In-Page Anchor Navigation (Navbar links & CTA buttons)
      if (isAnchorNavigatingRef.current) {
        const current = currentScrollRef.current;
        const target = targetScrollRef.current;
        const diff = target - current;

        if (Math.abs(diff) < 0.5) {
          currentScrollRef.current = target;
          writeScroll(target);
          isAnimatingRef.current = false;
          isAnchorNavigatingRef.current = false;
          rafIdRef.current = null;
          lastTimeRef.current = 0;
          return;
        }

        const dampingFactor = 1 - Math.exp(-9.0 * dt);
        const nextScroll = current + diff * dampingFactor;
        currentScrollRef.current = nextScroll;
        writeScroll(nextScroll);

        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // 2. Global Unified Scroll Control
      // Determine active continuous drive direction (either Down/Up button keyhold OR virtual drive)
      let activeDir: 1 | -1 | null = null;
      let driveSpeed = isInIntro() ? getIntroSpeed() : KEYBOARD_SCROLL_SPEED;

      if (activeKeyRef.current) {
        const dir = activeKeyRef.current === "ArrowDown" ? 1 : -1;
        const pressDuration = time - keyPressTimeRef.current;
        if (pressDuration > 120) {
          activeDir = dir;
        }
      } else if (virtualDriveRef.current && time <= virtualDriveRef.current.expiry) {
        activeDir = virtualDriveRef.current.dir;
        if (virtualDriveRef.current.speed) {
          driveSpeed = virtualDriveRef.current.speed;
        }
      } else {
        virtualDriveRef.current = null;
      }

      // If actively driving, advance target at driveSpeed
      if (activeDir !== null) {
        targetScrollRef.current += activeDir * driveSpeed * dt;
        targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current));
      }

      // Dynamic lead cap: controlled during intro, generous and natural on main content
      const currentLeadCap = getLeadCap();

      if (targetScrollRef.current > currentScrollRef.current + currentLeadCap) {
        targetScrollRef.current = currentScrollRef.current + currentLeadCap;
      } else if (targetScrollRef.current < currentScrollRef.current - currentLeadCap) {
        targetScrollRef.current = currentScrollRef.current - currentLeadCap;
      }

      const current = currentScrollRef.current;
      const target = targetScrollRef.current;
      const diff = target - current;

      // Settle condition: snap when close enough and no drive is actively running
      const isDriveActive = Boolean(
        activeKeyRef.current || (virtualDriveRef.current && time <= virtualDriveRef.current.expiry)
      );

      if (!isDriveActive && Math.abs(diff) < 0.25) {
        currentScrollRef.current = target;
        writeScroll(target);
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        lastTimeRef.current = 0;
        virtualDriveRef.current = null;
        return;
      }

      // Authoritative exponential damping: silky, controlled, responsive tracking
      const inIntro = isInIntro();
      const dampingFactor = 1 - Math.exp(-(inIntro ? INTRO_SCROLL_DECAY : ACTIVE_KEY_DECAY) * dt);
      const easedStep = diff * dampingFactor;
      const maxStep = inIntro ? getIntroSpeed() * dt : Infinity;
      const nextScroll = current + Math.max(-maxStep, Math.min(maxStep, easedStep));

      currentScrollRef.current = nextScroll;
      writeScroll(nextScroll);

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        lastTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Wheel & Trackpad Input Normalization: responsive, smooth, direction-aware
    const onWheel = (e: WheelEvent) => {
      // Don't intercept browser zoom
      if (e.ctrlKey) return;

      // Ignore zero or tiny fractional jitter from resting fingers on touchpad
      if (Math.abs(e.deltaY) < 0.5) return;

      e.preventDefault();

      const maxScroll = getMaxScroll();
      let normalizedDelta = e.deltaY;
      if (e.deltaMode === 1) {
        normalizedDelta *= 36;
      } else if (e.deltaMode === 2) {
        normalizedDelta *= 600;
      }

      const dir: 1 | -1 = normalizedDelta > 0 ? 1 : -1;
      const now = performance.now();

      // Interrupt anchor navigation or key hold on manual wheel input
      isTouchRef.current = false;
      isAnchorNavigatingRef.current = false;
      activeKeyRef.current = null;

      const isDirectionReversal = wheelDirRef.current !== dir;
      wheelDirRef.current = dir;
      lastWheelTimeRef.current = now;

      // If reversing direction, immediately synchronize to current scroll to cancel forward inertia
      if (isDirectionReversal) {
        targetScrollRef.current = currentScrollRef.current;
        virtualDriveRef.current = null;
      }

      // Preserve small trackpad deltas; a forced minimum turns gentle gestures
      // into large jumps through the frame sequence.
      const absDelta = Math.abs(normalizedDelta);
      const step = Math.sign(normalizedDelta) * (isInIntro()
        ? Math.min(absDelta * 0.65, 140)
        : Math.min(absDelta * 1.1, 280));

      let newTarget = targetScrollRef.current + step;
      newTarget = Math.max(0, Math.min(maxScroll, newTarget));

      // Dynamic lead cap: controlled during intro, generous on main content
      const leadCap = getLeadCap();

      if (newTarget > currentScrollRef.current + leadCap) {
        newTarget = currentScrollRef.current + leadCap;
      } else if (newTarget < currentScrollRef.current - leadCap) {
        newTarget = currentScrollRef.current - leadCap;
      }

      targetScrollRef.current = newTarget;
      startAnimation();
    };

    // Controlled Keyboard Scrolling: Instant response, smooth continuous drive
    const onKeyDown = (e: KeyboardEvent) => {
      // Allow normal typing inside input fields, textareas, and editable elements
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          activeEl.isContentEditable
        ) {
          return;
        }
      }

      // 1. ArrowDown / ArrowUp Handling (Single Tap & Smooth Long-Press)
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        isTouchRef.current = false;
        isAnchorNavigatingRef.current = false;

        // If this arrow key is already actively held, ignore browser repeat events to maintain steady drive
        if (activeKeyRef.current === e.key) {
          return;
        }

        const maxScroll = getMaxScroll();
        const dir: 1 | -1 = e.key === "ArrowDown" ? 1 : -1;

        activeKeyRef.current = e.key;
        keyPressTimeRef.current = performance.now();
        virtualDriveRef.current = null;

        // Reset target if reversing direction
        if ((dir === 1 && targetScrollRef.current < currentScrollRef.current) ||
            (dir === -1 && targetScrollRef.current > currentScrollRef.current)) {
          targetScrollRef.current = currentScrollRef.current;
        }

        const leadCap = getLeadCap();

        // Apply a crisp single-tap step immediately for instant responsiveness
        let newTarget = targetScrollRef.current + dir * KEY_SINGLE_STEP;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        if (newTarget > currentScrollRef.current + leadCap) {
          newTarget = currentScrollRef.current + leadCap;
        } else if (newTarget < currentScrollRef.current - leadCap) {
          newTarget = currentScrollRef.current - leadCap;
        }

        targetScrollRef.current = newTarget;
        startAnimation();
        return;
      }

      // 2. PageDown / PageUp / Space / Home / End Handling
      if (
        e.key === "PageDown" ||
        e.key === "PageUp" ||
        e.key === " " ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        e.preventDefault();
        const maxScroll = getMaxScroll();

        switch (e.key) {
          case "PageDown":
          case " ":
            {
              const dir: 1 | -1 = e.shiftKey ? -1 : 1;
              const pageStep = Math.min(window.innerHeight * 0.8, 640);
              let newTarget = targetScrollRef.current + dir * pageStep;
              newTarget = Math.max(0, Math.min(maxScroll, newTarget));
              targetScrollRef.current = newTarget;
              startAnimation();
            }
            return;
          case "PageUp":
            {
              const pageStep = Math.min(window.innerHeight * 0.8, 640);
              let newTarget = targetScrollRef.current - pageStep;
              newTarget = Math.max(0, Math.min(maxScroll, newTarget));
              targetScrollRef.current = newTarget;
              startAnimation();
            }
            return;
          case "Home":
            isAnchorNavigatingRef.current = true;
            targetScrollRef.current = 0;
            virtualDriveRef.current = null;
            activeKeyRef.current = null;
            startAnimation();
            return;
          case "End":
            isAnchorNavigatingRef.current = true;
            targetScrollRef.current = maxScroll;
            virtualDriveRef.current = null;
            activeKeyRef.current = null;
            startAnimation();
            return;
        }
      }
    };

    // Key release handler: smoothly stops continuous keyboard scroll
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (activeKeyRef.current === e.key) {
          activeKeyRef.current = null;
        }
      }
    };

    // Do not resume a stale navigation target after switching tabs or windows
    const onBlur = () => {
      stopAnimation();
    };

    // Synchronize when scroll is triggered externally (native scrollbar drag, external nav)
    const onScroll = () => {
      // If triggered by our own writeScroll within the last 100ms, ignore
      if (performance.now() - lastProgrammaticScrollTimeRef.current < 100) {
        return;
      }

      const currentY = window.scrollY;
      currentScrollRef.current = currentY;

      // When not animating and not actively dragging touch, sync target
      if (!isAnimatingRef.current && !isTouchDraggingRef.current) {
        targetScrollRef.current = currentY;
      } else if (!isTouchDraggingRef.current) {
        // User dragged scrollbar during programmatic animation -> yield immediately
        stopAnimation(currentY);
      }
    };

    // Touch device support: captures touch gestures across pinned scenes and content
    const onTouchStart = (e?: TouchEvent) => {
      isTouchRef.current = true;
      isAnchorNavigatingRef.current = false;
      activeKeyRef.current = null;
      virtualDriveRef.current = null;

      if (e?.touches && e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartYRef.current = touch.clientY;
        touchStartXRef.current = touch.clientX;
        touchLastYRef.current = touch.clientY;
        touchStartTimeRef.current = performance.now();
      }
      isTouchDraggingRef.current = false;

      // Yield any running programmatic animation so touch has instant priority
      if (isAnimatingRef.current) {
        stopAnimation(window.scrollY);
      } else {
        currentScrollRef.current = window.scrollY;
        targetScrollRef.current = window.scrollY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentX = touch.clientX;
      const diffX = Math.abs(currentX - touchStartXRef.current);
      const diffY = Math.abs(currentY - touchStartYRef.current);

      // Allow natural horizontal gestures without hijacking
      if (!isTouchDraggingRef.current && diffX > diffY && diffX > 8) {
        return;
      }

      // Small threshold before engaging vertical drag (preserves crisp taps on links/buttons)
      if (!isTouchDraggingRef.current && diffY > 6) {
        isTouchDraggingRef.current = true;
      }

      if (isTouchDraggingRef.current) {
        if (e.cancelable) {
          e.preventDefault();
        }

        const maxScroll = getMaxScroll();
        const deltaY = touchLastYRef.current - currentY;
        touchLastYRef.current = currentY;

        if (Math.abs(deltaY) < 0.3) return;

        // Controlled tactile tracking (~1.35x in intro for responsive frame scrubbing)
        const inIntro = isInIntro();
        const touchMult = inIntro ? MOBILE_TOUCH_MOVE_MULT : 1.15;
        let newTarget = targetScrollRef.current + deltaY * touchMult;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        // Strict lead clamp: prevents wild finger swipes from leaping ahead of animations
        const leadCap = getLeadCap();
        if (newTarget > currentScrollRef.current + leadCap) {
          newTarget = currentScrollRef.current + leadCap;
        } else if (newTarget < currentScrollRef.current - leadCap) {
          newTarget = currentScrollRef.current - leadCap;
        }

        targetScrollRef.current = newTarget;
        startAnimation();
      }
    };

    const onTouchEnd = (e?: TouchEvent) => {
      isTouchRef.current = false;

      if (!isTouchDraggingRef.current) {
        currentScrollRef.current = window.scrollY;
        targetScrollRef.current = window.scrollY;
        return;
      }
      isTouchDraggingRef.current = false;

      const touch = e?.changedTouches ? e.changedTouches[0] : null;
      if (!touch) return;

      const maxScroll = getMaxScroll();
      const now = performance.now();
      const elapsed = now - touchStartTimeRef.current;
      const totalDeltaY = touchStartYRef.current - touch.clientY;
      const absDist = Math.abs(totalDeltaY);

      // Controlled swipe detection: short flick (< 350ms) and meaningful distance (> 28px)
      if (elapsed < 350 && absDist > 28) {
        const dir: 1 | -1 = totalDeltaY > 0 ? 1 : -1;
        const inIntro = isInIntro();
        const leadCap = getLeadCap();

        // Smoothly advances by one controlled section transition step
        const swipeStep = inIntro
          ? Math.min(leadCap, Math.max(KEY_SINGLE_STEP, absDist * 0.7))
          : Math.min(leadCap, Math.max(KEY_SINGLE_STEP * 1.5, absDist * 1.1));

        let newTarget = targetScrollRef.current + dir * swipeStep;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        if (newTarget > currentScrollRef.current + leadCap) {
          newTarget = currentScrollRef.current + leadCap;
        } else if (newTarget < currentScrollRef.current - leadCap) {
          newTarget = currentScrollRef.current - leadCap;
        }

        targetScrollRef.current = newTarget;

        // Sustain controlled deceleration momentum
        virtualDriveRef.current = {
          dir,
          speed: inIntro ? getIntroSpeed() * 0.85 : KEYBOARD_SCROLL_SPEED * 0.8,
          expiry: now + Math.min(180, Math.round(absDist * 1.2)),
        };
        startAnimation();
      }
    };

    // Smooth in-page anchor navigation (e.g. #about, #skills, #contact, #hero)
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      try {
        const element = document.querySelector(href) as HTMLElement | null;
        if (element) {
          e.preventDefault();
          const maxScroll = getMaxScroll();
          const navOffset = href === "#hero" ? 0 : 70;
          const targetY = href === "#hero" ? 0 : element.getBoundingClientRect().top + window.scrollY - navOffset;
          const destination = href === "#hero" ? 0 : Math.max(0, Math.min(maxScroll, targetY));

          isAnchorNavigatingRef.current = true;
          activeKeyRef.current = null;
          virtualDriveRef.current = null;
          targetScrollRef.current = destination;
          startAnimation();
          window.history.pushState(null, "", href);
        }
      } catch {
        // Fallback for invalid query selector
      }
    };

    // Keep maxScroll synchronized via ResizeObserver whenever DOM expands
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        getMaxScroll();
      });
      if (document.documentElement) {
        resizeObserver.observe(document.documentElement);
      }
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    // Event listeners
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("resize", getMaxScroll, { passive: true });
    window.addEventListener("orientationchange", getMaxScroll, { passive: true });
    window.addEventListener("videoScrolledChange", getMaxScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);

    // Initial check on load
    if (document.readyState === "complete") {
      getMaxScroll();
    } else {
      window.addEventListener("load", getMaxScroll, { once: true });
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onBlur);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", getMaxScroll);
      window.removeEventListener("orientationchange", getMaxScroll);
      window.removeEventListener("videoScrolledChange", getMaxScroll);
      document.removeEventListener("click", onAnchorClick);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return null;
}
