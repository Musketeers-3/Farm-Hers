"use client";
import { useRef, useState, useEffect, useCallback, MouseEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mic, WifiOff } from "lucide-react";
import { IMG, SILK } from "@/components/ui/constants";

// 🔥 THE FIX: Removed the BoloCanvas dynamic import completely to prevent WebGL context crashes.

export default function BoloSpotlight() {
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
  }, [inView, phase, phraseIdx]);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView]);

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
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* 🔥 Lowered image opacity to let the Master WebGL scene shine through */}
        <img
          src={IMG.village}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #020a04, transparent, #020a04)",
            opacity: phase >= 1 ? 0.6 : 0,
            transition: "opacity 1.2s ease",
            pointerEvents: "none"
          }}
        />
      </div>

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
          background: "radial-gradient(circle,rgba(34,197,94,0.08) 0%,transparent 65%)",
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
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)"
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
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)"
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
                  textShadow: "0 4px 20px rgba(0,0,0,0.8)"
                }}
              >
                Sell. Earn.
              </h2>
              <p
                style={{
                  margin: "0 0 40px",
                  fontSize: 18,
                  color: "rgba(240,253,244,0.8)",
                  lineHeight: 1.75,
                  fontFamily: "'Barlow',sans-serif",
                  fontWeight: 300,
                  maxWidth: 420,
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)"
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
                      border: "1px solid rgba(34,197,94,0.4)",
                      background: "rgba(2,10,4,0.4)",
                      backdropFilter: "blur(8px)",
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

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              key="bolo-right"
              initial={{ opacity: 0, x: 60, filter: "blur(24px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, ease: SILK, delay: 0.2 }}
              style={{ position: "relative" }}
            >
              {/* 🔥 REMOVED THE BOLOCANVAS WRAPPER COMPLETELY */}
              
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  background: "linear-gradient(135deg,rgba(10,31,14,0.3),rgba(2,10,4,0.4))", /* 🔥 Upgraded Glassmorphism */
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 28,
                  padding: 48,
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 40px 120px rgba(0,0,0,0.5),0 0 80px rgba(34,197,94,0.06)",
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
                <div
                  style={{
                    background: "rgba(5,46,22,0.3)", /* 🔥 Enhanced Glass */
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
                      color: "rgba(74,222,128,0.7)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontFamily: "'Space Mono',monospace",
                    }}
                  >
                    {phrases[phraseIdx].lang}
                  </span>
                </div>
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
                      color: "#94a3b8",
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