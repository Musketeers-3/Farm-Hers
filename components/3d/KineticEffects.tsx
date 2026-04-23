"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

export default function KineticEffects() {
  const { gl } = useThree();

  // 🛑 HARD GUARD: Prevent crash if WebGL context is invalid
  if (!gl || !gl.getContext()) {
    console.warn("Skipping postprocessing: WebGL not available");
    return null;
  }

  // Optional: detect WebGL2 (postprocessing works best here)
  const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

  // If not WebGL2 → disable heavy effects
  if (!isWebGL2) {
    return null; // safest fallback
  }

  const chromaOffset = useRef(new THREE.Vector2(0.002, 0.002));

  const state = useRef({
    lastScrollY: typeof window !== "undefined" ? window.scrollY : 0,
    velocity: 0,
  });

  useFrame(() => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - state.current.lastScrollY;
    state.current.lastScrollY = currentScrollY;

    state.current.velocity = THREE.MathUtils.lerp(
      state.current.velocity,
      scrollDelta,
      0.1
    );

    const kineticMultiplier = state.current.velocity * 0.0003;
    const finalOffset = 0.002 + Math.abs(kineticMultiplier);

    chromaOffset.current.set(finalOffset, finalOffset);
  });

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={1.2}
        luminanceSmoothing={0.1}
        intensity={2.0}
        mipmapBlur
      />

      {/* @ts-expect-error known lib typing issue */}
      <ChromaticAberration
        offset={chromaOffset.current}
        radialModulation
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}
