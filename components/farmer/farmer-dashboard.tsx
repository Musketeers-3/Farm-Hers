"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { AgriLinkLogo } from "@/components/agrilink-logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { WeatherWidget } from "./weather-widget"
import { MarketInsightCard } from "./market-insight-card"
import { CommoditiesGrid } from "./commodities-grid"
import { CommunityPulse } from "./community-pulse"
import { MyFieldsCard } from "./my-fields-card"
import { BottomNav } from "./bottom-nav"
import { Bell, MapPin, ChevronDown } from "lucide-react"
import { format } from "date-fns"

export function FarmerDashboard() {
  const userName = useAppStore((state) => state.userName)
  const userLocation = useAppStore((state) => state.userLocation)
  const t = useTranslation()

  const today = new Date()
  const formattedDate = format(today, "EEEE, dd MMM yyyy")

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header — clean, elevated */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-lg mx-auto px-5 py-4 space-y-4">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <AgriLinkLogo size="sm" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all duration-200">
                <Bell className="w-[18px] h-[18px] text-foreground" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <p className="text-[13px] text-muted-foreground tracking-wide uppercase">{formattedDate}</p>
              <h1 className="text-[28px] font-serif font-bold text-foreground leading-tight tracking-tight">
                {t.hello}, <span className="text-primary">{userName.split(' ')[0]}</span>
              </h1>
            </div>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent transition-all duration-200">
              <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="text-[13px] font-medium text-foreground">{userLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main — Bento Grid Layout */}
      <main className="max-w-lg mx-auto px-5 py-6 space-y-5">
        {/* Top bento row: Weather + Market side by side on larger screens */}
        <div className="grid grid-cols-1 gap-4">
          <WeatherWidget />
          <MarketInsightCard />
        </div>

        {/* Community pulse — slim, horizontal */}
        <CommunityPulse />

        {/* Commodities */}
        <CommoditiesGrid />

        {/* My Fields */}
        <MyFieldsCard />
      </main>

      <BottomNav />
    </div>
  )
}
