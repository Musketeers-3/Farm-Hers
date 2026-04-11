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

// ----------------------------------------------------------------------
// 1. THE SPOTLIGHT & GLASSMORPHIC ITEM COMPONENT
// ----------------------------------------------------------------------
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      layout
      className={cn(
        "relative flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl transition-all duration-300 min-w-[84px] sm:min-w-[100px] overflow-hidden group",
        isSelected
          ? "bg-gradient-to-br from-primary to-agri-olive shadow-lg premium-shadow shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-transparent"
          : "bg-card border border-border/60 hover:border-primary/30 premium-shadow"
      )}
    >
      {/* Spotlight Glow Effect (Only visible on hover when NOT selected) */}
      {!isSelected && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity,
            background: `radial-gradient(120px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb, 107, 142, 35), 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Selected State Inner Glow & Texture */}
      {isSelected && (
        <>
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '12px 12px'
          }} />
        </>
      )}

      {/* Image Container */}
      <div className={cn(
        "relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all duration-300 z-10",
        isSelected 
          ? "ring-2 ring-white shadow-md shadow-black/20" 
          : "ring-1 ring-border/50 group-hover:ring-primary/40"
      )}>
        <Image
          src={cropIcons[crop.id] || cropIcons.wheat}
          alt={crop.name}
          width={60}
          height={60}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
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
              className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center"
            >
              <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Label */}
      <div className="relative z-10 flex flex-col items-center">
        <span className={cn(
          "text-[11px] sm:text-xs font-bold text-center tracking-wide",
          isSelected ? "text-white drop-shadow-sm" : "text-foreground group-hover:text-primary transition-colors"
        )}>
          {cropName}
        </span>
        
        {/* Price Indicator (Slides in on desktop/tablet) */}
        {!isSelected && (
          <span className="text-[9px] font-medium text-muted-foreground mt-0.5 sm:opacity-0 sm:-translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
            ₹{crop.currentPrice}
          </span>
        )}
      </div>
    </motion.button>
  )
}

// ----------------------------------------------------------------------
// 2. THE MAIN GRID LAYOUT
// ----------------------------------------------------------------------
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
    <div className="space-y-3 sm:space-y-4 w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight uppercase">
          {t.commodities}
        </h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          {crops.length} Listed
        </span>
      </div>
      
      {/* MOBILE-FIRST SCROLLING:
        On mobile, it acts as a smooth horizontal scrolling strip.
        On 'sm' (tablet/desktop) and up, it breaks out into a beautifully wrapping grid!
      */}
      <div className="flex sm:flex-wrap gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
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