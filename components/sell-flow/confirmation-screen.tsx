"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmationScreen({ crop, quantity, totalValue, poolBonus, getCropName, t, error }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/10">
          <Check className="w-10 h-10 text-primary" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-extrabold mt-4 text-foreground">Review & Confirm</h2>
      </div>

      <div className="bg-slate-50 dark:bg-[#1a2e1e]/80 border border-slate-200 dark:border-emerald-700/25 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
        <div className="flex justify-between text-sm font-bold"><span className="text-muted-foreground uppercase text-[10px] tracking-wider">Commodity</span><span className="text-foreground">{getCropName(crop)}</span></div>
        <div className="flex justify-between text-sm font-bold"><span className="text-muted-foreground uppercase text-[10px] tracking-wider">Quantity</span><span className="text-foreground">{quantity}q</span></div>
        <div className="h-px bg-slate-200 dark:bg-white/5 my-2" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Final Payout</span>
          <span className="text-4xl font-black tracking-tighter text-primary">₹{(totalValue + poolBonus).toLocaleString("en-IN")}</span>
        </div>
      </div>
      {error && <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-center text-sm font-bold">⚠️ {error}</div>}
    </div>
  );
}