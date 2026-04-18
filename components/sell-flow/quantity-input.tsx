"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { cropImages } from "./constants";

export function QuantityInput({
  crop,
  quantity,
  onQuantityChange,
  getCropName,
  t,
}: {
  crop: Crop;
  quantity: number;
  onQuantityChange: (q: number) => void;
  getCropName: (crop: Crop) => string;
  t: any;
}) {
  const totalValue = quantity * crop.currentPrice;

  return (
    <div className="relative space-y-10 flex flex-col items-center p-2">
      {/* 1. Ultra-Bright Glass Crop Pill */}
      <div 
        className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full 
          backdrop-blur-3xl border-[1.5px] border-white/60 dark:border-white/20 
          bg-white/40 dark:bg-white/10 overflow-hidden shadow-lg"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 10px 20px rgba(0,0,0,0.05)'
        }}
      >
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-0.5 rounded-full bg-white shadow-sm">
            <Image
              src={cropImages[crop.id] || cropImages.wheat}
              alt={crop.name}
              width={28}
              height={28}
              priority
              className="rounded-full object-cover w-7 h-7"
            />
          </div>
          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            {getCropName(crop)}
          </span>
          <div className="w-[1.5px] h-4 bg-slate-300 dark:bg-white/20" />
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            ₹{crop.currentPrice}/q
          </span>
        </div>
      </div>

      {/* 2. Main Input Section with Liquid Brightness */}
      <div className="relative flex flex-col items-center w-full">
        <label className="text-[11px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] mb-6">
          Enter Quantity
        </label>
        
        <div className="relative group">
          <input
            type="number"
            value={quantity || ""}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            autoFocus
            className="w-full bg-transparent text-8xl sm:text-9xl font-black text-center
              text-slate-900 dark:text-white tracking-tighter
              placeholder:text-slate-200 dark:placeholder:text-white/10
              outline-none p-0 focus:ring-0 transition-all"
            placeholder="0"
          />
          {/* Subtle Glow behind number when active */}
          <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
        </div>
        
        <span className="text-2xl font-black text-emerald-500 dark:text-emerald-400 mt-4 tracking-tight">
          {t.quintals}
        </span>
      </div>

      {/* 3. High-Contrast Quick Add Buttons */}
      <div className="flex flex-wrap justify-center gap-3 relative z-10">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(q)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 border-[1.5px]",
              "backdrop-blur-2xl shadow-sm",
              quantity === q
                ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] scale-110"
                : "bg-white/40 dark:bg-white/5 border-white/80 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-emerald-400/50"
            )}
            style={{
              boxShadow: quantity === q ? 'inset 0 2px 4px rgba(255,255,255,0.4)' : 'inset 0 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            +{q}q
          </button>
        ))}
      </div>

      {/* 4. Realistic Liquid Glass Estimated Card */}
      <AnimatePresence>
        {quantity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm rounded-[2.5rem] p-7 mt-4 relative overflow-hidden
              bg-white/30 dark:bg-white/5 backdrop-blur-[40px]
              border-[1.5px] border-white/70 dark:border-white/20 shadow-2xl"
            style={{
              boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -2px 6px rgba(0,0,0,0.05), 0 30px 60px rgba(0,0,0,0.12)'
            }}
          >
            {/* Glossy Surface Reflection Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">
                Estimated Value
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">
                  Live Rate
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-500/80 tracking-tight">₹</span>
              <span className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
                {totalValue.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Bottom Liquid Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}