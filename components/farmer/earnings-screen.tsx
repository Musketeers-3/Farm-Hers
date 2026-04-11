"use client"

import { useAppStore } from "@/lib/store"
import { BottomNav } from "./bottom-nav"
import { ArrowLeft, TrendingUp, Clock, IndianRupee, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useRouter } from "next/router"

const monthlyData = [
  { month: "Oct", revenue: 45000 },
  { month: "Nov", revenue: 62000 },
  { month: "Dec", revenue: 38000 },
  { month: "Jan", revenue: 85000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 112000 },
]

const cropBreakdown = [
  { crop: "Wheat", amount: 185000, percent: 44 },
  { crop: "Rice", amount: 98000, percent: 23 },
  { crop: "Mustard", amount: 78000, percent: 19 },
  { crop: "Others", amount: 59000, percent: 14 },
]

const transactions = [
  { id: "AG-1247", crop: "Wheat", qty: "50q", amount: 112500, date: "Mar 28, 2026", status: "paid" },
  { id: "AG-1245", crop: "Rice", qty: "30q", amount: 64500, date: "Mar 22, 2026", status: "paid" },
  { id: "AG-1242", crop: "Mustard", qty: "20q", amount: 104000, date: "Mar 15, 2026", status: "paid" },
  { id: "AG-1240", crop: "Wheat", qty: "40q", amount: 91000, date: "Mar 8, 2026", status: "paid" },
  { id: "AG-1238", crop: "Corn", qty: "25q", amount: 46250, date: "Feb 28, 2026", status: "paid" },
  { id: "AG-1235", crop: "Potato", qty: "60q", amount: 72000, date: "Feb 20, 2026", status: "pending" },
]

export function EarningsScreen() {
  const router = useRouter()   

  const totalRevenue = 420000
  const pendingAmount = 72000
  const monthGrowth = 14.2

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/farmer")}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.8} />
            </button>
            <h1 className="text-xl font-serif font-bold text-foreground">Earnings</h1>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-sm font-medium text-foreground hover:bg-accent transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-agri-success" />
              <span className="text-xs font-medium text-agri-success">+{monthGrowth}% this month</span>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-foreground">₹{(pendingAmount / 1000).toFixed(0)}K</p>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-agri-gold" />
              <span className="text-xs font-medium text-agri-gold">1 order processing</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Revenue Trend</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.42 0.14 155)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.42 0.14 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.005 100)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.5 0.01 150)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.01 150)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.005 100)", fontSize: 13 }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.42 0.14 155)" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Breakdown */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Revenue by Crop</h3>
          <div className="space-y-3">
            {cropBreakdown.map((item) => (
              <div key={item.crop} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.crop}</span>
                    <span className="text-sm text-muted-foreground">₹{(item.amount / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.percent}%`, opacity: 0.4 + (item.percent / 100) * 0.6 }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            <button className="text-xs text-primary font-medium">View All</button>
          </div>
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.status === "paid" ? "bg-agri-success/10" : "bg-agri-gold/10"
                  )}>
                    {tx.status === "paid" ? (
                      <IndianRupee className="w-5 h-5 text-agri-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-agri-gold" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.crop} · {tx.qty}</p>
                    <p className="text-[11px] text-muted-foreground">{tx.id} · {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{tx.amount.toLocaleString("en-IN")}</p>
                  <p className={cn("text-[11px] font-medium", tx.status === "paid" ? "text-agri-success" : "text-agri-gold")}>
                    {tx.status === "paid" ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
