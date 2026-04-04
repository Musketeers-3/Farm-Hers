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
    md: { icon: 28, text: "text-xl" },
    lg: { icon: 36, text: "text-2xl" },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M24 4C24 4 8 12 8 28C8 36 15 44 24 44C33 44 40 36 40 28C40 12 24 4 24 4Z"
          className="fill-primary"
        />
        <path
          d="M24 12C24 12 16 18 16 28C16 32 19 36 24 36C29 36 32 32 32 28C32 18 24 12 24 12Z"
          className="fill-primary/30"
        />
        <path
          d="M24 28V44"
          strokeWidth="2"
          className="stroke-primary"
        />
        <circle cx="28" cy="20" r="2.5" className="fill-agri-gold" />
      </svg>

      {variant === "full" && (
        <span className={cn("font-serif font-bold tracking-tight text-foreground", textSize)}>
          Agri<span className="text-primary">Link</span>
        </span>
      )}
    </div>
  )
}
