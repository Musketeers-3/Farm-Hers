"use client";
import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Float, useScroll } from "@react-three/drei";
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
  const scroll = useScroll();
  const texture = useLoader(THREE.TextureLoader, src);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uTint: { value: new THREE.Vector3(...tint) },
      uMotion: { value: 0 },
    }),
    [texture, tint]
  );

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const t = state.clock.elapsedTime;
    const scrollReveal = THREE.MathUtils.clamp((scroll.offset - 0.32 - index * 0.06) * 10, 0, 1);
    const drift = Math.sin(t * 0.45 + index) * 0.35;
    const pointerInfluence = THREE.MathUtils.clamp(
      1 - meshRef.current.position.distanceTo(
        new THREE.Vector3(state.pointer.x * 3, state.pointer.y * 2, meshRef.current.position.z),
      ) / 5,
      0,
      1,
    );

    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uMotion.value = scrollReveal + pointerInfluence * 0.55;

    // Smooth hover interpolation
    const target = hovered ? 1 : pointerInfluence * 0.65;
    matRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uHover.value, target, 0.08
    );

    // Cinematic drifting + staged reveal
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      position[2] + (1 - scrollReveal) * 2.5,
      0.08
    );
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      position[0] + drift,
      0.08
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      position[1] + Math.sin(t * 0.6 + index) * 0.2,
      0.08
    );
    meshRef.current.rotation.y = Math.sin(t * 0.35 + index) * 0.18 + (1 - scrollReveal) * 0.38;
    meshRef.current.rotation.x = Math.cos(t * 0.25 + index) * 0.1;
    meshRef.current.rotation.z = Math.sin(t * 0.2 + index * 2.1) * 0.06;
    meshRef.current.scale.setScalar(0.8 + scrollReveal * 0.2);
  });

  return (
    // Float adds an organic zero-gravity feel to the cards
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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