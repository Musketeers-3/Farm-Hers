"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────
// 1. THE HELIX SHADERS
// ─────────────────────────────────────────────────────────
const helixVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    
    // The Twisting Math
    float twistFactor = 3.5;
    float speed = 1.2;
    float angle = (position.y * twistFactor) - (uTime * speed);
    
    // 2D Rotation Matrix applied to X and Z
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    
    vec3 transformed = position;
    transformed.xz = rotationMatrix * transformed.xz;
    
    // Add a subtle pulsing scale effect
    float pulse = sin(uTime * 2.0 - position.y * 5.0) * 0.1 + 0.9;
    transformed.xz *= pulse;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const helixFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    // Create a glowing neon gradient (FarmHers Green to Gold)
    vec3 colorA = vec3(0.13, 0.77, 0.36); // #22c55e (Green)
    vec3 colorB = vec3(0.96, 0.75, 0.14); // #fbbf24 (Gold)
    
    // Mix the colors based on the vertical UV coordinate and time
    float mixRatio = sin(vUv.y * 10.0 + uTime * 3.0) * 0.5 + 0.5;
    vec3 finalColor = mix(colorA, colorB, mixRatio);
    
    // Push the color values beyond 1.0 so they emit light (for the Bloom pass later)
    gl_FragColor = vec4(finalColor * 2.5, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────
// 2. THE DYNAMIC HELIX COMPONENT
// ─────────────────────────────────────────────────────────
function DynamicHelix() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -1.5]}>
      {/* A cylinder with high heightSegments (128) is required so the GPU 
        has enough vertices to twist it smoothly without jagged edges. 
      */}
      <cylinderGeometry args={[0.4, 0.4, 6, 32, 128]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={helixVertexShader}
        fragmentShader={helixFragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        wireframe={true} // Renders as a high-tech glowing wire mesh
        transparent={true}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────
// 3. THE GLASS ORB MASTER COMPONENT
// ─────────────────────────────────────────────────────────
export default function GlassOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!orbRef.current) return;
    // Slow, heavy rotation to show off the glass warping
    orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    orbRef.current.rotation.y += 0.002;
    orbRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {/* The Background Object being refracted */}
      <DynamicHelix />

      {/* The Foreground Glass Focal Point */}
      <mesh ref={orbRef} position={[0, 0, 1]}>
        <icosahedronGeometry args={[2.5, 32]} />
        <MeshTransmissionMaterial
          backside={true}
          backsideThickness={1.5}
          thickness={4.5}                // Massive thickness for severe refraction
          chromaticAberration={0.15}     // Splits RGB channels for a cinematic lens effect
          anisotropy={0.5}               // Directional blur
          distortion={0.5}               // Surface waviness
          distortionScale={0.4}
          temporalDistortion={0.1}       // Makes the distortion shift over time
          color="#ffffff"
          roughness={0.1}                // The "Frosted" effect
          ior={1.5}                      // Index of Refraction (Glass)
          transmission={1.0}             // Let all light through
          clearcoat={1.0}                // Glossy outer shell
        />
      </mesh>
    </Float>
  );
}