"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import MagBtn from "./MagBtn";
import { EXPO } from "./constants";

export default function Nav() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 80)), [scrollY]);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: EXPO, delay: 0.4 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 48px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(2,10,4,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(34,197,94,0.1)" : "1px solid transparent",
        transition: "all 0.6s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div whileHover={{ rotate: 15 }} style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#22c55e,#15803d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Leaf size={16} color="#fff" />
        </motion.div>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#f0fdf4", fontFamily: "'Cormorant Garamond',serif", letterSpacing: "0.04em" }}>
          FarmHers
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>Solution Challenge '26</span>
        <MagBtn onClick={() => router.push("/onboarding")} dataCursor="ENTER →" style={{ padding: "10px 28px", borderRadius: 999, background: "#f0fdf4", border: "none", fontSize: 13, fontWeight: 700, color: "#020a04", fontFamily: "'Barlow',sans-serif", display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.02em" }}>
          Enter Platform <ArrowRight size={14} />
        </MagBtn>
      </div>
    </motion.nav>
  );
}