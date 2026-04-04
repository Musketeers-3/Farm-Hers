"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { SafetyScoreRing } from "./safety-score-ring"
import { FlaskConical, Droplets, Sun, Heart, Sparkles } from "lucide-react"
import type { Product } from "@/lib/skincare-data"

interface ProductCardProps {
  product: Product
  variant?: "default" | "compact" | "detailed"
  onClick?: () => void
  className?: string
}

const categoryIcons: Record<string, React.ElementType> = {
  "Serums": FlaskConical,
  "Cleansers": Droplets,
  "Sunscreen": Sun,
  "Moisturizers": Heart,
  "Treatments": Sparkles,
  "Exfoliants": Sparkles,
}

export function ProductCard({ product, variant = "default", onClick, className }: ProductCardProps) {
  const getSafetyBadge = (score: number) => {
    if (score >= 80) return { label: "Safe", className: "badge-safe" }
    if (score >= 60) return { label: "Caution", className: "badge-caution" }
    return { label: "Warning", className: "badge-warning" }
  }

  const badge = getSafetyBadge(product.safetyScore)
  const Icon = categoryIcons[product.category] || FlaskConical

  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 p-3 rounded-2xl glass-card w-full text-left",
          className
        )}
      >
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-peach-light to-rose-light flex-shrink-0 flex items-center justify-center">
          <Icon className="w-6 h-6 text-rose-dark/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-brown-dark truncate">{product.name}</h4>
          <p className="text-xs text-taupe">{product.brand}</p>
        </div>
        <SafetyScoreRing score={product.safetyScore} size="sm" showLabel={false} />
      </button>
    )
  }

  if (variant === "detailed") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "glass-card rounded-2xl p-4 w-full text-left",
          className
        )}
      >
        <div className="flex gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-peach-light to-rose-light flex-shrink-0 flex items-center justify-center">
            <Icon className="w-10 h-10 text-rose-dark/50" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-brown-dark">{product.name}</h3>
                <p className="text-sm text-taupe">{product.brand}</p>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", badge.className)}>
                {badge.label}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {product.ingredients.slice(0, 3).map((ing) => (
                <span key={ing} className="px-2 py-0.5 rounded-full text-[10px] bg-blush text-taupe">
                  {ing}
                </span>
              ))}
              {product.ingredients.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blush text-taupe">
                  +{product.ingredients.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "product-card rounded-2xl p-4 w-full text-left group",
        className
      )}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-peach-light via-cream to-rose-light mb-3 flex items-center justify-center">
        <Icon className="w-12 h-12 text-rose-dark/40 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-2 right-2">
          <SafetyScoreRing score={product.safetyScore} size="sm" />
        </div>
      </div>
      <h3 className="font-medium text-brown-dark truncate">{product.name}</h3>
      <p className="text-sm text-taupe">{product.brand}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-taupe/70">{product.category}</span>
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", badge.className)}>
          {badge.label}
        </span>
      </div>
    </button>
  )
}
