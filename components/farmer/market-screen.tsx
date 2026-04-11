"use client";

import { useAppStore, useTranslation } from "@/lib/store";
import { PriceHistoryChart } from "./price-history-chart";
import { BottomNav } from "./bottom-nav";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Search,
  Filter,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const cropImages: Record<string, string> = {
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop",
  mustard:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop",
  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=200&h=200&fit=crop",
  onion:
    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop",
};

const mandiData = [
  {
    name: "Ludhiana Mandi",
    distance: "12 km",
    prices: { wheat: 2350, rice: 2180, mustard: 5350 },
  },
  {
    name: "Amritsar Mandi",
    distance: "45 km",
    prices: { wheat: 2280, rice: 2220, mustard: 5200 },
  },
  {
    name: "Jalandhar Mandi",
    distance: "28 km",
    prices: { wheat: 2310, rice: 2150, mustard: 5280 },
  },
  {
    name: "Patiala Mandi",
    distance: "65 km",
    prices: { wheat: 2290, rice: 2190, mustard: 5320 },
  },
];

export function MarketScreen() {
  const router = useRouter();
  const crops = useAppStore((state) => state.crops);
  const marketInsights = useAppStore((state) => state.marketInsights);
  const t = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8 overflow-x-hidden">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. COMPACT GLASS HEADER */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/farmer")}
              className="w-9 h-9 sm:w-10.5 sm:h-10.5 rounded-xl sm:rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all duration-200 shadow-sm shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight leading-none">
                {t.market}
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-agri-success uppercase tracking-wider mt-0.5 sm:mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-agri-success animate-pulse" />{" "}
                Live Rates
              </p>
            </div>
          </div>

          {/* Search & Filter - Shrunk height for mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search crops or mandis..."
                className="pl-10 sm:pl-11 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-secondary/50 border border-border/50 focus-visible:ring-2 focus-visible:ring-primary/30 transition-all text-sm sm:text-base"
              />
            </div>
            <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors shrink-0">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 sm:space-y-8">
        {/* 2. THE FINANCIAL TICKER (Mobile Scaled) */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-1.5 sm:gap-2 px-1">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Market Movers
            </h2>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {marketInsights.map((insight, index) => {
              const crop = crops.find((c) => c.id === insight.cropId);
              if (!crop) return null;

              const TrendIcon =
                insight.trend === "up"
                  ? TrendingUp
                  : insight.trend === "down"
                    ? TrendingDown
                    : Minus;

              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  key={insight.cropId}
                  className="min-w-[190px] sm:min-w-[260px] relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-4 sm:gap-5 group premium-shadow border-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-agri-olive z-0" />
                  <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors duration-700 z-0" />
                  <div
                    className="absolute inset-0 opacity-[0.06] z-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-white/20 shadow-md">
                      <Image
                        src={cropImages[crop.id] || cropImages.wheat}
                        alt={crop.name}
                        width={40}
                        height={40}
                        priority={index <= 3}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                      {crop.name}
                    </span>
                  </div>

                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <div className="flex items-start leading-none -ml-0.5">
                        <span className="text-lg sm:text-xl font-light mt-0.5 sm:mt-1 mr-0.5 text-white/70">
                          ₹
                        </span>
                        {/* Shrunk huge text for mobile */}
                        <p className="text-3xl sm:text-4xl font-bold tracking-tighter text-white drop-shadow-sm">
                          {insight.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-white/60 mt-1">
                        / {crop.unit}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg backdrop-blur-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
                        insight.trend === "up"
                          ? "bg-white/20 border-white/30 text-agri-gold"
                          : "bg-black/20 border-black/30 text-white",
                      )}
                    >
                      <TrendIcon
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                        strokeWidth={3}
                      />
                      <span className="text-[10px] sm:text-xs font-bold tracking-wide">
                        {insight.trend === "up" && "+"}
                        {insight.percentChange}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* 3. NEARBY MANDIS (Mobile Scaled) */}
          <section className="lg:col-span-5 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight px-1">
              Nearby Mandis
            </h2>
            <div className="space-y-3">
              {mandiData.map((mandi, index) => (
                <motion.div
                  key={mandi.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-border/50 hover:border-primary/40 premium-shadow transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin
                          className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                          {mandi.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {mandi.distance} away
                        </p>
                      </div>
                    </div>
                    <button className="text-[10px] sm:text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors">
                      Details
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {Object.entries(mandi.prices).map(([cropId, price]) => {
                      const crop = crops.find((c) => c.id === cropId);
                      const insight = marketInsights.find(
                        (m) => m.cropId === cropId,
                      );
                      const isHighest = insight && price >= insight.price;

                      return (
                        <div
                          key={cropId}
                          className={cn(
                            "p-2 sm:p-2.5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-colors",
                            isHighest
                              ? "bg-agri-success/15 border border-agri-success/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                              : "bg-secondary/50 border border-transparent",
                          )}
                        >
                          <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate w-full text-center">
                            {crop?.name || cropId}
                          </span>
                          <span
                            className={cn(
                              "font-bold text-xs sm:text-sm md:text-base",
                              isHighest
                                ? "text-agri-success drop-shadow-sm"
                                : "text-foreground",
                            )}
                          >
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 4. PRICE HISTORY CHART */}
          <section className="lg:col-span-7 lg:sticky lg:top-36 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight px-1">
              Analytics
            </h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full glass-card premium-shadow rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-border/50"
            >
              <PriceHistoryChart />
            </motion.div>
          </section>
        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
