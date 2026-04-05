"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { PriceHistoryChart } from "./price-history-chart"
import { BottomNav } from "./bottom-nav"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, MapPin, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const cropImages: Record<string, string> = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=100&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100&h=100&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=100&h=100&fit=crop",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&h=100&fit=crop",
}

const mandiData = [
  { name: "Ludhiana Mandi", distance: "12 km", prices: { wheat: 2350, rice: 2180, mustard: 5350 } },
  { name: "Amritsar Mandi", distance: "45 km", prices: { wheat: 2280, rice: 2220, mustard: 5200 } },
  { name: "Jalandhar Mandi", distance: "28 km", prices: { wheat: 2310, rice: 2150, mustard: 5280 } },
  { name: "Patiala Mandi", distance: "65 km", prices: { wheat: 2290, rice: 2190, mustard: 5320 } },
]

export function MarketScreen() {
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const crops = useAppStore((state) => state.crops)
  const marketInsights = useAppStore((state) => state.marketInsights)
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveScreen("home")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">{t.market}</h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search crops or mandis..."
              className="pl-10 h-12 rounded-xl bg-muted border-0"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <Filter className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* Market Insights Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t.marketInsight}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {marketInsights.map((insight) => {
              const crop = crops.find((c) => c.id === insight.cropId)
              if (!crop) return null

              const TrendIcon =
                insight.trend === "up"
                  ? TrendingUp
                  : insight.trend === "down"
                  ? TrendingDown
                  : Minus

              return (
                <div
                  key={insight.cropId}
                  className="min-w-[160px] glass-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <Image
                        src={cropImages[crop.id] || cropImages.wheat}
                        alt={crop.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground">{crop.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {insight.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">per quintal</p>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        insight.trend === "up" && "bg-agri-success/20 text-agri-success",
                        insight.trend === "down" && "bg-destructive/20 text-destructive",
                        insight.trend === "stable" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {insight.trend === "up" && "+"}
                      {insight.percentChange}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mandi Prices */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Nearby Mandis</h2>
          <div className="space-y-3">
            {mandiData.map((mandi) => (
              <div
                key={mandi.name}
                className="bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{mandi.name}</h3>
                      <p className="text-xs text-muted-foreground">{mandi.distance} away</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(mandi.prices).map(([cropId, price]) => {
                    const crop = crops.find((c) => c.id === cropId)
                    const insight = marketInsights.find((m) => m.cropId === cropId)
                    const isHighest =
                      insight && price >= insight.price

                    return (
                      <div
                        key={cropId}
                        className={cn(
                          "p-2 rounded-xl text-center",
                          isHighest ? "bg-agri-success/10" : "bg-muted/50"
                        )}
                      >
                        <p className="text-xs text-muted-foreground capitalize">
                          {crop?.name || cropId}
                        </p>
                        <p
                          className={cn(
                            "font-semibold",
                            isHighest ? "text-agri-success" : "text-foreground"
                          )}
                        >
                          {price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price History Chart */}
        <PriceHistoryChart />
      </main>

      <BottomNav />
    </div>
  )
}
