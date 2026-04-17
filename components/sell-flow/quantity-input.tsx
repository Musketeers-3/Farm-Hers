"use client";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QuantityInput({ crop, quantity, onQuantityChange, getCropName }: any) {
  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="bg-slate-100 dark:bg-emerald-900/20 px-6 py-2 rounded-full border border-slate-200 dark:border-emerald-700/30">
        <span className="text-sm font-bold text-foreground">{getCropName(crop)} | ₹{crop.currentPrice}/q</span>
      </div>

      <div className="flex items-center gap-8">
        <input
          type="number"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="w-44 bg-transparent text-8xl font-black text-center text-foreground outline-none p-0 appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          autoFocus
        />
        <div className="flex flex-col gap-3">
          <button onClick={() => onQuantityChange(quantity + 1)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronUp /></button>
          <button onClick={() => onQuantityChange(Math.max(0, quantity - 1))} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><ChevronDown /></button>
        </div>
      </div>

      <AnimatePresence>
        {quantity > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-slate-50 dark:bg-[#1a2e1e]/70 border border-slate-200 dark:border-emerald-700/25 rounded-[2rem] p-6 text-center shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Value</p>
            <p className="text-4xl font-black text-primary">₹{(quantity * crop.currentPrice).toLocaleString("en-IN")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}