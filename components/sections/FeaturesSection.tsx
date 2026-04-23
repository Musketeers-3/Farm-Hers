"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, Users, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import ParallaxImg from "@/components/ui/ParallaxImg";
import LineReveal from "@/components/ui/LineReveal";
import { IMG, SILK } from "@/components/ui/constants";

interface Feature { index: number; tag: string; title: string; subtitle: string; body: string; icon: LucideIcon; accent: string; image: string; }
const FEATURES: Feature[] = [
  { index: 1, tag: "Voice AI", title: "Bolo Intelligence.", subtitle: "Speak to the market.", body: "Illiteracy is obsolete. Farmers speak in natural Hindi, Punjabi, or Hinglish to list crops, check live commodity pricing, and close multi-crore contracts. Bolo handles everything.", icon: Mic, accent: "#22c55e", image: IMG.farmers },
  { index: 2, tag: "Network", title: "Micro-Pooling.", subtitle: "Power in numbers.", body: "A two-acre farmer cannot fulfill an ITC contract alone. But a hundred of them can. FarmHers clusters smallholder yields dynamically to unlock premium corporate pricing tiers.", icon: Users, accent: "#3b82f6", image: IMG.field },
  { index: 3, tag: "Fintech", title: "Smart Escrow.", subtitle: "Zero default risk.", body: "Corporate funds are locked in cryptographic escrow before a single seed leaves the village. Payouts execute instantly upon delivery validation. Total financial security.", icon: ShieldCheck, accent: "#a855f7", image: IMG.market },
  { index: 4, tag: "Analytics", title: "Live Telemetry.", subtitle: "The pulse of the harvest.", body: "IoT integrations stream live Mandi analytics directly to your dashboard. The days of selling blindly below fair market value end today.", icon: TrendingUp, accent: "#f59e0b", image: IMG.wheat },
];

function FeatureCard({ feat, compact }: { feat: Feature; compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = feat.icon;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 80 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.1, ease: SILK }} style={{ position: "sticky", top: compact ? `${20 + feat.index * 12}px` : `${60 + feat.index * 20}px`, zIndex: feat.index * 10, borderRadius: compact ? 22 : 32, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(3,15,6,0.8)", backdropFilter: "blur(16px)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", marginBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", minHeight: compact ? 0 : 440 }}>
        <div style={{ padding: compact ? "34px 24px" : "52px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", left: "-20%", width: "80%", height: "80%", borderRadius: "50%", background: `radial-gradient(circle,${feat.accent}12 0%,transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${feat.accent}18`, border: `1px solid ${feat.accent}33`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={22} color={feat.accent} /></div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.35em", color: feat.accent, textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 3 }}>{feat.tag}</div>
                <div style={{ fontSize: 12, color: "#475569", fontFamily: "'Barlow',sans-serif" }}>{feat.subtitle}</div>
              </div>
            </div>
            <h3 style={{ margin: "0 0 24px", fontSize: compact ? "clamp(28px,8vw,38px)" : "clamp(32px,3.6vw,50px)", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1.05, letterSpacing: "-0.02em" }}>{feat.title}</h3>
            <p style={{ margin: 0, fontSize: compact ? 15 : 16, color: "rgba(148,163,184,0.75)", lineHeight: 1.75, fontFamily: "'Barlow',sans-serif", fontWeight: 300 }}>{feat.body}</p>
          </div>
          <div style={{ fontSize: compact ? 82 : 104, fontWeight: 700, color: `${feat.accent}06`, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, position: "absolute", bottom: compact ? -10 : -14, left: compact ? 18 : 32, letterSpacing: "-0.05em", pointerEvents: "none" }}>0{feat.index}</div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", minHeight: compact ? 260 : undefined }}>
          <ParallaxImg src={feat.image} alt={feat.title} style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(3,15,6,0.8) 0%,rgba(3,15,6,0.3) 40%,transparent 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,transparent 40%,${feat.accent}08 100%)` }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const sync = () => setCompact(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section style={{ background: "transparent", padding: "80px 40px 160px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 80 }}>
          <LineReveal><div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 20 }}>Platform Pillars</div></LineReveal>
          <LineReveal delay={0.1}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Engineered to be</h2></LineReveal>
          <LineReveal delay={0.18}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: "#22c55e", lineHeight: 1.0, letterSpacing: "-0.03em" }}>unstoppable.</h2></LineReveal>
        </div>
        {FEATURES.map((feat) => <FeatureCard key={feat.index} feat={feat} compact={compact} />)}
      </div>
    </section>
  );
}