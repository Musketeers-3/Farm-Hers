"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import ParallaxImg from "@/components/ui/ParallaxImg";
import { IMG, SILK } from "@/components/ui/constants";

function Counter({ to, suffix = "", dur = 2.4 }: { to: number; suffix?: string; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTs: number | null = null;
    const raf = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / (dur * 1000), 1);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, dur]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export default function ImpactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const stats = [
    { val: 2400000, suf: "+", label: "Farmers onboarded", sub: "Across 28 states" },
    { val: 18700000, suf: "+", label: "Bids placed", sub: "Last 12 months" },
    { val: 340, suf: "Cr+", label: "Trade volume", sub: "INR" },
    { val: 94, suf: "%", label: "Price transparency", sub: "vs. open market" },
  ];
  return (
    <section ref={ref} style={{ background: "transparent", padding: "0 0 160px", position: "relative", zIndex: 10 }}>
      <div style={{ position: "relative", height: 400, overflow: "hidden", marginBottom: 100 }}>
        <ParallaxImg src={IMG.harvest} alt="Harvest" style={{ position: "absolute", inset: 0, height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(2,10,4,0.9) 0%,transparent 30%,transparent 70%,rgba(2,10,4,0.9) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: SILK }} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 16 }}>The Numbers</div>
            <h2 style={{ margin: 0, fontSize: "clamp(40px,7vw,88px)", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", letterSpacing: "-0.03em", lineHeight: 1, textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}>Impact at scale.</h2>
          </motion.div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: i * 0.12, ease: SILK }} style={{ padding: "48px 36px", borderTop: "1px solid rgba(34,197,94,0.12)", borderRight: i < 3 ? "1px solid rgba(34,197,94,0.08)" : "none", background: "rgba(2,10,4,0.6)", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "clamp(40px,4.5vw,64px)", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1, marginBottom: 12, letterSpacing: "-0.03em" }}><Counter to={s.val} suffix={s.suf} /></div>
              <div style={{ fontSize: 15, color: "#94a3b8", fontFamily: "'Barlow',sans-serif", fontWeight: 400, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#334155", letterSpacing: "0.1em", fontFamily: "'Space Mono',monospace" }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}