"use client";

import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import {
  ArrowLeft,
  Clock,
  IndianRupee,
  ArrowUpRight,
  Download,
  Wallet,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
// Fixed the import path for the App Router!
import { useRouter } from "next/navigation";

const monthlyData = [
  { month: "Oct", revenue: 45000 },
  { month: "Nov", revenue: 62000 },
  { month: "Dec", revenue: 38000 },
  { month: "Jan", revenue: 85000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 112000 },
];

const cropBreakdown = [
  { crop: "Wheat", amount: 185000, percent: 44 },
  { crop: "Rice", amount: 98000, percent: 23 },
  { crop: "Mustard", amount: 78000, percent: 19 },
  { crop: "Others", amount: 59000, percent: 14 },
];

const transactions = [
  {
    id: "AG-1247",
    crop: "Wheat",
    qty: "50q",
    amount: 112500,
    date: "Mar 28, 2026",
    status: "paid",
  },
  {
    id: "AG-1245",
    crop: "Rice",
    qty: "30q",
    amount: 64500,
    date: "Mar 22, 2026",
    status: "paid",
  },
  {
    id: "AG-1242",
    crop: "Mustard",
    qty: "20q",
    amount: 104000,
    date: "Mar 15, 2026",
    status: "paid",
  },
  {
    id: "AG-1240",
    crop: "Wheat",
    qty: "40q",
    amount: 91000,
    date: "Mar 8, 2026",
    status: "paid",
  },
  {
    id: "AG-1238",
    crop: "Corn",
    qty: "25q",
    amount: 46250,
    date: "Feb 28, 2026",
    status: "paid",
  },
  {
    id: "AG-1235",
    crop: "Potato",
    qty: "60q",
    amount: 72000,
    date: "Feb 20, 2026",
    status: "pending",
  },
];

export function EarningsScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const totalRevenue = 420000;
  const pendingAmount = 72000;
  const monthGrowth = 14.2;

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8 overflow-x-hidden">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. HIGH-DENSITY GLASS HEADER (Matches Dashboard exactly) */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className="w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all shadow-sm shrink-0"
            >
              <ArrowLeft
                className="w-5.5 h-5.5 text-foreground"
                strokeWidth={1.8}
              />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-none tracking-tight">
                Earnings
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                Financial Overview
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary hover:bg-primary/20 transition-all shadow-sm">
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTENT GRID */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Hero Metrics & Breakdown (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Premium Total Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 sm:col-span-1 lg:col-span-2 relative overflow-hidden rounded-3xl p-5 sm:p-6 group premium-shadow border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-agri-olive z-0" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:bg-white/20 transition-colors duration-700 z-0" />

                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-agri-gold"
                      strokeWidth={3}
                    />
                    <span className="text-[11px] font-bold text-white">
                      +{monthGrowth}%
                    </span>
                  </div>
                </div>

                <div className="relative z-10 space-y-1">
                  <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">
                    Total Revenue
                  </p>
                  <div className="flex items-start leading-none -ml-0.5">
                    <span className="text-2xl font-light mt-1 mr-0.5 text-white/80">
                      ₹
                    </span>
                    <p className="text-4xl sm:text-5xl font-bold tracking-tighter text-white drop-shadow-sm">
                      {(totalRevenue / 100000).toFixed(2)}L
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Pending Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 sm:col-span-1 lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 border border-border/50 hover:border-agri-gold/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-agri-gold/15">
                    <Clock className="w-5 h-5 text-agri-gold" />
                  </div>
                  <span className="text-[11px] font-bold text-agri-gold bg-agri-gold/10 px-2.5 py-1 rounded-full">
                    Processing
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Pending Escrow
                  </p>
                  <div className="flex items-start leading-none -ml-0.5">
                    <span className="text-xl font-light mt-1 mr-0.5 text-foreground/70">
                      ₹
                    </span>
                    <p className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
                      {(pendingAmount / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Crop Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-6 space-y-6 border border-border/50"
            >
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg tracking-tight">
                  Revenue by Crop
                </h3>
              </div>
              <div className="space-y-5">
                {cropBreakdown.map((item, index) => (
                  <div key={item.crop} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {item.crop}
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        ₹{(item.amount / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.3 + index * 0.1,
                            ease: "easeOut",
                          }}
                          className="h-full bg-gradient-to-r from-primary to-agri-olive rounded-full"
                          style={{ opacity: 0.6 + (item.percent / 100) * 0.4 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary w-8 text-right">
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Charts & Transactions (Spans 7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-5 sm:p-6 space-y-6 border border-border/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground text-lg tracking-tight">
                    Revenue Trend
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground uppercase tracking-wider">
                  6 Months
                </span>
              </div>

              <div className="h-[250px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="oklch(0.42 0.14 155)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="oklch(0.42 0.14 155)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.5 0.01 150)"
                      strokeOpacity={0.2}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                        fill: "oklch(0.5 0.01 150)",
                        fontWeight: 600,
                      }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "oklch(0.5 0.01 150)",
                        fontWeight: 600,
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${v / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(var(--background), 0.9)",
                        borderRadius: "16px",
                        border: "1px solid rgba(var(--border), 0.5)",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        fontWeight: "bold",
                      }}
                      itemStyle={{ color: "var(--primary)" }}
                      formatter={(value: number) => [
                        `₹${value.toLocaleString("en-IN")}`,
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.42 0.14 155)"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground text-lg tracking-tight">
                  Recent Transactions
                </h3>
                <button className="text-xs px-3 py-1.5 bg-primary/10 rounded-lg text-primary font-bold hover:bg-primary/20 transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-2xl hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform",
                          tx.status === "paid"
                            ? "bg-agri-success/15"
                            : "bg-agri-gold/15",
                        )}
                      >
                        {tx.status === "paid" ? (
                          <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-agri-success" />
                        ) : (
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-agri-gold" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                          {tx.crop}{" "}
                          <span className="text-muted-foreground font-medium">
                            · {tx.qty}
                          </span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                          {tx.id} · {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-bold text-foreground">
                        ₹{tx.amount.toLocaleString("en-IN")}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5",
                          tx.status === "paid"
                            ? "text-agri-success"
                            : "text-agri-gold",
                        )}
                      >
                        {tx.status === "paid" ? "Completed" : "In Escrow"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
