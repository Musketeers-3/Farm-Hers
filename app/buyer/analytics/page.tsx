"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Area,
  ComposedChart,
  Line,
} from "recharts";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  MapPin,
  TrendingUp,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import buyerBg from "../../../components/buyer/buyer_dashboard_image.jpeg";
import Image from "next/image";

// ─── DARK MODE tokens (matches BuyerDashboard exactly) ────────────────────────
const DARK = {
  card:         "rgba(8,18,10,0.65)",
  cardStrong:   "rgba(5,14,7,0.70)",
  border:       "rgba(90,158,111,0.15)",
  blur:         "blur(18px)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.20)",
  accentBorder: "rgba(90,158,111,0.30)",
  textSub:      "rgba(255,255,255,0.55)",
  textLabel:    "rgba(255,255,255,0.38)",
  headerBg:     "rgba(6,14,7,0.80)",
  scrim:        "rgba(5,12,6,0.55)",
  glassCard:    "rgba(8,20,12,0.55)",
  glassHighlight: "rgba(90,158,111,0.08)",
};

// ─── LIGHT MODE tokens (original blue-sky aesthetic) ──────────────────────────
const LIGHT = {
  card:         "rgba(200,225,255,0.18)",
  cardStrong:   "rgba(200,225,255,0.25)",
  border:       "rgba(180,210,255,0.30)",
  blur:         "blur(32px)",
  accent:       "#4ade80",
  accentDark:   "#16a34a",
  accentBg:     "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.30)",
  textSub:      "rgba(255,255,255,0.75)",
  textLabel:    "rgba(255,255,255,0.50)",
  headerBg:     "rgba(180,210,255,0.15)",
  scrim:        "rgba(5,10,20,0.42)",
  glassCard:    "rgba(200,230,255,0.12)",
  glassHighlight: "rgba(255,255,255,0.08)",
};

// --- DYNAMIC MULTI-COMMODITY DATA ---
const rawMandiData = {
  jalandhar: [
    { name: "Mon", wheat: 2400, rice: 3100, wheatForecast: 2410, riceForecast: 3120 },
    { name: "Tue", wheat: 2420, rice: 3080, wheatForecast: 2430, riceForecast: 3090 },
    { name: "Wed", wheat: 2450, rice: 3150, wheatForecast: 2460, riceForecast: 3170 },
    { name: "Thu", wheat: 2440, rice: 3200, wheatForecast: 2450, riceForecast: 3220 },
    { name: "Fri", wheat: null, rice: null, wheatForecast: 2480, riceForecast: 3250 },
    { name: "Sat", wheat: null, rice: null, wheatForecast: 2510, riceForecast: 3290 },
    { name: "Sun", wheat: null, rice: null, wheatForecast: 2535, riceForecast: 3320 },
  ],
  khanna: [
    { name: "Mon", wheat: 2510, rice: 3150, wheatForecast: 2520, riceForecast: 3160 },
    { name: "Tue", wheat: 2530, rice: 3120, wheatForecast: 2540, riceForecast: 3130 },
    { name: "Wed", wheat: 2550, rice: 3190, wheatForecast: 2560, riceForecast: 3200 },
    { name: "Thu", wheat: 2545, rice: 3220, wheatForecast: 2555, riceForecast: 3230 },
    { name: "Fri", wheat: null, rice: null, wheatForecast: 2560, riceForecast: 3250 },
    { name: "Sat", wheat: null, rice: null, wheatForecast: 2590, riceForecast: 3280 },
    { name: "Sun", wheat: null, rice: null, wheatForecast: 2610, riceForecast: 3310 },
  ],
};

const liveTrades = [
  { time: "11:20:15", type: "BUY",  crop: "WHEAT", qty: "50Q",  price: "₹2445" },
  { time: "11:20:08", type: "SELL", crop: "RICE",  qty: "100Q", price: "₹3190" },
  { time: "11:19:42", type: "BUY",  crop: "WHEAT", qty: "20Q",  price: "₹2440" },
  { time: "11:18:55", type: "BUY",  crop: "RICE",  qty: "75Q",  price: "₹3200" },
];

const bentoVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Glassy card style helper
function glassStyle(G: typeof DARK, extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: G.glassCard,
    backdropFilter: G.blur,
    WebkitBackdropFilter: G.blur,
    border: `1px solid ${G.border}`,
    boxShadow: `
      0 8px 32px rgba(0,0,0,0.35),
      inset 0 1px 0 ${G.glassHighlight},
      inset 0 0 0 1px rgba(255,255,255,0.03)
    `,
    ...extra,
  };
}

export default function StrategicAnalyticsHub() {
  const router = useRouter();
  const { language } = useAppStore();
  const [activeMandi, setActiveMandi] = useState<keyof typeof rawMandiData>("jalandhar");
  const [selectedCommodity, setSelectedCommodity] = useState<"wheat" | "rice" | "both">("both");
  const [tickerIndex, setTickerIndex] = useState(0);

  // Read isDark from buyer-theme localStorage (shared with BuyerDashboard)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("buyer-theme");
    return saved !== null ? saved === "dark" : true;
  });

  useEffect(() => {
    const interval = setInterval(
      () => setTickerIndex((prev) => (prev + 1) % liveTrades.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  const G = isDark ? DARK : LIGHT;
  const marketData = rawMandiData[activeMandi];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden" style={{ backgroundColor: "#050505" }}>

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0">
        {isDark ? (
          // Dark: same buyer dashboard background image
          <Image src={buyerBg} alt="" fill priority className="object-cover object-bottom" />
        ) : (
          // Light: original blue sky market background
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
              style={{ backgroundImage: "url('/images/market-bg.jpg')" }}
            />
            <div
              className="absolute inset-0"
              style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            />
          </>
        )}
        <div className="absolute inset-0" style={{ background: G.scrim }} />
      </div>

      <div className="relative z-10 p-6 lg:p-10 max-w-[1800px] mx-auto min-h-screen flex flex-col">

        {/* ── TOP NAV ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 shrink-0"
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-full transition-all group"
              style={glassStyle(G)}
            >
              <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-white">
                AgriLink{" "}
                <span style={{ color: G.accent }} className="font-light">Terminal</span>
              </h1>
            </div>
          </div>

          {/* Mandi & Commodity Controls */}
          <div
            className="flex items-center gap-4 p-1.5 rounded-full"
            style={glassStyle(G)}
          >
            <div className="flex px-2" style={{ borderRight: `1px solid ${G.border}` }}>
              {["jalandhar", "khanna"].map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setActiveMandi(mandi as any)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2"
                  style={activeMandi === mandi
                    ? { background: G.accentBg, color: "#fff", border: `1px solid ${G.accentBorder}` }
                    : { color: "rgba(255,255,255,0.40)", border: "1px solid transparent" }
                  }
                >
                  <MapPin className="w-3 h-3" /> {mandi}
                </button>
              ))}
            </div>
            <div className="flex gap-1 pr-1">
              {["wheat", "rice", "both"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCommodity(type as any)}
                  className="px-5 py-2 rounded-full text-xs font-bold uppercase transition-all"
                  style={selectedCommodity === type
                    ? { background: G.accentDark, color: "#fff", border: `1px solid ${G.accentBorder}`, boxShadow: "0 0 15px rgba(30,77,43,0.5)" }
                    : { color: "rgba(255,255,255,0.40)", background: "transparent", border: "1px solid transparent" }
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-12 grid-rows-[auto_1fr] gap-6 flex-1 min-h-0">

          {/* Box 1: AI Insight */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-8 p-6 rounded-3xl flex flex-col justify-center overflow-hidden relative"
            style={{
              ...glassStyle(G),
              background: isDark
                ? `linear-gradient(135deg, rgba(45,106,79,0.30) 0%, rgba(8,18,10,0.70) 100%)`
                : `linear-gradient(135deg, rgba(74,222,128,0.20) 0%, rgba(200,225,255,0.18) 100%)`,
              borderLeft: `4px solid ${G.accent}`,
            }}
          >
            {/* Glow orb */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `${G.accentBg}`, filter: "blur(60px)" }}
            />
            {/* Glass highlight shimmer on top edge */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${G.accent}40, transparent)` }}
            />

            <p
              className="font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2 relative z-10"
              style={{ color: G.accent }}
            >
              <BrainCircuit className="w-4 h-4" /> Gemini 2.5 Flash Insight
            </p>
            <h2 className="text-2xl font-medium text-white/90 relative z-10">
              {language === "hi"
                ? "जालंधर में गेहूं की आवक कम है, सप्ताहांत तक कीमतों में 4% की वृद्धि अपेक्षित है।"
                : `Tightening supply in ${activeMandi.toUpperCase()} indicates a 4% bullish trend for Wheat by weekend.`}
            </h2>
          </motion.div>

          {/* Box 2: Live Volatility */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-4 p-6 rounded-3xl flex flex-col justify-center relative overflow-hidden"
            style={glassStyle(G)}
          >
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }}
            />

            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: G.textLabel }}>
                Market Status
              </p>
              <span
                className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.10)",
                  border: "1px solid rgba(74,222,128,0.25)",
                }}
              >
                <Radio className="w-3 h-3 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="flex items-end gap-4 mt-2">
              <h3 className="text-5xl font-black tracking-tighter text-white">HIGH</h3>
              <p className="mb-1 font-medium flex items-center" style={{ color: G.accent }}>
                <TrendingUp className="w-4 h-4 mr-1" /> Volatility
              </p>
            </div>
          </motion.div>

          {/* Box 3: Main Chart */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-9 p-8 rounded-[2.5rem] flex flex-col relative overflow-hidden"
            style={glassStyle(G)}
          >
            {/* Grid texture overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            {/* Top shimmer */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${G.accent}30, transparent)` }}
            />

            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-bold text-white">Price Elasticity & Projection</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: G.textSub }}>
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]" style={{ boxShadow: "0 0 8px #2E7D32" }} /> Wheat
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: G.textSub }}>
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" style={{ boxShadow: "0 0 8px #3B82F6" }} /> Rice
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={marketData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWheat2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRice2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12, fontWeight: 600 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12, fontWeight: 600 }} domain={["auto", "auto"]} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "rgba(5,14,7,0.92)" : "rgba(10,20,40,0.88)",
                      border: `1px solid ${G.border}`,
                      borderRadius: "16px",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                    itemStyle={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}
                  />
                  {(selectedCommodity === "wheat" || selectedCommodity === "both") && (
                    <Area type="monotone" dataKey="wheat" stroke="#2E7D32" strokeWidth={4} fill="url(#colorWheat2)" activeDot={{ r: 8, strokeWidth: 0, fill: "#2E7D32" }} />
                  )}
                  {(selectedCommodity === "rice" || selectedCommodity === "both") && (
                    <Area type="monotone" dataKey="rice" stroke="#3B82F6" strokeWidth={4} fill="url(#colorRice2)" activeDot={{ r: 8, strokeWidth: 0, fill: "#3B82F6" }} />
                  )}
                  {(selectedCommodity === "wheat" || selectedCommodity === "both") && (
                    <Line type="monotone" dataKey="wheatForecast" stroke="#2E7D32" strokeDasharray="6 6" strokeWidth={3} dot={false} />
                  )}
                  {(selectedCommodity === "rice" || selectedCommodity === "both") && (
                    <Line type="monotone" dataKey="riceForecast" stroke="#3B82F6" strokeDasharray="6 6" strokeWidth={3} dot={false} />
                  )}
                  <Brush dataKey="name" height={25} stroke={G.border} fill={isDark ? "rgba(5,14,7,0.80)" : "rgba(10,20,40,0.60)"} tickFormatter={() => ""} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Box 4: Live Order Feed */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-3 p-6 rounded-[2.5rem] flex flex-col relative overflow-hidden"
            style={glassStyle(G)}
          >
            {/* Top shimmer */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)` }}
            />

            <h3
              className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2"
              style={{ color: G.textLabel }}
            >
              <Activity className="w-4 h-4 text-white" /> Live Order Flow
            </h3>

            <div className="flex-1 space-y-4 overflow-hidden relative">
              {liveTrades.map((trade, i) => {
                const isBuy = trade.type === "BUY";
                const isActive = i === tickerIndex;
                return (
                  <motion.div
                    key={`${trade.time}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
                    className="p-4 rounded-2xl transition-all duration-500 relative overflow-hidden"
                    style={{
                      background: isBuy
                        ? "rgba(46,125,50,0.18)"
                        : "rgba(239,68,68,0.10)",
                      border: `1px solid ${isBuy ? "rgba(46,125,50,0.35)" : "rgba(239,68,68,0.20)"}`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      boxShadow: isActive
                        ? `0 4px 20px ${isBuy ? "rgba(46,125,50,0.25)" : "rgba(239,68,68,0.15)"}, inset 0 1px 0 rgba(255,255,255,0.06)`
                        : "none",
                      transform: isActive ? "scale(1)" : "scale(0.97)",
                    }}
                  >
                    {/* Shimmer on active */}
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                          background: isBuy
                            ? "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)"
                            : "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)",
                        }}
                      />
                    )}
                    <div className="flex justify-between items-center mb-2 text-xs font-bold" style={{ color: G.textLabel }}>
                      <span>{trade.time}</span>
                      <span style={{ color: isBuy ? "#4ade80" : "#f87171" }}>{trade.type}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-lg font-bold text-white">{trade.crop}</p>
                        <p className="text-xs" style={{ color: G.textSub }}>Qty: {trade.qty}</p>
                      </div>
                      <p className="text-xl font-black text-white">{trade.price}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${G.border}` }}>
              <div
                className="flex items-start gap-3 p-3 rounded-xl text-xs font-medium"
                style={{
                  color: "#fbbf24",
                  background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.20)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>High buy volume detected in Khanna Mandi over last 15 mins.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
