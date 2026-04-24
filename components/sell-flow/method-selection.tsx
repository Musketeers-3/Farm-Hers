"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Users, Gavel, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

function LightBg() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(130deg, #d6f5e3 0%, #e8faf2 22%, #f0fdf8 40%, #e8f5fb 62%, #daeef8 80%, #d0eaf6 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 50% at 0% 15%, rgba(167,243,208,0.65) 0%, transparent 60%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 55% at 100% 60%, rgba(186,230,253,0.55) 0%, transparent 60%)"
      }} />
    </div>
  );
}

function DarkBg() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(145deg, #071c14 0%, #040f0a 40%, #06151f 70%, #040d14 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 60% at -5% 50%, rgba(22,163,74,0.30) 0%, transparent 65%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 45% 55% at 105% 50%, rgba(16,185,129,0.20) 0%, transparent 65%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 35% at 50% 15%, rgba(74,222,128,0.08) 0%, transparent 55%)"
      }} />
    </div>
  );
}

export function MethodSelection({
  sellMethod,
  onMethodSelect,
  hasPool,
  poolBonus,
  t,
}: {
  sellMethod: "direct" | "pool" | "auction" | null;
  onMethodSelect: (m: "direct" | "pool" | "auction") => void;
  hasPool: boolean;
  poolBonus: number;
  t: any;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const methods = [
    {
      id: "direct" as const,
      icon: Package,
      title: "Direct Sell",
      desc: "Sell immediately at current market rate",
      badge: null,
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      id: "pool" as const,
      icon: Users,
      title: t.joinPool,
      desc: "Combine with neighbors for better rates",
      badge: hasPool ? `+₹${poolBonus}/q Bonus` : "Create New Pool",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: "auction" as const,
      icon: Gavel,
      title: t.startAuction,
      desc: "Let buyers compete for your produce",
      badge: "Max Profit",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {isDark ? <DarkBg /> : <LightBg />}

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-[#14532d] dark:text-white tracking-tight leading-tight">
            How do you want to <br />
            <span className="text-emerald-600 dark:text-emerald-400">Sell Produce?</span>
          </h2>
        </div>

        {/* Method Cards */}
        <div className="space-y-5">
          {methods.map((method) => {
            const isSelected = sellMethod === method.id;
            const Icon = method.icon;

            return (
              <motion.button
                key={method.id}
                onClick={() => onMethodSelect(method.id)}
                whileHover={{ scale: 1.01, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative w-full text-left rounded-[2.5rem] p-6 border-[1.5px] transition-all duration-500 overflow-hidden",
                  "backdrop-blur-[45px] shadow-2xl",
                  isSelected
                    ? "border-emerald-400/50 bg-emerald-500/20 dark:bg-emerald-500/10"
                    : "border-white/80 dark:border-white/10 bg-gradient-to-br from-emerald-50/40 to-blue-50/40 dark:from-emerald-900/5 dark:to-blue-900/5"
                )}
                style={{
                  boxShadow: isSelected
                    ? "inset 0 2px 6px rgba(255,255,255,0.8), 0 20px 40px rgba(16,185,129,0.15)"
                    : "inset 0 2px 4px rgba(255,255,255,0.9), 0 10px 30px rgba(0,0,0,0.04)"
                }}
              >
                {/* Glossy Top Edge */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-20" />

                {/* Liquid Glow Overlay (Selected) */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.2),transparent_70%)] pointer-events-none" />
                )}

                {/* Method Header */}
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                      "shadow-inner border",
                      isSelected
                        ? "bg-white dark:bg-emerald-500 border-white/50 text-emerald-600 dark:text-white"
                        : "bg-white/60 dark:bg-white/10 border-white/50 text-slate-500 dark:text-white/50"
                    )}>
                      <Icon className="w-7 h-7" strokeWidth={2.5} />
                    </div>

                    {/* Content */}
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={cn(
                          "text-lg font-black tracking-tight",
                          isSelected ? "text-[#14532d] dark:text-white" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {method.title}
                        </h3>
                        {method.badge && (
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                            method.badgeColor
                          )}>
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm font-bold leading-snug",
                        isSelected ? "text-slate-800/70 dark:text-white/60" : "text-slate-500 dark:text-slate-400"
                      )}>
                        {method.desc}
                      </p>
                    </div>
                  </div>

                  {/* Selection Bubble */}
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500",
                    isSelected
                      ? "bg-emerald-500 border-transparent shadow-lg"
                      : "border-slate-300 dark:border-white/20"
                  )}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-white"
                        >
                          <Check className="w-5 h-5" strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Decorative Background Icon */}
                <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity rotate-[-15deg]">
                  <Icon size={100} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs font-black text-[#15803d]/40 dark:text-white/30 uppercase tracking-[0.2em]">
          Secure Transaction Powered by AgriLink
        </p>
      </div>
    </div>
  );
}