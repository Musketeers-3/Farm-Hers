"use client"

import { useTranslation } from "@/lib/store"
import { Users, Activity, ChevronRight, TrendingUp, Gavel } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Mock live data to make the pulse feel active
const liveActivities = [
  { text: "Gurpreet joined a Wheat pool", time: "1m ago", icon: Users },
  { text: "Aman started a Mustard auction", time: "3m ago", icon: Gavel },
  { text: "Simran locked in a premium price", time: "5m ago", icon: TrendingUp },
]

export function CommunityPulse() {
  const t = useTranslation()
  const farmersNearby = 47
  
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-cycle through the live activities every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % liveActivities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="w-full glass-card premium-shadow border-0 relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 group cursor-pointer hover:shadow-xl hover:border-primary/30">
      
      {/* Subtle Background Glow for depth */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
      
      <div className="relative z-10 p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
        
        {/* Top Row: Icon, Title & Avatar Stack */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Premium Pulse Icon Container */}
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={2.5} />
              </div>
              {/* Red Live Indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 sm:h-3.5 w-3 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-80" />
                <span className="relative inline-flex rounded-full h-3 sm:h-3.5 w-3 sm:w-3.5 bg-destructive border-2 border-card" />
              </span>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">Live Pulse</h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="text-primary font-bold">{farmersNearby}</span> Active
              </p>
            </div>
          </div>

          {/* Staggered Avatar Stack */}
          <div className="flex -space-x-2 sm:-space-x-1.5 items-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-agri-olive border-2 border-card flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-primary-foreground shadow-sm relative"
                style={{ zIndex: 10 - i }}
              >
                {String.fromCharCode(64 + i)}
              </motion.div>
            ))}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-muted-foreground shadow-sm relative z-0"
            >
              +{farmersNearby - 3}
            </motion.div>
          </div>
        </div>

        {/* Bottom Row: Auto-Cycling Live Feed */}
        <div className="bg-secondary/40 backdrop-blur-sm rounded-xl p-3 sm:p-3.5 border border-border/50 flex items-center justify-between group-hover:bg-secondary/60 transition-colors">
          
          <div className="flex-1 min-w-0 relative h-5 sm:h-6 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center gap-2"
              >
                {(() => {
                  const CurrentIcon = liveActivities[activeIndex].icon
                  return (
                    <>
                      <CurrentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      <p className="text-[11px] sm:text-xs text-foreground font-medium truncate pr-4">
                        {liveActivities[activeIndex].text}
                        <span className="text-muted-foreground ml-1.5 font-normal">
                          • {liveActivities[activeIndex].time}
                        </span>
                      </p>
                    </>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>

      </div>
    </Card>
  )
}