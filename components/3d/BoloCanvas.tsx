"use client";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import GlassOrb from "./GlassOrb";
import KineticEffects from "./KineticEffects";

// Small utility to detect WebGL support safely
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function BoloCanvas() {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWebgl(hasWebGL());
  }, []);

  // 🔒 HARD GUARD: Prevent rendering if WebGL not available
  if (!mounted || !webgl) {
    return null; // you can replace with fallback UI if needed
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      // ⚡ Stabilized GL config
      gl={{
        antialias: false,
        alpha: true, // 👈 prevents "alpha of null" crash in some environments
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]} // 👈 prevents GPU overload on high DPI screens
      onCreated={({ gl }) => {
        // Extra safety: avoid null renderer edge-case
        if (!gl) {
          console.warn("WebGL context not available");
        }
      }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        color="#22c55e"
      />

      <Environment preset="city" />

      <GlassOrb />

      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.6}
        scale={15}
        blur={2.5}
        far={4}
        color="#15803d"
      />

      <KineticEffects />
    </Canvas>
  );
}
