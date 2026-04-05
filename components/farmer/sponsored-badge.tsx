"use client"

import { Megaphone } from "lucide-react"

export function SponsoredBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-agri-gold/10 text-agri-earth text-[10px] font-medium">
      <Megaphone className="w-3 h-3" />
      Sponsored
    </span>
  )
}
