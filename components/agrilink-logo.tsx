"use client"

import { cn } from "@/lib/utils"

interface AgriLinkLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
}

export function AgriLinkLogo({ className, size = "md", variant = "full" }: AgriLinkLogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 48, text: "text-3xl" },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Leaf/Plant Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer leaf */}
        <path
          d="M24 4C24 4 8 12 8 28C8 36 15 44 24 44C33 44 40 36 40 28C40 12 24 4 24 4Z"
          className="fill-primary"
        />
        {/* Inner leaf detail */}
        <path
          d="M24 12C24 12 16 18 16 28C16 32 19 36 24 36C29 36 32 32 32 28C32 18 24 12 24 12Z"
          className="fill-agri-sage"
        />
        {/* Stem */}
        <path
          d="M24 28V44"
          stroke="currentColor"
          strokeWidth="2"
          className="stroke-primary"
        />
        {/* Small leaf accent */}
        <circle cx="28" cy="20" r="3" className="fill-agri-gold" />
      </svg>

      {variant === "full" && (
        <span className={cn("font-serif font-bold tracking-tight text-foreground", textSize)}>
          Agri<span className="text-primary">Link</span>
        </span>
      )}
    </div>
  )
}
