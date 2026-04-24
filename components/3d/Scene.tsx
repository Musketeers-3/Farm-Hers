"use client";
import { Environment, Sparkles } from "@react-three/drei";
import CameraRig from "./CameraRig";
import GlassOrbCenter from "./GlassOrbCenter";
import ParticleVortex from "./ParticleVortex";
import FeatureCards from "./FeatureCards";
import KineticEffects from "./KineticEffects";

interface SceneProps {
  particleSize?: number;
  enablePost?: boolean;
}

export default function Scene({
  particleSize = 256,
  enablePost = true,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      {/* FarmHers Green & Gold Lights */}
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#fbbf24" />
      <Environment preset="night" />

      <CameraRig />

      <ParticleVortex size={particleSize} />
      <GlassOrbCenter />
      <FeatureCards basePosition={[0, -14, 0]} />
      {/* Golden pollen-like ambient sparkles */}
      <Sparkles
        count={120}
        scale={20}
        size={1.4}
        speed={0.25}
        color="#fbbf24"
      />

      {enablePost && <KineticEffects />}
    </>
  );
}
