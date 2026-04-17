"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Crop } from "@/lib/store";
import { cropIcons, cropImages } from "./constants";

export function CropSelection({ crops, selectedCrop, onSelect, getCropName }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground tracking-tight px-1">What are you selling?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {crops.map((crop: Crop, index: number) => {
          const isSelected = selectedCrop?.id === crop.id;
          const Icon = cropIcons[crop.id] || cropIcons.wheat;
          
          return (
            <motion.button
              key={crop.id}
              onClick={() => onSelect(crop)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] p-5 flex flex-col items-center justify-center gap-3 aspect-square transition-all duration-300 border",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-slate-200 dark:border-emerald-700/25 bg-slate-50 dark:bg-[#1a2e1e]/70"
              )}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={cropImages[crop.id] || cropImages.wheat}
                  alt={crop.name}
                  fill
                  sizes="200px"
                  priority={index <= 5}
                  className={cn("object-cover transition-opacity duration-500", isSelected ? "opacity-40" : "opacity-35")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent dark:from-[#111a13] dark:via-transparent" />
              </div>

              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center relative z-10", isSelected ? "bg-primary text-white shadow-lg" : "bg-white dark:bg-emerald-800/20 text-primary")}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>

              <div className="text-center relative z-10">
                <h3 className={cn("font-bold text-base", isSelected ? "text-primary" : "text-foreground")}>{getCropName(crop)}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">₹{crop.currentPrice}/q</p>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg z-20">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}