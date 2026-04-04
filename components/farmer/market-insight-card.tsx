"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { TrendingUp, TrendingDown, Minus, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MarketInsightCard() {
  const marketInsights = useAppStore((state) => state.marketInsights)
  const crops = useAppStore((state) => state.crops)
  const t = useTranslation()

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
    <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground premium-shadow-lg">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium opacity-80 tracking-wide uppercase">{t.marketInsight}</span>
          <span className="flex items-center gap-1.5 text-xs opacity-70">
            <MapPin className="w-3 h-3" strokeWidth={2} />
            {topInsight.mandiName}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-80">{crop.name}</h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[42px] font-bold leading-none tracking-tight">
                {topInsight.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm opacity-60">/{crop.unit}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
            "bg-primary-foreground/15"
          )}>
            <TrendIcon className="w-4 h-4" strokeWidth={2} />
            <span>
              {topInsight.trend === 'up' && '+'}
              {topInsight.percentChange}%
            </span>
          </div>
        </div>

        {/* CTA */}
        <button className="flex items-center justify-center gap-2 w-full py-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm">
          <span>{t.sell} {crop.name}</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
