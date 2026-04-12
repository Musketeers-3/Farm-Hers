"use client";

import { TrendingUp, Package, Users, Gavel } from "lucide-react";

export function BuyerAnalytics() {
  const stats = [
    {
      icon: TrendingUp,
      value: "₹24.5L",
      label: "Total Purchases",
      color: "text-agri-success",
      bg: "bg-agri-success/10",
    },
    {
      icon: Package,
      value: "1,250q",
      label: "Qty Procured",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Users,
      value: "87",
      label: "Farmers Connected",
      color: "text-agri-gold",
      bg: "bg-agri-gold/10",
    },
    {
      icon: Gavel,
      value: "12",
      label: "Auctions Won",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((item, i) => (
          <div
            key={item.label}
            className="glass-card rounded-2xl p-5 hover-lift premium-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold leading-tight">
                {item.label}
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Procurement Distribution Chart (Tailwind Native) */}
      <div className="glass-card rounded-2xl p-6 premium-shadow">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
          Volume Distribution (Current Quarter)
        </h3>

        <div className="space-y-5">
          {/* Wheat Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1.5 font-semibold">
              <span>Premium Wheat</span>
              <span className="text-muted-foreground">60%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: "60%" }}
              />
            </div>
          </div>

          {/* Mustard Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1.5 font-semibold">
              <span>Yellow Mustard</span>
              <span className="text-muted-foreground">25%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-agri-gold h-2.5 rounded-full"
                style={{ width: "25%" }}
              />
            </div>
          </div>

          {/* Rice Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1.5 font-semibold">
              <span>Basmati Rice</span>
              <span className="text-muted-foreground">15%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-agri-earth h-2.5 rounded-full"
                style={{ width: "15%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
