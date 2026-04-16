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
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
  mustard: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop",
};

const mandiData = [
  { name: "Ludhiana Mandi", distance: "12 km", prices: { wheat: 2350, rice: 2180, mustard: 5350 } },
  { name: "Amritsar Mandi", distance: "45 km", prices: { wheat: 2280, rice: 2220, mustard: 5200 } },
  { name: "Jalandhar Mandi", distance: "28 km", prices: { wheat: 2310, rice: 2150, mustard: 5280 } },
  { name: "Patiala Mandi", distance: "65 km", prices: { wheat: 2290, rice: 2190, mustard: 5320 } },
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
    // MAIN WRAPPER WITH BACKGROUND IMAGE
    <div className="relative min-h-screen pb-24 lg:pb-8 overflow-x-hidden selection:bg-primary/30">
      {/* 1. THE BACKGROUND LAYER */}
<div className="fixed inset-0 z-0 pointer-events-none">
  <Image 
    src="/image.png" // Points to public/image.png
    alt="Farm Background"
    fill
    sizes="100vw"
    priority
    className="object-cover transition-opacity duration-500"
  />
  {/* Dark Tint & Blur Overlay: Adjust bg-black/70 for more/less darkness */}
  <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px] transition-all" /> 
</div>

      {/* 2. GLASS HEADER */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/farmer")}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 border border-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">{t.market}</h1>
              <p className="text-[10px] font-semibold text-green-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Rates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search crops or mandis..."
                className="pl-10 h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50"
              />
            </div>
            <button className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        

{/* --- 2. MARKET MOVERS (ULTRA-COMPACT & ATTRACTIVE) --- */}
<section className="space-y-4">
  <div className="flex items-center justify-between px-1">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
        <Activity className="w-4 h-4 text-green-400" />
      </div>
      <h2 className="text-lg font-bold text-white tracking-tight">Market Movers</h2>
    </div>
  </div>

  <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
    {marketInsights.map((insight, index) => {
      const crop = crops.find((c) => c.id === insight.cropId);
      if (!crop) return null;
      
      const isUp = insight.trend === "up";
      const TrendIcon = isUp ? TrendingUp : insight.trend === "down" ? TrendingDown : Minus;

      return (
        <motion.div
          key={insight.cropId}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98, filter: "brightness(1.2)" }}
          className="min-w-[220px] relative h-[340px] group cursor-pointer"
        >
          {/* Animated Background Glow */}
          <div className={cn(
            "absolute inset-0 blur-[60px] opacity-20 transition-all duration-700 group-hover:opacity-40",
            isUp ? "bg-green-500/30" : "bg-red-500/30"
          )} />

          {/* Main Card */}
          <div className="relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-2xl shadow-xl flex flex-col p-4">
            
            {/* 1. IMAGE SECTION (Compact) */}
            <div className="relative w-full h-28 flex items-center justify-center mt-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-2xl" />
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-24 h-24 z-10"
              >
                <Image 
                  src={cropImages[crop.id] || cropImages.wheat} 
                  alt={crop.name} 
                  fill 
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* 2. CONTENT SECTION */}
            <div className="flex-grow flex flex-col items-center justify-center text-center mt-2">
              <span className="text-[8px] font-black text-green-400/60 uppercase tracking-[0.4em] mb-1">
                Top Mover
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-3">
                {crop.name}
              </h3>

              <div className="relative px-4 py-1">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-sm font-bold text-white/40">₹</span>
                  <p className="text-3xl font-black text-white tracking-tighter tabular-nums">
                    {insight.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest">
                  per {crop.unit}
                </p>
              </div>
            </div>

            {/* 3. TREND FOOTER */}
            <div className="mt-auto pt-2">
              <div className={cn(
                "flex items-center justify-center gap-1.5 py-2 rounded-2xl border transition-colors",
                isUp 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                <TrendIcon className="w-3.5 h-3.5" strokeWidth={3} />
                <span className="text-xs font-black">
                  {isUp ? '+' : ''}{insight.percentChange}%
                </span>
              </div>
            </div>

            {/* Subtle Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      );
    })}
  </div>
</section>






        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* NEARBY MANDIS */}
<section className="lg:col-span-5 space-y-4">
  <div className="flex items-center justify-between px-1">
    <div className="flex items-center gap-2">
      <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 shadow-inner">
        <MapPin className="w-4 h-4 text-green-400" />
      </div>
      <h2 className="text-xl font-bold text-white tracking-tight">Nearby Mandis</h2>
    </div>
    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Live Data</span>
  </div>

  <div className="space-y-4">
    {mandiData.map((mandi, index) => (
      <motion.div
        key={mandi.name}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-6 border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 group shadow-2xl"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-green-500/10 transition-all duration-700" />

        {/* Mandi Info Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-7 h-7 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
              </div>
              {/* Pulsing Live Dot */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#121212] animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-green-400 transition-colors">
                {mandi.name}
              </h3>
              <p className="text-[12px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                {mandi.distance} away
              </p>
            </div>
          </div>
          
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Price Grid with Crop Images */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(mandi.prices).map(([cropId, price]) => {
            const crop = crops.find((c) => c.id === cropId);
            return (
              <motion.div 
                key={cropId} 
               whileTap={{ filter: "brightness(1.5)", scale: 0.98 }}
                className="relative overflow-hidden group/item p-4 rounded-[24px] bg-white/[0.04] border border-white/5 flex flex-col items-center hover:bg-white/[0.08] hover:border-white/20 hover:brightness-125 transition-all duration-300 cursor-pointer"
              >
                {/* Crop Image Circle - Size increased to w-12 h-12 */}
                <div className="w-12 h-12 rounded-full overflow-hidden mb-3 border-2 border-white/10 shadow-xl group-hover/item:scale-110 group-hover/item:border-green-400/50 transition-all duration-300">
                  <Image 
                    src={cropImages[cropId] || cropImages.wheat} 
                    alt={cropId}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full brightness-90 group-hover/item:brightness-110"
                  />
                </div>
                
                {/* Text sizes increased to text-xs and text-base */}
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-tight mb-1">
                  {crop?.name || cropId}
                </span>
                <span className="font-extrabold text-base text-white tabular-nums">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {/* Glass highlight bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-500/0 group-hover/item:bg-green-400/60 transition-all duration-300 blur-[1px]" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    ))}
  </div>
</section>


          {/* ANALYTICS CHART */}
          <section className="lg:col-span-7 space-y-4">
  {/* Section Header with Actions */}
  <div className="flex items-center justify-between px-1">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-white/10 border border-white/10">
        <Activity className="w-4 h-4 text-green-400" />
      </div>
      <h2 className="text-lg font-bold text-white tracking-tight">Analytics</h2>
    </div>

    {/* Time Range Switcher (UX Improvement) */}
    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
      {["7D", "30D", "90D"].map((range, i) => (
        <button
          key={range}
          className={cn(
            "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
            i === 0 ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/70"
          )}
        >
          {range}
        </button>
      ))}
    </div>
  </div>

  {/* The Glass Chart Card */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-6 border border-white/10 shadow-2xl transition-all hover:border-white/20"
  >
    {/* Background Glow Effect (Visual Polish) */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-green-500/20 transition-colors" />

    {/* Chart Stats / Legend Area */}
    <div className="flex flex-wrap items-center gap-6 mb-8">
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Current Avg</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">₹2,350</span>
          <span className="text-xs font-medium text-green-400">+3.8%</span>
        </div>
      </div>
      
      {/* Legend Indicators */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          <span className="text-[10px] font-bold text-white/60">Wheat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-[10px] font-bold text-white/60">Mustard</span>
        </div>
      </div>
    </div>

    {/* The Actual Chart Component */}
    <div className="h-[280px] w-full relative">
      <PriceHistoryChart />
    </div>

    {/* Footer Info */}
    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
      <p className="text-[10px] text-white/30 font-medium">Last updated: Just now</p>
      <button className="text-[10px] font-bold text-green-400 hover:underline">View Full Report</button>
    </div>
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