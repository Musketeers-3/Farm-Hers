"use client"

import { useTranslation } from "@/lib/store"
import { Users, Activity } from "lucide-react"

export function CommunityPulse() {
  const t = useTranslation()
  const farmersNearby = 47

  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 premium-shadow">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
            <Users className="w-5 h-5 text-accent-foreground" strokeWidth={1.8} />
          </div>
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
            <span className="text-[13px] font-medium text-foreground">Live Activity</span>
          </div>
          <p className="text-[13px] text-muted-foreground truncate">
            <span className="font-semibold text-foreground">{farmersNearby}</span> {t.farmersNearby}
          </p>
        </div>

        <div className="flex -space-x-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-primary border-2 border-card flex items-center justify-center text-[10px] font-medium text-primary-foreground"
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
            +{farmersNearby - 3}
          </div>
        </div>
      </div>
    </div>
  )
}
