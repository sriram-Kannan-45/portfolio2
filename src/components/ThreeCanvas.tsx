"use client";

import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Mobile detection hook for dynamic window resize & orientation
// ---------------------------------------------------------------------------
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          (("ontouchstart" in window || (navigator.maxTouchPoints > 0)) &&
            window.innerWidth < 1024)
      );
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    window.addEventListener("orientationchange", check, { passive: true });
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return isMobile;
}

// ---------------------------------------------------------------------------
// Shared scroll state - updated via passive listener, 0 React re-renders
// ---------------------------------------------------------------------------
const scrollState = {
  progress: 0,
  scrollY: 0,
};

if (typeof window !== "undefined") {
  let cachedMaxScroll = 1;
  const updateMaxScroll = () => {
    const docH = document.documentElement ? document.documentElement.scrollHeight : 0;
    const bodyH = document.body ? document.body.scrollHeight : 0;
    cachedMaxScroll = Math.max(1, Math.max(docH, bodyH) - window.innerHeight);
  };

  const onScroll = () => {
    scrollState.scrollY = window.scrollY;
    scrollState.progress = Math.min(1, Math.max(0, window.scrollY / cachedMaxScroll));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateMaxScroll, { passive: true });
  window.addEventListener("orientationchange", updateMaxScroll, { passive: true });
  window.addEventListener("videoScrolledChange", updateMaxScroll, { passive: true });

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(updateMaxScroll);
    if (document.documentElement) ro.observe(document.documentElement);
  }

  if (document.readyState === "complete") {
    updateMaxScroll();
  } else {
    window.addEventListener("load", updateMaxScroll, { once: true });
  }
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
// Dynamically adjusts scale & position inside mobile viewport bounds
// ---------------------------------------------------------------------------
function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const smoothedScrollRef = useRef<number>(0);
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;

  // On desktop: position [3.2, 0, -2], scale 1.0
  // On mobile: position inside visible bounds so 3D objects never clip or leave screen
  const posX = isMobile ? Math.min(viewport.width * 0.28, 0.75) : 3.2;
  const posYBase = isMobile ? 0.2 : 0;
  const posZ = isMobile ? -1.5 : -2;
  const geomScale = isMobile ? 0.52 : 1;

  useFrame((state, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    // Smooth responsive damping towards target scroll progress (0-1)
    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      Math.min(1, d * 4.5)
    );
    const sp = smoothedScrollRef.current;

    // Synchronized scroll rotation + gentle ambient idle drift (bounded, no runaway)
    const ambientX = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    const ambientY = state.clock.elapsedTime * 0.05;
    const rotX = ambientX + sp * Math.PI * 0.7;
    const rotY = ambientY + sp * Math.PI * 1.2;
    const posY = posYBase - sp * (isMobile ? 1.0 : 1.8);

    if (meshRef.current) {
      meshRef.current.rotation.x = rotX;
      meshRef.current.rotation.y = rotY;
      meshRef.current.position.y = posY;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = rotX;
      wireframeRef.current.rotation.y = rotY;
      wireframeRef.current.position.y = posY;
    }
  });

  return (
    <group position={[posX, posYBase, posZ]} scale={geomScale}>
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
// Scaled and framed within mobile boundaries
// ---------------------------------------------------------------------------
function SecondaryNode() {
  const groupRef = useRef<THREE.Group>(null);
  const smoothedScrollRef = useRef<number>(0);
  const { viewport, size } = useThree();
  const isMobile = size.width < 768;

  const baseX = isMobile ? -Math.min(viewport.width * 0.26, 0.7) : -3.5;
  const baseY = isMobile ? -1.0 : -1.5;
  const baseZ = isMobile ? -1.8 : -3;
  const geomScale = isMobile ? 0.48 : 1;

  useFrame((state, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      Math.min(1, d * 4.5)
    );
    const sp = smoothedScrollRef.current;

    if (groupRef.current) {
      const ambientY = -state.clock.elapsedTime * 0.05;
      const rotY = ambientY - sp * Math.PI * 0.85;
      const rotZ = Math.sin(state.clock.elapsedTime * 0.4) * 0.05 + sp * 0.3;

      groupRef.current.rotation.y = rotY;
      groupRef.current.rotation.z = rotZ;
      groupRef.current.position.y =
        baseY +
        Math.sin(state.clock.elapsedTime * 0.6) * (isMobile ? 0.08 : 0.14) +
        sp * (isMobile ? 0.6 : 1.1);
      groupRef.current.position.x = baseX + sp * (isMobile ? 0.2 : 0.45);
    }
  });

  return (
    <group ref={groupRef} position={[baseX, baseY, baseZ]} scale={geomScale}>
      <mesh geometry={octaGeo} material={octaMat} />
      <lineSegments geometry={octaWireframeGeo} material={octaWireMat} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// SubtleDepthParticles - Z-depth drift on scroll for enhanced spatial depth
// Reduced particle count on mobile for low GPU overhead
// ---------------------------------------------------------------------------
function SubtleDepthParticles() {
  const { size } = useThree();
  const isMobile = size.width < 768;
  const count = isMobile ? 20 : 45;
  const pointsRef = useRef<THREE.Points>(null);
  const smoothedScrollRef = useRef<number>(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const spreadX = isMobile ? 8 : 16;
    const spreadY = isMobile ? 10 : 12;
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spreadX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count, isMobile]);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      Math.min(1, d * 4.5)
    );
    const sp = smoothedScrollRef.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = sp * 0.4;
      pointsRef.current.position.z = sp * (isMobile ? 1.2 : 1.8);
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={pointsMat} />;
}

// ---------------------------------------------------------------------------
// ScrollCameraController - Subtle camera tilt and dolly tied to scroll
// ---------------------------------------------------------------------------
function ScrollCameraController() {
  const { camera, size } = useThree();
  const smoothedScrollRef = useRef<number>(0);
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (document.hidden) return;
    const d = Math.min(delta, 0.05);

    smoothedScrollRef.current = THREE.MathUtils.lerp(
      smoothedScrollRef.current,
      scrollState.progress,
      Math.min(1, d * 4.5)
    );
    const sp = smoothedScrollRef.current;

    camera.position.y = -sp * (isMobile ? 0.3 : 0.55);
    camera.position.z = (isMobile ? 5.8 : 6.0) + sp * (isMobile ? 0.25 : 0.35);
  });

  return null;
}

// ---------------------------------------------------------------------------
// MouseTrackerLight - Updates only when pointer moves significantly
// ---------------------------------------------------------------------------
function MouseTrackerLight({ isMobile }: { isMobile: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const prevPosRef = useRef({ x: 0, y: 0 });

  if (isMobile) return null;

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
export default function ThreeCanvas({ active = true }: { active?: boolean }) {
  const isMobile = useIsMobile();
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
  const dprRange: [number, number] = isMobile ? [1, 1] : [1, 1.5];

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
          powerPreference: isMobile ? "default" : "high-performance",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={dprRange}
        frameloop={active ? "always" : "never"}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <MouseTrackerLight isMobile={isMobile} />
        <ScrollCameraController />
        <FloatingGeometry />
        <SecondaryNode />
        <SubtleDepthParticles />
      </Canvas>
    </div>
  );
}
