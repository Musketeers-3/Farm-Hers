"use client";
import { motion } from "framer-motion";
import { Package, Users, Gavel, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function MethodSelection({ sellMethod, onMethodSelect, hasPool, poolBonus, t }: any) {
  const methods = [
    { id: "direct", icon: Package, title: "Direct Sell", desc: "Current market rate", badge: null },
    { id: "pool", icon: Users, title: t.joinPool || "Join Pool", desc: "Better rates with neighbors", badge: hasPool ? `+₹${poolBonus}/q` : "New Pool" },
    { id: "auction", icon: Gavel, title: "Start Auction", desc: "Buyer competition", badge: "Max Profit" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight px-1">How do you want to sell?</h2>
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = sellMethod === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onMethodSelect(m.id as any)}
              className={cn(
                "w-full p-5 rounded-[2rem] text-left transition-all border flex items-center justify-between",
                isSelected
                  ? "bg-primary/10 border-primary shadow-md"
                  : "bg-slate-50 border-slate-200 dark:bg-[#1a2e1e]/70 dark:border-emerald-700/25"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", isSelected ? "bg-primary text-white shadow-lg" : "bg-white dark:bg-emerald-800/20 text-primary")}>
                  <m.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{m.title}</h3>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </div>
              {m.badge && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">{m.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}