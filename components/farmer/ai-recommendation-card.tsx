"use client";

import {
  Sparkles,
  TrendingUp,
  Droplets,
  ThermometerSun,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const recommendations = [
  {
    crop: "Mustard",
    confidence: 92,
    reason:
      "High soil moisture + rising prices make mustard ideal this season.",
    factors: [
      { icon: ThermometerSun, label: "Soil temp optimal", positive: true },
      { icon: Droplets, label: "Good moisture levels", positive: true },
      { icon: TrendingUp, label: "Price up 5.2% this week", positive: true },
    ],
  },
  {
    crop: "Wheat",
    confidence: 78,
    reason: "Stable demand with good weather window for sowing.",
    factors: [
      { icon: ThermometerSun, label: "Temp slightly high", positive: false },
      { icon: TrendingUp, label: "Steady prices", positive: true },
    ],
  },
];

export function AIRecommendationCard() {
  const top = recommendations[0];

  return (
    <Card
      className="w-full overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 relative border-0"
      style={{
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #f0fdf4 40%, #dcfce7 70%, #d1fae5 100%)",
        boxShadow:
          "0 8px 32px rgba(34,197,94,0.15), 0 2px 8px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* ── Wave SVG background ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg
          viewBox="0 0 900 340"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ opacity: 0.22 }}
        >
          <defs>
            <linearGradient id="waveGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M-50 220 C150 80, 350 320, 550 160 C700 40, 820 200, 960 130"
            fill="none"
            stroke="url(#waveGradLight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 68, 76, 84].map((offset, i) => (
            <path
              key={i}
              d={`M-50 ${220 + offset} C150 ${80 + offset}, 350 ${320 + offset}, 550 ${
                160 + offset
              } C700 ${40 + offset}, 820 ${200 + offset}, 960 ${130 + offset}`}
              fill="none"
              stroke="url(#waveGradLight)"
              strokeWidth={i < 6 ? 1.2 : 0.7}
              strokeLinecap="round"
              style={{ opacity: 1 - i * 0.06 }}
            />
          ))}
          {[0, 8, 16, 24, 32, 40, 50].map((offset, i) => (
            <path
              key={`r${i}`}
              d={`M500 ${-10 + offset} C620 ${60 + offset}, 780 ${180 + offset}, 960 ${
                100 + offset
              }`}
              fill="none"
              stroke="url(#waveGradLight)"
              strokeWidth={0.8}
              strokeLinecap="round"
              style={{ opacity: 0.7 - i * 0.08 }}
            />
          ))}
        </svg>
      </div>

      {/* Ambient glow — top-right */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, rgba(134,239,172,0.45) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(60px, -60px)",
        }}
      />
      {/* Ambient glow — bottom-left */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(-50px, 50px)",
        }}
      />

      {/* Glass sheen — top highlight */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "50%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "inherit",
        }}
      />

      <div className="relative p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow:
                "0 2px 8px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          >
            <Sparkles className="w-5 h-5 relative z-10" style={{ color: "#16a34a" }} />
            <span
              className="absolute inset-0 rounded-xl animate-ping opacity-30"
              style={{ background: "rgba(34,197,94,0.3)" }}
            />
          </div>
          <div>
            <h3
              className="text-base sm:text-lg font-bold tracking-tight"
              style={{ color: "#14532d" }}
            >
              AI Crop Recommendation
            </h3>
            <p className="text-xs font-medium" style={{ color: "rgba(20,83,45,0.55)" }}>
              Based on local soil, weather &amp; market
            </p>
          </div>
        </div>

        {/* Top Pick Box — frosted glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 sm:p-5 space-y-4"
          style={{
            background: "rgba(255,255,255,0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 4px 24px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.65)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: "#14532d" }}
              >
                Grow {top.crop}
              </span>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  color: "#15803d",
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {top.confidence}% Match
                </span>
              </div>
            </div>
            <button
              className="hidden sm:flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: "#16a34a" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#15803d")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#16a34a")}
            >
              Full Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p
            className="text-sm font-medium leading-relaxed max-w-2xl"
            style={{ color: "rgba(20,83,45,0.72)" }}
          >
            {top.reason}
          </p>

          {/* Staggered Factors */}
          <div className="flex flex-wrap gap-2 pt-1">
            {top.factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                  f.positive ? "text-[#15803d]" : "text-[#b91c1c]",
                )}
                style={
                  f.positive
                    ? {
                        background: "rgba(255,255,255,0.55)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                      }
                    : {
                        background: "rgba(255,255,255,0.45)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                      }
                }
              >
                {f.positive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {f.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Secondary Suggestions */}
        <div className="pt-1">
          <h4
            className="text-xs font-bold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
            style={{ color: "rgba(20,83,45,0.45)" }}
          >
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
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.35)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.55)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.6)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(34,197,94,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.35)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "inset 0 1px 0 rgba(255,255,255,0.75)";
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: "#14532d" }}>
                    {rec.crop}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      color: "rgba(20,83,45,0.5)",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {rec.confidence}% match
                  </span>
                </div>
                <ChevronRight
                  className="w-4 h-4 transition-all duration-200 group-hover:translate-x-0.5"
                  style={{ color: "#16a34a" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}