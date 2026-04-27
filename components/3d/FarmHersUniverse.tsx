"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import Scene from "./Scene";
import Overlay from "./Overlay";

export default function FarmHersUniverse() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!mounted) return null;

  const particleSize = isMobile ? 112 : 256;
  const enablePost = !isMobile;
  const dpr: [number, number] = isMobile ? [1, 1.2] : [1, 1.5];

  return (
    <main className="w-screen h-screen bg-background relative overflow-hidden" style={{ background: "#020a04" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={dpr}
      >
        <color attach="background" args={["#020a04"]} />
        <fog attach="fog" args={["#020a04", 12, 35]} />

        <Suspense fallback={null}>
          <ScrollControls pages={11} damping={0.16}>
            <Scene particleSize={particleSize} enablePost={enablePost} />
            <Scroll html style={{ width: "100%" }}>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </main>
  );
}