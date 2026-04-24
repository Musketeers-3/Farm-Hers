"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import Scene from "./Scene";
import Overlay from "./Overlay";

export default function FarmHersUniverse() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleSize = isMobile ? 128 : 256;
  const enablePost = !isMobile;

  return (
    <main className="w-screen h-screen bg-background relative overflow-hidden" style={{ background: "#020a04" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 1.5]}
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