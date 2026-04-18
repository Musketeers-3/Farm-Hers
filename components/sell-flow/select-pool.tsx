"use client";

import { motion } from "framer-motion";
import { Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";

export function SelectPool({
  pools, selectedPoolId, onSelect, crop, quantity, getCropName,
}: {
  pools: any[];
  selectedPoolId: string | null;
  onSelect: (id: string) => void;
  crop: Crop;
  quantity: number;
  getCropName: (crop: Crop) => string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Choose a Buyer Pool
        </h2>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
          These buyers are looking for {getCropName(crop)}. Pick the best deal.
        </p>
      </div>

      {pools.length === 0 ? (
        <div className="bg-white/40 dark:bg-white/[0.06] backdrop-blur-xl border border-white/50 dark:border-white/[0.09] rounded-3xl p-8 text-center space-y-3 shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Users className="w-10 h-10 text-slate-400 dark:text-white/30 mx-auto" />
          <p className="font-semibold text-slate-800 dark:text-white">No buyer requests right now</p>
          <p className="text-sm text-slate-500 dark:text-white/40">
            We'll create a new pool and notify buyers automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pools.map((pool) => {
            const remaining  = pool.targetQuantity - (pool.filledQuantity || 0);
            const fillPct    = Math.round(((pool.filledQuantity || 0) / pool.targetQuantity) * 100);
            const isSelected = selectedPoolId === pool.id;
            const canFulfill = remaining >= quantity;

            return (
              <motion.button
                key={pool.id}
                onClick={() => onSelect(pool.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full text-left rounded-3xl p-5 border-2 transition-all duration-300 backdrop-blur-xl",
                  isSelected
                    ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-lg shadow-emerald-500/10"
                    : "border-white/50 dark:border-white/[0.09] bg-white/40 dark:bg-white/[0.06] hover:border-emerald-400/40 dark:hover:border-white/20 shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{pool.creatorName}</h3>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border backdrop-blur-md",
                        pool.creatorRole === "buyer"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                      )}>
                        {pool.creatorRole === "buyer" ? "Verified Buyer" : "Farmer Pool"}
                      </span>
                    </div>
                    {pool.location && (
                      <p className="text-xs text-slate-500 dark:text-white/40 flex items-center gap-1">
                        📍 {pool.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500 dark:text-white/35 uppercase font-bold tracking-wider">
                      {pool.creatorRole === "buyer" ? "Offering" : "Asking"}
                    </p>
                    <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{pool.pricePerUnit}
                      <span className="text-sm font-medium text-slate-500 dark:text-white/35">/{pool.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Needs",     value: `${pool.targetQuantity} ${pool.unit}` },
                    { label: "Remaining", value: `${remaining} ${pool.unit}`           },
                    { label: "Farmers",   value: pool.members?.length || 0              },
                  ].map((stat) => (
                    <div key={stat.label}
                      className="bg-white/50 dark:bg-white/[0.07] rounded-xl p-2.5 text-center border border-white/20 dark:border-white/[0.07]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/30">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-slate-500 dark:text-white/30">Pool Filled</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{fillPct}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-600/70 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Fit indicator */}
                <div className={cn(
                  "rounded-xl p-3 flex items-center justify-between backdrop-blur-md",
                  canFulfill
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-400/20"
                    : "bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-400/20",
                )}>
                  <span className="text-xs font-semibold text-slate-600 dark:text-white/50">
                    {canFulfill ? `Your ${quantity}q fits perfectly` : `Pool needs ${remaining}q — you have ${quantity}q`}
                  </span>
                  <span className={cn(
                    "text-xs font-bold",
                    canFulfill ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
                  )}>
                    {canFulfill ? "✓ Full match" : `Partial: ${Math.min(quantity, remaining)}q`}
                  </span>
                </div>

                {pool.description && (
                  <p className="text-xs text-slate-500 dark:text-white/35 mt-3 leading-relaxed">
                    📋 {pool.description}
                  </p>
                )}

                {isSelected && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <Check className="w-4 h-4" strokeWidth={3} /> Selected
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
