"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  CSSProperties,
  MouseEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
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
  type LucideIcon,
} from "lucide-react";

// 🔥 R3F & DREI - THE HEAVY ARTILLERY
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  ContactShadows,
  Sparkles,
} from "@react-three/drei";

// ─────────────────────────────────────────────────────
//  EASING CURVES
// ─────────────────────────────────────────────────────
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SHARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

// ─────────────────────────────────────────────────────
//  IMAGES
// ─────────────────────────────────────────────────────
const IMG = {
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

// ─────────────────────────────────────────────────────
//  THE AMBIENT ATMOSPHERE (GLOBAL 3D DUST)
// ─────────────────────────────────────────────────────
function GlobalAtmosphere() {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Sparkles
          count={400}
          scale={25}
          size={3}
          speed={0.4}
          opacity={0.3}
          color="#fbbf24"
          noise={0.2}
        />
        <Sparkles
          count={150}
          scale={15}
          size={2}
          speed={0.6}
          opacity={0.5}
          color="#22c55e"
          noise={0.5}
        />
      </Canvas>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  FONT LOADER & GRAIN
// ─────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("ag-f")) return;
    const l = document.createElement("link");
    l.id = "ag-f";
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600;1,700&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
}

function Grain() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.045,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────
//  MAGNETIC BUTTON
// ─────────────────────────────────────────────────────
interface MagBtnProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  dataCursor?: string;
}
function MagBtn({
  children,
  style = {},
  onClick,
  dataCursor = "",
}: MagBtnProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      data-cursor={dataCursor}
      onClick={onClick}
      style={{ ...style, cursor: "pointer" } as CSSProperties}
    >
      {children}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────
//  LINE REVEAL & PARALLAX
// ─────────────────────────────────────────────────────
interface LineRevealProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}
function LineReveal({ children, delay = 0, style = {} }: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 1.0, ease: SILK, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxImgProps {
  src: string;
  alt?: string;
  style?: CSSProperties;
}
function ParallaxImg({ src, alt = "", style = {} }: ParallaxImgProps) {
  const ref = useRef<HTMLDivElement>(null);
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

// ─────────────────────────────────────────────────────
//  NAV
// ─────────────────────────────────────────────────────
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
      transition={{ duration: 1.2, ease: EXPO, delay: 0.4 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: "0 48px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(2,10,4,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(34,197,94,0.1)"
          : "1px solid transparent",
        transition: "all 0.6s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <motion.div
          whileHover={{ rotate: 15 }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "linear-gradient(135deg,#22c55e,#15803d)",
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
            fontFamily: "'Cormorant Garamond',serif",
            letterSpacing: "0.04em",
          }}
        >
          AgriLink
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "#22c55e",
            textTransform: "uppercase",
            fontFamily: "'Space Mono',monospace",
          }}
        >
          Solution Challenge '26
        </span>
        <MagBtn
          onClick={() => router.push("/onboarding")}
          dataCursor="ENTER →"
          style={{
            padding: "10px 28px",
            borderRadius: 999,
            background: "#f0fdf4",
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            color: "#020a04",
            fontFamily: "'Barlow',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            letterSpacing: "0.02em",
          }}
        >
          Enter Platform <ArrowRight size={14} />
        </MagBtn>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────
//  HERO (With Flashlight)
// ─────────────────────────────────────────────────────
function Hero() {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const [loaded, setLoaded] = useState(false);

  // Flashlight math
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
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
        transition={{ duration: 1.4, ease: SHARP, delay: 0.1 }}
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
              fontFamily: "'Space Mono',monospace",
            }}
          >
            LOADING
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ position: "absolute", inset: 0, y: imgY, scale: imgScale }}
      >
        <img
          src={IMG.hero}
          alt="Golden wheat fields"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: useTransform(
              [springX, springY],
              ([x, y]) =>
                `radial-gradient(circle 800px at ${x}px ${y}px, rgba(2,10,4,0.3) 0%, rgba(2,10,4,0.98) 100%)`,
            ),
          }}
        />
      </motion.div>

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
          transition={{ duration: 0.9, ease: EXPO, delay: 1.6 }}
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
              fontFamily: "'Space Mono',monospace",
            }}
          >
            The Agricultural Intelligence Platform
          </span>
        </motion.div>

        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h1
            initial={{ y: "100%" }}
            animate={loaded ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: SILK, delay: 1.7 }}
            style={{
              margin: 0,
              fontSize: "clamp(56px,9vw,128px)",
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond',serif",
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
            transition={{ duration: 1.1, ease: SILK, delay: 1.85 }}
            style={{
              margin: 0,
              fontSize: "clamp(56px,9vw,128px)",
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond',serif",
              background: "linear-gradient(135deg,#4ade80,#22c55e,#86efac)",
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
          transition={{ duration: 1, ease: EXPO, delay: 2.15 }}
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
              fontSize: "clamp(15px,1.5vw,18px)",
              color: "rgba(240,253,244,0.6)",
              lineHeight: 1.65,
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            Voice-native. Zero middlemen. Direct enterprise contracts.
            <br />
            Empowering 50M+ farmers with AI that speaks their language.
          </p>
          <MagBtn
            onClick={() => router.push("/onboarding")}
            dataCursor="ENTER →"
            style={{
              padding: "18px 48px",
              borderRadius: 999,
              background: "linear-gradient(135deg,#22c55e,#15803d)",
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Barlow',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 0 30px rgba(34,197,94,0.3)",
            }}
          >
            Enter Platform <ArrowRight size={16} />
          </MagBtn>
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
            background: "linear-gradient(to bottom,#22c55e,transparent)",
          }}
        />
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "rgba(34,197,94,0.6)",
            textTransform: "uppercase",
            fontFamily: "'Space Mono',monospace",
            writingMode: "vertical-lr",
          }}
        >
          scroll
        </span>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
//  🔥 CINEMATIC SCROLL-LOCK SEQUENCE
// ─────────────────────────────────────────────────────
function CinematicBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30% 0px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#020a04",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: "#000",
          opacity: phase >= 1 && phase < 5 ? 0.85 : 0,
          transition: "opacity 0.9s ease",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={IMG.harvest}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom,#020a04,rgba(2,10,4,0.4),#020a04)",
          }}
        />
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{
          y: phase >= 5 ? -140 : 0,
          opacity: phase >= 5 ? 0 : 1,
        }}
        transition={{ duration: 0.9, ease: EXPO }}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <AnimatePresence>
          {phase >= 2 && phase < 5 && (
            <motion.div
              key="line1"
              initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(16px)" }}
              transition={{ duration: 0.9, ease: SILK }}
              style={{ marginBottom: 16 }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(14px,1.5vw,18px)",
                  color: "rgba(34,197,94,0.6)",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                The problem has always been
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase >= 3 && phase < 5 && (
            <motion.div
              key="headline"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(30px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.3, filter: "blur(20px)" }}
              transition={{ duration: 1.0, ease: SILK }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(52px,9vw,130px)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond',serif",
                  color: "#f0fdf4",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                }}
              >
                Middlemen.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {phase >= 4 && phase < 5 && (
            <motion.div
              key="line2"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: SILK }}
              style={{ marginTop: 32, transformOrigin: "center" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    maxWidth: 200,
                    height: 1,
                    background: "linear-gradient(to right,transparent,#22c55e)",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.3em",
                    color: "#22c55e",
                    fontFamily: "'Space Mono',monospace",
                    textTransform: "uppercase",
                  }}
                >
                  AgriLink removes them
                </span>
                <div
                  style={{
                    flex: 1,
                    maxWidth: 200,
                    height: 1,
                    background: "linear-gradient(to left,transparent,#22c55e)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {phase >= 1 && phase < 5 && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: 48,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 2.8, ease: "linear" }}
              style={{
                height: 1,
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "rgba(34,197,94,0.5)",
                letterSpacing: "0.3em",
                fontFamily: "'Space Mono',monospace",
              }}
            >
              CONTINUING
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  MARQUEE
// ─────────────────────────────────────────────────────
function Marquee() {
  return (
    <div
      style={{
        background: "rgba(2, 10, 4, 0.8)",
        overflow: "hidden",
        borderTop: "1px solid rgba(34,197,94,0.08)",
        borderBottom: "1px solid rgba(34,197,94,0.08)",
        padding: "28px 0",
        position: "relative",
        zIndex: 10,
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
              fontSize: "clamp(11px,1.2vw,14px)",
              color: "rgba(34,197,94,0.35)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "'Space Mono',monospace",
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

// ─────────────────────────────────────────────────────
//  EDITORIAL INTRO
// ─────────────────────────────────────────────────────
function EditorialIntro() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "140px 60px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
              transition={{ duration: 0.9, ease: SILK }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono',monospace",
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
                  fontFamily: "'Cormorant Garamond',serif",
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
                    fontSize: "clamp(32px,4.5vw,60px)",
                    fontWeight: i === 0 ? 300 : 700,
                    fontStyle: i === 1 ? "italic" : "normal",
                    fontFamily: "'Cormorant Garamond',serif",
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
              transition={{ duration: 1.2, ease: SILK, delay: 0.5 }}
              style={{
                height: 1,
                background: "linear-gradient(90deg,#22c55e,transparent)",
                transformOrigin: "left",
                margin: "40px 0",
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: SILK, delay: 0.6 }}
              style={{
                margin: 0,
                fontSize: 18,
                color: "rgba(148,163,184,0.8)",
                lineHeight: 1.75,
                fontFamily: "'Barlow',sans-serif",
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

// ─────────────────────────────────────────────────────
//  FEATURE CARDS (ALL 4 RESTORED & STICKY)
// ─────────────────────────────────────────────────────
interface Feature {
  index: number;
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  icon: LucideIcon;
  accent: string;
  image: string;
}
const FEATURES: Feature[] = [
  {
    index: 1,
    tag: "Voice AI",
    title: "Bolo Intelligence.",
    subtitle: "Speak to the market.",
    body: "Illiteracy is obsolete. Farmers speak in natural Hindi, Punjabi, or Hinglish to list crops, check live commodity pricing, and close multi-crore contracts. Bolo handles everything.",
    icon: Mic,
    accent: "#22c55e",
    image: IMG.farmers,
  },
  {
    index: 2,
    tag: "Network",
    title: "Micro-Pooling.",
    subtitle: "Power in numbers.",
    body: "A two-acre farmer cannot fulfill an ITC contract alone. But a hundred of them can. AgriLink clusters smallholder yields dynamically to unlock premium corporate pricing tiers.",
    icon: Users,
    accent: "#3b82f6",
    image: IMG.field,
  },
  {
    index: 3,
    tag: "Fintech",
    title: "Smart Escrow.",
    subtitle: "Zero default risk.",
    body: "Corporate funds are locked in cryptographic escrow before a single seed leaves the village. Payouts execute instantly upon delivery validation. Total financial security.",
    icon: ShieldCheck,
    accent: "#a855f7",
    image: IMG.market,
  },
  {
    index: 4,
    tag: "Analytics",
    title: "Live Telemetry.",
    subtitle: "The pulse of the harvest.",
    body: "IoT integrations stream live Mandi analytics directly to your dashboard. The days of selling blindly below fair market value end today.",
    icon: TrendingUp,
    accent: "#f59e0b",
    image: IMG.wheat,
  },
];

function FeatureCard({ feat, compact }: { feat: Feature; compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const Icon = feat.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: SILK }}
      style={{
        position: "sticky",
        top: compact ? `${20 + feat.index * 12}px` : `${60 + feat.index * 20}px`,
        zIndex: feat.index * 10,
        borderRadius: compact ? 22 : 32,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(3,15,6,0.8)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
          minHeight: compact ? 0 : 440,
        }}
      >
        <div
          style={{
            padding: compact ? "34px 24px" : "52px 44px",
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
              background: `radial-gradient(circle,${feat.accent}12 0%,transparent 70%)`,
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
                    fontFamily: "'Space Mono',monospace",
                    marginBottom: 3,
                  }}
                >
                  {feat.tag}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    fontFamily: "'Barlow',sans-serif",
                  }}
                >
                  {feat.subtitle}
                </div>
              </div>
            </div>
            <h3
              style={{
                margin: "0 0 24px",
                fontSize: compact ? "clamp(28px,8vw,38px)" : "clamp(32px,3.6vw,50px)",
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond',serif",
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
                fontSize: compact ? 15 : 16,
                color: "rgba(148,163,184,0.75)",
                lineHeight: 1.75,
                fontFamily: "'Barlow',sans-serif",
                fontWeight: 300,
              }}
            >
              {feat.body}
            </p>
          </div>
          <div
            style={{
              fontSize: compact ? 82 : 104,
              fontWeight: 700,
              color: `${feat.accent}06`,
              fontFamily: "'Cormorant Garamond',serif",
              lineHeight: 1,
              position: "absolute",
              bottom: compact ? -10 : -14,
              left: compact ? 18 : 32,
              letterSpacing: "-0.05em",
              pointerEvents: "none",
            }}
          >
            0{feat.index}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: compact ? 260 : undefined,
          }}
        >
          <ParallaxImg
            src={feat.image}
            alt={feat.title}
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right,rgba(3,15,6,0.8) 0%,rgba(3,15,6,0.3) 40%,transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg,transparent 40%,${feat.accent}08 100%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function FeaturesSection() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section
      style={{
        background: "transparent",
        padding: "80px 40px 160px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 80 }}>
          <LineReveal>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                color: "#22c55e",
                textTransform: "uppercase",
                fontFamily: "'Space Mono',monospace",
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
                fontSize: "clamp(40px,6vw,80px)",
                fontWeight: 300,
                fontFamily: "'Cormorant Garamond',serif",
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
                fontSize: "clamp(40px,6vw,80px)",
                fontWeight: 700,
                fontStyle: "italic",
                fontFamily: "'Cormorant Garamond',serif",
                color: "#22c55e",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
              }}
            >
              unstoppable.
            </h2>
          </LineReveal>
        </div>
        {FEATURES.map((feat) => (
          <FeatureCard key={feat.index} feat={feat} compact={compact} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
//  🔥 THE BOLO 3D MASTERPIECE (Full Original UI + Glass Orb)
// ─────────────────────────────────────────────────────
function GlassOrb() {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.8, 16]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={2}
          thickness={1.8}
          chromaticAberration={0.08}
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#dcfce7"
          roughness={0.05}
          ior={1.5}
          transmission={1}
          clearcoat={1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#22c55e" wireframe />
      </mesh>
    </Float>
  );
}

function BoloSpotlight() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [micOffset, setMicOffset] = useState({ x: 0, y: 0 });

  const phrases = [
    { text: "मेरी गेहूं की फसल का बोली शुरू करो", lang: "Hindi • Detected" },
    { text: "ਮੇਰੀ ਕਣਕ ਦੀ ਬੋਲੀ ਸ਼ੁਰੂ ਕਰੋ", lang: "Punjabi • Detected" },
    { text: "Bhai, meri fasal ka bhav kya hai?", lang: "Hinglish • Detected" },
  ];

  // Typewriter
  useEffect(() => {
    if (!inView || phase < 2) return;
    const full = phrases[phraseIdx].text;
    let i = 0;
    setTypedText("");
    const t = setInterval(() => {
      i++;
      setTypedText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        setTimeout(() => {
          setPhraseIdx((p) => (p + 1) % phrases.length);
          setTypedText("");
        }, 2400);
      }
    }, 45);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, phase, phraseIdx]);

  // Phase sequencing
  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setMicOffset({
      x: (e.clientX - r.left - r.width / 2) * 0.04,
      y: (e.clientY - r.top - r.height / 2) * 0.04,
    });
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "transparent",
        zIndex: 10,
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={IMG.village}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: phase >= 1 ? 0.88 : 0,
            transition: "opacity 1.2s ease",
          }}
        />
      </div>

      {/* Spotlight glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: SILK }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(34,197,94,0.08) 0%,transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 100,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              key="bolo-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: SILK }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.4em",
                  color: "#22c55e",
                  textTransform: "uppercase",
                  fontFamily: "'Space Mono',monospace",
                  marginBottom: 32,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ width: 32, height: 1, background: "#22c55e" }} />{" "}
                AI Voice Assistant
              </div>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "clamp(44px,6vw,80px)",
                  fontWeight: 300,
                  fontFamily: "'Cormorant Garamond',serif",
                  color: "#94a3b8",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                Speak.
              </h2>
              <h2
                style={{
                  margin: "0 0 40px",
                  fontSize: "clamp(44px,6vw,80px)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "'Cormorant Garamond',serif",
                  color: "#f0fdf4",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                Sell. Earn.
              </h2>
              <p
                style={{
                  margin: "0 0 40px",
                  fontSize: 18,
                  color: "rgba(148,163,184,0.7)",
                  lineHeight: 1.75,
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 300,
                  maxWidth: 420,
                }}
              >
                Bolo understands Hindi, Punjabi, and Hinglish natively. No
                smartphone literacy required. Works offline on 2G. The market
                comes to the farmer.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Hindi", "Punjabi", "Hinglish", "Offline"].map((t) => (
                  <div
                    key={t}
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
                      fontFamily: "'Barlow',sans-serif",
                    }}
                  >
                    <Mic size={11} /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: The Merge of their Exact UI + 3D Glass Orb */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              key="bolo-right"
              initial={{ opacity: 0, x: 60, filter: "blur(24px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, ease: SILK, delay: 0.2 }}
              style={{ position: "relative" }}
            >
              {/* THE 3D GLASS ORB BEHIND THE UI CARD */}
              <div
                style={{
                  position: "absolute",
                  inset: "-30%",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              >
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                  <ambientLight intensity={0.4} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={2}
                    color="#22c55e"
                  />
                  <Environment preset="city" />
                  <GlassOrb />
                  <ContactShadows
                    position={[0, -3, 0]}
                    opacity={0.6}
                    scale={15}
                    blur={2.5}
                    far={4}
                    color="#15803d"
                  />
                </Canvas>
              </div>

              {/* THEIR EXACT UI CARD (Updated with slight transparency so orb shows through) */}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  background:
                    "linear-gradient(135deg,rgba(10,31,14,0.6),rgba(2,10,4,0.7))",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 28,
                  padding: 48,
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 40px 120px rgba(0,0,0,0.8),0 0 80px rgba(34,197,94,0.06)",
                }}
              >
                {/* Cursor-reactive mic */}
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
                        transform: "translate(-50%,-50%)",
                        width: 52 + r * 20,
                        height: 52 + r * 20,
                        borderRadius: "50%",
                        border: `1px solid rgba(34,197,94,${0.5 - r * 0.08})`,
                      }}
                    />
                  ))}
                  <motion.div
                    animate={{
                      x: micOffset.x,
                      y: micOffset.y,
                      boxShadow: [
                        "0 0 20px rgba(34,197,94,0.3),0 0 60px rgba(34,197,94,0.1)",
                        "0 0 40px rgba(34,197,94,0.6),0 0 100px rgba(34,197,94,0.2)",
                        "0 0 20px rgba(34,197,94,0.3),0 0 60px rgba(34,197,94,0.1)",
                      ],
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 200, damping: 20 },
                      y: { type: "spring", stiffness: 200, damping: 20 },
                      boxShadow: { duration: 2.5, repeat: Infinity },
                    }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <Mic size={26} color="#fff" />
                  </motion.div>
                </div>

                {/* Waveform */}
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
                          background: "linear-gradient(to top,#22c55e,#86efac)",
                          opacity: 0.7 + (i % 4) * 0.075,
                          boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Typewriter display */}
                <div
                  style={{
                    background: "rgba(5,46,22,0.5)",
                    border: "1px solid rgba(34,197,94,0.15)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    minHeight: 96,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 18,
                      color: "#86efac",
                      fontFamily: "'Barlow',sans-serif",
                      fontWeight: 400,
                      lineHeight: 1.5,
                      minHeight: 52,
                    }}
                  >
                    &ldquo;{typedText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: "1em",
                        background: "#22c55e",
                        marginLeft: 2,
                        verticalAlign: "text-bottom",
                      }}
                    />
                    &rdquo;
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(74,222,128,0.5)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "'Space Mono',monospace",
                    }}
                  >
                    {phrases[phraseIdx].lang}
                  </span>
                </div>

                {/* Status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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
                        fontFamily: "'Space Mono',monospace",
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
                      fontFamily: "'Space Mono',monospace",
                    }}
                  >
                    <WifiOff size={11} /> Offline Ready
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
//  🔥 3D AUCTION SCENE (Perfectly Restored)
// ─────────────────────────────────────────────────────
interface Crop {
  name: string;
  hindi: string;
  region: string;
  price: number;
  change: string;
  bids: number;
  color: string;
  emoji: string;
}
const CROPS: Crop[] = [
  {
    name: "Wheat",
    hindi: "गेहूं",
    region: "Punjab",
    price: 2340,
    change: "+4.2%",
    bids: 38,
    color: "#f59e0b",
    emoji: "🌾",
  },
  {
    name: "Rice",
    hindi: "चावल",
    region: "Haryana",
    price: 3120,
    change: "+1.8%",
    bids: 24,
    color: "#22c55e",
    emoji: "🌿",
  },
  {
    name: "Cotton",
    hindi: "कपास",
    region: "Maharashtra",
    price: 6480,
    change: "+6.5%",
    bids: 51,
    color: "#a78bfa",
    emoji: "☁️",
  },
  {
    name: "Soybean",
    hindi: "सोयाबीन",
    region: "MP",
    price: 4250,
    change: "+2.1%",
    bids: 19,
    color: "#fb7185",
    emoji: "🫘",
  },
  {
    name: "Maize",
    hindi: "मक्का",
    region: "Karnataka",
    price: 1890,
    change: "+3.3%",
    bids: 29,
    color: "#fbbf24",
    emoji: "🌽",
  },
];

function AuctionCard({
  crop,
  index,
  compact,
}: {
  crop: Crop;
  index: number;
  compact: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);
  const [bid, setBid] = useState(crop.price);
  const total = CROPS.length;
  const offset = index - (total - 1) / 2;
  const baseRotateY = offset * 8;

  useEffect(() => {
    const t = setInterval(
      () => setBid((p) => p + Math.floor(Math.random() * 12) + 1),
      1800 + index * 300,
    );
    return () => clearInterval(t);
  }, [index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, rotateY: baseRotateY * 2 }}
      animate={
        inView ? { opacity: 1, y: 0, rotateY: hovered ? 0 : baseRotateY } : {}
      }
      whileHover={{ rotateY: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: SILK, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="BID NOW"
      style={{
        flex: compact ? "0 0 220px" : "0 0 252px",
        background: "linear-gradient(135deg,rgba(3,15,6,0.9),rgba(2,10,4,0.9))",
        border: `1px solid ${hovered ? crop.color + "66" : "rgba(255,255,255,0.06)"}`,
        borderRadius: compact ? 20 : 24,
        padding: compact ? 20 : 26,
        boxShadow: hovered
          ? `0 30px 80px rgba(0,0,0,0.8),0 0 40px ${crop.color}22`
          : "0 20px 60px rgba(0,0,0,0.6)",
        transition: "border-color 0.3s,box-shadow 0.3s",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg,transparent,${crop.color},transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: "-20%",
          width: "80%",
          height: "80%",
          borderRadius: "50%",
          background: `radial-gradient(circle,${crop.color}10 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: `${crop.color}12`,
            border: `1px solid ${crop.color}22`,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: crop.color,
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: crop.color,
              fontFamily: "'Space Mono',monospace",
              letterSpacing: "0.15em",
            }}
          >
            LIVE
          </span>
        </div>
        <span style={{ fontSize: 22 }}>{crop.emoji}</span>
      </div>
      <h3
        style={{
            margin: "0 0 4px",
            fontSize: compact ? 24 : 28,
          fontWeight: 700,
          fontFamily: "'Cormorant Garamond',serif",
          color: "#f0fdf4",
          letterSpacing: "-0.02em",
        }}
      >
        {crop.name}{" "}
        <span style={{ fontSize: 14, color: "#334155", fontWeight: 400 }}>
          {crop.hindi}
        </span>
      </h3>
      <p
        style={{
            margin: compact ? "0 0 20px" : "0 0 28px",
          fontSize: 12,
          color: "#475569",
          fontFamily: "'Barlow',sans-serif",
        }}
      >
        {crop.region} Mandi
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <motion.span
          key={bid}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: compact ? 32 : 38,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontFamily: "'Cormorant Garamond',serif",
            color: crop.color,
          }}
        >
          ₹{bid.toLocaleString()}
        </motion.span>
        <span
          style={{
            fontSize: 12,
            color: "#22c55e",
            fontFamily: "'Space Mono',monospace",
          }}
        >
          {crop.change}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#334155",
              marginBottom: 4,
              fontFamily: "'Space Mono',monospace",
            }}
          >
            BIDS
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#f0fdf4",
              fontFamily: "'Cormorant Garamond',serif",
            }}
          >
            {crop.bids}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              color: "#334155",
              marginBottom: 4,
              fontFamily: "'Space Mono',monospace",
            }}
          >
            STATUS
          </div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#22c55e",
              fontFamily: "'Space Mono',monospace",
            }}
          >
            LIVE
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function AuctionScene() {
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "140px 0",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 60px",
          marginBottom: 80,
        }}
      >
        <LineReveal>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "#22c55e",
              textTransform: "uppercase",
              fontFamily: "'Space Mono',monospace",
              marginBottom: 20,
            }}
          >
            Live Auction Floor
          </div>
        </LineReveal>
        <LineReveal delay={0.1}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(40px,6vw,80px)",
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond',serif",
              color: "#f0fdf4",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Real bids.
          </h2>
        </LineReveal>
        <LineReveal delay={0.18}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(40px,6vw,80px)",
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond',serif",
              color: "#22c55e",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Real power.
          </h2>
        </LineReveal>
      </div>

      <div
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: 20,
          }}
        >
          {CROPS.map((crop, i) => (
            <AuctionCard key={i} crop={crop} index={i} compact={compact} />
          ))}
        </div>
      </div>

      {/* Live ticker */}
      <div style={{ maxWidth: 1200, margin: "40px auto 0", padding: "0 60px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            overflow: "hidden",
            borderTop: "1px solid rgba(34,197,94,0.08)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#22c55e",
                letterSpacing: "0.2em",
                fontFamily: "'Space Mono',monospace",
              }}
            >
              LIVE FEED
            </span>
          </div>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 16, ease: "linear", repeat: Infinity }}
            style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}
          >
            {[...CROPS, ...CROPS].map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  color: "rgba(148,163,184,0.6)",
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                {c.name}{" "}
                <span style={{ color: c.color }}>
                  ₹{c.price.toLocaleString()}
                </span>{" "}
                {c.change}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
//  IMPACT / STATS (Perfectly Restored)
// ─────────────────────────────────────────────────────
interface CounterProps {
  to: number;
  suffix?: string;
  dur?: number;
}
function Counter({ to, suffix = "", dur = 2.4 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTs: number | null = null;
    const raf = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / (dur * 1000), 1);
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
  const ref = useRef<HTMLElement>(null);
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
    <section
      ref={ref}
      style={{
        background: "transparent",
        padding: "0 0 160px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          height: 400,
          overflow: "hidden",
          marginBottom: 100,
        }}
      >
        <ParallaxImg
          src={IMG.harvest}
          alt="Harvest"
          style={{ position: "absolute", inset: 0, height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom,rgba(2,10,4,0.9) 0%,transparent 30%,transparent 70%,rgba(2,10,4,0.9) 100%)",
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
            transition={{ duration: 1, ease: SILK }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.35em",
                color: "#22c55e",
                textTransform: "uppercase",
                fontFamily: "'Space Mono',monospace",
                marginBottom: 16,
              }}
            >
              The Numbers
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(40px,7vw,88px)",
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond',serif",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 1,
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.12, ease: SILK }}
              style={{
                padding: "48px 36px",
                borderTop: "1px solid rgba(34,197,94,0.12)",
                borderRight: i < 3 ? "1px solid rgba(34,197,94,0.08)" : "none",
                background: "rgba(2,10,4,0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px,4.5vw,64px)",
                  fontWeight: 700,
                  fontFamily: "'Cormorant Garamond',serif",
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
                  fontFamily: "'Barlow',sans-serif",
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
                  fontFamily: "'Space Mono',monospace",
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

// ─────────────────────────────────────────────────────
//  SDG STRIP (Perfectly Restored)
// ─────────────────────────────────────────────────────
function SDGStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(1,7,2,0.8)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
        padding: "44px 0",
        position: "relative",
        zIndex: 10,
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
              fontSize: "clamp(72px,9vw,120px)",
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond',serif",
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

// ─────────────────────────────────────────────────────
//  FINAL CTA (Perfectly Restored)
// ─────────────────────────────────────────────────────
function FinalCTA() {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
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
        background: "transparent",
        zIndex: 10,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={IMG.field}
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
              "radial-gradient(ellipse at center,rgba(1,7,2,0.2) 0%,rgba(1,7,2,0.98) 75%)",
          }}
        />
      </div>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 2.5, ease: SILK }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 60%)",
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
          transition={{ duration: 0.8, ease: SILK }}
          style={{
            fontSize: 11,
            letterSpacing: "0.4em",
            color: "#22c55e",
            textTransform: "uppercase",
            fontFamily: "'Space Mono',monospace",
            marginBottom: 40,
          }}
        >
          The revolution starts
        </motion.div>
        <div style={{ overflow: "hidden", marginBottom: 8 }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1.1, ease: SILK, delay: 0.15 }}
            style={{
              margin: 0,
              fontSize: "clamp(60px,11vw,148px)",
              fontWeight: 300,
              fontFamily: "'Cormorant Garamond',serif",
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
            transition={{ duration: 1.1, ease: SILK, delay: 0.28 }}
            style={{
              margin: 0,
              fontSize: "clamp(60px,11vw,148px)",
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond',serif",
              background: "linear-gradient(135deg,#4ade80,#22c55e)",
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
          transition={{ duration: 1, ease: SILK, delay: 0.55 }}
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <MagBtn
            onClick={() => router.push("/onboarding")}
            dataCursor="LET'S GO"
            style={{
              padding: "22px 60px",
              borderRadius: 999,
              background: "linear-gradient(135deg,#22c55e,#15803d)",
              border: "none",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Barlow',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 0 40px rgba(34,197,94,0.35)",
            }}
          >
            Initialize FarmHers OS <ChevronRight size={20} />
          </MagBtn>
          <MagBtn
            dataCursor="PLAY"
            style={{
              padding: "22px 44px",
              borderRadius: 999,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(240,253,244,0.7)",
              fontFamily: "'Barlow',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Play size={14} fill="currentColor" /> Watch the Story
          </MagBtn>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
//  FOOTER (Perfectly Restored)
// ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: "rgba(1,7,2,0.9)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(34,197,94,0.07)",
        padding: "60px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
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
              background: "linear-gradient(135deg,#22c55e,#15803d)",
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
              fontFamily: "'Cormorant Garamond',serif",
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
            fontFamily: "'Space Mono',monospace",
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
                fontFamily: "'Barlow',sans-serif",
              }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────
//  ROOT (THE MASTERPIECE)
// ─────────────────────────────────────────────────────
export default function AgriLinkGodTier() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div
      style={{
        background: "#020a04",
        color: "#e2e8f0",
        overflowX: "hidden",
      }}
    >
      <FontLoader />
      <GlobalAtmosphere />
      <Grain />

      <Nav />
      <Hero />
      <Marquee />
      <CinematicBreak />
      <EditorialIntro />
      <FeaturesSection />
      <BoloSpotlight />
      <AuctionScene />
      <ImpactSection />
      <SDGStrip />
      <FinalCTA />
      <Footer />
    </div>
  );
}
