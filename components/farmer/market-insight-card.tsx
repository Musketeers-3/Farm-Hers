"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowRight, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function MarketInsightCard() {
  const marketInsights = useAppStore((state) => state.marketInsights)
  const crops = useAppStore((state) => state.crops)
  const t = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const topInsight = marketInsights.reduce((prev, current) =>
    current.percentChange > prev.percentChange ? current : prev
  , marketInsights[0])

  const crop = crops.find(c => c.id === topInsight?.cropId)

  if (!mounted || !topInsight || !crop) return (
    <div className="h-[220px] w-full rounded-2xl bg-muted/20 animate-pulse" />
  )

  const TrendIcon =
    topInsight.trend === 'up'
      ? TrendingUp
      : topInsight.trend === 'down'
        ? TrendingDown
        : Minus

  return (
    <Card className="w-full h-full border-0 shadow-lg premium-shadow overflow-hidden relative flex flex-col text-white rounded-2xl sm:rounded-3xl transition-all duration-500 group">

      {/* 1. Deep Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-agri-olive" />

      {/* 2. Internal Light Sources (The secret to making glass pop) */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-agri-gold/30 rounded-full blur-3xl pointer-events-none group-hover:bg-agri-gold/40 transition-colors duration-700" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* 3. Frost/Noise Texture */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{
        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />

      {/* Main Content Container */}
      <div className="relative z-10 p-4 sm:p-5 h-full flex flex-col justify-between gap-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-white/90">
            <Activity className="w-4 h-4 animate-pulse-slow drop-shadow-md" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase drop-shadow-sm">
              {t.marketInsight}
            </span>
          </div>

          {/* Glass Pill */}
          <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
            <MapPin className="w-3 h-3 text-agri-gold" />
            {topInsight.mandiName}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex justify-between items-end gap-4 mt-2">

          {/* Left: Crop & Price */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-medium text-white/80 tracking-wide mb-1">
              {crop.name}
            </h3>

            <div className="flex items-start leading-none -ml-0.5">
              <span className="text-2xl sm:text-3xl font-light mt-1 mr-1 text-white/70">
                ₹
              </span>

              <motion.span
                key={topInsight.price}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl sm:text-6xl font-medium tracking-tighter drop-shadow-md"
              >
                {topInsight.price.toLocaleString('en-IN')}
              </motion.span>
            </div>

            <span className="text-[10px] sm:text-xs text-white/60 font-medium tracking-wider mt-1.5">
              /{crop.unit}
            </span>
          </div>

          {/* Right: Trend Badge (Glassmorphic) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex flex-col items-end gap-1 shrink-0 mb-1.5",
              topInsight.trend === 'up' ? "text-agri-gold" : "text-white"
            )}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
              <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {topInsight.trend === 'up' && '+'}
                {topInsight.percentChange}%
              </span>
            </div>
          </motion.div>

        </div>

        {/* CTA Button (Heavy Glassmorphism) */}
        <button className="flex items-center justify-center gap-2 w-full py-3 mt-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] rounded-xl sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm font-bold group hover-lift overflow-hidden relative">
          
          {/* Button highlight shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          
          <span className="truncate drop-shadow-sm">
            {t.sell} {crop.name} Now
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform drop-shadow-sm" strokeWidth={2.5} />
        </button>

      </div>
    </Card>
  )
}