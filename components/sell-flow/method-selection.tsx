"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Users, Gavel, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const methods = [
    {
      id: "direct" as const,
      icon: Package,
      title: "Direct Sell",
      desc: "Sell immediately at current market rate",
      badge: null,
      highlight: false,
      baseColor: "rgba(59, 130, 246, 0.2)", // Blue
      borderColor: "border-blue-400/50",
    },
    {
      id: "pool" as const,
      icon: Users,
      title: t.joinPool,
      desc: "Combine with neighbors for better rates",
      badge: hasPool ? `+₹${poolBonus}/q Bonus` : "Create New Pool",
      highlight: true,
      baseColor: "rgba(251, 191, 36, 0.2)", // Amber
      borderColor: "border-amber-400/50",
    },
    {
      id: "auction" as const,
      icon: Gavel,
      title: t.startAuction,
      desc: "Let buyers compete for your produce",
      badge: "Max Profit",
      highlight: false,
      baseColor: "rgba(168, 85, 247, 0.2)", // Purple
      borderColor: "border-purple-400/50",
    },
  ];

  return (
    <div className="relative space-y-8 p-4 min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Decorative background elements to enhance glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          How do you want to <br/>
          <span className="text-emerald-600 dark:text-emerald-400">Sell Produce?</span>
        </h2>
      </div>

      <div className="relative z-10 grid gap-6">
        {methods.map((method) => {
          const isSelected = sellMethod === method.id;
          const Icon = method.icon;

          return (
            <motion.button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative w-full p-6 rounded-[2.5rem] text-left transition-all duration-500",
                "border-[1.5px] backdrop-blur-3xl overflow-hidden",
                isSelected 
                  ? `${method.borderColor} shadow-[0_20px_40px_rgba(0,0,0,0.1)]` 
                  : "border-white/60 dark:border-white/10 bg-white/30 dark:bg-white/5 shadow-sm"
              )}
              style={{
                backgroundColor: isSelected ? method.baseColor : undefined,
              }}
            >
              {/* Glossy Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 dark:bg-white/20" />
              
              {/* Internal Liquid Glow (Selected State) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
                    }}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center gap-5 relative z-10">
                {/* Icon Container with Realistic Glass Depth */}
                <div className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                  "shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.1)]",
                  isSelected
                    ? "bg-white/90 dark:bg-white/20 text-slate-900 dark:text-white"
                    : "bg-white/60 dark:bg-white/10 text-slate-500"
                )}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={cn(
                      "text-lg font-black tracking-tight",
                      isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {method.title}
                    </h3>
                    {method.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-400">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm font-bold leading-snug",
                    isSelected ? "text-slate-800/70 dark:text-white/60" : "text-slate-500"
                  )}>
                    {method.desc}
                  </p>
                </div>

                {/* Animated Selection Bubble */}
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500",
                  isSelected 
                    ? "bg-white dark:bg-emerald-400 border-transparent shadow-lg" 
                    : "border-slate-300 dark:border-white/20"
                )}>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-emerald-600 dark:text-slate-900"
                      >
                        <Check className="w-5 h-5" strokeWidth={4} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Decorative Fruit/Icon from Reference */}
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity rotate-[-15deg]">
                 <Icon size={100} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="relative z-10 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-8">
        Secure Transaction Powered by AgriLink
      </p>
    </div>
  );
}