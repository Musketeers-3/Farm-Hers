"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowRight, Activity, BadgeCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

export function MarketInsightCard() {
  const marketInsights = useAppStore((state) => state.marketInsights)
  const crops = useAppStore((state) => state.crops)
  const t = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const topInsight = useMemo(() => {
    if (!marketInsights?.length) return null
    return marketInsights.reduce((prev, current) =>
      current.percentChange > prev.percentChange ? current : prev
    , marketInsights[0])
  }, [marketInsights])

  const crop = useMemo(() => {
    if (!crops || !topInsight) return null
    return crops.find(c => c.id === topInsight.cropId)
  }, [crops, topInsight])

  const TrendIcon =
    topInsight?.trend === "up"
      ? TrendingUp
      : topInsight?.trend === "down"
        ? TrendingDown
        : Minus

  if (!mounted || !topInsight || !crop) return (
    <div className="h-[180px] w-full rounded-[1.5rem] animate-pulse bg-[#f8fffe] dark:bg-white/5" />
  )

  return (
    <div className="w-full overflow-hidden relative flex flex-col rounded-[1.5rem] group transition-all duration-500
      bg-gradient-to-br from-white via-[#f0fdf4] to-white
      dark:from-[#071a0d] dark:via-[#0a2211] dark:to-[#071a0d]"
      style={{
        boxShadow: "0 10px 30px rgba(34,197,94,0.08), 0 1px 8px rgba(34,197,94,0.04)",
      }}
    >
      {/* ── Wave SVG background ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg
          viewBox="0 0 900 300"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-[0.12] dark:opacity-[0.08]"
        >
          <defs>
            <linearGradient id="waveGradMkt" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
          <path
            d="M-50 200 C150 70, 350 290, 550 140 C700 30, 820 180, 960 110"
            fill="none"
            stroke="url(#waveGradMkt)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {[6, 12, 18, 24, 30, 36, 44, 52, 60, 70].map((offset, i) => (
            <path
              key={i}
              d={`M-50 ${200 + offset} C150 ${70 + offset}, 350 ${290 + offset}, 550 ${140 + offset} C700 ${30 + offset}, 820 ${180 + offset}, 960 ${110 + offset}`}
              fill="none"
              stroke="url(#waveGradMkt)"
              strokeWidth={i < 4 ? 1.1 : 0.6}
              strokeLinecap="round"
              style={{ opacity: 1 - i * 0.08 }}
            />
          ))}
        </svg>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(134,239,172,0.3) 0%, transparent 70%)",
          transform: "translate(50px, -50px)",
        }}
      />

      <div className="relative z-10 p-5 flex flex-col gap-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#15803d]/45 dark:text-emerald-500/50">
              Mandi Insights
            </span>
            <h2 className="text-xs font-black flex items-center gap-1.5 text-[#14532d] dark:text-emerald-200">
              <Activity className="w-3.5 h-3.5 text-[#16a34a] dark:text-emerald-400" />
              {t.marketInsight}
            </h2>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-white/80 dark:bg-white/10
              backdrop-blur-[12px]"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <MapPin className="w-2.5 h-2.5 text-orange-500 dark:text-orange-400" />
            <span className="text-[9px] font-bold text-[#15803d] dark:text-emerald-300">
              {topInsight.mandiName}
            </span>
          </div>
        </div>

        {/* PRICE SECTION */}
        <div
          className="p-4 rounded-[1.25rem]
            bg-white/50 dark:bg-white/[0.06]
            backdrop-blur-[20px]"
          style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.05)" }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black tracking-tighter leading-none mb-1.5 text-[#14532d] dark:text-emerald-200">
                {crop.name}
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: topInsight.trend === "down" ? "#dc2626" : "#16a34a" }}
                >
                  <TrendIcon className="w-2.5 h-2.5 text-white stroke-[3]" />
                  <span className="text-[9px] font-black text-white">
                    {topInsight.trend === "up" && "+"}{topInsight.percentChange}%
                  </span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-[#15803d]/55 dark:text-emerald-400/60">
                  {topInsight.trend === "up" ? "HIGH DEMAND" : topInsight.trend === "down" ? "FALLING" : "STABLE"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-tighter text-[#15803d]/40 dark:text-emerald-500/50">
                CURRENT PRICE
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-bold text-[#15803d]/40 dark:text-emerald-500/50">₹</span>
                <motion.span
                  key={topInsight.price}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-black leading-none tracking-tighter text-[#14532d] dark:text-emerald-200"
                >
                  {topInsight.price.toLocaleString("en-IN")}
                </motion.span>
                <div
                  className="flex flex-col ml-1 pl-2"
                  style={{ borderLeft: "1.5px solid rgba(21,128,61,0.08)" }}
                >
                  <span className="text-[6px] font-black uppercase leading-none text-[#15803d]/40 dark:text-emerald-500/50">
                    PER
                  </span>
                  <span className="text-[8px] font-black uppercase leading-none text-[#15803d]/60 dark:text-emerald-400/70">
                    {crop.unit?.toUpperCase() ?? "QUINTAL"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDICATORS + BUTTON ROW */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px] font-black
              text-[#15803d] dark:text-emerald-300
              bg-white/70 dark:bg-white/10"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
          >
            <Zap className="w-2.5 h-2.5 fill-green-500 text-green-500" />
            LIVE
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px] font-black
              text-[#15803d] dark:text-emerald-300
              bg-white/70 dark:bg-white/10"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
          >
            <BadgeCheck className="w-2.5 h-2.5 fill-green-500 text-green-500" />
            VERIFIED
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative ml-auto flex items-center gap-2 py-2.5 px-5 text-white rounded-[0.85rem] transition-all"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              boxShadow: "0 8px 20px rgba(22,163,74,0.25)",
            }}
          >
            <span className="text-xs font-black tracking-tight">
              {t.sell} {crop.name} Now
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
