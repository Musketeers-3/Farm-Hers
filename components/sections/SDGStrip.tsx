"use client";
import { motion } from "framer-motion";

export default function SDGStrip() {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(1,7,2,0.8)", backdropFilter: "blur(10px)", overflow: "hidden", padding: "44px 0", position: "relative", zIndex: 10 }}>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }} style={{ display: "flex", whiteSpace: "nowrap", gap: 120 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <h2 key={i} style={{ margin: 0, fontSize: "clamp(72px,9vw,120px)", fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", color: "transparent", WebkitTextStroke: "1.5px rgba(34,197,94,0.2)", letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
            ZERO HUNGER &nbsp;·&nbsp; NO POVERTY &nbsp;·&nbsp; DECENT WORK &nbsp;·&nbsp; RESPONSIBLE GROWTH &nbsp;·&nbsp;
          </h2>
        ))}
      </motion.div>
    </div>
  );
}