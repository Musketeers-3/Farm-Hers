"use client"

import { cn } from "@/lib/utils"

interface SafetyScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function SafetyScoreRing({ score, size = "md", showLabel = true, className }: SafetyScoreRingProps) {
  const sizes = {
    sm: { ring: 44, stroke: 4, text: "text-sm" },
    md: { ring: 72, stroke: 5, text: "text-xl" },
    lg: { ring: 110, stroke: 6, text: "text-3xl" },
  }

  const { ring, stroke, text } = sizes[size]
  const radius = (ring - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return { 
      stroke: "#065F46", 
      fill: "url(#safeGradient)",
      bg: "#D1FAE5",
      text: "#065F46"
    }
    if (score >= 60) return { 
      stroke: "#92400E", 
      fill: "url(#cautionGradient)",
      bg: "#FEF3C7",
      text: "#92400E"
    }
    return { 
      stroke: "#991B1B", 
      fill: "url(#warningGradient)",
      bg: "#FEE2E2",
      text: "#991B1B"
    }
  }

  const color = getColor(score)

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={ring} height={ring} className="transform -rotate-90">
        <defs>
          <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="cautionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="rgba(139, 115, 85, 0.1)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke={color.fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-out",
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", text)} style={{ color: color.text }}>{score}</span>
          {size !== "sm" && <span className="text-[9px] text-taupe uppercase tracking-wider">Score</span>}
        </div>
      )}
    </div>
  )
}
