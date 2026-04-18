// components/farmer/sell-flow/select-pool.tsx
"use client";
import { motion } from "framer-motion";
import { Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";

export function SelectPool({
  pools,
  selectedPoolId,
  onSelect,
  crop,
  quantity,
  getCropName,
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
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Choose a Buyer Pool
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          These buyers are looking for {getCropName(crop)}. Pick the best deal.
        </p>
      </div>

      {pools.length === 0 ? (
        <div className="glass-card border border-border/50 rounded-3xl p-8 text-center space-y-3">
          <Users className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="font-semibold text-foreground">
            No buyer requests right now
          </p>
          <p className="text-sm text-muted-foreground">
            We'll create a new pool and notify buyers automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pools.map((pool) => {
            const remaining = pool.targetQuantity - (pool.filledQuantity || 0);
            const fillPct = Math.round(
              ((pool.filledQuantity || 0) / pool.targetQuantity) * 100,
            );
            const isSelected = selectedPoolId === pool.id;
            const canFulfill = remaining >= quantity;

            return (
              <motion.button
                key={pool.id}
                onClick={() => onSelect(pool.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full text-left rounded-3xl p-5 border-2 transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/30 premium-shadow",
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-lg text-foreground">
                        {pool.creatorName}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                          pool.creatorRole === "buyer"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20",
                        )}
                      >
                        {pool.creatorRole === "buyer"
                          ? "Verified Buyer"
                          : "Farmer Pool"}
                      </span>
                    </div>
                    {pool.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        📍 {pool.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {pool.creatorRole === "buyer" ? "Offering" : "Asking"}
                    </p>
                    <p className="text-2xl font-black font-mono text-primary">
                      ₹{pool.pricePerUnit}
                      <span className="text-sm font-medium text-muted-foreground">
                        /{pool.unit}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    {
                      label: "Needs",
                      value: `${pool.targetQuantity} ${pool.unit}`,
                    },
                    { label: "Remaining", value: `${remaining} ${pool.unit}` },
                    { label: "Farmers", value: pool.members?.length || 0 },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-secondary/50 rounded-xl p-2.5 text-center"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-muted-foreground">Pool Filled</span>
                    <span className="text-primary">{fillPct}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-xl p-3 flex items-center justify-between",
                    canFulfill
                      ? "bg-agri-success/10 border border-agri-success/20"
                      : "bg-amber-500/10 border border-amber-500/20",
                  )}
                >
                  <span className="text-xs font-semibold text-muted-foreground">
                    {canFulfill
                      ? `Your ${quantity}q fits perfectly`
                      : `Pool needs ${remaining}q — you have ${quantity}q`}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      canFulfill ? "text-agri-success" : "text-amber-400",
                    )}
                  >
                    {canFulfill
                      ? "✓ Full match"
                      : `Partial: ${Math.min(quantity, remaining)}q`}
                  </span>
                </div>

                {pool.description && (
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    📋 {pool.description}
                  </p>
                )}

                {isSelected && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-primary text-sm font-bold">
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
