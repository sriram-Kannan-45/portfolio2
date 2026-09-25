"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating geometric polyhedron with clamped delta and subtle rotation
function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (meshRef.current) {
      meshRef.current.rotation.x += clampedDelta * 0.15;
      meshRef.current.rotation.y += clampedDelta * 0.2;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += clampedDelta * 0.15;
      wireframeRef.current.rotation.y += clampedDelta * 0.2;
    }
  });

  return (
    <group position={[3.2, 0, -2]}>
      {/* Subtle translucent dark mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#101018"
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Titanium Wireframe Outline */}
      <lineSegments ref={wireframeRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.605, 0)]} />
        <lineBasicMaterial color="#4ade80" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

// Second smaller secondary floating polyhedral node
function SecondaryNode() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (groupRef.current) {
      groupRef.current.rotation.y -= clampedDelta * 0.18;
      groupRef.current.rotation.z += clampedDelta * 0.12;
      groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[-3.5, -1.5, -3]}>
      <mesh>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#0c0d12"
          roughness={0.3}
          metalness={0.85}
          transparent
          opacity={0.6}
        />
      </mesh>
      <lineSegments>
        <wireframeGeometry args={[new THREE.OctahedronGeometry(1.105, 0)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// Restrained ambient dust particles (subtle 3D depth, no clutter)
function SubtleDepthParticles() {
  const count = 45;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    if (pointsRef.current) {
      pointsRef.current.rotation.y += clampedDelta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d1d5db"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Interactive pointer light - updates only when pointer position actually changes
function MouseTrackerLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const prevPosRef = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    if (!lightRef.current) return;
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

export default function ThreeCanvas() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", motionHandler);

    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mq.removeEventListener("change", motionHandler);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (prefersReducedMotion || !isTabVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-40 mix-blend-screen"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: false, // Save fillrate and MSAA memory bandwidth
          alpha: true,
          powerPreference: "default",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.25]} // Cap DPR to prevent fillrate bottleneck on high-DPI displays
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <MouseTrackerLight />
        <FloatingGeometry />
        <SecondaryNode />
        <SubtleDepthParticles />
      </Canvas>
    </div>
  );
}
