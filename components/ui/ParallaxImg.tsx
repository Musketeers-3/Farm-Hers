"use client";
import { useRef, CSSProperties } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ParallaxImg({ src, alt = "", style = {} }: { src: string; alt?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.img src={src} alt={alt} style={{ y, width: "100%", height: "115%", objectFit: "cover", display: "block" }} />
    </div>
  );
}