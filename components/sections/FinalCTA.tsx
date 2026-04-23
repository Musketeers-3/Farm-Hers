"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import MagBtn from "@/components/ui/MagBtn";
import { IMG, SILK } from "@/components/ui/constants";

export default function FinalCTA() {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <section ref={ref} style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "transparent", zIndex: 10 }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={IMG.field} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,rgba(1,7,2,0.2) 0%,rgba(1,7,2,0.98) 75%)" }} />
      </div>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 2.5, ease: SILK }} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "100px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: SILK }} style={{ fontSize: 11, letterSpacing: "0.4em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 40 }}>The revolution starts</motion.div>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h2 initial={{ y: "110%" }} animate={inView ? { y: "0%" } : {}} transition={{ duration: 1.1, ease: SILK, delay: 0.15 }} style={{ margin: 0, fontSize: "clamp(60px,11vw,148px)", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 0.92, letterSpacing: "-0.04em" }}>The soil</motion.h2>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 64 }}>
          <motion.h2 initial={{ y: "110%" }} animate={inView ? { y: "0%" } : {}} transition={{ duration: 1.1, ease: SILK, delay: 0.28 }} style={{ margin: 0, fontSize: "clamp(60px,11vw,148px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", background: "linear-gradient(135deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 0.92, letterSpacing: "-0.04em" }}>is ready.</motion.h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: SILK, delay: 0.55 }} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <MagBtn onClick={() => router.push("/onboarding")} dataCursor="LET'S GO" style={{ padding: "22px 60px", borderRadius: 999, background: "linear-gradient(135deg,#22c55e,#15803d)", border: "none", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Barlow',sans-serif", display: "flex", alignItems: "center", gap: 12, letterSpacing: "0.04em", textTransform: "uppercase", boxShadow: "0 0 40px rgba(34,197,94,0.35)" }}>
            Initialize FarmHers OS <ChevronRight size={20} />
          </MagBtn>
          <MagBtn dataCursor="PLAY" style={{ padding: "22px 44px", borderRadius: 999, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", fontSize: 16, fontWeight: 500, color: "rgba(240,253,244,0.7)", fontFamily: "'Barlow',sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
            <Play size={14} fill="currentColor" /> Watch the Story
          </MagBtn>
        </motion.div>
      </div>
    </section>
  );
}