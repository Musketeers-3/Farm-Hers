"use client";
import { Environment, Sparkles } from "@react-three/drei";
import CameraRig from "./CameraRig";
import ParticleVortex from "./ParticleVortex";
import ParallaxLogo from "./ParallaxLogo";
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
  const sparkleCount = particleSize >= 256 ? 180 : 90;

  return (
    <>
      <ambientLight intensity={0.24} />
      {/* FarmHers Green & Gold Lights */}
      <pointLight position={[10, 10, 10]} intensity={1.35} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#fbbf24" />
      <pointLight position={[0, 5, 2]} intensity={0.45} color="#86efac" />
      <Environment preset="night" />

      <CameraRig />

      <ParticleVortex size={particleSize} />
      {/* Central parallax logo with cursor response */}
      <ParallaxLogo position={[0, 0, 0]} />
      <FeatureCards basePosition={[0, -14, 0]} />
      {/* Golden pollen-like ambient sparkles */}
      <Sparkles
        count={sparkleCount}
        scale={24}
        size={1.6}
        speed={0.3}
        color="#fbbf24"
      />

      {enablePost && <KineticEffects />}
    </>
  );
}
