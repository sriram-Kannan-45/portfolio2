"use client";

import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Mobile detection - module level to avoid per-render checks
// ---------------------------------------------------------------------------
const isMobileDevice =
  typeof window !== "undefined" &&
  (window.innerWidth < 768 ||
    (("ontouchstart" in window || (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)) &&
      window.innerWidth < 1024));

// ---------------------------------------------------------------------------
// Shared scroll state - updated via passive listener, 0 React re-renders
// ---------------------------------------------------------------------------
const scrollState = {
  progress: 0,
  scrollY: 0,
};

if (typeof window !== "undefined") {
  const onScroll = () => {
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    scrollState.scrollY = window.scrollY;
    scrollState.progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---------------------------------------------------------------------------
// Pre-allocate geometries & materials OUTSIDE components
// Avoid any object/geometry/material allocations inside render or animation loops
// ---------------------------------------------------------------------------
const icosaGeo = new THREE.IcosahedronGeometry(1.6, 0);
const icosaWireGeo = new THREE.IcosahedronGeometry(1.605, 0);
const icosaWireframeGeo = new THREE.WireframeGeometry(icosaWireGeo);

const octaGeo = new THREE.OctahedronGeometry(1.1, 0);
const octaWireGeo = new THREE.OctahedronGeometry(1.105, 0);
const octaWireframeGeo = new THREE.WireframeGeometry(octaWireGeo);

// Shared materials - created once, reused everywhere
const icosaMat = new THREE.MeshStandardMaterial({
  color: "#101018",
  roughness: 0.2,
  metalness: 0.9,
  transparent: true,
  opacity: 0.7,
});

const icosaWireMat = new THREE.LineBasicMaterial({
  color: "#4ade80",
  transparent: true,
  opacity: 0.35,
});

const octaMat = new THREE.MeshStandardMaterial({
  color: "#0c0d12",
  roughness: 0.3,
  metalness: 0.85,
  transparent: true,
  opacity: 0.6,
});

const octaWireMat = new THREE.LineBasicMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.25,
});

const pointsMat = new THREE.PointsMaterial({
  size: 0.035,
  color: "#d1d5db",
  transparent: true,
  opacity: 0.3,
  sizeAttenuation: true,
});

// ---------------------------------------------------------------------------
// FloatingGeometry - Smooth scroll-damped rotation and vertical parallax
// ---------------------------------------------------------------------------
function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const smoothedScrollRef = useRef<number>(0);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    // Smooth lerp damping towards target scroll
    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      d * 3.5
    );
    const sp = smoothedScrollRef.current;

    // Fluid base rotation + scroll momentum
    const rotStepX = d * (0.15 + sp * 0.35);
    const rotStepY = d * (0.2 + sp * 0.45);
    const posY = -sp * 2.5;

    if (meshRef.current) {
      meshRef.current.rotation.x += rotStepX;
      meshRef.current.rotation.y += rotStepY;
      meshRef.current.position.y = posY;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += rotStepX;
      wireframeRef.current.rotation.y += rotStepY;
      wireframeRef.current.position.y = posY;
    }
  });

  return (
    <group position={[3.2, 0, -2]}>
      <mesh ref={meshRef} geometry={icosaGeo} material={icosaMat} />
      <lineSegments
        ref={wireframeRef}
        geometry={icosaWireframeGeo}
        material={icosaWireMat}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// SecondaryNode - Counter-parallax and bobbing
// ---------------------------------------------------------------------------
function SecondaryNode() {
  const groupRef = useRef<THREE.Group>(null);
  const smoothedScrollRef = useRef<number>(0);

  useFrame((state, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      d * 3.0
    );
    const sp = smoothedScrollRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y -= d * (0.18 + sp * 0.25);
      groupRef.current.rotation.z += d * 0.12;
      groupRef.current.position.y =
        -1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2 + sp * 1.5;
      groupRef.current.position.x = -3.5 + sp * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[-3.5, -1.5, -3]}>
      <mesh geometry={octaGeo} material={octaMat} />
      <lineSegments geometry={octaWireframeGeo} material={octaWireMat} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// SubtleDepthParticles - Z-depth drift on scroll for enhanced spatial depth
// ---------------------------------------------------------------------------
function SubtleDepthParticles() {
  const count = isMobileDevice ? 25 : 45;
  const pointsRef = useRef<THREE.Points>(null);
  const smoothedScrollRef = useRef<number>(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      d * 2.5
    );
    const sp = smoothedScrollRef.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += d * 0.02;
      pointsRef.current.position.z = sp * 2.0;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={pointsMat} />;
}

// ---------------------------------------------------------------------------
// ScrollCameraController - Subtle camera tilt and dolly tied to scroll
// ---------------------------------------------------------------------------
function ScrollCameraController() {
  const { camera } = useThree();
  const smoothedScrollRef = useRef<number>(0);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      d * 2.8
    );
    const sp = smoothedScrollRef.current;

    camera.position.y = -sp * 0.7;
    camera.position.z = 6 + sp * 0.4;
  });

  return null;
}

// ---------------------------------------------------------------------------
// MouseTrackerLight - Updates only when pointer moves significantly
// ---------------------------------------------------------------------------
function MouseTrackerLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const prevPosRef = useRef({ x: 0, y: 0 });

  if (isMobileDevice) return null;

  useFrame(({ pointer }) => {
    if (document.hidden || !lightRef.current) return;
    const dx = Math.abs(pointer.x - prevPosRef.current.x);
    const dy = Math.abs(pointer.y - prevPosRef.current.y);
    if (dx > 0.005 || dy > 0.005) {
      prevPosRef.current.x = pointer.x;
      prevPosRef.current.y = pointer.y;
      lightRef.current.position.x = pointer.x * 4;
      lightRef.current.position.y = pointer.y * 3;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 3]}
      intensity={1.2}
      color="#16a34a"
      distance={8}
      decay={2}
    />
  );
}

// ---------------------------------------------------------------------------
// ThreeCanvas Component
// ---------------------------------------------------------------------------
export default function ThreeCanvas() {
  const prefersReducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReducedMotionChange = useCallback((e: MediaQueryListEvent) => {
    prefersReducedMotionRef.current = e.matches;
    if (containerRef.current) {
      containerRef.current.style.display = e.matches ? "none" : "";
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", handleReducedMotionChange);
    if (containerRef.current && mq.matches) {
      containerRef.current.style.display = "none";
    }
    return () => mq.removeEventListener("change", handleReducedMotionChange);
  }, [handleReducedMotionChange]);

  if (prefersReducedMotionRef.current) {
    return null;
  }

  // Device pixel ratio capped to prevent high-DPI fillrate bottlenecks:
  // Desktop max 1.5, Mobile max 1.0
  const dprRange: [number, number] = isMobileDevice ? [1, 1] : [1, 1.5];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-35"
      aria-hidden="true"
      style={{ contain: "strict" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: isMobileDevice ? "default" : "high-performance",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={dprRange}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        {!isMobileDevice && <MouseTrackerLight />}
        <ScrollCameraController />
        <FloatingGeometry />
        <SecondaryNode />
        <SubtleDepthParticles />
      </Canvas>
    </div>
  );
}
