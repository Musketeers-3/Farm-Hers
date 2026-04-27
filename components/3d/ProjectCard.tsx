"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  imageWarpVertexShader,
  solidWarpFragmentShader,
} from "./shaders/imageWarp";

interface ProjectCardProps {
  position: [number, number, number];
  index: number;
  title: string;
  subtitle: string;
  accentColor: string;
  imageUrl?: string;
  align?: "left" | "right";
}

export default function ProjectCard({
  position,
  index,
  title,
  subtitle,
  accentColor,
  imageUrl,
  align = "right",
}: ProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport, size } = useThree();
  const scroll = useScroll();
  const [hovered, setHovered] = useState(false);

  const normalizedPointer = useMemo(() => new THREE.Vector2(0, 0), []);

  // Parse accent color
  const accent = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  // Load texture if provided
  const texture = useTexture(imageUrl || "/placeholder.jpg");

  // Card material with warp shader
  const cardMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uColor: { value: accent },
        uGlowColor: { value: accent },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTexture: { value: texture },
      },
      vertexShader: imageWarpVertexShader,
      fragmentShader: imageUrl
        ? `uniform sampler2D uTexture;
           uniform vec3 uGlowColor;
           varying vec2 vUv;
           varying float vDistortion;

           void main() {
             vec4 texColor = texture2D(uTexture, vUv);
             float edgeDist = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
             float edgeGlow = smoothstep(0.08, 0.0, edgeDist);
             vec3 glowContrib = uGlowColor * edgeGlow * 0.4;
             gl_FragColor = vec4(texColor.rgb + glowContrib, 1.0);
           }`
        : solidWarpFragmentShader,
    });
  }, [accentColor, imageUrl, texture]);

  // Glow material for outer glow effect
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: accent },
        uIntensity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - vec2(0.5));
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);

          // Pulsing effect
          float pulse = sin(uTime * 1.5 + uIntensity * 3.14159) * 0.15 + 0.85;

          // Edge glow
          float edge = smoothstep(0.35, 0.5, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
          edge *= pulse;

          float alpha = glow * 0.15 + edge * 0.4;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [accent]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    const time = state.clock.elapsedTime;
    const scrollOffset = scroll.offset;

    // Calculate card entrance based on scroll
    const cardPage = index * 0.25; // Each card appears at 25% scroll intervals
    const progress = Math.max(0, Math.min(1, (scrollOffset - cardPage + 0.2) * 3));

    // Fly-in animation from right side
    const startX = align === "right" ? 4 : -4;
    const targetX = 0;
    groupRef.current.position.x = THREE.MathUtils.lerp(startX, targetX, progress);
    groupRef.current.position.y = position[1];
    groupRef.current.position.z = position[2];

    // 3D flip effect - rotate on Y axis as card enters
    const flipProgress = Math.min(progress * 1.5, 1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      align === "right" ? Math.PI * 0.5 : -Math.PI * 0.5,
      0,
      flipProgress
    );

    // Tilt based on mouse position when visible
    if (progress > 0.8) {
      const tiltIntensity = (progress - 0.8) * 5;
      meshRef.current.rotation.x = pointer.y * 0.15 * tiltIntensity;
      meshRef.current.rotation.z = -pointer.x * 0.1 * tiltIntensity;
    }

    // Update shader uniforms
    cardMaterial.uniforms.uTime.value = time;
    cardMaterial.uniforms.uIntensity.value = hovered ? 1.2 : progress;
    glowMaterial.uniforms.uTime.value = time;
    glowMaterial.uniforms.uIntensity.value = index;

    // Update mouse position for shader
    normalizedPointer.set(pointer.x, pointer.y);
    cardMaterial.uniforms.uMouse.value = normalizedPointer;

    // Scale up on hover
    const targetScale = hovered ? 1.05 : 1;
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    meshRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={[1.8, 1.2, 1]} position={[0, 0, -0.1]}>
        <planeGeometry args={[2.4, 1.6]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Main card */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.2, 1.4]} />
        <primitive object={cardMaterial} attach="material" />
      </mesh>

      {/* Border glow */}
      <mesh scale={[1.12, 1.06, 1]} position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}