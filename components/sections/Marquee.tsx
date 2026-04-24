"use client";
import { motion } from "framer-motion";

export default function Marquee() {
  return (
    // 🔥 Upgraded background to transparent smoked glass
    <div style={{ background: "rgba(2, 10, 4, 0.1)", backdropFilter: "blur(8px)", overflow: "hidden", borderTop: "1px solid rgba(34,197,94,0.08)", borderBottom: "1px solid rgba(34,197,94,0.08)", padding: "28px 0", position: "relative", zIndex: 10 }}>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, ease: "linear", repeat: Infinity }} style={{ display: "flex", whiteSpace: "nowrap", gap: 80 }}>
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} style={{ fontSize: "clamp(11px,1.2vw,14px)", color: "rgba(34,197,94,0.8)", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", textShadow: "0 0 10px rgba(34,197,94,0.2)" }}>
            ZERO HUNGER &nbsp;•&nbsp; DIRECT TRADE &nbsp;•&nbsp; FARMER FIRST &nbsp;•&nbsp; BOLO AI &nbsp;•&nbsp; LIVE AUCTIONS &nbsp;•&nbsp; INDIA BUILT &nbsp;•&nbsp; GLOBAL SCALE &nbsp;•&nbsp; NO POVERTY &nbsp;•&nbsp; REAL-TIME BIDS &nbsp;•&nbsp; VOICE NATIVE &nbsp;&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}