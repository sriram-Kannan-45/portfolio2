"use client";

import React, { useEffect, useRef } from "react";

interface Spark {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
  history: { x: number; y: number }[];
  jitterFreq: number;
  jitterAmp: number;
  branch: boolean;
}

const SPARK_PALETTES = [
  { color: "#34d399", glow: "rgba(16, 185, 129, 0.7)" }, // Electric Emerald
  { color: "#38bdf8", glow: "rgba(14, 165, 233, 0.7)" }, // High-voltage Cyan
  { color: "#fef08a", glow: "rgba(234, 179, 8, 0.6)" },   // Gold Plasma Filament
  { color: "#f8fafc", glow: "rgba(94, 234, 212, 0.8)" },  // Ionized White Core
];

export default function ElectricSparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Pool of reusable spark objects (0 allocation during scroll animation)
    const isMobile = width < 768;
    const POOL_SIZE = isMobile ? 22 : 38;

    const pool: Spark[] = Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 1.5,
      color: "#34d399",
      glowColor: "rgba(16, 185, 129, 0.7)",
      life: 0,
      maxLife: 45,
      history: [],
      jitterFreq: 0.25,
      jitterAmp: 1.2,
      branch: false,
    }));

    let lastScrollY = window.scrollY;
    let scrollAccumulator = 0;
    let isLoopRunning = false;
    let rafId: number | null = null;
    let lastTime = 0;

    const spawnSpark = (dir: number) => {
      // Find inactive spark in pool
      const spark = pool.find((s) => !s.active);
      if (!spark) return;

      const palette = SPARK_PALETTES[Math.floor(Math.random() * SPARK_PALETTES.length)];
      spark.active = true;
      spark.color = palette.color;
      spark.glowColor = palette.glow;

      // Position: horizontally distributed across the viewport width
      spark.x = Math.random() * width;

      // Position: vertically aligned with the motion direction
      // When scrolling down (dir > 0), sparks emerge from the lower half and travel upward
      // When scrolling up (dir < 0), sparks emerge from the upper half and travel downward
      if (dir > 0) {
        spark.y = height * (0.4 + Math.random() * 0.55);
        spark.vy = -(Math.random() * 2.6 + 1.2);
      } else {
        spark.y = height * (0.05 + Math.random() * 0.55);
        spark.vy = Math.random() * 2.6 + 1.2;
      }

      spark.vx = (Math.random() - 0.5) * 1.4;
      spark.size = Math.random() * 1.4 + 1.2; // 1.2px - 2.6px subtle size
      spark.life = 0;
      spark.maxLife = Math.floor(Math.random() * 25 + 35); // 35 - 60 frames (~600ms - 1000ms)
      spark.jitterFreq = Math.random() * 0.3 + 0.15;
      spark.jitterAmp = Math.random() * 1.8 + 0.8;
      spark.branch = Math.random() < 0.15; // occasional electric micro-branch
      spark.history = [{ x: spark.x, y: spark.y }];
    };

    const render = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;

      for (let i = 0; i < pool.length; i++) {
        const spark = pool[i];
        if (!spark.active) continue;

        activeCount++;
        spark.life++;

        if (spark.life >= spark.maxLife) {
          spark.active = false;
          spark.history = [];
          continue;
        }

        // Natural smooth fade envelope (in -> hold -> out)
        const progress = spark.life / spark.maxLife;
        let alpha = 0;
        if (progress < 0.18) {
          alpha = (progress / 0.18) * 0.65;
        } else if (progress < 0.6) {
          alpha = 0.65;
        } else {
          alpha = ((1 - progress) / 0.4) * 0.65;
        }

        // Electric micro-jitter along perpendicular axis
        const jitter = Math.sin(spark.life * spark.jitterFreq) * spark.jitterAmp;
        spark.x += spark.vx + jitter * 0.5;
        spark.y += spark.vy;

        // Maintain small kinetic trail (last 3-4 positions)
        spark.history.unshift({ x: spark.x, y: spark.y });
        if (spark.history.length > 4) {
          spark.history.pop();
        }

        // Render subtle glowing electric trail and spark head
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowColor = spark.glowColor;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = spark.color;
        ctx.fillStyle = spark.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Kinetic electric stream
        if (spark.history.length > 1) {
          ctx.lineWidth = Math.max(0.7, spark.size * 0.6);
          ctx.beginPath();
          ctx.moveTo(spark.history[0].x, spark.history[0].y);
          for (let j = 1; j < spark.history.length; j++) {
            ctx.lineTo(spark.history[j].x, spark.history[j].y);
          }
          ctx.stroke();

          // Occasional micro electric branch
          if (spark.branch && spark.life % 4 === 0) {
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(spark.x, spark.y);
            ctx.lineTo(
              spark.x + (Math.random() - 0.5) * 12,
              spark.y + (Math.random() - 0.5) * 10
            );
            ctx.stroke();
          }
        }

        // Glowing spark head
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // If active particles exist, keep loop alive
      if (activeCount > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
        rafId = null;
        lastTime = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const startLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    };

    // Scroll listener: detects section transitions and spawns synchronized sparks
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      const absDelta = Math.abs(delta);
      if (absDelta < 0.5) return;

      const dir = delta > 0 ? 1 : -1;
      scrollAccumulator += absDelta;

      // Spawn 1 spark every ~32px of scroll movement (matches KEY_SINGLE_STEP)
      const SPARK_SCROLL_INTERVAL = 32;
      while (scrollAccumulator >= SPARK_SCROLL_INTERVAL) {
        scrollAccumulator -= SPARK_SCROLL_INTERVAL;
        spawnSpark(dir);
      }

      startLoop();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{
        contain: "strict",
      }}
      aria-hidden="true"
    />
  );
}
