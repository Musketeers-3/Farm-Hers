"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Mic,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Leaf,
  WifiOff,
  Play,
} from "lucide-react";

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Unsplash images – agriculture themed
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=90&auto=format&fit=crop",
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=80&auto=format&fit=crop",
  farmers:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80&auto=format&fit=crop",
  market:
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=900&q=80&auto=format&fit=crop",
  field:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80&auto=format&fit=crop",
  village:
    "https://images.unsplash.com/photo-1530036050562-5d8e1e2fb1c9?w=900&q=80&auto=format&fit=crop",
  harvest:
    "https://images.unsplash.com/photo-1601472544090-639cd8a00a9f?w=1800&q=80&auto=format&fit=crop",
};

// ─────────────────────────────────────────
//  FONT LOADER
// ─────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("ag-fonts")) return;
    const l1 = document.createElement("link");
    l1.id = "ag-fonts";
    l1.rel = "stylesheet";
    l1.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(l1);
  }, []);
  return null;
}

// ─────────────────────────────────────────
//  GRAIN OVERLAY
// ─────────────────────────────────────────
function Grain({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ─────────────────────────────────────────
//  CURTAIN WIPE
// ─────────────────────────────────────────
function CurtainSection({
  children,
  bg = "#020a04",
  curtainColor = "#0a1f0e",
  index = 0,
}: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div
      ref={ref}
      style={{ position: "relative", overflow: "hidden", background: bg }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={inView ? { y: "-102%" } : { y: 0 }}
        transition={{ duration: 1.2, ease: EASE_SHARP, delay: index * 0.05 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background: curtainColor,
          transformOrigin: "top",
        }}
      />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
//  LINE REVEALER
// ─────────────────────────────────────────
function LineReveal({ children, delay = 0, style = {} }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 1.0, ease: EASE_SILK, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
//  IMAGE PARALLAX WRAPPER
// ─────────────────────────────────────────
function ParallaxImage({ src, alt = "", style = {} }: any) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          y,
          width: "100%",
          height: "115%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────
//  NAV
// ─────────────────────────────────────────
function Nav() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const u = scrollY.on("change", (v) => setScrolled(v > 80));
    return u;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.4 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "0 40px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.6s ease, border-color 0.6s ease",
        background: scrolled ? "rgba(2,10,4,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(34,197,94,0.1)"
          : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div
          whileHover={{ rotate: 15 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Leaf size={16} color="#fff" />
        </motion.div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#f0fdf4",
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.04em",
          }}
        >
          AgriLink
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span
          className="hidden sm:block"
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "#22c55e",
            textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          Solution Challenge '26
        </span>
        <motion.button
          onClick={() => router.push("/onboarding")}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 30px rgba(34,197,94,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "10px 28px",
            borderRadius: 999,
            background: "#f0fdf4",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            color: "#020a04",
            fontFamily: "'Barlow', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            letterSpacing: "0.02em",
          }}
        >
          Enter Platform <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────
function Hero() {
  const router = useRouter();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        background: "#020a04",
      }}
    >
      <motion.div
        initial={{ y: "0%" }}
        animate={loaded ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 1.4, ease: EASE_SHARP, delay: 0.1 }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 100,
          background: "#020a04",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ opacity: loaded ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#22c55e",
              letterSpacing: "0.3em",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            LOADING
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: imgY,
          scale: imgScale,
          transformOrigin: "center",
        }}
      >
        <img
          src={IMAGES.hero}
          alt="Golden wheat fields"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(2,10,4,0.45) 0%, rgba(2,10,4,0.1) 40%, rgba(2,10,4,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(2,10,4,0.8) 100%)",
          }}
        />
      </motion.div>

      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 60px 72px",
          y: textY,
          opacity,
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 1.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ width: 40, height: 1, background: "#22c55e" }} />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "#22c55e",
              textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            The Agricultural Intelligence Platform
          </span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h1
            initial={{ y: "100%" }}
            animate={loaded ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 1.7 }}
            style={{
              margin: 0,
              fontSize: "clamp(56px, 9vw, 128px)",
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond', serif",
              color: "#f0fdf4",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Future
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 32 }}>
          <motion.h1
            initial={{ y: "100%" }}
            animate={loaded ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 1.85 }}
            style={{
              margin: 0,
              fontSize: "clamp(56px, 9vw, 128px)",
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              background: "linear-gradient(135deg, #4ade80, #22c55e, #86efac)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Harvest.
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_EXPO, delay: 2.15 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <p
            style={{
              margin: 0,
              maxWidth: 460,
              fontSize: "clamp(15px, 1.5vw, 18px)",
              color: "rgba(240,253,244,0.6)",
              lineHeight: 1.65,
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            Voice-native. Zero middlemen. Direct enterprise contracts.
            Empowering 50M+ farmers with AI that speaks their language.
          </p>
          <motion.button
            onClick={() => router.push("/onboarding")}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 50px rgba(34,197,94,0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "18px 48px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Barlow', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 0 30px rgba(34,197,94,0.3)",
            }}
          >
            Enter Platform <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.8, duration: 1 }}
        style={{
          position: "absolute",
          right: 40,
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 60,
            background: "linear-gradient(to bottom, #22c55e, transparent)",
          }}
        />
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "rgba(34,197,94,0.6)",
            textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace",
            writingMode: "vertical-lr",
          }}
        >
          scroll
        </span>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────
//  MANIFESTO MARQUEE
// ─────────────────────────────────────────
function Marquee() {
  return (
    <div
      style={{
        background: "#020a04",
        overflow: "hidden",
        borderTop: "1px solid rgba(34,197,94,0.08)",
        borderBottom: "1px solid rgba(34,197,94,0.08)",
        padding: "28px 0",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", whiteSpace: "nowrap", gap: 80 }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            style={{
              fontSize: "clamp(11px, 1.2vw, 14px)",
              color: "rgba(34,197,94,0.35)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            ZERO HUNGER &nbsp;•&nbsp; DIRECT TRADE &nbsp;•&nbsp; FARMER FIRST
            &nbsp;•&nbsp; BOLO AI &nbsp;•&nbsp; LIVE AUCTIONS &nbsp;•&nbsp;
            INDIA BUILT &nbsp;•&nbsp; GLOBAL SCALE &nbsp;•&nbsp; NO POVERTY
            &nbsp;•&nbsp; REAL-TIME BIDS &nbsp;•&nbsp; VOICE NATIVE &nbsp;&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
//  EDITORIAL INTRO
// ─────────────────────────────────────────
function EditorialIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} style={{ background: "#020a04", padding: "140px 60px" }}>
      <div
        className="hidden sm:block"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div style={{ paddingTop: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_SILK }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: 20,
                }}
              >
                Our Thesis
              </div>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 700,
                  color: "rgba(34,197,94,0.07)",
                  fontFamily: "'Cormorant Garamond', serif",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                01
              </div>
            </motion.div>
          </div>

          <div>
            {[
              "India has 140 million farmers.",
              "None of them should sell blindly.",
            ].map((line, i) => (
              <LineReveal key={i} delay={i * 0.15}>
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: "clamp(32px, 4.5vw, 60px)",
                    fontWeight: i === 0 ? 300 : 700,
                    fontStyle: i === 1 ? "italic" : "normal",
                    fontFamily: "'Cormorant Garamond', serif",
                    color: i === 0 ? "#94a3b8" : "#f0fdf4",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {line}
                </h2>
              </LineReveal>
            ))}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: EASE_SILK, delay: 0.5 }}
              style={{
                height: 1,
                background: "linear-gradient(90deg, #22c55e, transparent)",
                transformOrigin: "left",
                margin: "40px 0",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_SILK, delay: 0.6 }}
              style={{
                margin: 0,
                fontSize: 18,
                color: "rgba(148,163,184,0.8)",
                lineHeight: 1.75,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                maxWidth: 540,
              }}
            >
              AgriLink is the operating system for direct agriculture commerce —
              where voice meets machine intelligence, and every farmer commands
              the same market access as any Fortune 500 buyer.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
//  FEATURE CARDS (sticky stacking)
// ─────────────────────────────────────────
const FEATURES = [
  {
    index: 1,
    tag: "Voice AI",
    title: "Bolo Intelligence.",
    subtitle: "Speak to the market.",
    body: "Illiteracy is obsolete. Farmers speak in natural Hindi, Punjabi, or Hinglish to list crops, check live commodity pricing, and close multi-crore contracts. Bolo handles everything.",
    icon: Mic,
    accent: "#22c55e",
    image: IMAGES.farmers,
  },
  {
    index: 2,
    tag: "Network",
    title: "Micro-Pooling.",
    subtitle: "Power in numbers.",
    body: "A two-acre farmer cannot fulfill an ITC contract alone. But a hundred of them can. AgriLink clusters smallholder yields dynamically to unlock premium corporate pricing tiers.",
    icon: Users,
    accent: "#3b82f6",
    image: IMAGES.field,
  },
  {
    index: 3,
    tag: "Fintech",
    title: "Smart Escrow.",
    subtitle: "Zero default risk.",
    body: "Corporate funds are locked in cryptographic escrow before a single seed leaves the village. Payouts execute instantly upon delivery validation. Total financial security.",
    icon: ShieldCheck,
    accent: "#a855f7",
    image: IMAGES.market,
  },
  {
    index: 4,
    tag: "Analytics",
    title: "Live Telemetry.",
    subtitle: "The pulse of the harvest.",
    body: "IoT integrations stream live Mandi analytics directly to your dashboard. The days of selling blindly below fair market value end today.",
    icon: TrendingUp,
    accent: "#f59e0b",
    image: IMAGES.wheat,
  },
];

function FeatureCard({ feat }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = feat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: EASE_SILK }}
      style={{
        position: "sticky",
        top: `${60 + feat.index * 20}px`,
        zIndex: feat.index * 10,
        borderRadius: 32,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#030f06",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        marginBottom: 24,
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ minHeight: 500 }}
      >
        <div
          style={{
            padding: "64px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30%",
              left: "-20%",
              width: "80%",
              height: "80%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${feat.accent}12 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 48,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: `${feat.accent}18`,
                  border: `1px solid ${feat.accent}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} color={feat.accent} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    color: feat.accent,
                    textTransform: "uppercase",
                    fontFamily: "'Space Mono', monospace",
                    marginBottom: 3,
                  }}
                >
                  {feat.tag}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {feat.subtitle}
                </div>
              </div>
            </div>

            <h3
              style={{
                margin: "0 0 24px",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond', serif",
                color: "#f0fdf4",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {feat.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                color: "rgba(148,163,184,0.75)",
                lineHeight: 1.75,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
              }}
            >
              {feat.body}
            </p>
          </div>

          <div
            className="hidden sm:block"
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: `${feat.accent}06`,
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: 1,
              position: "absolute",
              bottom: -20,
              left: 40,
              letterSpacing: "-0.05em",
              pointerEvents: "none",
            }}
          >
            0{feat.index}
          </div>
        </div>

        <div
          className="hidden md:block"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <ParallaxImage
            src={feat.image}
            alt={feat.title}
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, #030f06 0%, rgba(3,15,6,0.3) 40%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, transparent 40%, ${feat.accent}08 100%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <section style={{ background: "#020a04", padding: "80px 40px 160px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <CurtainSection bg="#020a04" curtainColor="#020a04">
          <div style={{ marginBottom: 80 }}>
            <LineReveal>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.35em",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: 20,
                }}
              >
                Platform Pillars
              </div>
            </LineReveal>
            <LineReveal delay={0.1}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(40px, 6vw, 80px)",
                  fontWeight: 300,
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#f0fdf4",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                }}
              >
                Engineered to be
              </h2>
            </LineReveal>
            <LineReveal delay={0.18}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(40px, 6vw, 80px)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#22c55e",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                }}
              >
                unstoppable.
              </h2>
            </LineReveal>
          </div>
        </CurtainSection>

        {FEATURES.map((feat) => (
          <FeatureCard key={feat.index} feat={feat} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
//  BOLO AI SECTION
// ─────────────────────────────────────────
function BoloSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [phraseIdx, setPhraseIdx] = useState(0);
  const phrases = [
    { text: "मेरी गेहूं की फसल का बोली शुरू करो", lang: "Hindi" },
    { text: "ਮੇਰੀ ਕਣਕ ਦੀ ਬੋਲੀ ਸ਼ੁਰੂ ਕਰੋ", lang: "Punjabi" },
    { text: "Bhai, meri fasal ka bhav kya hai?", lang: "Hinglish" },
  ];

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(
      () => setPhraseIdx((p) => (p + 1) % phrases.length),
      3000,
    );
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#010702",
        padding: "160px 40px",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={IMAGES.village}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, #010702 50%, rgba(1,7,2,0.6) 100%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div>
            <LineReveal>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.4em",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono', monospace",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ width: 32, height: 1, background: "#22c55e" }} />{" "}
                AI Voice Assistant
              </div>
            </LineReveal>
            <LineReveal delay={0.1}>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "clamp(44px, 6vw, 80px)",
                  fontWeight: 300,
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#94a3b8",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                Speak.
              </h2>
            </LineReveal>
            <LineReveal delay={0.15}>
              <h2
                style={{
                  margin: "0 0 40px",
                  fontSize: "clamp(44px, 6vw, 80px)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#f0fdf4",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                Sell. Earn.
              </h2>
            </LineReveal>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE_SILK }}
              style={{
                margin: "0 0 40px",
                fontSize: 18,
                color: "rgba(148,163,184,0.7)",
                lineHeight: 1.75,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                maxWidth: 420,
              }}
            >
              Bolo understands Hindi, Punjabi, and Hinglish natively. No
              smartphone literacy required. Works offline on 2G. The market
              comes to the farmer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE_SILK }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              {[
                { label: "Hindi", icon: <Mic size={11} /> },
                { label: "Punjabi", icon: <Mic size={11} /> },
                { label: "Hinglish", icon: <Mic size={11} /> },
                { label: "Offline", icon: <WifiOff size={11} /> },
              ].map((t) => (
                <div
                  key={t.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(34,197,94,0.2)",
                    background: "rgba(34,197,94,0.05)",
                    fontSize: 12,
                    color: "#4ade80",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {t.icon} {t.label}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60, filter: "blur(24px)" }}
            animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.3, ease: EASE_SILK, delay: 0.2 }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(10,31,14,0.9), rgba(2,10,4,0.95))",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 28,
                padding: 48,
                backdropFilter: "blur(40px)",
                boxShadow:
                  "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 44,
                  position: "relative",
                  height: 120,
                }}
              >
                {[1, 2, 3, 4].map((r) => (
                  <motion.div
                    key={r}
                    animate={{
                      scale: [1, 1.3 + r * 0.2, 1],
                      opacity: [0.25, 0, 0.25],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: r * 0.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 52 + r * 20,
                      height: 52 + r * 20,
                      borderRadius: "50%",
                      border: `1px solid rgba(34,197,94,${0.5 - r * 0.08})`,
                    }}
                  />
                ))}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)",
                      "0 0 40px rgba(34,197,94,0.6), 0 0 100px rgba(34,197,94,0.2)",
                      "0 0 20px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <Mic size={26} color="#fff" />
                </motion.div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  height: 52,
                  marginBottom: 32,
                }}
              >
                {Array.from({ length: 28 }, (_, i) => {
                  const baseH = 8 + Math.abs(Math.sin(i * 0.6)) * 36;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        height: [baseH, baseH * 0.3, baseH * 1.4, baseH],
                      }}
                      transition={{
                        duration: 1.4 + (i % 3) * 0.2,
                        delay: i * 0.04,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        width: 3,
                        borderRadius: 3,
                        background: `linear-gradient(to top, #22c55e, #86efac)`,
                        opacity: 0.7 + (i % 4) * 0.075,
                        boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                      }}
                    />
                  );
                })}
              </div>

              <div
                style={{
                  background: "rgba(5,46,22,0.5)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  minHeight: 88,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: EASE_SILK }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: 18,
                        color: "#86efac",
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      "{phrases[phraseIdx].text}"
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        color: "rgba(74,222,128,0.5)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {phrases[phraseIdx].lang} • Detected
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 8px #22c55e",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#22c55e",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    Listening…
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    color: "#334155",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  <WifiOff size={11} /> Offline Ready
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
//  IMPACT / STATS
// ─────────────────────────────────────────
function Counter({ to, suffix = "", dur = 2.4 }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s: number | null = null;
    const raf = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / (dur * 1000), 1);
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.floor(to * e));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to, dur]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function ImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const stats = [
    {
      val: 2400000,
      suf: "+",
      label: "Farmers onboarded",
      sub: "Across 28 states",
    },
    { val: 18700000, suf: "+", label: "Bids placed", sub: "Last 12 months" },
    { val: 340, suf: "Cr+", label: "Trade volume", sub: "INR" },
    { val: 94, suf: "%", label: "Price transparency", sub: "vs. open market" },
  ];

  return (
    <section ref={ref} style={{ background: "#020a04", padding: "0 0 160px" }}>
      <div
        style={{
          position: "relative",
          height: 400,
          overflow: "hidden",
          marginBottom: 100,
        }}
      >
        <ParallaxImage
          src={IMAGES.harvest}
          alt="Harvest"
          style={{ position: "absolute", inset: 0, height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, #020a04 0%, transparent 30%, transparent 70%, #020a04 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE_SILK }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                color: "#22c55e",
                textTransform: "uppercase",
                fontFamily: "'Space Mono', monospace",
                marginBottom: 16,
              }}
            >
              The Numbers
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(40px, 7vw, 88px)",
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond', serif",
                color: "#f0fdf4",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                textShadow: "0 4px 40px rgba(0,0,0,0.8)",
              }}
            >
              Impact at scale.
            </h2>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_SILK }}
              style={{
                padding: "48px 36px",
                borderTop: "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px, 4.5vw, 64px)",
                  fontWeight: 700,
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#f0fdf4",
                  lineHeight: 1,
                  marginBottom: 12,
                  letterSpacing: "-0.03em",
                }}
              >
                <Counter to={s.val} suffix={s.suf} />
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#94a3b8",
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 400,
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#334155",
                  letterSpacing: "0.1em",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
//  SDG KINETIC MARQUEE
// ─────────────────────────────────────────
function SDGStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "#010702",
        overflow: "hidden",
        padding: "44px 0",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        style={{ display: "flex", whiteSpace: "nowrap", gap: 120 }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <h2
            key={i}
            style={{
              margin: 0,
              fontSize: "clamp(72px, 9vw, 120px)",
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', serif",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(34,197,94,0.2)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            ZERO HUNGER &nbsp;·&nbsp; NO POVERTY &nbsp;·&nbsp; DECENT WORK
            &nbsp;·&nbsp; RESPONSIBLE GROWTH &nbsp;·&nbsp;
          </h2>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
//  FINAL CTA
// ─────────────────────────────────────────
function FinalCTA() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#010702",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={IMAGES.field}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(1,7,2,0.2) 0%, rgba(1,7,2,0.98) 75%)",
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 2.5, ease: EASE_SILK }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "100px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_SILK }}
          style={{
            fontSize: 11,
            letterSpacing: "0.4em",
            color: "#22c55e",
            textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace",
            marginBottom: 40,
          }}
        >
          The revolution starts
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 0.15 }}
            style={{
              margin: 0,
              fontSize: "clamp(60px, 11vw, 148px)",
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond', serif",
              color: "#f0fdf4",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            The soil
          </motion.h2>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 64 }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: EASE_SILK, delay: 0.28 }}
            style={{
              margin: 0,
              fontSize: "clamp(60px, 11vw, 148px)",
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', serif",
              background: "linear-gradient(135deg, #4ade80, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            is ready.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_SILK, delay: 0.55 }}
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.button
            onClick={() => router.push("/onboarding")}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 80px rgba(34,197,94,0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "22px 60px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Barlow', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 0 40px rgba(34,197,94,0.35)",
            }}
          >
            Initialize FarmHers OS <ChevronRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: "rgba(34,197,94,0.5)" }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "22px 44px",
              borderRadius: 999,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(240,253,244,0.7)",
              fontFamily: "'Barlow', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "border-color 0.3s",
            }}
          >
            <Play size={14} fill="currentColor" /> Watch the Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: "#010702",
        borderTop: "1px solid rgba(34,197,94,0.07)",
        padding: "60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf size={14} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#334155",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.04em",
              }}
            >
              AgriLink
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#1e293b",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            © 2026 FarmHers Team — Google Solution Challenge
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacy", "Terms", "Investors", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 13,
                  color: "#1e293b",
                  textDecoration: "none",
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────
export default function AgriLinkLuxury() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      style={{ background: "#020a04", color: "#e2e8f0", overflowX: "hidden" }}
    >
      <FontLoader />
      <Grain opacity={0.045} />
      <Nav />
      <Hero />
      <Marquee />
      <EditorialIntro />
      <FeaturesSection />
      <BoloSection />
      <ImpactSection />
      <SDGStrip />
      <FinalCTA />
      <Footer />
    </div>
  );
}
