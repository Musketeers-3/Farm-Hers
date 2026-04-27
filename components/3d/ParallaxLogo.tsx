"use client";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParallaxLogoProps {
  position?: [number, number, number];
}

export default function ParallaxLogo({ position = [0, 0, 0] }: ParallaxLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // Create metallic gradient material
  const metalMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#22c55e") },
        uColor2: { value: new THREE.Color("#15803d") },
        uHighlight: { value: new THREE.Color("#86efac") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uHighlight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

          float gradient = vUv.y + sin(uTime * 0.5 + vUv.x * 3.14159) * 0.1;
          vec3 baseColor = mix(uColor1, uColor2, gradient);

          vec3 finalColor = mix(baseColor, uHighlight, fresnel * 0.8);
          finalColor += uHighlight * pow(fresnel, 2.0) * 0.5;

          float alpha = 0.85 + fresnel * 0.15;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Outer glow material
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#22c55e") },
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
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - vec2(0.5));
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0);

          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
          glow *= pulse;

          float ring = smoothstep(0.35, 0.45, dist) * (1.0 - smoothstep(0.45, 0.5, dist));
          ring *= sin(uTime * 1.5) * 0.5 + 0.5;

          float alpha = glow * 0.4 + ring * 0.6;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;

    // Update time uniforms
    metalMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    glowMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    // Calculate target rotation based on cursor position
    targetRotation.current.x = pointer.y * 0.15;
    targetRotation.current.y = pointer.x * 0.15;

    // Smooth interpolation (lerp)
    const easing = 0.08;
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * easing;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * easing;

    // Apply rotation
    meshRef.current.rotation.x = currentRotation.current.x;
    meshRef.current.rotation.y = currentRotation.current.y;
    glowRef.current.rotation.x = currentRotation.current.x;
    glowRef.current.rotation.y = currentRotation.current.y;

    // Subtle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.4}>
        <circleGeometry args={[1.2, 64]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Main metallic orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={metalMaterial} attach="material" />
      </mesh>

      {/* Inner ring detail */}
      <mesh scale={0.7}>
        <torusGeometry args={[0.8, 0.03, 16, 64]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.6} />
      </mesh>

      {/* Outer ring */}
      <mesh scale={0.95}>
        <torusGeometry args={[1, 0.02, 16, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}