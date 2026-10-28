"use client";

import { useEffect, useId, useMemo, useRef, useSyncExternalStore } from "react";
import { createNeuralGraph, findNetworkHit, propagateNetwork } from "@/lib/neuralNetwork";

const subscribeViewport = (notify: () => void) => {
  window.addEventListener("resize", notify, { passive: true });
  return () => window.removeEventListener("resize", notify);
};
const getViewport = () => `${window.innerWidth},${window.innerHeight}`;
const getServerViewport = () => "1600,900";
const SIGNAL_SPEED = 220;

export default function NeuralNetworkBackground({ active = false }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewport = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  const [width, height] = viewport.split(",").map(Number);
  const graph = useMemo(() => createNeuralGraph(width, height), [width, height]);
  const id = useId().replace(/:/g, "");
  const glowId = `${id}-neuron-glow`;

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const paths = Array.from(container.querySelectorAll<SVGPathElement>(".neural-network-signal"));
    const neurons = Array.from(container.querySelectorAll<SVGGElement>(".neural-network-neuron"));
    const origin = container.querySelector<SVGGElement>(".neural-network-origin");
    let touch: { x: number; y: number; scroll: number; time: number; id: number } | null = null;
    let lastHover = { x: -999, y: -999, time: -999 };

    const stop = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      touch = null;
    };
    const animate = (element: Element | null | undefined, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!element) return;
      element.getAnimations().forEach((animation) => animation.cancel());
      const animation = element.animate(frames, options);
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    };
    const pulsePath = (edge: number, reverse: boolean, from: number, to: number, delay: number, intensity: number) => {
      animate(paths[edge * 2 + (reverse ? 1 : 0)], [
        { strokeDashoffset: -from, opacity: 0, offset: 0 },
        { strokeDashoffset: -(from + (to - from) * 0.12), opacity: intensity, offset: 0.12 },
        { strokeDashoffset: -(from + (to - from) * 0.8), opacity: intensity * 0.85, offset: 0.8 },
        { strokeDashoffset: -to, opacity: 0, offset: 1 },
      ], {
        duration: Math.max(120, Math.abs(to - from) * graph.edges[edge].length / SIGNAL_SPEED * 1000),
        delay: delay / SIGNAL_SPEED * 1000,
        easing: "linear",
      });
    };

    const interact = (event: PointerEvent, hover = false) => {
      if (document.hidden || motion.matches || !origin) return;
      if (event.target instanceof Element && event.target.closest("a, button, input, textarea, select, [contenteditable], header, footer")) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) * width / rect.width;
      const y = (event.clientY - rect.top) * height / rect.height;
      const now = performance.now();
      if (hover && (now - lastHover.time < 650 || Math.hypot(x - lastHover.x, y - lastHover.y) < 55)) return;
      const hit = findNetworkHit(graph, x, y, hover ? 24 : 42);
      if (!hit) return;
      lastHover = { x, y, time: now };
      const reach = width < 768 ? 240 : 380;
      const propagation = propagateNetwork(graph, hit, reach);

      // Begin at the touched branch, splitting the signal in both directions.
      origin.setAttribute("transform", `translate(${hit.x} ${hit.y})`);
      animate(origin.querySelector(".neural-network-touch-glow"), [
        { opacity: 0.9, transform: "scale(0.5)" },
        { opacity: 0, transform: "scale(2.4)" },
      ], { duration: 650, easing: "ease-out" });
      pulsePath(hit.edge, false, hit.t, 1, 0, 1);
      pulsePath(hit.edge, true, hit.t, 0, 0, 1);
      propagation.routes.forEach((route) => {
        const forward = graph.edges[route.edge].from === route.from;
        pulsePath(route.edge, !forward, forward ? 0 : 1, forward ? 1 : 0, route.delay, 0.95 * (1 - route.delay / (reach * 1.25)));
      });
      propagation.distances.forEach((distance, node) => {
        if (distance > reach) return;
        animate(neurons[node], [{ opacity: 0.65 }, { opacity: 1, offset: 0.2 }, { opacity: 0.65 }], {
          delay: distance / SIGNAL_SPEED * 1000,
          duration: 650,
          easing: "ease-out",
        });
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touch = { x: event.clientX, y: event.clientY, scroll: window.scrollY, time: performance.now(), id: event.pointerId };
      } else if (event.button === 0) {
        interact(event);
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.buttons === 0) interact(event, true);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (touch && event.pointerId === touch.id && performance.now() - touch.time < 450 &&
        Math.hypot(event.clientX - touch.x, event.clientY - touch.y) < 10 && Math.abs(window.scrollY - touch.scroll) < 6) interact(event);
      touch = null;
    };
    const onPointerCancel = () => { touch = null; };
    const onVisibilityChange = () => { if (document.hidden) stop(); };

    // Observe input passively; the visual layer never blocks links or scrolling.
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motion.addEventListener("change", stop);
    return () => {
      stop();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motion.removeEventListener("change", stop);
    };
  }, [active, graph, width, height]);

  return (
    <div ref={containerRef} className="neural-network-background" data-active={active} aria-hidden="true">
      <div className="neural-network-aura" />
      <svg className="neural-network-graph" viewBox={`0 0 ${width} ${height}`} focusable="false">
        <defs>
          <radialGradient id={glowId}>
            <stop stopColor="#b5f7df" stopOpacity="0.6" />
            <stop offset="0.2" stopColor="#64d9b4" stopOpacity="0.24" />
            <stop offset="0.55" stopColor="#34d399" stopOpacity="0.06" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="neural-network-dendrites" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {graph.dendrites.map((path, level) => <path key={level} className={`neural-network-dendrite-${level}`} d={path} />)}
        </g>
        <g className="neural-network-connections" fill="none">
          {graph.edges.map((edge, index) => <path key={index} d={edge.path} />)}
        </g>
        <g fill="none">
          {graph.edges.map((edge, index) => (
            <g key={index}>
              <path className="neural-network-signal" d={edge.path} pathLength="1" />
              <path className="neural-network-signal" d={edge.path} pathLength="1" />
            </g>
          ))}
        </g>
        {graph.nodes.map((node, index) => (
          <g key={index} className="neural-network-neuron">
            <circle cx={node.x} cy={node.y} r={node.radius * 5.5} fill={`url(#${glowId})`} />
            <path className="neural-network-body" d={node.body} />
            <circle className="neural-network-core" cx={node.x} cy={node.y} r={node.radius * 0.3} />
          </g>
        ))}
        <g className="neural-network-origin" transform="translate(-100 -100)">
          <circle className="neural-network-touch-glow" r="24" fill={`url(#${glowId})`} />
        </g>
      </svg>
    </div>
  );
}
