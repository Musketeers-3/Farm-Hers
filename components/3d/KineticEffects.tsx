"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

export default function KineticEffects() {
  const { gl } = useThree();
  const scroll = useScroll();

  // WebGL2 guard — postprocessing is unstable on WebGL1
  const ctx = gl?.getContext?.();
  const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && ctx instanceof WebGL2RenderingContext;
  if (!ctx || !isWebGL2) return null;

  const chromaOffset = useRef(new THREE.Vector2(0.0015, 0.0015));
  const lastOffset = useRef(0);

  useFrame(() => {
    const delta = scroll.offset - lastOffset.current;
    lastOffset.current = scroll.offset;
    const velocity = Math.min(Math.abs(delta) * 6, 0.012);
    const final = 0.0015 + velocity;
    chromaOffset.current.set(final, final);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.2} intensity={1.4} mipmapBlur />
      <ChromaticAberration offset={chromaOffset.current} radialModulation modulationOffset={0.5} />
    </EffectComposer>
  );
}