"use client"

import { Sparkles, TrendingUp, Droplets, ThermometerSun, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const recommendations = [
  {
    crop: "Mustard",
    confidence: 92,
    reason: "High soil moisture + rising prices make mustard ideal this season.",
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
]

export function AIRecommendationCard() {
  const top = recommendations[0]

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 border-l-4 border-l-primary">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Crop Recommendation</h3>
          <p className="text-[11px] text-muted-foreground">Based on your soil, weather & market</p>
        </div>
      </div>

      {/* Top pick */}
      <div className="bg-primary/5 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">Grow {top.crop}</span>
            <span className="px-2 py-0.5 rounded-full bg-agri-success/15 text-agri-success text-xs font-semibold">
              {top.confidence}% match
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">{top.reason}</p>
        <div className="flex flex-wrap gap-2">
          {top.factors.map((f, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
                f.positive ? "bg-agri-success/10 text-agri-success" : "bg-agri-gold/10 text-agri-earth"
              )}
            >
              <f.icon className="w-3 h-3" />
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Other suggestions */}
      {recommendations.slice(1).map((rec) => (
        <div key={rec.crop} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{rec.crop}</span>
            <span className="text-xs text-muted-foreground">{rec.confidence}% match</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  )
}
