"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { cropIcons, cropImages } from "./constants";

export function CropSelection({
  crops, selectedCrop, onSelect, getCropName,
}: {
  crops: Crop[];
  selectedCrop: Crop | null;
  onSelect: (crop: Crop) => void;
  getCropName: (crop: Crop) => string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight px-1">
        What are you selling?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {crops.map((crop, index) => {
          const isSelected = selectedCrop?.id === crop.id;
          const Icon = cropIcons[crop.id] || cropIcons.wheat;

          return (
            <motion.button
              key={crop.id}
              onClick={() => onSelect(crop)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative overflow-hidden rounded-3xl p-4 flex flex-col items-center justify-center gap-3 aspect-square transition-all duration-300 group border-2",
                isSelected
                  ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-lg shadow-emerald-500/20"
                  : "border-transparent bg-white/40 dark:bg-white/[0.06] backdrop-blur-xl hover:border-emerald-400/40 dark:hover:border-white/20 shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
              )}
            >
              {/* Background crop image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cropImages[crop.id] || cropImages.wheat}
                  alt={crop.name}
                  fill
                  priority={index <= 3}
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-110",
                    isSelected ? "opacity-60" : "opacity-40 dark:opacity-25",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#020c04]/90 via-white/40 dark:via-[#020c04]/40 to-transparent" />
              </div>

              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10",
                isSelected
                  ? "bg-emerald-500 text-white shadow-lg rotate-3"
                  : "bg-white/80 dark:bg-white/[0.1] text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
              )}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>

              {/* Text */}
              <div className="text-center relative z-10">
                <h3 className={cn(
                  "font-bold tracking-tight text-base",
                  isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white",
                )}>
                  {getCropName(crop)}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-white/40 mt-0.5">
                  ₹{crop.currentPrice}/q
                </p>
              </div>

              {/* Check mark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md z-20"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
