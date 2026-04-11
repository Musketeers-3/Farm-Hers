"use client";

import { Card } from "@/components/ui/card";
import { useAppStore, useTranslation } from "@/lib/store";
import {
  MapPin,
  Wind,
  Droplets,
  Eye,
  Activity,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Weather Config
const weatherConfig = {
  sunny: {
    gradient: "from-orange-400 via-amber-500 to-orange-600",
    subtitle: "Golden Hour",
    MainIcon: Sun,
  },
  cloudy: {
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    subtitle: "Overcast",
    MainIcon: Cloud,
  },
  "partly-cloudy": {
    gradient: "from-blue-400 via-sky-500 to-blue-600",
    subtitle: "Clear Skies",
    MainIcon: Cloud,
  },
  rainy: {
    gradient: "from-indigo-600 via-blue-700 to-slate-800",
    subtitle: "Heavy Showers",
    MainIcon: CloudRain,
  },
};

// Forecast Data
const forecastData = [
  { day: "Mon", temp: 22, Icon: Cloud },
  { day: "Tue", temp: 23, Icon: Sun },
  { day: "Wed", temp: 19, Icon: CloudRain },
  { day: "Thu", temp: 20, Icon: Cloud },
  { day: "Fri", temp: 28, Icon: Sun },
  { day: "Sat", temp: 18, Icon: CloudRain },
  { day: "Sun", temp: 20, Icon: CloudLightning },
];

export function WeatherWidget() {
  const weather = useAppStore((state) => state.weather);
  const userLocation = useAppStore((state) => state.userLocation);
  const t = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentCondition = weather?.condition || "sunny";
  const config = weatherConfig[currentCondition];
  const MainIcon = config.MainIcon;

  if (!mounted)
    return (
      <div className="h-[220px] w-full rounded-2xl bg-muted/20 animate-pulse" />
    );

  return (
    <Card className="w-full border-0 shadow-lg premium-shadow overflow-hidden relative flex flex-col text-white rounded-2xl sm:rounded-3xl transition-all duration-300">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCondition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}
        />
      </AnimatePresence>

      {/* Top Section - Always side-by-side, perfectly scaled */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-row justify-between items-center gap-2">
        {/* Left: Temp & Location */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-white/90 mb-1">
            <MainIcon className="w-4 h-4 animate-pulse-slow" />
            <span className="text-xs font-medium tracking-wide">
              {config.subtitle}
            </span>
          </div>

          <div className="flex items-start leading-none -ml-1">
            <motion.span
              key={weather?.temperature}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl sm:text-6xl font-medium tracking-tighter drop-shadow-sm"
            >
              {weather?.temperature || 24}
            </motion.span>
            <span className="text-2xl sm:text-3xl font-light mt-1 drop-shadow-sm">
              °
            </span>
          </div>

          <div className="mt-2 text-white/90 text-xs font-medium tracking-wide flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {userLocation || "Punjab Valley"}
          </div>
        </div>

        {/* Right: 2x2 Stats Grid - Shrunk text to fit side-by-side on mobile */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3">
          <div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase text-white/70 font-semibold tracking-wider">
              <Wind className="w-3 h-3" /> Wind
            </div>
            <span className="text-sm sm:text-base font-semibold">
              {weather?.windSpeed || 7}
              <span className="text-[10px] sm:text-xs text-white/80 font-medium ml-0.5">
                mph
              </span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase text-white/70 font-semibold tracking-wider">
              <Eye className="w-3 h-3" /> Visibility
            </div>
            <span className="text-sm sm:text-base font-semibold">
              12.5
              <span className="text-[10px] sm:text-xs text-white/80 font-medium ml-0.5">
                mi
              </span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase text-white/70 font-semibold tracking-wider">
              <Activity className="w-3 h-3" /> Air Q.
            </div>
            <span className="text-sm sm:text-base font-semibold">38</span>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase text-white/70 font-semibold tracking-wider">
              <Droplets className="w-3 h-3" /> Humidity
            </div>
            <span className="text-sm sm:text-base font-semibold">
              {weather?.humidity || 52}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Forecast - Flex space-between forces it onto one clean line without wrapping */}
      <div className="relative z-10 bg-black/15 backdrop-blur-md px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex justify-between items-center w-full">
          {forecastData.map((day, i) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-[11px] sm:text-xs font-medium text-white/90">
                {day.temp}°
              </span>
              <day.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow-sm" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wide text-white/70 font-bold">
                {day.day}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
