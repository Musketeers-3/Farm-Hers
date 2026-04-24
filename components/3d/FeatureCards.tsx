"use client";
import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { cardVertexShader, cardFragmentShader } from "./shaders/cardDistortion";

// Swap these placeholders with abstract/cool textures from your assets
const FEATURES = [
  { src: "/images/hero-wheat.jpg", tint: [0.13, 0.77, 0.36] as [number, number, number], pos: [-3, 2, -2] },   // Left, high, far
  { src: "/images/hero-tractor.jpg", tint: [0.98, 0.75, 0.14] as [number, number, number], pos: [3, 0, 0] },     // Right, mid, close
  { src: "/images/market-bg.jpg", tint: [0.13, 0.77, 0.36] as [number, number, number], pos: [-2.5, -2, 1] }, // Left, low, closest
];

interface CardProps {
  src: string;
  tint: [number, number, number];
  index: number;
  position: [number, number, number];
}

function FeatureCard({ src, tint, index, position }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, src);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uTint: { value: new THREE.Vector3(...tint) },
    }),
    [texture, tint]
  );

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;
    matRef.current.uniforms.uTime.value = t;

    // Smooth hover interpolation
    const target = hovered ? 1 : 0;
    matRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uHover.value, target, 0.08
    );

    // Cinematic drifting
    meshRef.current.rotation.y = Math.sin(t * 0.2 + index) * 0.1;
    meshRef.current.rotation.x = Math.cos(t * 0.15 + index) * 0.05;
  });

  return (
    // Float adds an organic zero-gravity feel to the cards
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          {/* 🔥 Increased segments (64,64) for ultra-smooth liquid rippling */}
          <planeGeometry args={[3, 4, 64, 64]} />
          <shaderMaterial ref={matRef} vertexShader={cardVertexShader} fragmentShader={cardFragmentShader} uniforms={uniforms} transparent />
        </mesh>
        
        {/* Backing Ambient Glow */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[3.4, 4.4]} />
          <meshBasicMaterial color={new THREE.Color(...tint)} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  );
}

export default function FeatureCards({ basePosition = [0, -9, 0] as [number, number, number] }) {
  return (
    <group position={basePosition}>
      {FEATURES.map((f, i) => (
        <FeatureCard key={i} src={f.src} tint={f.tint} index={i} position={f.pos as [number, number, number]} />
      ))}
    </group>
  );
}