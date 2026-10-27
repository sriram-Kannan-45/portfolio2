"use client";

import { useEffect, useId, useRef } from "react";

function SmokeCloud({ secondary = false }: { secondary?: boolean }) {
  const id = useId().replace(/:/g, "");
  const noise = `${id}-noise`;
  const fade = `${id}-fade`;
  const mask = `${id}-mask`;

  return (
    <svg
      className={`portfolio-smoke-cloud ${secondary ? "portfolio-smoke-secondary" : "portfolio-smoke-primary"}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <defs>
        {/* Match the warm, textured smoke in the closing Thank You scene. */}
        <filter id={noise} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="3" seed={secondary ? 8 : 12} result="cloud" />
          <feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="2" seed={secondary ? 12 : 8} result="flow" />
          <feDisplacementMap in="cloud" in2="flow" scale="110" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.60  0 0 0 0 0.53  0 0 0 0 0.39  0 0 0 0.85 -0.32" />
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={fade}>
          <stop offset="0" stopColor="white" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="white" stopOpacity="0.35" />
          <stop offset="1" stopColor="black" />
        </radialGradient>
        <mask id={mask}>
          <ellipse cx="800" cy="440" rx="760" ry="420" fill={`url(#${fade})`} />
        </mask>
      </defs>
      <g mask={`url(#${mask})`}>
        <rect width="1600" height="900" filter={`url(#${noise})`} />
      </g>
    </svg>
  );
}

export default function SmokeBackground({ active = false }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibility = () => {
      if (containerRef.current) {
        containerRef.current.dataset.paused = String(document.hidden);
      }
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return (
    <div ref={containerRef} className="portfolio-smoke" data-active={active} aria-hidden="true">
      <div className="portfolio-smoke-haze" />
      <SmokeCloud />
      <SmokeCloud secondary />
      <div className="portfolio-smoke-wisp" />
    </div>
  );
}
