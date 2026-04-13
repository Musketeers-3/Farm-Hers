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
  { crop: "Wheat",   amount: 185000, percent: 44 },
  { crop: "Rice",    amount: 98000,  percent: 23 },
  { crop: "Mustard", amount: 78000,  percent: 19 },
  { crop: "Others",  amount: 59000,  percent: 14 },
];

const transactions = [
  { id: "AG-1247", crop: "Wheat",   qty: "50q", amount: 112500, date: "Mar 28, 2026", status: "paid" },
  { id: "AG-1245", crop: "Rice",    qty: "30q", amount:  64500, date: "Mar 22, 2026", status: "paid" },
  { id: "AG-1242", crop: "Mustard", qty: "20q", amount: 104000, date: "Mar 15, 2026", status: "paid" },
  { id: "AG-1240", crop: "Wheat",   qty: "40q", amount:  91000, date: "Mar 8, 2026",  status: "paid" },
  { id: "AG-1238", crop: "Corn",    qty: "25q", amount:  46250, date: "Feb 28, 2026", status: "paid" },
  { id: "AG-1235", crop: "Potato",  qty: "60q", amount:  72000, date: "Feb 20, 2026", status: "pending" },
];

/* ─── Shared Glass Tokens ─────────────────────────────── */
const GLASS = {
  background: "rgba(255, 255, 255, 0.55)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
} as const;

const GLASS_INNER = {
  background: "rgba(255, 255, 255, 0.4)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  color: "#166534",
} as const;

export function EarningsScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const totalRevenue  = 420000;
  const pendingAmount = 72000;
  const monthGrowth   = 14.2;

  if (!isMounted) return null;

  return (
    <div
      className="min-h-screen pb-28 lg:pb-8 overflow-x-hidden relative"
      style={{
        background: "linear-gradient(135deg, #dcfce7 0%, #dcfce7 20%, #bfdbfe 100%)",
      }}
    >
      {/* ── Background Wave Pattern ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M-200 ${300 + i * 15} Q 300 ${100 - i * 10}, 600 ${400} T 1400 ${200 + i * 20}`}
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="1.5"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push("/farmer")}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
              style={GLASS_INNER}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">Earnings</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Finance Overview</p>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            style={GLASS_INNER}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">

              {/* Total Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 rounded-[32px] p-8"
                style={GLASS}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl bg-white/60 border border-white/40">
                    <Wallet className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {monthGrowth}%
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL REVENUE</p>
                <h2 className="text-6xl font-black text-slate-800 leading-none">
                  ₹{(totalRevenue / 100000).toFixed(2)}
                  <span className="text-3xl font-bold opacity-50 ml-1">L</span>
                </h2>
              </motion.div>

              {/* Pending Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-2 rounded-[32px] p-6"
                style={GLASS}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-white/60 border border-white/40">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Processing
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Escrow</p>
                  <div className="flex items-start leading-none">
                    <span className="text-xl font-light mt-1 mr-0.5 text-slate-600">₹</span>
                    <p className="text-4xl font-black text-slate-800">
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
              className="rounded-[32px] p-6 space-y-5"
              style={GLASS}
            >
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-lg">Revenue by Crop</h3>
              </div>
              <div className="space-y-5">
                {cropBreakdown.map((item, index) => (
                  <div key={item.crop} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{item.crop}</span>
                      <span>₹{(item.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-white/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 w-8 text-right">
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-[32px] p-6"
              style={GLASS}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800 text-lg">Revenue Trend</h3>
                </div>
                <span
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl text-slate-600 uppercase tracking-wider"
                  style={GLASS_INNER}
                >
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
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(v) => `₹${v / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={4}
                      fill="url(#colorRevenue)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-[32px] p-6 space-y-4"
              style={GLASS}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
                <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors hover:bg-white/60 group"
                    style={{
                      background: "rgba(255,255,255,0.40)",
                      border: "1px solid rgba(255,255,255,0.60)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/80 border border-white/20 group-hover:scale-105 transition-transform">
                        {tx.status === "paid"
                          ? <IndianRupee className="w-5 h-5 text-emerald-600" />
                          : <Clock className="w-5 h-5 text-amber-500" />
                        }
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {tx.crop}{" "}
                          <span className="text-slate-500 font-medium">· {tx.qty}</span>
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {tx.id} · {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800">₹{tx.amount.toLocaleString("en-IN")}</p>
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        tx.status === "paid" ? "text-emerald-500" : "text-amber-500"
                      )}>
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