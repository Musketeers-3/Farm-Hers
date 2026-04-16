"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Crop } from "@/lib/store";
import { cropImages } from "./constants";
import { ChevronUp, ChevronDown } from "lucide-react";

interface QuantityInputProps {
  crop: Crop;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  getCropName: (crop: Crop) => string;
  t: any;
}

export function QuantityInput({
  crop,
  quantity,
  onQuantityChange,
  getCropName,
  t,
}: QuantityInputProps) {
  const totalValue = quantity * crop.currentPrice;

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Crop pill */}
      <div className="inline-flex items-center gap-3 bg-secondary/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
        <Image
          src={cropImages[crop.id] || cropImages.wheat}
          alt={crop.name}
          width={24}
          height={24}
          priority
          className="rounded-full object-cover w-6 h-6"
        />
        <span className="text-sm font-semibold text-foreground">
          {getCropName(crop)}
        </span>
        <span className="text-muted-foreground">|</span>
        <span className="text-sm font-medium text-muted-foreground">
          ₹{crop.currentPrice}/q
        </span>
      </div>

      {/* Label */}
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Enter Quantity
      </label>

      {/* Number + stepper row */}
      <div className="flex items-center justify-center gap-6 w-full">
        {/* 
          appearance-none + webkit/moz overrides completely remove the 
          browser's native up/down spin buttons on number inputs 
        */}
        <input
          type="number"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          autoFocus
          className="w-40 bg-transparent text-7xl font-mono font-semibold text-center text-foreground placeholder:text-muted-foreground/30 outline-none p-0 focus:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          placeholder="0"
        />

        {/* Custom stepper — only these arrows should show */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity + 1))}
            className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
          >
            <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
          >
            <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Unit label */}
      <span className="text-base font-bold text-primary -mt-2">
        {t.quintals || "Quintals"}
      </span>

      {/* Quick-add chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {[10, 25, 50, 100].map((q) => (
          <button
            key={q}
            onClick={() => onQuantityChange(quantity + q)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200",
              quantity === q
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary",
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
            className="w-full glass-card premium-shadow rounded-3xl p-5 border border-border/50"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Estimated Value
              </span>
              <span className="text-[10px] bg-agri-success/15 text-agri-success px-2 py-1 rounded-md font-bold uppercase">
                Live Rate
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-2xl text-foreground font-light mr-1">₹</span>
              <span className="text-4xl font-bold tracking-tighter text-foreground">
                {totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
