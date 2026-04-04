"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MarketInsightCard() {
  const marketInsights = useAppStore((state) => state.marketInsights)
  const crops = useAppStore((state) => state.crops)
  const t = useTranslation()

  // Get top performing crop
  const topInsight = marketInsights.reduce((prev, current) => 
    current.percentChange > prev.percentChange ? current : prev
  , marketInsights[0])

  const crop = crops.find(c => c.id === topInsight?.cropId)

  if (!topInsight || !crop) return null

  const TrendIcon = topInsight.trend === 'up' 
    ? TrendingUp 
    : topInsight.trend === 'down' 
      ? TrendingDown 
      : Minus

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-agri-olive p-5 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grain" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#grain)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-90">{t.marketInsight}</span>
          <span className="flex items-center gap-1 text-xs opacity-80">
            <MapPin className="w-3 h-3" />
            {topInsight.mandiName}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90">{crop.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {topInsight.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm opacity-80">/{crop.unit}</span>
            </div>
          </div>

          {/* Trend Badge */}
          <div className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
            topInsight.trend === 'up' && "bg-white/20",
            topInsight.trend === 'down' && "bg-red-500/30",
            topInsight.trend === 'stable' && "bg-white/10"
          )}>
            <TrendIcon className="w-4 h-4" />
            <span>
              {topInsight.trend === 'up' && '+'}
              {topInsight.percentChange}%
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-sm font-medium">
          <span>{t.sell} {crop.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
