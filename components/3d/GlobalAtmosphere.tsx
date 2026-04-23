"use client";
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";
import { simVertexShader, simFragmentShader, renderVertexShader, renderFragmentShader } from "./shaders";

const SIZE = 256; // 256 * 256 = 65,536 particles

function VortexSimulation() {
  // 1. Initial Geometry Generation (Assigning UVs to map to the FBO)
  const particlesPosition = useMemo(() => {
    const length = SIZE * SIZE;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % SIZE) / SIZE;
      particles[i3 + 1] = i / SIZE / SIZE;
      particles[i3 + 2] = 0;
    }
    return particles;
  }, []);

  // 2. Initial Particle Spread (Filling the first FBO)
  const initialPositions = useMemo(() => {
    const data = new Float32Array(SIZE * SIZE * 4);
    for (let i = 0; i < SIZE * SIZE; i++) {
      // Randomly scatter particles in a sphere for startup
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      data[i * 4 + 0] = radius * Math.sin(phi) * Math.cos(theta); // x
      data[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      data[i * 4 + 2] = radius * Math.cos(phi);                   // z
      data[i * 4 + 3] = 1.0;                                      // alpha
    }
    const texture = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 3. FBO Setup (The Ping-Pong Buffers)
  const fboProps = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType };
  const targetA = useFBO(SIZE, SIZE, fboProps);
  const targetB = useFBO(SIZE, SIZE, fboProps);
  const [activeFBO, setActiveFBO] = useState(targetA);

  // 4. Simulation Material
  const simMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const renderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // The invisible scene where the math happens
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1));

  useFrame((state) => {
    if (!simMaterialRef.current || !renderMaterialRef.current) return;

    // Determine targets for the Ping-Pong swap
    const currentTarget = activeFBO === targetA ? targetA : targetB;
    const nextTarget = activeFBO === targetA ? targetB : targetA;

    // Update Simulation Uniforms
    simMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    simMaterialRef.current.uniforms.uPositions.value = currentTarget.texture;

    // 1. Render the math scene into the NEXT buffer
    state.gl.setRenderTarget(nextTarget);
    state.gl.clear();
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null); // Reset to screen

    // 2. Feed the new FBO texture to the visible particles
    renderMaterialRef.current.uniforms.uPositions.value = nextTarget.texture;

    // 3. Swap the active buffer for the next frame
    setActiveFBO(nextTarget);
  });

  return (
    <>
      {/* THE INVISIBLE MATH LAYER */}
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial 
            ref={simMaterialRef}
            vertexShader={simVertexShader}
            fragmentShader={simFragmentShader}
            uniforms={{
              uPositions: { value: initialPositions },
              uTime: { value: 0 }
            }}
          />
        </mesh>,
        scene
      )}

      {/* THE VISIBLE PARTICLES */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesPosition.length / 3} args={[particlesPosition, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={renderMaterialRef}
          vertexShader={renderVertexShader}
          fragmentShader={renderFragmentShader}
          uniforms={{ uPositions: { value: null } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function GlobalAtmosphere() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <VortexSimulation />
      </Canvas>
    </div>
  );
}