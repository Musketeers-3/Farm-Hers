"use client";

import { useAppStore } from "@/lib/store";
import { Wind, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type ThemeKey = "sunny" | "clear_night" | "rainy" | "snowy" | "cloudy" | "partlycloudy";

const THEMES: Record<ThemeKey, { bg: string }> = {
  sunny:        { bg: "from-[#1a6b8a] via-[#2196b6] to-[#0d3f5e]" },
  clear_night:  { bg: "from-[#0b1437] via-[#112055] to-[#050d22]" },
  rainy:        { bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]" },
  snowy:        { bg: "from-[#1c2a3a] via-[#253545] to-[#101e2c]" },
  cloudy:       { bg: "from-[#2c2c3e] via-[#383850] to-[#1a1a28]" },
  partlycloudy: { bg: "from-[#1a4a6e] via-[#1e5580] to-[#0d2e45]" },
};

// Open-Meteo WMO weather code → condition string
function wmoToCondition(code: number, isNight: boolean): string {
  if (code === 0) return isNight ? "clear_night" : "sunny";
  if (code <= 2)  return "partlycloudy";
  if (code === 3) return "cloudy";
  if (code <= 67) return "rainy";
  if (code <= 77) return "snowy";
  if (code <= 82) return "rainy";
  if (code <= 86) return "snowy";
  return "rainy";
}

function wmoToLabel(code: number, isNight: boolean): string {
  if (code === 0) return isNight ? "Clear Night" : "Sunny";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  return "Thunderstorm";
}

interface ForecastDay {
  day: string;
  condition: string;
  high: number;
  low: number;
  rain: number;
}

interface LiveWeather {
  temp: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  conditionLabel: string;
  themeKey: ThemeKey;
  forecast: ForecastDay[];
}

function SunIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="9" fill="#FFD600" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line key={i} x1="20" y1="3" x2="20" y2="8"
          stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round"
          transform={`rotate(${deg} 20 20)`} />
      ))}
    </svg>
  );
}
function MoonIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M28 22c-6 0-11-5-11-11 0-2 .5-4 1.4-5.6C12.2 7 8 12.5 8 19c0 7.2 5.8 13 13 13 6.5 0 12-4.2 13.6-10-.5.1-1.1.1-1.6.1h-5z" fill="#b0bec5" />
    </svg>
  );
}
function CloudIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 28" fill="none">
      <path d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z" fill="rgba(255,255,255,0.75)" />
    </svg>
  );
}
function RainIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none">
      <path d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z" fill="rgba(255,255,255,0.7)" />
      <line x1="14" y1="26" x2="12" y2="32" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="26" x2="18" y2="32" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="26" x2="24" y2="32" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function SnowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none">
      <path d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z" fill="rgba(255,255,255,0.7)" />
      <line x1="20" y1="25" x2="20" y2="35" stroke="#90caf9" strokeWidth="2" strokeLinecap="round"/>
      <line x1="15" y1="27" x2="25" y2="33" stroke="#90caf9" strokeWidth="2" strokeLinecap="round"/>
      <line x1="25" y1="27" x2="15" y2="33" stroke="#90caf9" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function PartlyCloudyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 36" fill="none">
      <circle cx="14" cy="14" r="8" fill="#FFD600" opacity="0.9"/>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <line key={i} x1="14" y1="2" x2="14" y2="5"
          stroke="#FFD600" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg} 14 14)`} />
      ))}
      <path d="M36 28H18a7 7 0 010-14 7 7 0 0113.4-1.7A5 5 0 1136 28z" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

function getWeatherIcon(condition: string, size = 20) {
  const c = condition.toLowerCase();
  if (c === "sunny")                    return <SunIcon size={size} />;
  if (c === "clear_night")              return <MoonIcon size={size} />;
  if (c === "rainy")                    return <RainIcon size={size} />;
  if (c === "snowy")                    return <SnowIcon size={size} />;
  if (c === "partlycloudy")             return <PartlyCloudyIcon size={size} />;
  return <CloudIcon size={size} />;
}

function getRainAlert(condition: string, rain: number) {
  if (condition === "rainy" && rain > 15) return { text: "⚠️ Heavy rain alert",     color: "bg-red-900/40 text-red-200" };
  if (condition === "rainy" && rain > 5)  return { text: "🌧️ Rain in next 3 hours", color: "bg-blue-900/40 text-blue-200" };
  if (rain > 0)                           return { text: "🌦️ Light rain expected",  color: "bg-sky-900/40 text-sky-200" };
  return null;
}

function getIrrigationTip(condition: string, temp: number, hour: number): string {
  const isNight = hour >= 20 || hour < 6;
  if (condition === "rainy")        return "💧 Skip watering — rain expected";
  if (condition === "snowy")        return "❄️ Protect crops from frost";
  if (temp > 35)                    return "🌡️ Water early morning only";
  if (isNight)                      return "🌙 Best time to water: now (night)";
  if (hour < 10)                    return "🌅 Best time to water: morning ✅";
  return "🌿 Best time to water: evening";
}

async function geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    const data = await res.json();
    if (data.results?.[0]) {
      return { lat: data.results[0].latitude, lon: data.results[0].longitude };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchWeather(lat: number, lon: number): Promise<LiveWeather | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=auto&forecast_days=4`
    );
    const data = await res.json();

    const current = data.current;
    const daily   = data.daily;
    const isDay   = current.is_day === 1;
    const hour    = new Date().getHours();
    const isNight = !isDay;

    const condition  = wmoToCondition(current.weather_code, isNight);
    const themeKey   = condition as ThemeKey;

    const days = ["Today", "Tomorrow"];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const forecast: ForecastDay[] = daily.time.slice(0, 4).map((dateStr: string, i: number) => {
      const d    = new Date(dateStr);
      const cond = wmoToCondition(daily.weather_code[i], false);
      return {
        day:       i < 2 ? days[i] : weekdays[d.getDay()],
        condition: cond,
        high:      Math.round(daily.temperature_2m_max[i]),
        low:       Math.round(daily.temperature_2m_min[i]),
        rain:      Math.round(daily.precipitation_sum[i] ?? 0),
      };
    });

    return {
      temp:           Math.round(current.temperature_2m),
      windSpeed:      Math.round(current.wind_speed_10m),
      humidity:       current.relative_humidity_2m,
      condition,
      conditionLabel: wmoToLabel(current.weather_code, isNight),
      themeKey,
      forecast,
    };
  } catch {
    return null;
  }
}

export function WeatherWidget() {
  const userLocation = useAppStore((s) => s.userLocation);
  const [mounted, setMounted]       = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [weather, setWeather]       = useState<LiveWeather | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setCurrentHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Fetch live weather whenever location changes
  useEffect(() => {
    if (!userLocation) return;

    const load = async () => {
      setLoading(true);
      const coords = await geocodeLocation(userLocation);
      if (!coords) { setLoading(false); return; }
      const data = await fetchWeather(coords.lat, coords.lon);
      if (data) setWeather(data);
      setLoading(false);
    };

    load();
    // Refresh every 30 minutes
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userLocation]);

  // Fallback values
  const themeKey       = weather?.themeKey ?? (currentHour >= 6 && currentHour < 20 ? "sunny" : "clear_night");
  const theme          = THEMES[themeKey];
  const temp           = weather?.temp ?? 24;
  const windSpeed      = weather?.windSpeed ?? 7;
  const humidity       = weather?.humidity ?? 52;
  const condition      = weather?.condition ?? "sunny";
  const conditionLabel = weather?.conditionLabel ?? "Sunny";
  const forecast       = weather?.forecast ?? [
    { day: "Today", condition: "sunny",        high: 24, low: 18, rain: 0 },
    { day: "Tomorrow", condition: "cloudy",    high: 22, low: 16, rain: 2 },
    { day: "Sun",   condition: "partlycloudy", high: 25, low: 17, rain: 0 },
    { day: "Mon",   condition: "sunny",        high: 27, low: 19, rain: 0 },
  ];

  const rainAlert     = getRainAlert(condition, forecast[0]?.rain ?? 0);
  const irrigationTip = getIrrigationTip(condition, temp, currentHour);

  if (!mounted) return <div className="h-[170px] w-full rounded-[20px] bg-gray-800 animate-pulse" />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={themeKey}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55 }}
        className={`relative w-full overflow-hidden rounded-[20px] bg-gradient-to-br ${theme.bg} text-white border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
        style={{ minHeight: 170 }}
      >
        {/* Stars — clear night */}
        {themeKey === "clear_night" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 55}%` }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
            ))}
          </div>
        )}

        {/* Rain streaks */}
        {themeKey === "rainy" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div key={i} className="absolute w-px bg-blue-300"
                style={{ left: `${(i / 12) * 100}%`, height: 18 }}
                animate={{ top: ["0%", "110%"] }}
                transition={{ duration: 0.55 + Math.random() * 0.4, repeat: Infinity, delay: Math.random() * 0.6, ease: "linear" }} />
            ))}
          </div>
        )}

        <div className="relative z-10 p-2.5 flex flex-col gap-1.5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5">
              {getWeatherIcon(themeKey, 28)}
              <div>
                <p className="text-[13px] font-bold leading-tight">
                  {loading ? "Loading..." : conditionLabel}
                </p>
                <p className="text-[9px] opacity-55">
                  {userLocation || "Your Location"} · {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <motion.p
                key={temp}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[20px] font-black leading-none"
              >
                {loading ? "..." : `${temp}°C`}
              </motion.p>
              <p className="text-[8px] opacity-55 mt-0.5">
                {windSpeed} km/h · {humidity}% hum
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-between text-[9px] opacity-70 border-t border-white/10 pt-1.5">
            <span className="flex items-center gap-1">
              <Wind size={9} className="text-blue-300" /> Wind <strong className="ml-1">{windSpeed} km/h</strong>
            </span>
            <span className="flex items-center gap-1">
              <Droplets size={9} className="text-blue-200" /> Humidity <strong className="ml-1">{humidity}%</strong>
            </span>
          </div>

          {/* 4-Day Forecast */}
          <div className="grid grid-cols-4 gap-1 border-t border-white/10 pt-1.5">
            {forecast.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 rounded-xl bg-white/8 py-1.5 px-1">
                <span className="text-[9px] font-semibold opacity-65">{f.day}</span>
                <div style={{ width: 20, height: 20 }}>{getWeatherIcon(f.condition, 20)}</div>
                <span className="text-[10px] font-bold">{f.high}°</span>
                <span className="text-[8px] opacity-45">{f.low}°</span>
                {f.rain > 0 && (
                  <span className="text-[7px] text-blue-300 font-medium">💧{f.rain}mm</span>
                )}
              </div>
            ))}
          </div>

          {/* Rain Alert */}
          {rainAlert && (
            <div className={`flex items-center gap-2 rounded-xl px-2 py-1 ${rainAlert.color}`}>
              <span className="text-[10px] font-semibold">{rainAlert.text}</span>
            </div>
          )}

          {/* Irrigation Tip */}
          <div className="flex items-center gap-2 rounded-xl bg-green-900/35 px-2 py-1">
            <span className="text-[10px] text-green-200 font-medium">{irrigationTip}</span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}