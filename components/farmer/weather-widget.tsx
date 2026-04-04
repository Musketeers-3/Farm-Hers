"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { Cloud, Sun, CloudRain, Droplets, Wind, Thermometer, CloudSun } from "lucide-react"
import { cn } from "@/lib/utils"

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun,
}

export function WeatherWidget() {
  const weather = useAppStore((state) => state.weather)
  const t = useTranslation()

  if (!weather) return null

  const WeatherIcon = weatherIcons[weather.condition]

  return (
    <div className="rounded-2xl bg-card border border-border/60 p-5 premium-shadow space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            weather.isGoodForHarvest ? "bg-accent" : "bg-secondary"
          )}>
            <WeatherIcon className={cn(
              "w-7 h-7",
              weather.condition === "sunny" ? "text-agri-gold" : "text-primary"
            )} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">
              {weather.condition.replace("-", " ")}
            </p>
          </div>
        </div>
        
        <div className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-medium",
          weather.isGoodForHarvest 
            ? "bg-accent text-accent-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {weather.isGoodForHarvest ? t.goodDayToHarvest : t.notIdealForHarvest}
        </div>
      </div>

      {/* Stats — clean grid */}
      <div className="grid grid-cols-4 gap-2">
        <WeatherStat icon={Thermometer} label={t.soilTemp} value={`+${weather.temperature - 5}°`} />
        <WeatherStat icon={Droplets} label={t.humidity} value={`${weather.humidity}%`} />
        <WeatherStat icon={Wind} label={t.wind} value={`${weather.windSpeed}`} />
        <WeatherStat icon={CloudRain} label={t.precipitation} value="0mm" />
      </div>

      {/* Sun times — refined line */}
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-agri-gold" />
          <span className="text-[13px] text-muted-foreground">5:45 AM</span>
        </div>
        <div className="flex-1 mx-4 h-px bg-gradient-to-r from-agri-gold/40 via-border to-primary/40" />
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-muted-foreground">6:52 PM</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  )
}

function WeatherStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-secondary/60">
      <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
