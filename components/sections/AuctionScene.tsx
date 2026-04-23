"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import LineReveal from "@/components/ui/LineReveal";
import { SILK } from "@/components/ui/constants";

interface Crop { name: string; hindi: string; region: string; price: number; change: string; bids: number; color: string; emoji: string; }
const CROPS: Crop[] = [
  { name: "Wheat", hindi: "गेहूं", region: "Punjab", price: 2340, change: "+4.2%", bids: 38, color: "#f59e0b", emoji: "🌾" },
  { name: "Rice", hindi: "चावल", region: "Haryana", price: 3120, change: "+1.8%", bids: 24, color: "#22c55e", emoji: "🌿" },
  { name: "Cotton", hindi: "कपास", region: "Maharashtra", price: 6480, change: "+6.5%", bids: 51, color: "#a78bfa", emoji: "☁️" },
  { name: "Soybean", hindi: "सोयाबीन", region: "MP", price: 4250, change: "+2.1%", bids: 19, color: "#fb7185", emoji: "🫘" },
  { name: "Maize", hindi: "मक्का", region: "Karnataka", price: 1890, change: "+3.3%", bids: 29, color: "#fbbf24", emoji: "🌽" },
];

function AuctionCard({ crop, index, compact }: { crop: Crop; index: number; compact: boolean; }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);
  const [bid, setBid] = useState(crop.price);
  const total = CROPS.length;
  const offset = index - (total - 1) / 2;
  const baseRotateY = offset * 8;

  useEffect(() => {
    const t = setInterval(() => setBid((p) => p + Math.floor(Math.random() * 12) + 1), 1800 + index * 300);
    return () => clearInterval(t);
  }, [index]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 100, rotateY: baseRotateY * 2 }} animate={inView ? { opacity: 1, y: 0, rotateY: hovered ? 0 : baseRotateY } : {}} whileHover={{ rotateY: 0, scale: 1.04 }} transition={{ duration: 0.9, ease: SILK, delay: index * 0.1 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} data-cursor="BID NOW" style={{ flex: compact ? "0 0 220px" : "0 0 252px", background: "linear-gradient(135deg,rgba(3,15,6,0.9),rgba(2,10,4,0.9))", border: `1px solid ${hovered ? crop.color + "66" : "rgba(255,255,255,0.06)"}`, borderRadius: compact ? 20 : 24, padding: compact ? 20 : 26, boxShadow: hovered ? `0 30px 80px rgba(0,0,0,0.8),0 0 40px ${crop.color}22` : "0 20px 60px rgba(0,0,0,0.6)", transition: "border-color 0.3s,box-shadow 0.3s", position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${crop.color},transparent)` }} />
      <div style={{ position: "absolute", top: "-40%", left: "-20%", width: "80%", height: "80%", borderRadius: "50%", background: `radial-gradient(circle,${crop.color}10 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: `${crop.color}12`, border: `1px solid ${crop.color}22` }}>
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: "50%", background: crop.color }} />
          <span style={{ fontSize: 9, color: crop.color, fontFamily: "'Space Mono',monospace", letterSpacing: "0.15em" }}>LIVE</span>
        </div>
        <span style={{ fontSize: 22 }}>{crop.emoji}</span>
      </div>
      <h3 style={{ margin: "0 0 4px", fontSize: compact ? 24 : 28, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", letterSpacing: "-0.02em" }}>{crop.name} <span style={{ fontSize: 14, color: "#334155", fontWeight: 400 }}>{crop.hindi}</span></h3>
      <p style={{ margin: compact ? "0 0 20px" : "0 0 28px", fontSize: 12, color: "#475569", fontFamily: "'Barlow',sans-serif" }}>{crop.region} Mandi</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
        <motion.span key={bid} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }} style={{ fontSize: compact ? 32 : 38, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "'Cormorant Garamond',serif", color: crop.color }}>₹{bid.toLocaleString()}</motion.span>
        <span style={{ fontSize: 12, color: "#22c55e", fontFamily: "'Space Mono',monospace" }}>{crop.change}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div>
          <div style={{ fontSize: 10, color: "#334155", marginBottom: 4, fontFamily: "'Space Mono',monospace" }}>BIDS</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#f0fdf4", fontFamily: "'Cormorant Garamond',serif" }}>{crop.bids}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#334155", marginBottom: 4, fontFamily: "'Space Mono',monospace" }}>STATUS</div>
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", fontFamily: "'Space Mono',monospace" }}>LIVE</motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuctionScene() {
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const sync = () => setCompact(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section ref={ref} style={{ background: "transparent", padding: "140px 0", overflow: "hidden", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px", marginBottom: 80 }}>
        <LineReveal><div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", marginBottom: 20 }}>Live Auction Floor</div></LineReveal>
        <LineReveal delay={0.1}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Real bids.</h2></LineReveal>
        <LineReveal delay={0.18}><h2 style={{ margin: 0, fontSize: "clamp(40px,6vw,80px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", color: "#22c55e", lineHeight: 1.0, letterSpacing: "-0.03em" }}>Real power.</h2></LineReveal>
      </div>
      <div style={{ perspective: "1200px", perspectiveOrigin: "50% 50%", padding: "40px 60px" }}>
        <div style={{ display: "flex", gap: 24, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 20 }}>
          {CROPS.map((crop, i) => <AuctionCard key={i} crop={crop} index={i} compact={compact} />)}
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "40px auto 0", padding: "0 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, overflow: "hidden", borderTop: "1px solid rgba(34,197,94,0.08)", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: "0.2em", fontFamily: "'Space Mono',monospace" }}>LIVE FEED</span>
          </div>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 16, ease: "linear", repeat: Infinity }} style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}>
            {[...CROPS, ...CROPS].map((c, i) => (
              <span key={i} style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", fontFamily: "'Space Mono',monospace" }}>{c.name} <span style={{ color: c.color }}>₹{c.price.toLocaleString()}</span> {c.change}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}