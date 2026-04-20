"use client";

import { useAppStore, useTranslation } from "@/lib/store";
import { PriceHistoryChart } from "./price-history-chart";
import { BottomNav } from "./bottom-nav";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Search,
  Filter,
  Activity,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// ── Crop images ───────────────────────────────────────────────────────────────
const cropImages: Record<string, string> = {
  wheat:   "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
  rice:    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop",
};

const mandiData = [
  { name: "Ludhiana Mandi",  distance: "12 km", prices: { wheat: 2350, rice: 2180, mustard: 5350 } },
  { name: "Amritsar Mandi",  distance: "45 km", prices: { wheat: 2280, rice: 2220, mustard: 5200 } },
  { name: "Jalandhar Mandi", distance: "28 km", prices: { wheat: 2310, rice: 2150, mustard: 5280 } },
  { name: "Patiala Mandi",   distance: "65 km", prices: { wheat: 2290, rice: 2190, mustard: 5320 } },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLASS TOKENS — extracted from AIRecommendationCard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Outer wrapper — matches the AIRecommendationCard <Card>:
 *   Light: bg-gradient-to-br from-[#e8f5e9] via-[#f0fdf4] to-[#d1fae5]
 *   Dark:  bg-white/[0.06] backdrop-blur-xl border border-white/[0.09]
 */
const AI_GLASS_OUTER = [
  "relative overflow-hidden",
  "rounded-2xl sm:rounded-3xl",
  // Light mode soft green gradient
  "bg-gradient-to-br from-[#e8f5e9] via-[#f0fdf4] to-[#d1fae5]",
  // Dark mode glass panel
  "dark:bg-none dark:bg-white/[0.06] dark:backdrop-blur-xl",
  "border-0",
  "dark:border dark:border-white/[0.09]",
  "dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
].join(" ");

/**
 * Inner frosted panel — matches the "top pick" motion.div inside AIRecommendationCard:
 *   Light: bg-white/45 backdrop-blur-[20px] border border-white/65
 *   Dark:  bg-white/[0.06] border-white/[0.08]
 */
const AI_GLASS_INNER_PANEL = [
  "relative overflow-hidden",
  "rounded-2xl",
  "bg-white/45 dark:bg-white/[0.06]",
  "backdrop-blur-[20px]",
  "border border-white/65 dark:border-white/[0.08]",
].join(" ");

/**
 * Small chip / icon wrapper — matches factor pills in AIRecommendationCard:
 *   Light: bg-white/55 backdrop-blur-[8px] border border-white/60
 *   Dark:  bg-white/[0.07] border-white/[0.08]
 */
const AI_GLASS_CHIP = [
  "bg-white/60 dark:bg-white/[0.07]",
  "backdrop-blur-md",
  "border border-white/60 dark:border-white/[0.08]",
].join(" ");

/** Shadow used on the outer AI card */
const AI_OUTER_SHADOW = {
  boxShadow:
    "0 8px 32px rgba(34,197,94,0.15), 0 2px 8px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
};

/** Shadow used on inner frosted panels */
const AI_INNER_PANEL_SHADOW = {
  boxShadow:
    "0 4px 24px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
};

/** Shadow used on small chips / pills */
const AI_CHIP_SHADOW = {
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
};

// Shared wave SVG background (identical to AIRecommendationCard)
function WaveBg() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <svg
        viewBox="0 0 900 340"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-[0.22] dark:opacity-[0.07]"
      >
        <defs>
          <linearGradient id="waveGradMkt" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="50%"  stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          d="M-50 220 C150 80, 350 320, 550 160 C700 40, 820 200, 960 130"
          fill="none" stroke="url(#waveGradMkt)" strokeWidth="3.5" strokeLinecap="round"
        />
        {[6,12,18,24,30,36,42,48,54,60,68,76,84].map((offset, i) => (
          <path
            key={i}
            d={`M-50 ${220+offset} C150 ${80+offset}, 350 ${320+offset}, 550 ${160+offset} C700 ${40+offset}, 820 ${200+offset}, 960 ${130+offset}`}
            fill="none" stroke="url(#waveGradMkt)"
            strokeWidth={i < 6 ? 1.2 : 0.7}
            strokeLinecap="round"
            style={{ opacity: 1 - i * 0.06 }}
          />
        ))}
      </svg>
    </div>
  );
}

// Light-mode glow blobs (identical to AIRecommendationCard)
function GlowBlobs() {
  return (
    <>
      <div
        className="absolute top-0 right-0 pointer-events-none dark:opacity-0"
        style={{
          width: 220, height: 220,
          background: "radial-gradient(circle, rgba(134,239,172,0.45) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(60px, -60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none dark:opacity-0"
        style={{
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(-50px, 50px)",
        }}
      />
      {/* Light mode top sheen */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none dark:opacity-0"
        style={{
          height: "50%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "inherit",
        }}
      />
      {/* Dark mode top-right green shimmer */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-0 dark:opacity-100 bg-[radial-gradient(circle,rgba(52,211,153,0.1)_0%,transparent_70%)] translate-x-12 -translate-y-12" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function MarketScreen() {
  const router         = useRouter();
  const crops          = useAppStore((state) => state.crops);
  const marketInsights = useAppStore((state) => state.marketInsights);
  const t              = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen pb-24 lg:pb-8 overflow-x-hidden">

      {/* ── FIXED BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#f0fdf4] to-white transition-opacity duration-500 ${
            mounted && isDark ? "opacity-0" : "opacity-100"
          }`}
        />
        {mounted && isDark && (
          <>
            <Image
              src="/images/farmers_bg.jpg"
              alt=""
              fill
              priority
              className="object-fill object-center"
              style={{ opacity: 1.0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,8,0.3) 0%, rgba(2,8,3,0.7) 100%)",
              }}
            />
          </>
        )}
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-[#020c04]/75 backdrop-blur-2xl transition-all duration-300 border-b border-transparent dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/farmer")}
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-white/[0.12] transition-all duration-200 shadow-sm border-0 dark:border dark:border-white/[0.08]",
                  "bg-white dark:bg-white/[0.07]"
                )}
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-[#14532d] dark:text-white" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#14532d] dark:text-white tracking-tight leading-none">
                  {t.market}
                </h1>
                <p className="text-[10px] font-black text-[#15803d]/40 dark:text-white/30 tracking-[0.15em] uppercase mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Rates
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-white/[0.12] transition-all duration-200 shadow-sm border-0 dark:border dark:border-white/[0.08]",
                "bg-white dark:bg-white/[0.07]"
              )}
              aria-label="Toggle Dark Mode"
            >
              {isDark
                ? <Sun  className="w-5 h-5 text-emerald-300" strokeWidth={2} />
                : <Moon className="w-5 h-5 text-[#14532d]"   strokeWidth={2} />
              }
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
              <Input
                placeholder="Search crops or mandis..."
                className={cn(
                  "pl-10 h-11 rounded-2xl",
                  // AI card glass input tokens
                  "bg-white/60 dark:bg-white/[0.07] backdrop-blur-md",
                  "border border-white/60 dark:border-white/[0.08]",
                  "text-slate-800 dark:text-white",
                  "placeholder:text-slate-400 dark:placeholder:text-white/30",
                  "focus-visible:ring-emerald-500/40"
                )}
              />
            </div>
            <button
              className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 dark:text-white/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors",
                AI_GLASS_CHIP
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">

        {/* ════ MARKET MOVERS — AI card outer wrapper ════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={AI_GLASS_OUTER}
          style={AI_OUTER_SHADOW}
        >
          <WaveBg />
          <GlowBlobs />

          {/* Header row */}
          <div className="relative z-10 px-4 sm:px-6 pt-5 pb-3 flex items-center gap-3">
            <div
              className={cn("w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0", AI_GLASS_CHIP)}
              style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)" }}
            >
              <Activity className="w-5 h-5 text-[#16a34a] dark:text-emerald-400" />
              <span className="absolute inset-0 rounded-xl animate-ping opacity-20" style={{ background: "rgba(34,197,94,0.3)" }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#14532d] dark:text-white">
                Market Movers
              </h2>
              <p className="text-xs font-medium text-[#14532d]/55 dark:text-white/40">
                Live crop prices across mandis
              </p>
            </div>
          </div>

          {/* Scrollable cards */}
          <div className="relative z-10 flex gap-4 overflow-x-auto pb-5 scrollbar-hide px-4 sm:px-6">
            {marketInsights.map((insight, idx) => {
              const crop = crops.find((c) => c.id === insight.cropId);
              if (!crop) return null;

              const isUp   = insight.trend === "up";
              const isDown = insight.trend === "down";
              const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

              return (
                <motion.div
                  key={insight.cropId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="min-w-[190px] sm:min-w-[210px] cursor-pointer group"
                >
                  {/* Inner frosted panel — matches AIRecommendationCard "top pick" panel */}
                  <div
                    className={cn(AI_GLASS_INNER_PANEL, "p-4 sm:p-5 flex flex-col items-center gap-3 h-full")}
                    style={AI_INNER_PANEL_SHADOW}
                  >
                    {/* Corner glow */}
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[50px] pointer-events-none
                      bg-emerald-500/[0.08] dark:bg-emerald-400/[0.1]" />

                    {/* Floating crop image */}
                    <div className="relative w-full h-24 flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                        className="relative w-20 h-20 z-10"
                      >
                        <Image
                          src={cropImages[crop.id] || cropImages.wheat}
                          alt={crop.name}
                          fill
                          priority
                          className="object-cover rounded-2xl shadow-lg"
                        />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <span className="text-[8px] font-black text-[#16a34a]/60 dark:text-emerald-400/50 uppercase tracking-[0.4em]">
                        Top Mover
                      </span>
                      <h3 className="text-lg font-bold text-[#14532d] dark:text-white tracking-tight mt-0.5">
                        {crop.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-sm font-bold text-slate-400 dark:text-white/35">₹</span>
                        <p className="text-3xl font-black text-[#14532d] dark:text-white tracking-tighter tabular-nums">
                          {insight.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="text-[9px] font-medium text-[#14532d]/45 dark:text-white/25 uppercase tracking-widest">
                        per {crop.unit}
                      </p>
                    </div>

                    {/* Trend pill — matches AIRecommendationCard factor pills */}
                    <div
                      className={cn(
                        "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-black mt-auto backdrop-blur-[8px]",
                        isUp
                          ? "text-[#15803d] dark:text-emerald-300 border-[rgba(34,197,94,0.3)] dark:border-emerald-500/25 bg-white/55 dark:bg-emerald-500/10"
                          : isDown
                            ? "text-[#b91c1c] dark:text-red-400 border-[rgba(239,68,68,0.25)] dark:border-red-500/25 bg-white/45 dark:bg-red-500/10"
                            : "text-[#14532d]/60 dark:text-white/40 border-white/50 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.05]"
                      )}
                      style={AI_CHIP_SHADOW}
                    >
                      {isUp
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : isDown
                          ? <AlertCircle className="w-3.5 h-3.5" />
                          : <Minus className="w-3.5 h-3.5" />
                      }
                      <span>{isUp ? "+" : ""}{insight.percentChange}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ════ BOTTOM GRID — Nearby Mandis + Analytics ════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── NEARBY MANDIS ── */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn("w-10 h-10 rounded-xl flex items-center justify-center", AI_GLASS_CHIP)}
                  style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                >
                  <MapPin className="w-4 h-4 text-[#16a34a] dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#14532d] dark:text-white">
                    Nearby Mandis
                  </h2>
                  <p className="text-[10px] font-black text-[#15803d]/40 dark:text-white/30 uppercase tracking-[0.15em]">
                    Live Data
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {mandiData.map((mandi, index) => (
                <motion.div
                  key={mandi.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={cn(AI_GLASS_OUTER, "p-4 sm:p-5")}
                  style={AI_OUTER_SHADOW}
                >
                  <WaveBg />
                  <GlowBlobs />

                  {/* Mandi header */}
                  <div className="relative z-10 flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", AI_GLASS_CHIP)}
                          style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                        >
                          <MapPin className="w-6 h-6 text-[#16a34a] dark:text-emerald-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-transparent animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#14532d] dark:text-white">
                          {mandi.name}
                        </h3>
                        <p className="text-[11px] font-black text-[#15803d]/40 dark:text-white/30 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          <Activity className="w-3 h-3" /> {mandi.distance} away
                        </p>
                      </div>
                    </div>
                    <button
                      className={cn("w-9 h-9 rounded-full flex items-center justify-center text-[#14532d]/50 dark:text-white/25 hover:text-[#16a34a] dark:hover:text-emerald-400 transition-colors", AI_GLASS_CHIP)}
                      style={AI_CHIP_SHADOW}
                    >
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>

                  {/* Price grid — each cell is an AI inner panel */}
                  <div className="relative z-10 grid grid-cols-3 gap-3">
                    {Object.entries(mandi.prices).map(([cropId, price]) => {
                      const crop = crops.find((c) => c.id === cropId);
                      return (
                        <motion.div
                          key={cropId}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            AI_GLASS_INNER_PANEL,
                            "flex flex-col items-center p-3 cursor-pointer group/item transition-all duration-200",
                            "hover:border-emerald-400/40 dark:hover:border-emerald-400/30"
                          )}
                          style={AI_INNER_PANEL_SHADOW}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden mb-2 border-2 border-white/40 dark:border-white/10 shadow-md group-hover/item:scale-110 group-hover/item:border-emerald-400/50 transition-all duration-200">
                            <Image
                              src={cropImages[cropId] || cropImages.wheat}
                              alt={cropId}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#14532d]/50 dark:text-white/30 uppercase tracking-tight mb-0.5">
                            {crop?.name || cropId}
                          </span>
                          <span className="font-black text-sm text-[#14532d] dark:text-white tabular-nums">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/0 group-hover/item:bg-emerald-400/50 transition-all duration-200 rounded-b-2xl" />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── ANALYTICS CHART ── */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn("w-10 h-10 rounded-xl flex items-center justify-center", AI_GLASS_CHIP)}
                  style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                >
                  <Activity className="w-4 h-4 text-[#16a34a] dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#14532d] dark:text-white">
                    Analytics
                  </h2>
                  <p className="text-[10px] font-black text-[#15803d]/40 dark:text-white/30 uppercase tracking-[0.15em]">
                    Price History
                  </p>
                </div>
              </div>

              {/* Time range switcher — AI chip style */}
              <div
                className={cn("flex p-1 rounded-xl", AI_GLASS_CHIP)}
                style={AI_CHIP_SHADOW}
              >
                {["7D", "30D", "90D"].map((range, i) => (
                  <button
                    key={range}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black rounded-lg transition-all",
                      i === 0
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-[#14532d]/60 dark:text-white/40 hover:text-[#14532d] dark:hover:text-white/70"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart card — AI card outer wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(AI_GLASS_OUTER, "p-5 sm:p-6")}
              style={AI_OUTER_SHADOW}
            >
              <WaveBg />
              <GlowBlobs />

              {/* Stats + legend */}
              <div className="relative z-10 flex flex-wrap items-center gap-6 mb-6">
                <div>
                  <p className="text-[10px] font-black text-[#15803d]/40 dark:text-white/30 uppercase tracking-widest mb-1">
                    Current Avg
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#14532d] dark:text-white">₹2,350</span>
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-lg backdrop-blur-[8px]
                        text-[#15803d] dark:text-emerald-300
                        border border-[rgba(34,197,94,0.3)] dark:border-emerald-500/25
                        bg-white/55 dark:bg-emerald-500/10"
                      style={AI_CHIP_SHADOW}
                    >
                      +3.8%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-bold text-[#14532d]/60 dark:text-white/50">Wheat</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-[#14532d]/60 dark:text-white/50">Mustard</span>
                  </div>
                </div>
              </div>

              {/* Chart inside AI inner panel */}
              <div
                className={cn(AI_GLASS_INNER_PANEL, "relative z-10 h-[280px] w-full p-4")}
                style={AI_INNER_PANEL_SHADOW}
              >
                <PriceHistoryChart />
              </div>

              {/* Footer */}
              <div className="relative z-10 mt-5 pt-5 border-t border-white/30 dark:border-white/[0.06] flex items-center justify-between">
                <p className="text-[10px] text-[#14532d]/40 dark:text-white/25 font-medium">
                  Last updated: Just now
                </p>
                <button className="text-[10px] font-black text-[#16a34a] dark:text-emerald-400 hover:underline flex items-center gap-1">
                  View Full Report <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
