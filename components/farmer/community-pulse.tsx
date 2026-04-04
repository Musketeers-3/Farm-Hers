"use client"

import { useTranslation } from "@/lib/store"
import { Users, Activity } from "lucide-react"

export function CommunityPulse() {
  const t = useTranslation()
  const farmersNearby = 47 // This would come from real data

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {/* Animated pulse indicator */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-agri-success/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-agri-olive" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agri-success opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-agri-success" />
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-agri-success" />
            <span className="text-sm font-medium text-foreground">Live Activity</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{farmersNearby}</span> {t.farmersNearby}
          </p>
        </div>

        {/* Mini avatars */}
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-agri-sage to-agri-olive border-2 border-card flex items-center justify-center text-xs font-medium text-white"
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{farmersNearby - 4}
          </div>
        </div>
      </div>
    </div>
  )
}
