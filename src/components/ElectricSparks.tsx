"use client";

import React, { useEffect, useRef } from "react";

interface Spark {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  coreColor: string;
  glowColor: string;
  mainColor: string;
  life: number;
  maxLife: number;
  history: { x: number; y: number }[];
  seed: number;
  jitterFreq: number;
  jitterAmp: number;
  branch: boolean;
  branchOffset: { x: number; y: number };
}

const SPARK_PALETTES = [
  {
    core: "#ffffff",
    main: "#34d399", // Neon Emerald
    glow: "rgba(52, 211, 153, 0.95)",
  },
  {
    core: "#ffffff",
    main: "#38bdf8", // Electric Cyan
    glow: "rgba(56, 189, 248, 0.95)",
  },
  {
    core: "#ffffff",
    main: "#6ee7b7", // Mint Plasma
    glow: "rgba(110, 231, 183, 0.9)",
  },
  {
    core: "#ffffff",
    main: "#fbbf24", // Golden Arc Filament
    glow: "rgba(251, 191, 36, 0.9)",
  },
];

export default function ElectricSparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honor accessibility preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    updateDimensions();

    window.addEventListener("resize", updateDimensions, { passive: true });

    // Pool of pre-allocated spark objects (0 garbage collection during scroll animations)
    const isMobile = window.innerWidth < 768;
    const POOL_SIZE = isMobile ? 28 : 52;

    const pool: Spark[] = Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 3,
      coreColor: "#ffffff",
      glowColor: "rgba(52, 211, 153, 0.95)",
      mainColor: "#34d399",
      life: 0,
      maxLife: 45,
      history: [],
      seed: Math.random() * 100,
      jitterFreq: 0.35,
      jitterAmp: 2.2,
      branch: false,
      branchOffset: { x: 0, y: 0 },
    }));

    let lastScrollY = window.scrollY;
    let isLoopRunning = false;
    let rafId: number | null = null;
    let idleFrames = 0;

    const spawnSpark = (dir: number) => {
      const spark = pool.find((s) => !s.active);
      if (!spark) return;

      const palette = SPARK_PALETTES[Math.floor(Math.random() * SPARK_PALETTES.length)];
      spark.active = true;
      spark.coreColor = palette.core;
      spark.mainColor = palette.main;
      spark.glowColor = palette.glow;

      // Distributed across screen width with slight center clustering
      const margin = width * 0.05;
      spark.x = margin + Math.random() * (width - margin * 2);

      // Vertical spawn point aligned with motion direction:
      // Scrolling DOWN (dir > 0): sparks spawn in lower screen half and surge upward
      // Scrolling UP (dir < 0): sparks spawn in upper screen half and surge downward
      if (dir > 0) {
        spark.y = height * (0.45 + Math.random() * 0.5);
        spark.vy = -(Math.random() * 3.5 + 2.0);
      } else {
        spark.y = height * (0.05 + Math.random() * 0.5);
        spark.vy = Math.random() * 3.5 + 2.0;
      }

      spark.vx = (Math.random() - 0.5) * 2.2;
      spark.size = Math.random() * 2.0 + 2.2; // 2.2px - 4.2px luminous head
      spark.life = 0;
      spark.maxLife = Math.floor(Math.random() * 20 + 35); // 35 - 55 frames (~600ms - 900ms)
      spark.seed = Math.random() * 100;
      spark.jitterFreq = Math.random() * 0.4 + 0.25;
      spark.jitterAmp = Math.random() * 2.5 + 1.2;
      spark.branch = Math.random() < 0.22; // 22% chance of micro lightning branch
      spark.branchOffset = {
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 14,
      };
      spark.history = [{ x: spark.x, y: spark.y }];
    };

    const render = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Spawn sparks proportionally when scrolling
      const absDelta = Math.abs(scrollDelta);
      if (absDelta > 0.2) {
        idleFrames = 0;
        const dir = scrollDelta > 0 ? 1 : -1;
        // Spawn 1 to 2 sparks per active scroll frame
        const count = Math.min(3, Math.max(1, Math.round(absDelta / 8)));
        for (let i = 0; i < count; i++) {
          spawnSpark(dir);
        }
      } else {
        idleFrames++;
      }

      ctx.clearRect(0, 0, width, height);

      // Use additive blending for intense electric luminescence
      ctx.globalCompositeOperation = "lighter";

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

        // Luminous fade envelope: quick flare in, steady glow, graceful fade out
        const progress = spark.life / spark.maxLife;
        let alpha = 0;
        if (progress < 0.15) {
          alpha = (progress / 0.15) * 0.95;
        } else if (progress < 0.55) {
          alpha = 0.95;
        } else {
          alpha = ((1 - progress) / 0.45) * 0.95;
        }

        // Micro-electric perpendicular jitter simulation
        const jitter = Math.sin(spark.life * spark.jitterFreq + spark.seed) * spark.jitterAmp;
        spark.x += spark.vx + jitter * 0.6;
        spark.y += spark.vy;

        // Keep 5-6 points of historical trajectory for kinetic electric streamer
        spark.history.unshift({ x: spark.x, y: spark.y });
        if (spark.history.length > 6) {
          spark.history.pop();
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowColor = spark.glowColor;
        ctx.shadowBlur = 14;

        // 1. Draw Electric Kinetic Streamer Tail with subtle lightning jitter
        if (spark.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(spark.history[0].x, spark.history[0].y);
          for (let j = 1; j < spark.history.length; j++) {
            const pt = spark.history[j];
            const arcJitter = (Math.sin(j * 4.2 + spark.seed) - 0.5) * 1.8;
            ctx.lineTo(pt.x + arcJitter, pt.y);
          }
          ctx.strokeStyle = spark.mainColor;
          ctx.lineWidth = Math.max(1.0, spark.size * 0.7);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();

          // 2. Micro lightning arc branch
          if (spark.branch && spark.life > 6 && spark.life < spark.maxLife * 0.7) {
            ctx.beginPath();
            ctx.moveTo(spark.x, spark.y);
            const midX = spark.x + spark.branchOffset.x * 0.5 + (Math.random() - 0.5) * 4;
            const midY = spark.y + spark.branchOffset.y * 0.5;
            const endX = spark.x + spark.branchOffset.x;
            const endY = spark.y + spark.branchOffset.y;
            ctx.lineTo(midX, midY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = spark.coreColor;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // 3. Glowing Electric Spark Core
        // Outer colored glow aura
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = spark.mainColor;
        ctx.fill();

        // Hot white electric inner nucleus
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, Math.max(1.0, spark.size * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = spark.coreColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      // Keep RAF loop running while particles are active or user recently scrolled
      if (activeCount > 0 || idleFrames < 10) {
        rafId = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
        rafId = null;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const startLoop = () => {
      idleFrames = 0;
      if (!isLoopRunning) {
        isLoopRunning = true;
        rafId = requestAnimationFrame(render);
      }
    };

    const onScroll = () => {
      startLoop();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("videoScrolledChange", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("videoScrolledChange", onScroll);
      window.removeEventListener("resize", updateDimensions);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}
