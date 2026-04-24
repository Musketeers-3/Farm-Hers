"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import LineReveal from "@/components/ui/LineReveal";
import { SILK } from "@/components/ui/constants";

export default function EditorialIntro() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  
  return (
    <section ref={ref} style={{ background: "transparent", width: "100%", padding: "140px 60px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
          <div style={{ paddingTop: 8 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease: SILK }}>
              <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 20, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Our Thesis</div>
              <div style={{ fontSize: 80, fontWeight: 700, color: "rgba(34,197,94,0.15)", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, letterSpacing: "-0.04em" }}>01</div>
            </motion.div>
          </div>
          <div>
            {["India has 140 million farmers.", "None of them should sell blindly."].map((line, i) => (
              <LineReveal key={i} delay={i * 0.15}>
                <h2 style={{ margin: "0 0 4px", fontSize: "clamp(32px,4.5vw,60px)", fontWeight: i === 0 ? 300 : 700, fontStyle: i === 1 ? "italic" : "normal", fontFamily: "'Cormorant Garamond',serif", color: i === 0 ? "#94a3b8" : "#f0fdf4", lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>{line}</h2>
              </LineReveal>
            ))}
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease: SILK, delay: 0.5 }} style={{ height: 1, background: "linear-gradient(90deg,#22c55e,transparent)", transformOrigin: "left", margin: "40px 0" }} />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: SILK, delay: 0.6 }} style={{ margin: 0, fontSize: 18, color: "rgba(240,253,244,0.8)", lineHeight: 1.75, fontFamily: "'Barlow',sans-serif", fontWeight: 300, maxWidth: 540, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
              FarmHers is the operating system for direct agriculture commerce — where voice meets machine intelligence, and every farmer commands the same market access as any Fortune 500 buyer.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}