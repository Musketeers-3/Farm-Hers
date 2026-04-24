"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { IMG, EXPO, SILK } from "@/components/ui/constants";

export default function CinematicBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30% 0px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setPhase(1), 300), setTimeout(() => setPhase(2), 900), setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400), setTimeout(() => setPhase(5), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    // 🔥 Removed the hard #020a04 background so it doesn't break the WebGL canvas
    <div ref={ref} style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "transparent", zIndex: 10 }}>
      
      {/* Ghostly dark fade to help text legibility, without going fully opaque */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5, background: "#000", opacity: phase >= 1 && phase < 5 ? 0.6 : 0, transition: "opacity 0.9s ease", pointerEvents: "none" }} />
      
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Lowered opacity slightly so the 3D particles show through the image */}
        <img src={IMG.harvest} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #020a04, transparent, #020a04)" }} />
      </div>

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: phase >= 5 ? -140 : 0, opacity: phase >= 5 ? 0 : 1 }} transition={{ duration: 0.9, ease: EXPO }} style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 40px" }}>
        <AnimatePresence>
          {phase >= 2 && phase < 5 && (
            <motion.div key="line1" initial={{ opacity: 0, y: 60, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -40, filter: "blur(16px)" }} transition={{ duration: 0.9, ease: SILK }} style={{ marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: "clamp(14px,1.5vw,18px)", color: "rgba(34,197,94,0.8)", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", textShadow: "0 0 20px rgba(34,197,94,0.4)" }}>The problem has always been</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase >= 3 && phase < 5 && (
            <motion.div key="headline" initial={{ opacity: 0, scale: 0.6, filter: "blur(30px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.3, filter: "blur(20px)" }} transition={{ duration: 1.0, ease: SILK }}>
              <h2 style={{ margin: 0, fontSize: "clamp(52px,9vw,130px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 0.95, letterSpacing: "-0.04em", textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>Middlemen.</h2>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase >= 4 && phase < 5 && (
            <motion.div key="line2" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: SILK }} style={{ marginTop: 32, transformOrigin: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ flex: 1, maxWidth: 200, height: 1, background: "linear-gradient(to right,transparent,#22c55e)" }} />
                <span style={{ fontSize: 13, letterSpacing: "0.3em", color: "#22c55e", fontFamily: "'Space Mono',monospace", textTransform: "uppercase" }}>FarmHers removes them</span>
                <div style={{ flex: 1, maxWidth: 200, height: 1, background: "linear-gradient(to left,transparent,#22c55e)" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {phase >= 1 && phase < 5 && (
          <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: 180 }} transition={{ duration: 2.8, ease: "linear" }} style={{ height: 1, background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontSize: 10, color: "rgba(34,197,94,0.5)", letterSpacing: "0.3em", fontFamily: "'Space Mono',monospace" }}>CONTINUING</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}