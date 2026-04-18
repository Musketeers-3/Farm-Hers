"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Check, MapPin, Info } from "lucide-react";
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
    <div className="space-y-6 p-1">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Choose <span className="text-emerald-500">Buyer Pool</span>
        </h2>
        <p className="text-sm font-bold text-slate-500 dark:text-white/40 mt-1 uppercase tracking-widest">
          {getCropName(crop)} Market Deals
        </p>
      </div>

      {pools.length === 0 ? (
        <div className="relative rounded-[2.5rem] p-10 text-center space-y-4 border-[1.5px] border-white/60 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
           <Users className="w-12 h-12 text-emerald-500/50 mx-auto" />
           <p className="text-lg font-black text-slate-800 dark:text-white">Seeking Buyers...</p>
           <p className="text-xs font-bold text-slate-500 dark:text-white/40 leading-relaxed uppercase tracking-tighter">
             New pools are formed automatically based on your location.
           </p>
        </div>
      ) : (
        <div className="space-y-5">
          {pools.map((pool) => {
            const remaining  = pool.targetQuantity - (pool.filledQuantity || 0);
            const fillPct    = Math.round(((pool.filledQuantity || 0) / pool.targetQuantity) * 100);
            const isSelected = selectedPoolId === pool.id;
            const canFulfill = remaining >= quantity;

            return (
              <motion.button
                key={pool.id}
                onClick={() => onSelect(pool.id)}
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
                    ? 'inset 0 2px 6px rgba(255,255,255,0.8), 0 20px 40px rgba(16,185,129,0.15)' 
                    : 'inset 0 2px 4px rgba(255,255,255,0.9), 0 10px 30px rgba(0,0,0,0.04)'
                }}
              >
                {/* Glossy Top Edge */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-20" />
                
                {/* Pool Header */}
                <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-emerald-500 flex items-center justify-center shadow-inner border border-white/50">
                       <Users className={cn("w-7 h-7", isSelected ? "text-emerald-600 dark:text-white" : "text-emerald-500")} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">{pool.creatorName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                           {pool.creatorRole === "buyer" ? "Verified Buyer" : "Farmer Pool"}
                        </span>
                        {pool.location && (
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <MapPin size={10} className="text-emerald-500" /> {pool.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                      ₹{pool.pricePerUnit}<span className="text-xs font-bold text-slate-400 italic">/{pool.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Pool Progress Section */}
                <div className="bg-white/40 dark:bg-black/20 rounded-3xl p-4 border border-white/50 dark:border-white/10 mb-5 relative z-10 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining Capacity</p>
                       <p className="text-lg font-black text-slate-800 dark:text-white">{remaining} {pool.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{fillPct}% Filled</p>
                      <p className="text-xs font-bold text-slate-400">Target: {pool.targetQuantity}q</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>

                {/* Fit Match Badge */}
                <div className={cn(
                  "rounded-2xl p-3.5 flex items-center justify-between border-[1.5px] relative z-10 transition-colors duration-500",
                  canFulfill
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
                )}>
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tight">
                    <Info size={14} />
                    {canFulfill ? `Perfect Match for your ${quantity}q` : `Pool almost full: ${remaining}q left`}
                  </div>
                  {isSelected && <Check className="w-5 h-5 animate-pulse" strokeWidth={4} />}
                </div>

                {/* Liquid Glow Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.2),transparent_70%)] pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}