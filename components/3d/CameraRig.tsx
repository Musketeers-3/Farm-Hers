"use client";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

// The extended 11-page cinematic flight path
function createCameraCurve(): THREE.CatmullRomCurve3 {
  const pts = [
    new THREE.Vector3(0, 0, 7),       // Page 1: Hero (Glass Orb)
    new THREE.Vector3(-2, -4, 6),     // Page 3: Thesis / Intro
    new THREE.Vector3(0, -8, 5),      // Page 4: Cinematic Break
    new THREE.Vector3(2, -12, 5.5),   // Page 5-6: Features (HUD starts)
    new THREE.Vector3(-1.5, -16, 6),  // Page 7: Features (HUD ends)
    new THREE.Vector3(0, -20, 5),     // Page 9: Auction Scene
    new THREE.Vector3(0, -25, 9),     // Page 10-11: Impact & Final CTA (Pull back wide)
  ];
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
}

const LOOK_TARGETS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, -4, 0),
  new THREE.Vector3(0, -8, 0),
  new THREE.Vector3(0, -12, 0),
  new THREE.Vector3(0, -16, 0),
  new THREE.Vector3(0, -20, 0),
  new THREE.Vector3(0, -25, 0),
];

export default function CameraRig() {
  const { camera } = useThree();
  const scroll = useScroll();
  const curve = useMemo(() => createCameraCurve(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const smoothT = useMemo(() => ({ value: 0 }), []);

  useFrame(() => {
    // scroll.offset goes from 0 (top) to 1 (bottom) of the 11 pages
    const targetT = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    smoothT.value = THREE.MathUtils.damp(smoothT.value, targetT, 4.2, 1 / 60);
    const point = curve.getPointAt(smoothT.value);
    camera.position.lerp(point, 0.1); // Smooth positional tracking

    // Interpolate between the discrete look targets
    const seg = smoothT.value * (LOOK_TARGETS.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    const a = LOOK_TARGETS[i];
    const b = LOOK_TARGETS[Math.min(i + 1, LOOK_TARGETS.length - 1)];
    tmpLook.lerpVectors(a, b, f);
    
    // Slight damping on the lookAt for buttery smooth panning
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.lerp(tmpLook, 0.05);
    camera.lookAt(currentLookAt);
    camera.rotation.z = THREE.MathUtils.lerp(
      camera.rotation.z,
      Math.sin(smoothT.value * Math.PI * 5.0) * 0.012,
      0.07
    );
  });

  return null;
}