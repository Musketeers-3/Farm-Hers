"use client";
import { ReactNode, useRef, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { SILK } from "./constants";

export default function LineReveal({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div initial={{ y: "110%", opacity: 0 }} animate={inView ? { y: "0%", opacity: 1 } : {}} transition={{ duration: 1.0, ease: SILK, delay }}>
        {children}
      </motion.div>
    </div>
  );
}