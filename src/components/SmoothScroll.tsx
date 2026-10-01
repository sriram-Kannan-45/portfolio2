"use client";

import { useEffect, useRef } from "react";

// Desktop tuned parameters: 100% preserved
const KEYBOARD_SCROLL_SPEED = 380;     // Continuous scroll speed when holding ArrowDown/Up (px/second)
const KEY_SINGLE_STEP = 32;            // Single tap discrete step (px)
const ACTIVE_KEY_DECAY = 14.0;         // Snappy, responsive tracking while holding arrow keys
const MAX_CONTROLLED_LEAD = 48;        // Anti-skipping lead clamp: prevents leaping ahead of current scroll
const SCROLL_HOLD_WINDOW = 140;        // Active hold duration refreshed by continuous scroll gestures (ms)

// Mobile touch-tuned parameters: ~15% faster for responsive touch navigation while preserving anti-skip guarantees
const MOBILE_MAX_CONTROLLED_LEAD = 56;  // ~16% increase, strictly caps lead to prevent skipping sections
const MOBILE_TOUCH_MOVE_MULT = 1.26;    // ~14.5% increase in tactile dragging responsiveness
const MOBILE_DRIVE_SPEED = 440;         // ~15.8% increase for swipe momentum drive (px/s)
const MOBILE_SWIPE_STEP_MIN = 36;       // ~12.5% increase for single swipe flick

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

  // Manual scroll virtual drive tracking (shares exact same 380px/s velocity & 14.0 decay as down button on desktop; 440px/s on mobile)
  const virtualDriveRef = useRef<{ dir: 1 | -1; speed?: number; expiry: number } | null>(null);
  const lastWheelTimeRef = useRef(0);
  const wheelGestureStartRef = useRef(0);
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
      let driveSpeed = KEYBOARD_SCROLL_SPEED;

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

      // If actively driving, advance target at driveSpeed (380px/s on desktop; 440px/s on mobile touch)
      if (activeDir !== null) {
        targetScrollRef.current += activeDir * driveSpeed * dt;
        targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current));
      }

      // Anti-skipping lead clamp: strictly caps lead ahead of current scroll
      // Desktop lead capped at 48px; mobile touch capped at 56px (~16% faster, strictly anti-skip)
      const currentLeadCap = isTouchRef.current ? MOBILE_MAX_CONTROLLED_LEAD : MAX_CONTROLLED_LEAD;
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
      isTouchRef.current = false;
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
        isTouchRef.current = false;
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

      // Keep target synchronized when dragging scrollbar thumb
      if (!isAnimatingRef.current) {
        targetScrollRef.current = currentY;
      }
    };

    // Mobile Touch Gesture Normalization: tuned ~15% faster for responsive feel while preserving strict section control
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isTouchRef.current = true;
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
      touchStartXRef.current = touch.clientX;
      touchLastYRef.current = touch.clientY;
      touchStartTimeRef.current = performance.now();
      isTouchDraggingRef.current = false;

      // Reset ongoing anchor navigation or drives
      isAnchorNavigatingRef.current = false;
      activeKeyRef.current = null;
      virtualDriveRef.current = null;

      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = window.scrollY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
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
        // Prevent browser's native runaway momentum fling
        if (e.cancelable) {
          e.preventDefault();
        }

        const maxScroll = getMaxScroll();
        const deltaY = touchLastYRef.current - currentY;
        touchLastYRef.current = currentY;

        if (Math.abs(deltaY) < 0.3) return;

        // Controlled tactile tracking (~15% faster and snappier on mobile touch)
        let newTarget = targetScrollRef.current + deltaY * MOBILE_TOUCH_MOVE_MULT;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        // Strict lead clamp: prevents wild finger swipes from leaping ahead of animations
        if (newTarget > currentScrollRef.current + MOBILE_MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current + MOBILE_MAX_CONTROLLED_LEAD;
        } else if (newTarget < currentScrollRef.current - MOBILE_MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current - MOBILE_MAX_CONTROLLED_LEAD;
        }

        targetScrollRef.current = newTarget;
        startAnimation();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isTouchDraggingRef.current) return;
      isTouchDraggingRef.current = false;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const maxScroll = getMaxScroll();
      const now = performance.now();
      const elapsed = now - touchStartTimeRef.current;
      const totalDeltaY = touchStartYRef.current - touch.clientY;
      const absDist = Math.abs(totalDeltaY);

      // Controlled swipe detection: short flick (< 320ms) and meaningful distance (> 30px)
      if (elapsed < 320 && absDist > 30) {
        const dir: 1 | -1 = totalDeltaY > 0 ? 1 : -1;
        // Smoothly advances by one controlled section transition step (capped at 56px, ~16% faster)
        const controlledSwipeStep = Math.min(
          MOBILE_MAX_CONTROLLED_LEAD,
          Math.max(MOBILE_SWIPE_STEP_MIN, absDist * 0.46)
        );
        let newTarget = targetScrollRef.current + dir * controlledSwipeStep;
        newTarget = Math.max(0, Math.min(maxScroll, newTarget));

        if (newTarget > currentScrollRef.current + MOBILE_MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current + MOBILE_MAX_CONTROLLED_LEAD;
        } else if (newTarget < currentScrollRef.current - MOBILE_MAX_CONTROLLED_LEAD) {
          newTarget = currentScrollRef.current - MOBILE_MAX_CONTROLLED_LEAD;
        }

        targetScrollRef.current = newTarget;

        // Sustain controlled deceleration at 440px/s (~16% faster) for 120ms
        virtualDriveRef.current = {
          dir,
          speed: MOBILE_DRIVE_SPEED,
          expiry: now + 120,
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
