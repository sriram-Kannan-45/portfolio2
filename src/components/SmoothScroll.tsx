"use client";

import { useEffect, useRef } from "react";

// Tuned parameters for controlled, premium, responsive smooth scrolling
const KEYBOARD_SCROLL_SPEED = 380;     // Continuous scroll speed when holding ArrowDown/Up (px/second)
const KEY_SINGLE_STEP = 32;            // Single tap discrete step (px)
const ACTIVE_KEY_DECAY = 14.0;         // Snappy, responsive tracking while holding arrow keys
const MAX_CONTROLLED_LEAD = 48;        // Anti-skipping lead clamp: prevents leaping ahead of current scroll
const SCROLL_HOLD_WINDOW = 140;        // Active hold duration refreshed by continuous scroll gestures (ms)

export default function SmoothScroll() {
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const maxScrollRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const isInternalScrollRef = useRef(false);
  const isTouchRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Keyboard long-press tracking
  const activeKeyRef = useRef<"ArrowDown" | "ArrowUp" | null>(null);
  const keyPressTimeRef = useRef(0);

  // Manual scroll virtual drive tracking (shares exact same 380px/s velocity & 14.0 decay as down button)
  const virtualDriveRef = useRef<{ dir: 1 | -1; expiry: number } | null>(null);
  const lastWheelTimeRef = useRef(0);
  const wheelGestureStartRef = useRef(0);
  const wheelDirRef = useRef<1 | -1>(1);

  // Dedicated anchor navigation state for navbar and in-page CTA links
  const isAnchorNavigatingRef = useRef(false);

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

    // Initialize positions
    const initialY = window.scrollY;
    currentScrollRef.current = initialY;
    targetScrollRef.current = initialY;
    getMaxScroll();

    // Authoritative Single Animation Loop: Shared 1:1 between Down Button & Manual Scrolling
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
          isInternalScrollRef.current = true;
          window.scrollTo(0, target);
          isInternalScrollRef.current = false;
          isAnimatingRef.current = false;
          isAnchorNavigatingRef.current = false;
          rafIdRef.current = null;
          lastTimeRef.current = 0;
          return;
        }

        const dampingFactor = 1 - Math.exp(-9.0 * dt);
        const nextScroll = current + diff * dampingFactor;
        currentScrollRef.current = nextScroll;
        isInternalScrollRef.current = true;
        window.scrollTo(0, nextScroll);
        isInternalScrollRef.current = false;

        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // 2. Global Unified Scroll Control across the Entire Website
      // Determine active continuous drive direction (either Down Button keyhold OR manual scroll hold)
      let activeDir: 1 | -1 | null = null;

      if (activeKeyRef.current) {
        const dir = activeKeyRef.current === "ArrowDown" ? 1 : -1;
        const pressDuration = time - keyPressTimeRef.current;
        if (pressDuration > 120) {
          activeDir = dir;
        }
      } else if (virtualDriveRef.current && time <= virtualDriveRef.current.expiry) {
        activeDir = virtualDriveRef.current.dir;
      } else {
        virtualDriveRef.current = null;
      }

      // If actively driving, advance target at constant KEYBOARD_SCROLL_SPEED (380px/s)
      if (activeDir !== null) {
        targetScrollRef.current += activeDir * KEYBOARD_SCROLL_SPEED * dt;
        targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current));
      }

      // Anti-skipping lead clamp: strictly caps lead ahead of current scroll
      // Prevents aggressive gestures or bursts from leaping ahead of animations
      if (targetScrollRef.current > currentScrollRef.current + MAX_CONTROLLED_LEAD) {
        targetScrollRef.current = currentScrollRef.current + MAX_CONTROLLED_LEAD;
      } else if (targetScrollRef.current < currentScrollRef.current - MAX_CONTROLLED_LEAD) {
        targetScrollRef.current = currentScrollRef.current - MAX_CONTROLLED_LEAD;
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
        isInternalScrollRef.current = true;
        window.scrollTo(0, target);
        isInternalScrollRef.current = false;
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        lastTimeRef.current = 0;
        virtualDriveRef.current = null;
        return;
      }

      // Authoritative exponential damping: silky, controlled, premium tracking
      const dampingFactor = 1 - Math.exp(-ACTIVE_KEY_DECAY * dt);
      const nextScroll = current + diff * dampingFactor;

      currentScrollRef.current = nextScroll;
      isInternalScrollRef.current = true;
      window.scrollTo(0, nextScroll);
      isInternalScrollRef.current = false;

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        lastTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Wheel & Trackpad Input Normalization: 1:1 Parity with Down-Button Navigation
    const onWheel = (e: WheelEvent) => {
      // Don't intercept browser zoom
      if (e.ctrlKey) return;

      // Ignore zero or tiny fractional jitter from resting fingers on touchpad
      if (Math.abs(e.deltaY) < 1.0) return;

      e.preventDefault();

      const maxScroll = getMaxScroll();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const now = performance.now();

      // Interrupt anchor navigation or key hold on manual wheel input
      isAnchorNavigatingRef.current = false;
      activeKeyRef.current = null;

      const timeSinceLastWheel = now - lastWheelTimeRef.current;
      lastWheelTimeRef.current = now;

      const isDirectionReversal = wheelDirRef.current !== dir;
      const isNewGesture = timeSinceLastWheel > 120 || isDirectionReversal;
      wheelDirRef.current = dir;

      if (isNewGesture) {
        wheelGestureStartRef.current = now;
        // First notch/action of a scroll gesture:
        // Applies the exact discrete step matching the down button single tap (32px)
        let newTarget = (isDirectionReversal ? currentScrollRef.current : targetScrollRef.current) + dir * KEY_SINGLE_STEP;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        if (newTarget > currentScrollRef.current + MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current + MAX_CONTROLLED_LEAD;
        } else if (newTarget < currentScrollRef.current - MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current - MAX_CONTROLLED_LEAD;
        }

        targetScrollRef.current = newTarget;
        virtualDriveRef.current = null;
      } else {
        // Continuous scrolling (holding/rolling the wheel or dragging touchpad):
        // Does NOT add discrete delta! (Prevents velocity stacking and section skipping)
        // Sustains the active virtual drive at 380px/s,
        // exactly matching the long-press down button behavior.
        const gestureDuration = now - wheelGestureStartRef.current;
        if (gestureDuration > 80) {
          virtualDriveRef.current = {
            dir,
            expiry: now + SCROLL_HOLD_WINDOW,
          };
        }
      }

      startAnimation();
    };

    // Controlled Keyboard Scrolling: Exact Reference Behavior
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
        isAnchorNavigatingRef.current = false;

        // If this arrow key is already actively held, completely ignore OS key-repeat events!
        // This neutralizes browser key-repeat acceleration and prevents jumping
        if (activeKeyRef.current === e.key) {
          return;
        }

        const maxScroll = getMaxScroll();
        const dir = e.key === "ArrowDown" ? 1 : -1;

        activeKeyRef.current = e.key;
        keyPressTimeRef.current = performance.now();
        virtualDriveRef.current = null;

        // Apply a small single-tap step immediately for instant responsiveness
        let newTarget = targetScrollRef.current + dir * KEY_SINGLE_STEP;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        if (newTarget > currentScrollRef.current + MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current + MAX_CONTROLLED_LEAD;
        } else if (newTarget < currentScrollRef.current - MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current - MAX_CONTROLLED_LEAD;
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
        const now = performance.now();

        switch (e.key) {
          case "PageDown":
          case " ":
            {
              const dir: 1 | -1 = e.shiftKey ? -1 : 1;
              let newTarget = targetScrollRef.current + dir * KEY_SINGLE_STEP * 2;
              newTarget = Math.max(0, Math.min(maxScroll, newTarget));
              if (newTarget > currentScrollRef.current + MAX_CONTROLLED_LEAD) {
                newTarget = currentScrollRef.current + MAX_CONTROLLED_LEAD;
              } else if (newTarget < currentScrollRef.current - MAX_CONTROLLED_LEAD) {
                newTarget = currentScrollRef.current - MAX_CONTROLLED_LEAD;
              }
              targetScrollRef.current = newTarget;
              virtualDriveRef.current = {
                dir,
                expiry: now + 200,
              };
              startAnimation();
            }
            return;
          case "PageUp":
            {
              let newTarget = targetScrollRef.current - KEY_SINGLE_STEP * 2;
              newTarget = Math.max(0, Math.min(maxScroll, newTarget));
              if (newTarget < currentScrollRef.current - MAX_CONTROLLED_LEAD) {
                newTarget = currentScrollRef.current - MAX_CONTROLLED_LEAD;
              }
              targetScrollRef.current = newTarget;
              virtualDriveRef.current = {
                dir: -1,
                expiry: now + 200,
              };
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

    // If window loses focus, immediately release key hold state
    const onBlur = () => {
      activeKeyRef.current = null;
      virtualDriveRef.current = null;
    };

    // Synchronize when scroll is triggered externally (e.g. scrollbar thumb drag)
    const onScroll = () => {
      if (isInternalScrollRef.current) return;

      const currentY = window.scrollY;
      currentScrollRef.current = currentY;

      // Keep target synchronized when dragging scrollbar thumb or touch-scrolling
      if (!isAnimatingRef.current || isTouchRef.current) {
        targetScrollRef.current = currentY;
      }
    };

    // Touch device support: preserve completely natural mobile gestures
    const onTouchStart = () => {
      isTouchRef.current = true;
      activeKeyRef.current = null;
      virtualDriveRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        isAnimatingRef.current = false;
      }
      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = window.scrollY;
    };

    const onTouchEnd = () => {
      isTouchRef.current = false;
      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = window.scrollY;
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
    window.addEventListener("touchend", onTouchEnd, { passive: true });
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
      window.removeEventListener("touchend", onTouchEnd);
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
