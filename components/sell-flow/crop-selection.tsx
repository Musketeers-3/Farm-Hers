// components/farmer/sell-flow/crop-selection.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Crop } from "@/lib/store";
import { cropIcons, cropImages } from "./constants";

export function CropSelection({ crops, selectedCrop, onSelect, getCropName }: {
  crops: Crop[];
  selectedCrop: Crop | null;
  onSelect: (crop: Crop) => void;
  getCropName: (crop: Crop) => string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground tracking-tight px-1">
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
                "relative overflow-hidden rounded-3xl p-4 flex flex-col items-center justify-center gap-3 aspect-square transition-all duration-500 group premium-shadow border-2",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-transparent bg-card/40 backdrop-blur-md hover:border-primary/30",
              )}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={cropImages[crop.id] || cropImages.wheat}
                  alt={crop.name}
                  fill
                  priority={index <= 3}
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-110",
                    isSelected ? "opacity-70" : "opacity-50",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              </div>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10",
                isSelected
                  ? "bg-primary text-white shadow-lg rotate-3"
                  : "bg-background/80 text-primary group-hover:bg-primary group-hover:text-white",
              )}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="text-center relative z-10">
                <h3 className={cn(
                  "font-bold tracking-tight text-base",
                  isSelected ? "text-primary" : "text-foreground",
                )}>
                  {getCropName(crop)}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                  ₹{crop.currentPrice}/q
                </p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md z-20"
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