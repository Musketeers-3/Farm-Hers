"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, Users, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import LineReveal from "@/components/ui/LineReveal";
import { SILK } from "@/components/ui/constants";

interface Feature { index: number; tag: string; title: string; subtitle: string; body: string; icon: LucideIcon; accent: string; align: "left" | "right"; }
const FEATURES: Feature[] = [
  { index: 1, tag: "Voice AI", title: "Bolo Intelligence.", subtitle: "Speak to the market.", body: "Farmers speak natively. Bolo handles the rest.", icon: Mic, accent: "#22c55e", align: "right" },
  { index: 2, tag: "Network", title: "Micro-Pooling.", subtitle: "Power in numbers.", body: "Clustering yields to unlock premium pricing.", icon: Users, accent: "#fbbf24", align: "left" },
  { index: 3, tag: "Fintech", title: "Smart Escrow.", subtitle: "Zero default risk.", body: "Funds cryptographically locked before harvest.", icon: ShieldCheck, accent: "#22c55e", align: "right" },
  { index: 4, tag: "Analytics", title: "Live Telemetry.", subtitle: "The pulse of the harvest.", body: "IoT data streams directly to your dashboard.", icon: TrendingUp, accent: "#fbbf24", align: "left" },
];

function HUDFeature({ feat }: { feat: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = feat.icon;
  
  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, x: feat.align === "left" ? -40 : 40 }} 
      animate={inView ? { opacity: 1, x: 0 } : {}} 
      transition={{ duration: 1.1, ease: SILK }} 
      style={{ 
        display: "flex", 
        justifyContent: feat.align === "left" ? "flex-start" : "flex-end",
        marginBottom: "12vh", // Space them out vertically so the camera flies past them
        pointerEvents: "none" // Ensures mouse hovers pass through to the 3D cards behind!
      }}
    >
      <div style={{ maxWidth: 400, textAlign: feat.align }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: feat.align === "left" ? "flex-start" : "flex-end", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${feat.accent}15`, border: `1px solid ${feat.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${feat.accent}20` }}>
            <Icon size={18} color={feat.accent} />
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", color: feat.accent, textTransform: "uppercase", fontFamily: "'Space Mono',monospace", textShadow: `0 0 10px ${feat.accent}50` }}>{feat.tag}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Barlow',sans-serif" }}>{feat.subtitle}</div>
          </div>
        </div>
        <h3 style={{ margin: "0 0 16px", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1.05, letterSpacing: "-0.02em", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
          {feat.title}
        </h3>
        <p style={{ margin: 0, fontSize: 16, color: "rgba(240,253,244,0.7)", lineHeight: 1.6, fontFamily: "'Barlow',sans-serif", fontWeight: 300, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
          {feat.body}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section style={{ background: "transparent", padding: "80px 40px 160px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 120, textAlign: "center" }}>
          <LineReveal><div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 20 }}>Platform Pillars</div></LineReveal>
          <LineReveal delay={0.1}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Engineered to be</h2></LineReveal>
          <LineReveal delay={0.18}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: "#22c55e", lineHeight: 1.0, letterSpacing: "-0.03em" }}>unstoppable.</h2></LineReveal>
        </div>
        
        {/* HUD Overlay Elements */}
        {FEATURES.map((feat) => <HUDFeature key={feat.index} feat={feat} />)}
      </div>
    </section>
  );
}