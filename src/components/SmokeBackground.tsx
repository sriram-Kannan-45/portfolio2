"use client";

import React, { useEffect, useRef } from "react";

interface WhiteSmokeParticle {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  wobbleOffset: number;
  wobbleSpeed: number;
}

export default function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking for realistic smoke displacement
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 190,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Subtle atmospheric white smoke particle pool
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 16;
    const particles: WhiteSmokeParticle[] = [];

    const createParticle = (spawnRandomY = false): WhiteSmokeParticle => {
      const pRadius = 110 + Math.random() * 140;
      const maxLife = 400 + Math.random() * 450;

      return {
        x: Math.random() * width,
        y: spawnRandomY ? Math.random() * height : height + pRadius * 0.4,
        radius: pRadius * 0.6,
        maxRadius: pRadius,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.2 + Math.random() * 0.35),
        alpha: 0,
        // Delicate, soft, translucent ambient smoke (does not wash out the black background)
        targetAlpha: 0.02 + Math.random() * 0.025,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        life: spawnRandomY ? Math.random() * maxLife : 0,
        maxLife,
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.008,
      };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-init particles on resize
      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particles.push(createParticle(true));
        }
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Update and draw each white smoke puff
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt * 60;

        // Smooth fade-in, sustain, and dissipation
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.targetAlpha;
        } else if (progress > 0.65) {
          p.alpha = ((1 - progress) / 0.35) * p.targetAlpha;
        } else {
          p.alpha = p.targetAlpha;
        }

        // Expansion of smoke puff as it rises
        if (p.radius < p.maxRadius) {
          p.radius += 0.18;
        }

        // Natural swirling harmonic drift
        const wobble = Math.sin(time * p.wobbleSpeed * 0.05 + p.wobbleOffset) * 0.45;
        p.x += (p.vx + wobble) * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.rotation += p.rotationSpeed * (dt * 60);

        // Interactive mouse curl
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 0.85;
          p.x += (dx / dist) * force * 3.2;
          p.y += (dy / dist) * force * 3.2;
          p.rotation += (p.vx > 0 ? 0.012 : -0.012) * force;
        }

        // Draw pure white volumetric smoke radial gradient
        if (p.alpha > 0.001) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
          // Subtle, delicate white & silver vapor falloff
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.65})`);
          grad.addColorStop(0.3, `rgba(245, 248, 255, ${p.alpha * 0.35})`);
          grad.addColorStop(0.65, `rgba(235, 240, 250, ${p.alpha * 0.12})`);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Respawn when life expires or moves past screen top
        if (p.life >= p.maxLife || p.y < -p.radius) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-65"
      aria-hidden="true"
    >
      {/* Pure White Procedural Smoke Canvas over deep black background */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
