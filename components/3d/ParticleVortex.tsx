"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame, createPortal } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";
import {
  simVertexShader,
  simFragmentShader,
  renderVertexShader,
  renderFragmentShader,
} from "./shaders/vortex"; // Ensure this matches your file name!

interface ParticleVortexProps {
  size?: number;
}

export default function ParticleVortex({ size = 256 }: ParticleVortexProps) {
  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
      particles[i3 + 2] = 0;
    }
    return particles;
  }, [size]);

  const initialPositions = useMemo(() => {
    const data = new Float32Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      data[i * 4 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 4 + 2] = radius * Math.cos(phi);
      data[i * 4 + 3] = 1.0;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    return texture;
  }, [size]);

  const fboProps = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  };
  const targetA = useFBO(size, size, fboProps);
  const targetB = useFBO(size, size, fboProps);
  const [activeFBO, setActiveFBO] = useState(targetA);

  const simMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const renderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1));

  useFrame((state) => {
    if (!simMaterialRef.current || !renderMaterialRef.current) return;

    const currentTarget = activeFBO === targetA ? targetA : targetB;
    const nextTarget = activeFBO === targetA ? targetB : targetA;

    simMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    simMaterialRef.current.uniforms.uPositions.value = currentTarget.texture;

    state.gl.setRenderTarget(nextTarget);
    state.gl.clear();
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);

    renderMaterialRef.current.uniforms.uPositions.value = nextTarget.texture;
    setActiveFBO(nextTarget);
  });

  return (
    <>
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={simMaterialRef}
            vertexShader={simVertexShader}
            fragmentShader={simFragmentShader}
            uniforms={{ uPositions: { value: initialPositions }, uTime: { value: 0 } }}
          />
        </mesh>,
        scene,
      )}

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