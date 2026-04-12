"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Area,
  ComposedChart,
  Line,
} from "recharts";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  MapPin,
  TrendingUp,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// --- DYNAMIC MULTI-COMMODITY DATA ---
const rawMandiData = {
  jalandhar: [
    {
      name: "Mon",
      wheat: 2400,
      rice: 3100,
      wheatForecast: 2410,
      riceForecast: 3120,
    },
    {
      name: "Tue",
      wheat: 2420,
      rice: 3080,
      wheatForecast: 2430,
      riceForecast: 3090,
    },
    {
      name: "Wed",
      wheat: 2450,
      rice: 3150,
      wheatForecast: 2460,
      riceForecast: 3170,
    },
    {
      name: "Thu",
      wheat: 2440,
      rice: 3200,
      wheatForecast: 2450,
      riceForecast: 3220,
    },
    {
      name: "Fri",
      wheat: null,
      rice: null,
      wheatForecast: 2480,
      riceForecast: 3250,
    },
    {
      name: "Sat",
      wheat: null,
      rice: null,
      wheatForecast: 2510,
      riceForecast: 3290,
    },
    {
      name: "Sun",
      wheat: null,
      rice: null,
      wheatForecast: 2535,
      riceForecast: 3320,
    },
  ],
  khanna: [
    {
      name: "Mon",
      wheat: 2510,
      rice: 3150,
      wheatForecast: 2520,
      riceForecast: 3160,
    },
    {
      name: "Tue",
      wheat: 2530,
      rice: 3120,
      wheatForecast: 2540,
      riceForecast: 3130,
    },
    {
      name: "Wed",
      wheat: 2550,
      rice: 3190,
      wheatForecast: 2560,
      riceForecast: 3200,
    },
    {
      name: "Thu",
      wheat: 2545,
      rice: 3220,
      wheatForecast: 2555,
      riceForecast: 3230,
    },
    {
      name: "Fri",
      wheat: null,
      rice: null,
      wheatForecast: 2560,
      riceForecast: 3250,
    },
    {
      name: "Sat",
      wheat: null,
      rice: null,
      wheatForecast: 2590,
      riceForecast: 3280,
    },
    {
      name: "Sun",
      wheat: null,
      rice: null,
      wheatForecast: 2610,
      riceForecast: 3310,
    },
  ],
};

const liveTrades = [
  { time: "11:20:15", type: "BUY", crop: "WHEAT", qty: "50Q", price: "₹2445" },
  { time: "11:20:08", type: "SELL", crop: "RICE", qty: "100Q", price: "₹3190" },
  { time: "11:19:42", type: "BUY", crop: "WHEAT", qty: "20Q", price: "₹2440" },
  { time: "11:18:55", type: "BUY", crop: "RICE", qty: "75Q", price: "₹3200" },
];

const bentoVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function StrategicAnalyticsHub() {
  const router = useRouter();
  const { language } = useAppStore();
  const [activeMandi, setActiveMandi] =
    useState<keyof typeof rawMandiData>("jalandhar");
  const [selectedCommodity, setSelectedCommodity] = useState<
    "wheat" | "rice" | "both"
  >("both");

  // Simulated Live Ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setTickerIndex((prev) => (prev + 1) % liveTrades.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  const marketData = rawMandiData[activeMandi];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden bg-[#050505]">
      {/* 🚀 FIXED BACKGROUND: Much darker mask so the white text and neon lines pop */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/market-bg.jpg')" }}
      />
      {/* The Heavy Smoked Mask */}
      <div className="fixed inset-0 z-1 bg-black/50 backdrop-blur-[8px]" />

      <div className="relative z-10 p-6 lg:p-10 max-w-[1800px] mx-auto min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 shrink-0"
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-full bg-black/50 border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-white">
                AgriLink{" "}
                <span className="text-primary font-light">Terminal</span>
              </h1>
            </div>
          </div>

          {/* Mandi & Commodity Controls */}
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-2xl p-1.5 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex px-2 border-r border-white/10">
              {["jalandhar", "khanna"].map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setActiveMandi(mandi as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2",
                    activeMandi === mandi
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/80",
                  )}
                >
                  <MapPin className="w-3 h-3" /> {mandi}
                </button>
              ))}
            </div>
            <div className="flex gap-1 pr-1">
              {["wheat", "rice", "both"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCommodity(type as any)}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs font-bold uppercase transition-all",
                    selectedCommodity === type
                      ? "bg-primary text-white shadow-[0_0_15px_rgba(30,77,43,0.5)]"
                      : "text-white/40 hover:bg-white/5",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 🚀 BENTO GRID LAYOUT */}
        <div className="grid grid-cols-12 grid-rows-[auto_1fr] gap-6 flex-1 min-h-0">
          {/* Bento Box 1: AI Insight Header */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-8 p-6 bg-gradient-to-r from-primary/30 to-black/80 border border-white/10 border-l-primary border-l-4 backdrop-blur-2xl rounded-3xl flex flex-col justify-center overflow-hidden relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Gemini 2.5 Flash Insight
            </p>
            <h2 className="text-2xl font-medium text-white/90">
              {language === "hi"
                ? "जालंधर में गेहूं की आवक कम है, सप्ताहांत तक कीमतों में 4% की वृद्धि अपेक्षित है।"
                : `Tightening supply in ${activeMandi.toUpperCase()} indicates a 4% bullish trend for Wheat by weekend.`}
            </h2>
          </motion.div>

          {/* Bento Box 2: Live Volatility */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-4 p-6 bg-black/60 border border-white/10 backdrop-blur-2xl rounded-3xl flex flex-col justify-center shadow-2xl"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                Market Status
              </p>
              <span className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-500/20">
                <Radio className="w-3 h-3 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="flex items-end gap-4 mt-2">
              <h3 className="text-5xl font-black tracking-tighter text-white">
                HIGH
              </h3>
              <p className="text-primary mb-1 font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> Volatility
              </p>
            </div>
          </motion.div>

          {/* Bento Box 3: Main Chart Area */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-9 p-8 bg-black/60 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] flex flex-col shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className="text-xl font-bold text-white">
                Price Elasticity & Projection
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] shadow-[0_0_10px_#2E7D32]" />{" "}
                  Wheat
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />{" "}
                  Rice
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={marketData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff15"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12, fontWeight: 600 }}
                    domain={["auto", "auto"]}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10,10,10,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      backdropFilter: "blur(20px)",
                    }}
                    itemStyle={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  />

                  {/* Actual Data Lines */}
                  {(selectedCommodity === "wheat" ||
                    selectedCommodity === "both") && (
                    <Area
                      type="monotone"
                      dataKey="wheat"
                      stroke="#2E7D32"
                      strokeWidth={4}
                      fill="url(#colorWheat)"
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#2E7D32" }}
                    />
                  )}
                  {(selectedCommodity === "rice" ||
                    selectedCommodity === "both") && (
                    <Area
                      type="monotone"
                      dataKey="rice"
                      stroke="#3B82F6"
                      strokeWidth={4}
                      fill="url(#colorRice)"
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#3B82F6" }}
                    />
                  )}

                  {/* AI Forecast Lines */}
                  {(selectedCommodity === "wheat" ||
                    selectedCommodity === "both") && (
                    <Line
                      type="monotone"
                      dataKey="wheatForecast"
                      stroke="#2E7D32"
                      strokeDasharray="6 6"
                      strokeWidth={3}
                      dot={false}
                    />
                  )}
                  {(selectedCommodity === "rice" ||
                    selectedCommodity === "both") && (
                    <Line
                      type="monotone"
                      dataKey="riceForecast"
                      stroke="#3B82F6"
                      strokeDasharray="6 6"
                      strokeWidth={3}
                      dot={false}
                    />
                  )}

                  <Brush
                    dataKey="name"
                    height={25}
                    stroke="rgba(255,255,255,0.2)"
                    fill="rgba(0,0,0,0.8)"
                    tickFormatter={() => ""}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bento Box 4: The Live Order Feed */}
          <motion.div
            variants={bentoVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-3 p-6 bg-black/60 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] flex flex-col relative overflow-hidden shadow-2xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-white" /> Live Order Flow
            </h3>

            <div className="flex-1 space-y-4 overflow-hidden relative">
              {liveTrades.map((trade, i) => (
                <motion.div
                  key={`${trade.time}-${i}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: i === tickerIndex ? 1 : 0.4, x: 0 }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all duration-500",
                    trade.type === "BUY"
                      ? "bg-[#2E7D32]/20 border-[#2E7D32]/40"
                      : "bg-red-500/10 border-red-500/20",
                    i === tickerIndex
                      ? "scale-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                      : "scale-95",
                  )}
                >
                  <div className="flex justify-between items-center mb-2 text-xs font-bold text-white/40">
                    <span>{trade.time}</span>
                    <span
                      className={
                        trade.type === "BUY" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {trade.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {trade.crop}
                      </p>
                      <p className="text-xs text-white/60">Qty: {trade.qty}</p>
                    </div>
                    <p className="text-xl font-black text-white">
                      {trade.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  High buy volume detected in Khanna Mandi over last 15 mins.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
