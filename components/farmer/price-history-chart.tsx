"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const generateData = (days: number) => {
  const base: Record<string, number> = { wheat: 2275, rice: 2150, mustard: 5200 }
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const label = days <= 7
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][date.getDay()]
      : `${date.getDate()}/${date.getMonth() + 1}`
    return {
      label,
      wheat: base.wheat + Math.round((Math.random() - 0.4) * 200),
      rice: base.rice + Math.round((Math.random() - 0.45) * 150),
      mustard: base.mustard + Math.round((Math.random() - 0.3) * 400),
    }
  })
}

const ranges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
]

const crops = [
  { id: "wheat", name: "Wheat", color: "oklch(0.42 0.14 155)" },
  { id: "rice", name: "Rice", color: "oklch(0.72 0.1 90)" },
  { id: "mustard", name: "Mustard", color: "oklch(0.55 0.06 240)" },
]

export function PriceHistoryChart() {
  const [range, setRange] = useState(7)
  const [activeCrop, setActiveCrop] = useState("wheat")
  const data = generateData(range)

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Price History</h3>
        <div className="flex gap-1 p-0.5 rounded-lg bg-secondary">
          {ranges.map((r) => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                range === r.days ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop selector */}
      <div className="flex gap-2">
        {crops.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCrop(c.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5",
              activeCrop === c.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            )}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            {c.name}
          </button>
        ))}
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.005 100)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.01 150)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(0.5 0.01 150)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.005 100)", fontSize: 12 }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, activeCrop]}
            />
            <Line
              type="monotone"
              dataKey={activeCrop}
              stroke={crops.find(c => c.id === activeCrop)?.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
