"use client";

import {
  Sparkles, TrendingUp, Droplets, ThermometerSun,
  ChevronRight, CheckCircle2, AlertCircle, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const recommendations = [
  {
    crop: "Mustard",
    confidence: 92,
    reason: "High soil moisture + rising prices make mustard ideal this season.",
    factors: [
      { icon: ThermometerSun, label: "Soil temp optimal",      positive: true  },
      { icon: Droplets,       label: "Good moisture levels",   positive: true  },
      { icon: TrendingUp,     label: "Price up 5.2% this week",positive: true  },
    ],
  },
  {
    crop: "Wheat",
    confidence: 78,
    reason: "Stable demand with good weather window for sowing.",
    factors: [
      { icon: ThermometerSun, label: "Temp slightly high", positive: false },
      { icon: TrendingUp,     label: "Steady prices",      positive: true  },
    ],
  },
];

export function AIRecommendationCard() {
  const top = recommendations[0];

  return (
    <Card
      className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border-0 relative transition-colors duration-300
        /* Light mode: soft green gradient */
        bg-gradient-to-br from-[#e8f5e9] via-[#f0fdf4] to-[#d1fae5]
        /* Dark mode: glass panel over farmers_bg.jpg */
        dark:bg-none dark:bg-white/[0.06] dark:backdrop-blur-xl
        dark:border dark:border-white/[0.09]
        dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{
        boxShadow: "0 8px 32px rgba(34,197,94,0.15), 0 2px 8px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Wave SVG — light mode accent, dimmed in dark */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg
          viewBox="0 0 900 340" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-[0.22] dark:opacity-[0.07]"
        >
          <defs>
            <linearGradient id="waveGradAI" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#22c55e" />
              <stop offset="50%"  stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M-50 220 C150 80, 350 320, 550 160 C700 40, 820 200, 960 130"
            fill="none" stroke="url(#waveGradAI)" strokeWidth="3.5" strokeLinecap="round" />
          {[6,12,18,24,30,36,42,48,54,60,68,76,84].map((offset, i) => (
            <path key={i}
              d={`M-50 ${220+offset} C150 ${80+offset}, 350 ${320+offset}, 550 ${160+offset} C700 ${40+offset}, 820 ${200+offset}, 960 ${130+offset}`}
              fill="none" stroke="url(#waveGradAI)" strokeWidth={i < 6 ? 1.2 : 0.7}
              strokeLinecap="round" style={{ opacity: 1 - i * 0.06 }} />
          ))}
        </svg>
      </div>

      {/* Light mode glow blobs — invisible in dark */}
      <div className="absolute top-0 right-0 pointer-events-none dark:opacity-0"
        style={{ width: 220, height: 220, background: "radial-gradient(circle, rgba(134,239,172,0.45) 0%, transparent 70%)", borderRadius: "50%", transform: "translate(60px, -60px)" }} />
      <div className="absolute bottom-0 left-0 pointer-events-none dark:opacity-0"
        style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", borderRadius: "50%", transform: "translate(-50px, 50px)" }} />

      {/* Light mode sheen */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none dark:opacity-0"
        style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)", borderRadius: "inherit" }} />

      {/* Dark mode: subtle top-right green shimmer */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-0 dark:opacity-100
        bg-[radial-gradient(circle,rgba(52,211,153,0.1)_0%,transparent_70%)] translate-x-12 -translate-y-12" />

      <div className="relative p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0
            bg-white/55 dark:bg-white/[0.08] backdrop-blur-[12px]"
            style={{ boxShadow: "0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.6)" }}>
            <Sparkles className="w-5 h-5 relative z-10 text-[#16a34a] dark:text-emerald-400" />
            <span className="absolute inset-0 rounded-xl animate-ping opacity-30" style={{ background: "rgba(34,197,94,0.3)" }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#14532d] dark:text-white">
              AI Crop Recommendation
            </h3>
            <p className="text-xs font-medium text-[#14532d]/55 dark:text-white/40">
              Based on local soil, weather &amp; market
            </p>
          </div>
        </div>

        {/* Top pick frosted panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 sm:p-5 space-y-4
            bg-white/45 dark:bg-white/[0.06] backdrop-blur-[20px]
            border border-white/65 dark:border-white/[0.08]"
          style={{ boxShadow: "0 4px 24px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.85)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#14532d] dark:text-white">
                Grow {top.crop}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full
                bg-[rgba(34,197,94,0.15)] dark:bg-emerald-400/20
                border border-[rgba(34,197,94,0.35)] dark:border-emerald-400/30
                text-[#15803d] dark:text-emerald-300">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {top.confidence}% Match
                </span>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#16a34a] dark:text-emerald-400 hover:text-[#15803d] dark:hover:text-emerald-300 transition-colors">
              Full Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-medium leading-relaxed max-w-2xl text-[#14532d]/72 dark:text-white/60">
            {top.reason}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {top.factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-[8px]",
                  f.positive
                    ? "text-[#15803d] dark:text-emerald-300 border border-[rgba(34,197,94,0.3)] dark:border-emerald-500/25 bg-white/55 dark:bg-emerald-500/10"
                    : "text-[#b91c1c] dark:text-red-400 border border-[rgba(239,68,68,0.25)] dark:border-red-500/25 bg-white/45 dark:bg-red-500/10"
                )}
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}
              >
                {f.positive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {f.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Secondary options */}
        <div className="pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5 text-[#14532d]/45 dark:text-white/30">
            <Leaf className="w-3 h-3" />
            Other Viable Options
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.slice(1).map((rec, i) => (
              <motion.div
                key={rec.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200
                  bg-white/35 dark:bg-white/[0.05]
                  hover:bg-white/60 dark:hover:bg-white/[0.09]
                  border border-white/55 dark:border-white/[0.08]
                  hover:border-[rgba(34,197,94,0.4)] dark:hover:border-emerald-500/25
                  backdrop-blur-[12px]"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#14532d] dark:text-white">{rec.crop}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md text-[#14532d]/50 dark:text-white/35 bg-white/50 dark:bg-white/[0.07]">
                    {rec.confidence}% match
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#16a34a] dark:text-emerald-400 transition-all duration-200 group-hover:translate-x-0.5" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
