"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

// Fixed positions keep server and client markup identical without a particle loop.
const dust = Array.from({ length: 28 }, (_, index) => ({
  x: 14 + ((index * 37) % 73),
  y: 29 + ((index * 19) % 42),
  size: index % 5 === 0 ? 2 : 1,
  opacity: 0.15 + (index % 5) * 0.1,
}));

export default function ThankYouSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    let disposed = false;
    let refreshFrame: number | null = null;
    const context = gsap.context(() => {
      const viewport = viewportRef.current;
      const title = titleRef.current;
      if (!viewport || !title) return;
      const spotlight = viewport.querySelector(".closing-spotlight");
      const smoke = viewport.querySelector(".closing-smoke");
      const wisp = viewport.querySelector(".closing-smoke-wisp");
      const streaks = viewport.querySelector(".closing-streaks");
      const paths = viewport.querySelectorAll(".closing-streaks path");
      const particles = viewport.querySelectorAll(".closing-dust i");
      const glow = viewport.querySelector(".closing-title-glow");
      const haze = viewport.querySelector(".closing-haze");

      if (reducedMotion) {
        gsap.set(viewport, { backgroundColor: "#030303" });
        gsap.set(title, { opacity: 1, y: 0, filter: "none" });
        gsap.set(spotlight, { opacity: 0.85, scaleY: 1 });
        gsap.set([smoke, wisp], { opacity: 0.35, xPercent: 0, y: 0, scale: 1 });
        gsap.set([haze, glow], { opacity: 1 });
        gsap.set(streaks, { opacity: 0.8, x: 0 });
        gsap.set(paths, { strokeDashoffset: 0 });
        gsap.set(particles, { opacity: (index) => dust[index].opacity, x: 0, y: 0 });
        return;
      }

      // Durations are fractions of this one-unit SCRUBBED timeline, not seconds
      // of autonomous playback. The visual viewport is pinned only after footer.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "closing-thank-you",
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.round(viewport.offsetHeight * 1.8)}`,
          pin: viewport,
          pinSpacing: true,
          anticipatePin: 0,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 0-20%: darkness, the overhead beam, the first smoke and gold dust.
      timeline
        .fromTo(viewport, { backgroundColor: "#030305" },
          { backgroundColor: "#030303", duration: 0.2 }, 0)
        .fromTo(spotlight, { opacity: 0, scaleY: 0.86 },
          { opacity: 0.72, scaleY: 1, duration: 0.2 }, 0)
        .fromTo(haze, { opacity: 0 }, { opacity: 0.65, duration: 0.2 }, 0)
        .fromTo(smoke, { opacity: 0, scale: 0.9, xPercent: -3, y: 18 },
          { opacity: 0.2, scale: 0.96, xPercent: -2, y: 10, duration: 0.2 }, 0)
        .fromTo(wisp, { opacity: 0, scale: 0.9, xPercent: 3, y: 12 },
          { opacity: 0.12, scale: 0.96, xPercent: 2, y: 8, duration: 0.2 }, 0)
        .fromTo(particles, { opacity: 0, x: 0, y: 12 }, {
          opacity: (index) => dust[index].opacity,
          x: (index) => (index % 2 ? 1 : -1) * (3 + index % 5),
          y: (index) => -2 - index % 6,
          duration: 0.2,
        }, 0)
        // 20-50%: flowing lines draw in as the real heading resolves to sharp text.
        .fromTo(streaks, { opacity: 0, x: -24 }, { opacity: 0.8, x: 0, duration: 0.3 }, 0.2)
        .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, 0.2)
        .fromTo(title, { opacity: 0, y: 28, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 }, 0.2)
        .to(smoke, { opacity: 0.42, scale: 1.04, xPercent: 0, y: -3, duration: 0.3 }, 0.2)
        .to(wisp, { opacity: 0.26, scale: 1.02, xPercent: 0, y: -4, duration: 0.3 }, 0.2)
        // 50-80%: the sharp headline holds while the background develops.
        .fromTo(glow, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.5)
        .to(haze, { opacity: 1, duration: 0.3 }, 0.5)
        .to(spotlight, { opacity: 0.85, duration: 0.3 }, 0.5)
        // Gentle travel continues through 100%, driven exclusively by scrolling.
        .to(streaks, { x: 22, duration: 0.5 }, 0.5)
        .to(smoke, { opacity: 0.35, scale: 1.1, xPercent: 2, y: -14, duration: 0.5 }, 0.5)
        .to(wisp, { opacity: 0.22, scale: 1.08, xPercent: -2, y: -10, duration: 0.5 }, 0.5)
        .to(particles, {
          x: (index) => (index % 2 ? 1 : -1) * (12 + index % 9),
          y: (index) => -18 - index % 17,
          duration: 0.8,
        }, 0.2);
    }, sectionRef.current || undefined);

    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    // Project filters and experience tabs change the content above this section.
    // Observe layout size, not scroll events, and coalesce refreshes to one frame.
    const content = sectionRef.current?.parentElement;
    const precedingSections = Array.from(content?.children ?? []).filter(
      (element) => element !== sectionRef.current && element.matches("section, footer")
    );
    const sizes = new Map(precedingSections.map((element) => [element, element.getBoundingClientRect()]));
    const observer = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const next = entry.target.getBoundingClientRect();
        const previous = sizes.get(entry.target);
        sizes.set(entry.target, next);
        if (!previous || Math.abs(next.height - previous.height) >= 1 || Math.abs(next.width - previous.width) >= 1) changed = true;
      }
      if (!changed) return;
      if (refreshFrame !== null) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = null;
        if (!disposed) ScrollTrigger.refresh();
      });
    });
    // Exclude this section's own pin spacer to avoid refresh feedback loops.
    precedingSections.forEach((element) => observer.observe(element));
    return () => {
      disposed = true;
      observer.disconnect();
      if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="thank-you" className="closing-screen" aria-labelledby="closing-title">
      <div ref={viewportRef} className="closing-viewport">
        <div className="closing-atmosphere" aria-hidden="true">
          <div className="closing-spotlight" />
          <div className="closing-haze" />
          <svg className="closing-smoke" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <filter id="closing-smoke-noise" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="4" seed="12" result="cloud" />
                <feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="2" seed="8" result="flow" />
                <feDisplacementMap in="cloud" in2="flow" scale="110" xChannelSelector="R" yChannelSelector="G" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.60  0 0 0 0 0.53  0 0 0 0 0.39  0 0 0 0.85 -0.32" />
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <radialGradient id="closing-smoke-fade">
                <stop offset="0" stopColor="white" stopOpacity="0.9" />
                <stop offset="0.7" stopColor="white" stopOpacity="0.35" />
                <stop offset="1" stopColor="black" />
              </radialGradient>
              <mask id="closing-smoke-mask"><ellipse cx="800" cy="440" rx="680" ry="340" fill="url(#closing-smoke-fade)" /></mask>
            </defs>
            <g mask="url(#closing-smoke-mask)"><rect width="1600" height="900" filter="url(#closing-smoke-noise)" /></g>
          </svg>
          <div className="closing-smoke-wisp" />
          <div className="closing-title-glow" />
          <svg className="closing-streaks" viewBox="0 0 1600 900" preserveAspectRatio="none">
            <defs>
              <linearGradient id="closing-gold-line">
                <stop stopColor="#d4af64" stopOpacity="0" />
                <stop offset="0.24" stopColor="#c8974c" stopOpacity="0.6" />
                <stop offset="0.48" stopColor="#f8d894" stopOpacity="0.08" />
                <stop offset="0.76" stopColor="#e5bc76" stopOpacity="0.55" />
                <stop offset="1" stopColor="#c8974c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#closing-gold-line)">
              <path pathLength="1" d="M-80 475 C250 280 390 670 750 475 S1210 260 1690 535" strokeWidth="1.2" />
              <path pathLength="1" d="M-100 500 C220 320 460 580 780 490 S1260 340 1680 520" strokeWidth="0.6" opacity="0.55" />
              <path pathLength="1" d="M40 300 C390 650 500 550 800 460 S1230 340 1600 540" strokeWidth="0.8" opacity="0.3" />
            </g>
          </svg>
          <div className="closing-dust">{dust.map((particle, index) => (
            <i key={index} style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size }} />
          ))}</div>
        </div>
        <h2 ref={titleRef} id="closing-title" className="closing-title font-cinematic">
          <span className="closing-ivory">THANK</span>{" "}<span className="closing-gold">YOU</span>
        </h2>
      </div>
    </section>
  );
}
