"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hover state on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        target.role === "button" ||
        getComputedStyle(target).cursor === "pointer";

      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          x: cursorX,
          y: cursorY,
          width: isHovering ? 32 : 8,
          height: isHovering ? 32 : 8,
          borderRadius: "50%",
          backgroundColor: isHovering ? "#22c55e" : "#22c55e",
          mixBlendMode: "difference" as React.CSSProperties["mixBlendMode"],
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0.9,
        }}
      />

      {/* Outer ring for hover state */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          x: cursorX,
          y: cursorY,
          width: isHovering ? 56 : 0,
          height: isHovering ? 56 : 0,
          borderRadius: "50%",
          border: "1px solid #22c55e",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: isHovering ? 0.6 : 0,
        }}
      />

      {/* Trail effect */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          x: cursorX,
          y: cursorY,
          width: isHovering ? 24 : 12,
          height: isHovering ? 24 : 12,
          borderRadius: "50%",
          backgroundColor: "#fbbf24",
          pointerEvents: "none",
          zIndex: 9997,
          opacity: 0.4,
          filter: "blur(4px)",
        }}
      />
    </>
  );
}