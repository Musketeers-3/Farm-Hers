"use client"

import { useAppStore, useTranslation, type Crop } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { CheckCircle2 } from "lucide-react"

const cropIcons: Record<string, string> = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=200&h=200&fit=crop",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop",
}

function CropCard({ 
  crop, 
  isSelected, 
  onClick, 
  cropName 
}: { 
  crop: Crop, 
  isSelected: boolean, 
  onClick: () => void,
  cropName: string
}) {
  const divRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!divRef.current || isSelected) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.button
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      layout
      className="relative flex flex-col items-center gap-2 group min-w-[80px]"
    >
      {/* Spotlight Glow (hover only, not selected) */}
      {!isSelected && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(120px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Circle Image Container */}
      <div className={cn(
        "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300 z-10 shadow-md",
        isSelected
          ? "ring-4 ring-green-600 ring-offset-2"
          : "ring-1 ring-slate-200 group-hover:ring-green-400/60"
      )}>
        <Image
          src={cropIcons[crop.id] || cropIcons.wheat}
          alt={crop.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isSelected ? "scale-110" : "group-hover:scale-110"
          )}
        />

        {/* Selected Checkmark Overlay */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-green-900/40 backdrop-blur-[1px] flex items-center justify-center"
            >
              <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Label Below */}
      <div className="relative z-10 flex flex-col items-center">
        <span className={cn(
          "text-[11px] sm:text-xs font-black text-center tracking-wide uppercase",
          isSelected ? "text-green-800" : "text-slate-950 group-hover:text-green-700 transition-colors"
        )}>
          {cropName}
        </span>
        <span className={cn(
          "text-[10px] font-bold text-green-700/70 mt-0.5 transition-all duration-300",
          !isSelected && "sm:opacity-0 sm:-translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
        )}>
          ₹{crop.currentPrice}
        </span>
      </div>
    </motion.button>
  )
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
    <div className="space-y-6 w-full p-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-black text-slate-950 tracking-tight uppercase">
          {t.commodities}
        </h3>
        <span className="text-[10px] font-black text-green-900 bg-[#f0fdf4] px-3 py-1 rounded-full uppercase">
          {crops.length} Available
        </span>
      </div>

      <div className="flex sm:flex-wrap items-start gap-5 sm:gap-8 overflow-x-auto sm:overflow-visible pb-6 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {crops.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            isSelected={selectedCrop?.id === crop.id}
            onClick={() => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop)}
            cropName={getCropName(crop)}
          />
        ))}
      </div>
    </div>
  )
}