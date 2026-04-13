"use client";

import { useAppStore } from "@/lib/store";
import { Wind, Droplets, Thermometer, Eye, Umbrella } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type ThemeKey =
  | "sunny"
  | "clear_night"
  | "rainy"
  | "snowy"
  | "cloudy"
  | "partlycloudy"
  | "stormy";

interface ForecastDay {
  day: string;
  condition: ThemeKey;
  high: number;
  low: number;
  rain: number; // mm
  pop: number; // precipitation probability 0–100
}

interface LiveWeather {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  visibility: number; // km
  uvIndex: number;
  condition: ThemeKey;
  conditionLabel: string;
  themeKey: ThemeKey;
  forecast: ForecastDay[];
}

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES: Record<ThemeKey, { bg: string }> = {
  sunny: { bg: "from-[#1a6b8a] via-[#2196b6] to-[#0d3f5e]" },
  clear_night: { bg: "from-[#0b1437] via-[#112055] to-[#050d22]" },
  rainy: { bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]" },
  snowy: { bg: "from-[#1c2a3a] via-[#253545] to-[#101e2c]" },
  cloudy: { bg: "from-[#2c2c3e] via-[#383850] to-[#1a1a28]" },
  partlycloudy: { bg: "from-[#1a4a6e] via-[#1e5580] to-[#0d2e45]" },
  stormy: { bg: "from-[#1a1a1a] via-[#2d1a3e] to-[#0d0d1e]" },
};

// ─── WMO WEATHER CODE → CONDITION + LABEL ────────────────────────────────────
// Full WMO codes: https://open-meteo.com/en/docs#weathervariables
function wmoToCondition(code: number, isDay: boolean): ThemeKey {
  if (code === 0) return isDay ? "sunny" : "clear_night";
  if (code === 1 || code === 2) return "partlycloudy";
  if (code === 3) return "cloudy";
  if (code >= 45 && code <= 48) return "cloudy"; // fog
  if (code >= 51 && code <= 67) return "rainy"; // drizzle / rain
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "rainy"; // rain showers
  if (code === 85 || code === 86) return "snowy"; // snow showers
  if (code >= 95 && code <= 99) return "stormy";
  return isDay ? "sunny" : "clear_night";
}

function wmoToLabel(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "Sunny" : "Clear Night";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45) return "Foggy";
  if (code === 48) return "Icy Fog";
  if (code === 51) return "Light Drizzle";
  if (code === 53) return "Drizzle";
  if (code === 55) return "Heavy Drizzle";
  if (code === 61) return "Light Rain";
  if (code === 63) return "Moderate Rain";
  if (code === 65) return "Heavy Rain";
  if (code === 66 || code === 67) return "Freezing Rain";
  if (code === 71) return "Light Snow";
  if (code === 73) return "Snow";
  if (code === 75) return "Heavy Snow";
  if (code === 77) return "Snow Grains";
  if (code === 80) return "Rain Showers";
  if (code === 81) return "Moderate Showers";
  if (code === 82) return "Heavy Showers";
  if (code === 85) return "Snow Showers";
  if (code === 86) return "Heavy Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm & Hail";
  return isDay ? "Clear" : "Clear Night";
}

// ─── GEOCODING ────────────────────────────────────────────────────────────────
const ADMIN_SUFFIXES = [
  /\s+(I{1,3}|IV|V{1,2}|VI{1,2}|VII|VIII|IX|X)\s+tahsil$/i,
  /\s+tahsil$/i,
  /\s+taluka$/i,
  /\s+taluk$/i,
  /\s+district$/i,
  /\s+division$/i,
  /\s+block$/i,
  /\s+mandal$/i,
  /\s+(I{1,3}|IV|V{1,2}|VI{1,2}|VII|VIII|IX|X)$/,
];

function buildQueryCandidates(raw: string): string[] {
  const candidates: string[] = [raw.trim()];
  let cleaned = raw.trim();
  for (const pattern of ADMIN_SUFFIXES) {
    const next = cleaned.replace(pattern, "").trim();
    if (next && next !== cleaned) {
      cleaned = next;
      candidates.push(cleaned);
    }
  }
  const firstWord = cleaned.split(/\s+/)[0];
  if (firstWord && firstWord !== cleaned) candidates.push(firstWord);
  return [...new Set(candidates)];
}

async function tryGeocode(
  query: string,
): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
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

async function geocodeLocation(
  location: string,
): Promise<{ lat: number; lon: number } | null> {
  const candidates = buildQueryCandidates(location);
  for (const query of candidates) {
    const result = await tryGeocode(query);
    if (result) return result;
  }
  return null;
}

// ─── OPEN-METEO FETCH (FREE — NO API KEY) ────────────────────────────────────
async function fetchWeather(
  lat: number,
  lon: number,
): Promise<LiveWeather | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
      `wind_speed_10m,weather_code,visibility,uv_index,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
      `precipitation_sum,precipitation_probability_max` +
      `&timezone=auto` +
      `&forecast_days=4`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();

    const cur = data.current;
    const isDay = cur.is_day === 1;
    const code = cur.weather_code as number;

    const themeKey = wmoToCondition(code, isDay);
    const conditionLabel = wmoToLabel(code, isDay);

    // Visibility: Open-Meteo returns metres
    const visibilityKm = Math.round((cur.visibility ?? 10000) / 1000);

    // Daily forecast (indices 0–3)
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayLabels = ["Today", "Tomorrow"];

    const forecast: ForecastDay[] = (data.daily.time as string[])
      .slice(0, 4)
      .map((dateStr: string, i: number) => {
        const date = new Date(dateStr);
        const dayCode = data.daily.weather_code[i] as number;
        return {
          day: i < 2 ? dayLabels[i] : weekdays[date.getDay()],
          condition: wmoToCondition(dayCode, true),
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
          rain: Math.round(data.daily.precipitation_sum[i] ?? 0),
          pop: Math.round(data.daily.precipitation_probability_max[i] ?? 0),
        };
      });

    return {
      temp: Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.apparent_temperature),
      windSpeed: Math.round(cur.wind_speed_10m), // already km/h from Open-Meteo
      humidity: Math.round(cur.relative_humidity_2m),
      visibility: visibilityKm,
      uvIndex: Math.round(cur.uv_index ?? 0),
      condition: themeKey,
      conditionLabel,
      themeKey,
      forecast,
    };
  } catch (err) {
    console.error("Open-Meteo fetch failed:", err);
    return null;
  }
}

// ─── HELPER UTILS ─────────────────────────────────────────────────────────────
function getRainAlert(condition: ThemeKey, rain: number, pop: number) {
  if (condition === "stormy")
    return {
      text: "⛈️ Thunderstorm alert — stay indoors",
      color: "bg-purple-900/40 text-purple-200",
    };
  if (condition === "rainy" && rain > 15)
    return { text: "⚠️ Heavy rain alert", color: "bg-red-900/40 text-red-200" };
  if (condition === "rainy" && pop >= 70)
    return {
      text: "🌧️ High chance of rain today",
      color: "bg-blue-900/40 text-blue-200",
    };
  if (pop >= 40)
    return {
      text: `🌦️ ${pop}% rain chance — keep watch`,
      color: "bg-sky-900/40 text-sky-200",
    };
  return null;
}

function getIrrigationTip(
  condition: ThemeKey,
  temp: number,
  uv: number,
  hour: number,
): string {
  const isNight = hour >= 20 || hour < 6;
  if (condition === "stormy") return "⛈️ Secure equipment — storm incoming";
  if (condition === "rainy") return "💧 Skip watering — rain expected";
  if (condition === "snowy") return "❄️ Protect crops from frost";
  if (uv >= 8) return `🔆 UV ${uv} — water before 8 AM only`;
  if (temp > 35) return "🌡️ Extreme heat — water early morning only";
  if (isNight) return "🌙 Best time to water: now (night)";
  if (hour < 10) return "🌅 Best time to water: morning ✅";
  return "🌿 Best time to water: this evening";
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
function SunIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="9" fill="#FFD600" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1="20"
          y1="3"
          x2="20"
          y2="8"
          stroke="#FFD600"
          strokeWidth="2.5"
          strokeLinecap="round"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
    </svg>
  );
}
function MoonIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M28 22c-6 0-11-5-11-11 0-2 .5-4 1.4-5.6C12.2 7 8 12.5 8 19c0 7.2 5.8 13 13 13 6.5 0 12-4.2 13.6-10-.5.1-1.1.1-1.6.1h-5z"
        fill="#b0bec5"
      />
    </svg>
  );
}
function CloudIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 28" fill="none">
      <path
        d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z"
        fill="rgba(255,255,255,0.75)"
      />
    </svg>
  );
}
function RainIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none">
      <path
        d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z"
        fill="rgba(255,255,255,0.7)"
      />
      <line
        x1="14"
        y1="26"
        x2="12"
        y2="32"
        stroke="#4fc3f7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="26"
        x2="18"
        y2="32"
        stroke="#4fc3f7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="26"
        x2="24"
        y2="32"
        stroke="#4fc3f7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SnowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none">
      <path
        d="M32 22H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 22z"
        fill="rgba(255,255,255,0.7)"
      />
      <line
        x1="20"
        y1="25"
        x2="20"
        y2="35"
        stroke="#90caf9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="27"
        x2="25"
        y2="33"
        stroke="#90caf9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="25"
        y1="27"
        x2="15"
        y2="33"
        stroke="#90caf9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PartlyCloudyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 36" fill="none">
      <circle cx="14" cy="14" r="8" fill="#FFD600" opacity="0.9" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <line
          key={i}
          x1="14"
          y1="2"
          x2="14"
          y2="5"
          stroke="#FFD600"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${deg} 14 14)`}
        />
      ))}
      <path
        d="M36 28H18a7 7 0 010-14 7 7 0 0113.4-1.7A5 5 0 1136 28z"
        fill="rgba(255,255,255,0.8)"
      />
    </svg>
  );
}
function StormIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 36" fill="none">
      <path
        d="M32 20H10a8 8 0 010-16 8 8 0 0115.3-2A6 6 0 1132 20z"
        fill="rgba(255,255,255,0.55)"
      />
      <polyline
        points="22,22 17,30 21,30 16,38"
        stroke="#FFD600"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function getWeatherIcon(condition: string, size = 20) {
  const c = condition.toLowerCase();
  if (c === "sunny") return <SunIcon size={size} />;
  if (c === "clear_night") return <MoonIcon size={size} />;
  if (c === "rainy") return <RainIcon size={size} />;
  if (c === "snowy") return <SnowIcon size={size} />;
  if (c === "partlycloudy") return <PartlyCloudyIcon size={size} />;
  if (c === "stormy") return <StormIcon size={size} />;
  return <CloudIcon size={size} />;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function WeatherWidget() {
  const userLocation = useAppStore((s) => s.userLocation);
  const [mounted, setMounted] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setCurrentHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const load = async () => {
      setLoading(true);
      setLocationError(false);
      setFetchError(false);
      setWeather(null);

      const coords = await geocodeLocation(userLocation);
      if (!coords) {
        setLocationError(true);
        setLoading(false);
        return;
      }

      const data = await fetchWeather(coords.lat, coords.lon);
      if (data) {
        setWeather(data);
      } else {
        setFetchError(true);
      }
      setLoading(false);
    };

    load();
    // Refresh every 30 minutes
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userLocation]);

  const isNightFallback = currentHour >= 20 || currentHour < 6;
  const themeKey =
    weather?.themeKey ?? (isNightFallback ? "clear_night" : "sunny");
  const theme = THEMES[themeKey];

  const temp = weather?.temp;
  const feelsLike = weather?.feelsLike;
  const windSpeed = weather?.windSpeed;
  const humidity = weather?.humidity;
  const visibility = weather?.visibility;
  const uvIndex = weather?.uvIndex ?? 0;
  const condition =
    weather?.condition ?? (isNightFallback ? "clear_night" : "sunny");
  const conditionLabel =
    weather?.conditionLabel ?? (isNightFallback ? "Clear Night" : "Sunny");
  const forecast = weather?.forecast ?? [];

  const rainAlert = getRainAlert(
    condition,
    forecast[0]?.rain ?? 0,
    forecast[0]?.pop ?? 0,
  );
  const irrigationTip = getIrrigationTip(
    condition,
    temp ?? 25,
    uvIndex,
    currentHour,
  );

  if (!mounted)
    return (
      <div className="h-[170px] w-full rounded-[20px] bg-gray-800 animate-pulse" />
    );

  if (locationError)
    return (
      <div
        className="w-full rounded-[20px] bg-gradient-to-br from-[#1c1c2e] via-[#2a1a2e] to-[#0d0d1e] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 flex flex-col items-center justify-center gap-3 text-center"
        style={{ minHeight: 170 }}
      >
        <span className="text-3xl">🌍</span>
        <div>
          <p className="text-[13px] font-black text-white/90">
            Location not found
          </p>
          <p className="text-[11px] text-white/45 mt-0.5">
            <span className="text-white/70 font-semibold">
              "{userLocation}"
            </span>{" "}
            didn't match any city.
          </p>
          <p className="text-[10px] text-white/35 mt-1">
            Try a nearby city or check the spelling.
          </p>
        </div>
      </div>
    );

  if (fetchError)
    return (
      <div
        className="w-full rounded-[20px] bg-gradient-to-br from-[#1c1c2e] via-[#2a1a2e] to-[#0d0d1e] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 flex flex-col items-center justify-center gap-3 text-center"
        style={{ minHeight: 170 }}
      >
        <span className="text-3xl">⚡</span>
        <div>
          <p className="text-[13px] font-black text-white/90">
            Weather temporarily unavailable
          </p>
          <p className="text-[11px] text-white/45 mt-0.5">
            Could not reach weather service for
          </p>
          <p className="text-[11px] text-white/70 font-semibold mt-0.5">
            "{userLocation}"
          </p>
          <p className="text-[10px] text-white/30 mt-1">
            Check your internet connection and try again.
          </p>
        </div>
      </div>
    );

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
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${(i * 17 + 5) % 97}%`,
                  top: `${(i * 13 + 3) % 55}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.5 + (i % 4) * 0.5,
                  repeat: Infinity,
                  delay: (i % 5) * 0.4,
                }}
              />
            ))}
          </div>
        )}

        {/* Rain streaks */}
        {(themeKey === "rainy" || themeKey === "stormy") && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-blue-300"
                style={{ left: `${(i / 12) * 100}%`, height: 18 }}
                animate={{ top: ["0%", "110%"] }}
                transition={{
                  duration: 0.6 + (i % 3) * 0.15,
                  repeat: Infinity,
                  delay: (i % 6) * 0.1,
                  ease: "linear",
                }}
              />
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
                  {userLocation || "Your Location"} ·{" "}
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
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
                {loading ? "..." : temp != null ? `${temp}°C` : "—"}
              </motion.p>
              <p className="text-[8px] opacity-55 mt-0.5">
                {feelsLike != null ? `Feels ${feelsLike}°C` : ""}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-1 text-[8px] opacity-70 border-t border-white/10 pt-1.5">
            <span className="flex flex-col items-center gap-0.5">
              <Wind size={9} className="text-blue-300" />
              <span>
                {windSpeed != null ? windSpeed : "—"}
                <br />
                km/h
              </span>
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <Droplets size={9} className="text-blue-200" />
              <span>
                {humidity != null ? `${humidity}%` : "—"}
                <br />
                hum
              </span>
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <Eye size={9} className="text-sky-200" />
              <span>
                {visibility != null ? visibility : "—"}
                <br />
                km vis
              </span>
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <Thermometer size={9} className="text-orange-300" />
              <span>
                UV {uvIndex}
                <br />
                {uvIndex >= 8 ? "High" : uvIndex >= 4 ? "Mod" : "Low"}
              </span>
            </span>
          </div>

          {/* 4-Day Forecast */}
          <div className="grid grid-cols-4 gap-1 border-t border-white/10 pt-1.5">
            {forecast.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-0.5 rounded-xl bg-white/[0.08] py-1.5 px-1"
              >
                <span className="text-[9px] font-semibold opacity-65">
                  {f.day}
                </span>
                <div style={{ width: 20, height: 20 }}>
                  {getWeatherIcon(f.condition, 20)}
                </div>
                <span className="text-[10px] font-bold">{f.high}°</span>
                <span className="text-[8px] opacity-45">{f.low}°</span>
                {f.pop > 0 && (
                  <span className="flex items-center gap-0.5 text-[7px] text-blue-300 font-medium">
                    <Umbrella size={6} />
                    {f.pop}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Rain Alert */}
          {rainAlert && (
            <div
              className={`flex items-center gap-2 rounded-xl px-2 py-1 ${rainAlert.color}`}
            >
              <span className="text-[10px] font-semibold">
                {rainAlert.text}
              </span>
            </div>
          )}

          {/* Irrigation Tip */}
          <div className="flex items-center gap-2 rounded-xl bg-green-900/35 px-2 py-1">
            <span className="text-[10px] text-green-200 font-medium">
              {irrigationTip}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
