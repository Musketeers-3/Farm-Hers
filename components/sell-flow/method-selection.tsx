"use client";

import { motion } from "framer-motion";
import { Package, Users, Gavel, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function MethodSelection({
  sellMethod, onMethodSelect, hasPool, poolBonus, t,
}: {
  sellMethod: "direct" | "pool" | "auction" | null;
  onMethodSelect: (m: "direct" | "pool" | "auction") => void;
  hasPool: boolean;
  poolBonus: number;
  t: any;
}) {
  const methods = [
    {
      id:        "direct"  as const,
      icon:      Package,
      title:     "Direct Sell",
      desc:      "Sell immediately at current market rate",
      badge:     null,
      highlight: false,
    },
    {
      id:        "pool"    as const,
      icon:      Users,
      title:     t.joinPool,
      desc:      "Combine with neighbors for better rates",
      badge:     hasPool ? `+₹${poolBonus}/q Bonus` : "Create New Pool",
      highlight: true,
    },
    {
      id:        "auction" as const,
      icon:      Gavel,
      title:     t.startAuction,
      desc:      "Let buyers compete for your produce",
      badge:     "Max Profit",
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        How do you want to sell?
      </h2>

      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = sellMethod === method.id;
          return (
            <motion.button
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full p-5 sm:p-6 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group",
                isSelected
                  ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500 dark:border-emerald-400 shadow-md shadow-emerald-500/10"
                  : "bg-white/40 dark:bg-white/[0.06] backdrop-blur-xl border-2 border-white/50 dark:border-white/[0.09] hover:border-emerald-400/40 dark:hover:border-white/20 shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
              )}
            >
              {/* Gold shimmer for pool option */}
              {method.highlight && !isSelected && (
                <div className="absolute inset-0 bg-amber-400/[0.03] dark:bg-amber-400/[0.04] pointer-events-none" />
              )}

              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                  isSelected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/60 dark:bg-white/[0.08] text-slate-500 dark:text-white/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-500/10",
                )}>
                  <method.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={cn(
                      "text-lg font-bold truncate",
                      isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white",
                    )}>
                      {method.title}
                    </h3>
                    {method.badge && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        method.id === "pool"
                          ? "bg-amber-400/15 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/25 dark:border-amber-400/25"
                          : "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/25",
                      )}>
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-white/40 pr-4 leading-snug">
                    {method.desc}
                  </p>
                </div>

                {/* Radio dot */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-2 transition-all",
                  isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-white/20",
                )}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
