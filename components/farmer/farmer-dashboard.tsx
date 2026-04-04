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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3 space-y-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <AgriLinkLogo size="sm" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-background" />
              </button>
            </div>
          </div>

          {/* Greeting Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                {t.hello}, <span className="text-gradient-green">{userName.split(' ')[0]}</span>
              </h1>
            </div>
            
            {/* Location Selector */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{userLocation}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-5 space-y-6">
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Market Insight Card */}
        <MarketInsightCard />

        {/* Community Pulse */}
        <CommunityPulse />

        {/* Commodities Grid */}
        <CommoditiesGrid />

        {/* My Fields */}
        <MyFieldsCard />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
