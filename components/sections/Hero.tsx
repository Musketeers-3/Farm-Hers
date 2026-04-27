"use client";
import { useRef, useState, useEffect, useLayoutEffect, MouseEvent } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagBtn from "@/components/ui/MagBtn";
import { IMG, EXPO, SHARP, SILK } from "@/components/ui/constants";
import { getGsap } from "@/components/3d/gsapClient";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-kicker], [data-hero-title], [data-hero-copy], [data-hero-cta]",
        { y: 48, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.2,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  // 🔥 THE FIX: Use native window routing to escape the WebGL Canvas Context trap
  const handleLaunch = () => {
    window.location.href = "/onboarding";
  };

  return (
    // 🔥 THE FIX: Removed Framer Motion's useScroll logic to stop the `.style` crash
    <section ref={ref} onMouseMove={handleMouseMove} style={{ position: "relative", height: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "transparent" }}>
      <motion.div initial={{ y: "0%" }} animate={loaded ? { y: "-100%" } : { y: "0%" }} transition={{ duration: 1.4, ease: SHARP, delay: 0.1 }} style={{ position: "absolute", inset: 0, zIndex: 100, background: "#020a04", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ opacity: loaded ? 0 : 1 }} transition={{ duration: 0.4 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, ease: "linear", repeat: Infinity }} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#22c55e" }} />
          <span style={{ fontSize: 12, color: "#22c55e", letterSpacing: "0.3em", fontFamily: "'Space Mono',monospace" }}>LOADING</span>
        </motion.div>
      </motion.div>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src={IMG.hero} alt="Golden wheat fields" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.15 }} />
      </div>
      <motion.div style={{ position: "relative", zIndex: 10, padding: "0 60px 72px", width: "100%", pointerEvents: "none" }}>
        <motion.div data-hero-kicker initial={{ opacity: 0, x: -20 }} animate={loaded ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, ease: EXPO, delay: 1.6 }} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 1, background: "#22c55e" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.35em", color: "#22c55e", textTransform: "uppercase", fontFamily: "'Space Mono',monospace" }}>The Agricultural Intelligence Platform</span>
        </motion.div>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h1 data-hero-title initial={{ y: "100%" }} animate={loaded ? { y: "0%" } : {}} transition={{ duration: 1.1, ease: SILK, delay: 1.7 }} style={{ margin: 0, fontSize: "clamp(56px,9vw,128px)", fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: "#f0fdf4", lineHeight: 0.92, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>Future</motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 32 }}>
          <motion.h1 data-hero-title initial={{ y: "100%" }} animate={loaded ? { y: "0%" } : {}} transition={{ duration: 1.1, ease: SILK, delay: 1.85 }} style={{ margin: 0, fontSize: "clamp(56px,9vw,128px)", fontWeight: 700, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", background: "linear-gradient(135deg,#4ade80,#22c55e,#86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 0.92, letterSpacing: "-0.02em", textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>Harvest.</motion.h1>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: EXPO, delay: 2.15 }} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 32, pointerEvents: "auto" }}>
          <p data-hero-copy style={{ margin: 0, maxWidth: 460, fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(240,253,244,0.8)", lineHeight: 1.65, fontFamily: "'Barlow',sans-serif", fontWeight: 300, letterSpacing: "0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>Voice-native. Zero middlemen. Direct enterprise contracts.<br />Empowering 50M+ farmers with AI that speaks their language.</p>
          <MagBtn data-hero-cta onClick={handleLaunch} dataCursor="ENTER →" style={{ padding: "18px 48px", borderRadius: 999, background: "linear-gradient(135deg,#22c55e,#15803d)", border: "none", fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Barlow',sans-serif", display: "flex", alignItems: "center", gap: 10, letterSpacing: "0.04em", textTransform: "uppercase", boxShadow: "0 0 30px rgba(34,197,94,0.3)" }}>
            Enter Platform <ArrowRight size={16} />
          </MagBtn>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 2.8, duration: 1 }} style={{ position: "absolute", right: 40, bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 60, background: "linear-gradient(to bottom,#22c55e,transparent)" }} />
        <span style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(34,197,94,0.8)", textTransform: "uppercase", fontFamily: "'Space Mono',monospace", writingMode: "vertical-lr" }}>scroll</span>
      </motion.div>
    </section>
  );
}