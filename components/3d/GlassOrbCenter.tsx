"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { helixVertexShader, helixFragmentShader } from "./shaders/helix";

function DynamicHelix() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -1.5]}>
      <cylinderGeometry args={[0.4, 0.4, 6, 32, 128]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={helixVertexShader}
        fragmentShader={helixFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        wireframe
        transparent
      />
    </mesh>
  );
}

export default function GlassOrbCenter() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!orbRef.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.mouse.x;
    const my = state.mouse.y;
    // Mouse parallax tilt
    orbRef.current.rotation.x = THREE.MathUtils.lerp(
      orbRef.current.rotation.x,
      Math.sin(t * 0.3) * 0.2 + my * 0.3,
      0.05,
    );
    orbRef.current.rotation.y += 0.002;
    orbRef.current.position.x = THREE.MathUtils.lerp(
      orbRef.current.position.x,
      mx * 0.4,
      0.05,
    );
    orbRef.current.position.y = Math.sin(t * 0.8) * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <DynamicHelix />
      <mesh ref={orbRef} position={[0, 0, 1]}>
        <icosahedronGeometry args={[2.2, 32]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={1.5}
          thickness={4.5}
          chromaticAberration={0.15}
          anisotropy={0.5}
          distortion={0.5}
          distortionScale={0.4}
          temporalDistortion={0.1}
          color="#ffffff"
          roughness={0.1}
          ior={1.5}
          transmission={1.0}
          clearcoat={1.0}
        />
      </mesh>
    </Float>
  );
}