"use client"

import { useTranslation } from "@/lib/store"
import { Users, Activity, ChevronRight, TrendingUp, Gavel } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const liveActivities = [
  { text: "Gurpreet joined a Wheat pool",       time: "1m ago", icon: Users },
  { text: "Aman started a Mustard auction",     time: "3m ago", icon: Gavel },
  { text: "Simran locked in a premium price",   time: "5m ago", icon: TrendingUp },
]

export function CommunityPulse() {
  const farmersNearby = 47
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % liveActivities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="w-full relative overflow-hidden rounded-[32px] cursor-pointer group transition-all duration-300
        /* Light mode: soft green gradient card */
        bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]
        /* Dark mode: glass panel over farmers_bg.jpg */
        dark:bg-none dark:bg-white/[0.06] dark:backdrop-blur-xl
        border-0 dark:border dark:border-white/[0.08]
        shadow-[0_8px_32px_rgba(5,150,105,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Light mode decorative waves — hidden in dark */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-0">
        <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
          {[...Array(10)].map((_, i) => (
            <path
              key={i}
              d={`M-20 ${40 + i * 12} Q 150 ${10 - i * 4}, 250 ${100} T 420 ${60 + i * 8}`}
              fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.2"
            />
          ))}
        </svg>
      </div>

      {/* Dark mode: subtle green shimmer top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none dark:opacity-100 opacity-0
        bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_70%)]
        translate-x-8 -translate-y-8" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-5">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl
                bg-white/90 dark:bg-white/[0.08]
                backdrop-blur-md
                flex items-center justify-center
                border border-emerald-50 dark:border-white/[0.08]
                shadow-sm">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white dark:border-transparent" />
              </span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-emerald-950 dark:text-white tracking-tight leading-none mb-1">
                Live Pulse
              </h3>
              <p className="text-[11px] font-bold text-emerald-800/70 dark:text-white/40 uppercase tracking-widest">
                <span className="text-emerald-700 dark:text-emerald-400">{farmersNearby}</span> Active
              </p>
            </div>
          </div>

          {/* Avatar stack */}
          <div className="flex -space-x-2 items-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white dark:border-transparent flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ zIndex: 10 - i }}
              >
                {String.fromCharCode(64 + i)}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border-2 border-emerald-50 dark:border-white/[0.1] flex items-center justify-center text-[10px] font-bold text-emerald-800 dark:text-emerald-300 shadow-sm"
            >
              +{farmersNearby - 3}
            </motion.div>
          </div>
        </div>

        {/* Live Feed ticker */}
        <div className="
          bg-white/60 dark:bg-white/[0.06]
          backdrop-blur-md
          rounded-2xl p-3.5
          border border-emerald-100/50 dark:border-white/[0.07]
          flex items-center justify-between
          group-hover:bg-white/80 dark:group-hover:bg-white/[0.09]
          transition-all shadow-inner dark:shadow-none">
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
                      <CurrentIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <p className="text-[13px] text-emerald-950 dark:text-white/85 font-bold truncate">
                        {liveActivities[activeIndex].text}
                        <span className="text-emerald-800/40 dark:text-white/30 ml-2 font-medium">
                          • {liveActivities[activeIndex].time}
                        </span>
                      </p>
                    </>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700/50 dark:text-white/30 group-hover:text-emerald-700 dark:group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  )
}
