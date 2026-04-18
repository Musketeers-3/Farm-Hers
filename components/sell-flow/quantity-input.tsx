"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { cropImages } from "./constants";

export function QuantityInput({
  crop, quantity, onQuantityChange, getCropName, t,
}: {
  crop: Crop;
  quantity: number;
  onQuantityChange: (q: number) => void;
  getCropName: (crop: Crop) => string;
  t: any;
}) {
  const totalValue = quantity * crop.currentPrice;

  return (
    <div className="space-y-8 flex flex-col items-center">

      {/* Crop pill */}
      <div className="inline-flex items-center gap-3
        bg-white/60 dark:bg-white/[0.08]
        backdrop-blur-md
        px-4 py-2 rounded-full
        border border-white/60 dark:border-white/[0.1]
        shadow-sm">
        <Image
          src={cropImages[crop.id] || cropImages.wheat}
          alt={crop.name}
          width={24} height={24}
          priority
          className="rounded-full object-cover w-6 h-6"
        />
        <span className="text-sm font-semibold text-slate-800 dark:text-white">{getCropName(crop)}</span>
        <span className="text-slate-400 dark:text-white/30">|</span>
        <span className="text-sm font-medium text-slate-500 dark:text-white/40">₹{crop.currentPrice}/q</span>
      </div>

      {/* Number input */}
      <div className="flex flex-col items-center w-full mt-4">
        <label className="text-sm font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-4">
          Enter Quantity
        </label>
        <input
          type="number"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          autoFocus
          className="w-2/3 bg-transparent text-6xl sm:text-8xl font-mono font-medium text-center
            text-slate-900 dark:text-white
            placeholder:text-slate-300 dark:placeholder:text-white/20
            outline-none p-0 focus:ring-0"
          placeholder="0"
        />
        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{t.quintals}</span>
      </div>

      {/* Quick-add buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(q)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200",
              quantity === q
                ? "bg-emerald-500 text-white shadow-md scale-105 dark:bg-emerald-500"
                : "bg-white/60 dark:bg-white/[0.08] text-slate-600 dark:text-white/60 border border-white/60 dark:border-white/[0.1] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400",
            )}
          >
            +{q}q
          </button>
        ))}
      </div>

      {/* Estimated value card */}
      <AnimatePresence>
        {quantity > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full rounded-3xl p-5 sm:p-6 mt-4
              bg-white/50 dark:bg-white/[0.06]
              backdrop-blur-xl
              border border-white/60 dark:border-white/[0.09]
              shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider">
                Estimated Value
              </span>
              <span className="text-[10px] bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold uppercase border border-emerald-500/20 dark:border-emerald-400/25">
                Live Rate
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-3xl text-slate-700 dark:text-white/60 font-light mr-1">₹</span>
              <span className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
                {totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
