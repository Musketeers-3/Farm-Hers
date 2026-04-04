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
    <div className="glass-card rounded-2xl p-5 space-y-4">
      {/* Header with location and main temp */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            weather.isGoodForHarvest ? "bg-agri-sage/30" : "bg-agri-wheat/30"
          )}>
            <WeatherIcon className={cn(
              "w-8 h-8",
              weather.condition === "sunny" ? "text-agri-gold" : "text-agri-olive"
            )} />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">
              {weather.condition.replace("-", " ")}
            </p>
          </div>
        </div>
        
        {/* Harvest Advisory Badge */}
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium",
          weather.isGoodForHarvest 
            ? "bg-agri-success/20 text-agri-olive" 
            : "bg-agri-wheat/30 text-agri-earth"
        )}>
          {weather.isGoodForHarvest ? t.goodDayToHarvest : t.notIdealForHarvest}
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <WeatherStat
          icon={Thermometer}
          label={t.soilTemp}
          value={`+${weather.temperature - 5}°C`}
        />
        <WeatherStat
          icon={Droplets}
          label={t.humidity}
          value={`${weather.humidity}%`}
        />
        <WeatherStat
          icon={Wind}
          label={t.wind}
          value={`${weather.windSpeed} km/h`}
        />
        <WeatherStat
          icon={CloudRain}
          label={t.precipitation}
          value="0 mm"
        />
      </div>

      {/* Sun times */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-agri-gold" />
          <span className="text-sm text-muted-foreground">5:45 AM</span>
          <span className="text-xs text-muted-foreground">Sunrise</span>
        </div>
        <div className="flex-1 mx-4 h-[2px] bg-gradient-to-r from-agri-gold via-agri-sage to-agri-olive rounded-full" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sunset</span>
          <span className="text-sm text-muted-foreground">6:52 PM</span>
          <div className="w-2 h-2 rounded-full bg-agri-olive" />
        </div>
      </div>
    </div>
  )
}

function WeatherStat({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType
  label: string
  value: string 
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/50">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
