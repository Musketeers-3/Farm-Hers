"use client"

import { useTranslation } from "@/lib/store"
import { Users, Activity, ChevronRight, TrendingUp, Gavel } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const liveActivities = [
  { text: "Gurpreet joined a Wheat pool", time: "1m ago", icon: Users },
  { text: "Aman started a Mustard auction", time: "3m ago", icon: Gavel },
  { text: "Simran locked in a premium price", time: "5m ago", icon: TrendingUp },
]

export function CommunityPulse() {
  const t = useTranslation()
  const farmersNearby = 47
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % liveActivities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card
      className="w-full relative overflow-hidden rounded-[32px] cursor-pointer border-0 group transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        boxShadow: "0 8px 32px rgba(5,150,105,0.10), 0 2px 8px rgba(5,150,105,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Wavy Mesh Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
          {[...Array(10)].map((_, i) => (
            <path
              key={i}
              d={`M-20 ${40 + i * 12} Q 150 ${10 - i * 4}, 250 ${100} T 420 ${60 + i * 8}`}
              fill="none"
              stroke="#059669"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-5">

        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">

            {/* Glassy Icon Container */}
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center border border-emerald-50 shadow-sm">
                <Activity className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-destructive border-2 border-white" />
              </span>
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-black text-emerald-950 tracking-tight leading-none mb-1">
                Live Pulse
              </h3>
              <p className="text-[11px] font-bold text-emerald-800/70 uppercase tracking-widest">
                <span className="text-emerald-700">{farmersNearby}</span> Active
              </p>
            </div>
          </div>

          {/* Staggered Avatar Stack (kept from 2nd code) */}
          <div className="flex -space-x-2 sm:-space-x-1.5 items-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ zIndex: 10 - i }}
              >
                {String.fromCharCode(64 + i)}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border-2 border-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-800 shadow-sm"
            >
              +{farmersNearby - 3}
            </motion.div>
          </div>
        </div>

        {/* Bottom Live Feed */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-100/50 flex items-center justify-between group-hover:bg-white/80 transition-all shadow-inner">
          <div className="flex-1 min-w-0 relative h-6 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center gap-2.5"
              >
                {(() => {
                  const CurrentIcon = liveActivities[activeIndex].icon
                  return (
                    <>
                      <CurrentIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-[13px] text-emerald-950 font-bold truncate">
                        {liveActivities[activeIndex].text}
                        <span className="text-emerald-800/40 ml-2 font-medium">
                          • {liveActivities[activeIndex].time}
                        </span>
                      </p>
                    </>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700/50 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </div>

      </div>
    </Card>
  )
}