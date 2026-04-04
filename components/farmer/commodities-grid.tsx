"use client"

import { useAppStore, useTranslation, type Crop } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Crop emoji/icon mapping for visual representation
const cropIcons: Record<string, string> = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100&h=100&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=100&h=100&fit=crop",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop",
}

export function CommoditiesGrid() {
  const crops = useAppStore((state) => state.crops)
  const selectedCrop = useAppStore((state) => state.selectedCrop)
  const setSelectedCrop = useAppStore((state) => state.setSelectedCrop)
  const language = useAppStore((state) => state.language)
  const t = useTranslation()

  const getCropName = (crop: Crop) => {
    if (language === 'hi') return crop.nameHi
    if (language === 'pa') return crop.namePa
    return crop.name
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{t.commodities}</h3>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all min-w-[80px]",
              "hover:scale-105 active:scale-95",
              selectedCrop?.id === crop.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border hover:border-primary/30"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl overflow-hidden",
              selectedCrop?.id === crop.id ? "ring-2 ring-white/30" : ""
            )}>
              <Image
                src={cropIcons[crop.id] || cropIcons.wheat}
                alt={crop.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={cn(
              "text-xs font-medium text-center",
              selectedCrop?.id === crop.id ? "text-primary-foreground" : "text-foreground"
            )}>
              {getCropName(crop)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
