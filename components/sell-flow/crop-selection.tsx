"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { cropIcons, cropImages } from "./constants";
import { CropAnalyzer } from "@/components/crop-analyzer"; // Make sure this path matches your structure

export function CropSelection({
  crops,
  selectedCrop,
  onSelect,
  getCropName,
  onQualityVerified, // NEW: Pass the final adjusted price to the parent form
}: {
  crops: Crop[];
  selectedCrop: Crop | null;
  onSelect: (crop: Crop) => void;
  getCropName: (crop: Crop) => string;
  onQualityVerified?: (bonusMultiplier: number) => void;
}) {
  // Local state to track the AI-determined quality bonus (1.0 = standard, 1.15 = 15% bonus)
  const [qualityMultiplier, setQualityMultiplier] = useState<number>(1.0);
  const [isScanned, setIsScanned] = useState(false);

  // Simulated callback for when the CropAnalyzer finishes its Vertex AI call
  const handleAnalysisComplete = (labels: any[]) => {
    // In a real scenario, you'd calculate this based on the labels (e.g., if 'Fresh' > 90%)
    // For the demo, we instantly award a 15% premium price bump!
    const bonus = 1.15; 
    setQualityMultiplier(bonus);
    setIsScanned(true);
    
    if (onQualityVerified) {
      onQualityVerified(bonus);
    }
  };

  const handleCropClick = (crop: Crop) => {
    // Reset the scanner state if they switch crops
    if (selectedCrop?.id !== crop.id) {
      setQualityMultiplier(1.0);
      setIsScanned(false);
    }
    onSelect(crop);
  };

  return (
    <div className="relative space-y-8 p-1">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          What are you <span className="text-emerald-500">selling?</span>
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Select your harvest and verify quality for premium pricing.
        </p>
      </div>

      {/* ── CROP GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {crops.map((crop, index) => {
          const isSelected = selectedCrop?.id === crop.id;
          const Icon = cropIcons[crop.id] || cropIcons.wheat;
          
          // Calculate dynamic price based on AI multiplier
          const basePrice = crop.currentPrice;
          const finalPrice = Math.round(basePrice * (isSelected ? qualityMultiplier : 1.0));
          const hasBonus = isSelected && qualityMultiplier > 1.0;

          return (
            <motion.button
              key={crop.id}
              onClick={() => handleCropClick(crop)}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-5 flex flex-col items-center justify-center gap-4 aspect-square transition-all duration-500 group border-[1.5px]",
                isSelected
                  ? "border-emerald-400/50 bg-emerald-500/20 dark:bg-emerald-500/10 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                  : "border-white/60 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-3xl shadow-sm"
              )}
            >
              {/* Premium Glass Overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none z-10" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/60 dark:bg-white/20 z-10" />

              {/* Background crop image with depth */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={cropImages[crop.id] || cropImages.wheat}
                  alt={crop.name}
                  fill
                  priority={index <= 3}
                  className={cn(
                    "object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-3",
                    isSelected ? "opacity-40" : "opacity-20 dark:opacity-10"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 dark:via-black/20 to-white/90 dark:to-slate-950" />
              </div>

              {/* Icon Container with Glass Depth */}
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-20",
                "shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_8px_16px_rgba(0,0,0,0.1)]",
                isSelected
                  ? "bg-white/90 dark:bg-emerald-500 text-emerald-600 dark:text-white scale-110"
                  : "bg-white/60 dark:bg-white/10 text-slate-500 group-hover:text-emerald-500 group-hover:scale-110"
              )}>
                <Icon className="w-7 h-7" strokeWidth={2.5} />
              </div>

              {/* Text Info */}
              <div className="text-center relative z-20">
                <h3 className={cn(
                  "font-black tracking-tight text-lg transition-colors duration-300",
                  isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"
                )}>
                  {getCropName(crop)}
                </h3>
                
                {/* Dynamic Price Badge */}
                <motion.div 
                  layout
                  className={cn(
                    "mt-1 px-3 py-1 rounded-full backdrop-blur-md border transition-all duration-500 flex items-center justify-center gap-1",
                    hasBonus 
                      ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                      : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10"
                  )}
                >
                  {hasBonus && <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />}
                  <p className={cn(
                    "text-[11px] font-black tracking-wide",
                    hasBonus ? "text-emerald-700 dark:text-emerald-300" : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    ₹{finalPrice}/q
                  </p>
                </motion.div>
              </div>

              {/* Premium Check Mark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.4)] z-30"
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Subtle radial inner glow */}
              {isSelected && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.15),transparent_70%)] pointer-events-none z-10" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── AI QUALITY SCANNER (Reveals only when a crop is selected) ── */}
      <AnimatePresence>
        {selectedCrop && !isScanned && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="overflow-hidden pt-4"
          >
            {/* Note: You need to pass the handleAnalysisComplete prop to your CropAnalyzer 
              so it can trigger this component when the scan is done! 
              Add this to your CropAnalyzer.tsx: 
              onComplete?: (results: any) => void;
            */}
            <CropAnalyzer />
            
            {/* Demo Button: Delete this once your CropAnalyzer is actually firing the callback
            <button 
              onClick={() => handleAnalysisComplete([])}
              className="mt-4 w-full py-3 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-500/10 transition"
            >
              [Dev Tool] Simulate Successful AI Scan
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}