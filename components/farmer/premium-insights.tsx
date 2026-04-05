"use client"

import { Lock, TrendingUp, BarChart3, Brain, ChevronRight, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  { icon: BarChart3, title: "Advanced Price Analytics", desc: "30/60/90 day predictive models" },
  { icon: Brain, title: "AI Demand Forecast", desc: "Know what buyers want before they do" },
  { icon: TrendingUp, title: "Profit Optimizer", desc: "Best time-to-sell recommendations" },
]

export function PremiumInsights() {
  return (
    <div className="relative glass-card rounded-2xl overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-agri-gold/20 via-transparent to-primary/10 pointer-events-none" />
      
      <div className="relative p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-agri-gold/15 flex items-center justify-center">
              <Crown className="w-5 h-5 text-agri-gold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Premium Insights</h3>
              <p className="text-[11px] text-muted-foreground">Unlock advanced analytics</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-agri-gold/15 text-agri-earth text-[11px] font-semibold">PRO</span>
        </div>

        {/* Feature list */}
        <div className="space-y-2">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <f.icon className="w-5 h-5 text-agri-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="text-[11px] text-muted-foreground">{f.desc}</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-gold to-agri-wheat text-agri-earth font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          Upgrade to Premium
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
