"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  Package,
  Gavel,
  ShoppingCart,
  Bell,
  Building2,
  BarChart3,
  Moon,
  Sun,
  IndianRupee,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { useRouter } from "next/navigation";

// 🚀 IMPORT THE NEW MODULAR COMPONENTS HERE
import { BuyerAuctions } from "./buyer-auctions";
import { BuyerPools } from "./buyer-pools";
import { BuyerOrders } from "./buyer-orders";
import { BuyerAnalytics } from "./buyer-analytics";
// import { BuyerPools } from "./buyer-pools"
// import { BuyerOrders } from "./buyer-orders"
// import { BuyerAnalytics } from "./buyer-analytics"

export function BuyerDashboard() {
  const language = useAppStore((state) => state.language);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const router = useRouter();
  const t = useTranslation(); // Pulling from your global store now

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("auctions"); // Defaulting to auctions to test it

  // Note: We should eventually move isDark to the Zustand store!
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  const tabs = [
    { key: "pools", label: "Pools", icon: Package },
    { key: "auctions", label: "Auctions", icon: Gavel, badge: 3 }, // Mock badge count for now
    { key: "orders", label: "Orders", icon: ShoppingCart },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* HEADER: Exactly as you designed it, perfectly responsive */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AgriLinkLogo size="sm" />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Punjab Agro Mills
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all"
              >
                {isDark ? (
                  <Sun className="w-[18px] h-[18px]" />
                ) : (
                  <Moon className="w-[18px] h-[18px]" />
                )}
              </button>
              <button className="relative w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <button
                onClick={() => {
                  setUserRole("farmer");
                  router.push("/farmer");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-accent text-sm font-medium transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Farmer View</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 space-y-6">
        {/* SEARCH BAR AREA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {t.welcome || "Welcome Back"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mt-0.5">
            Punjab Agro Mills
          </h1>
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, mandis, or farmers..."
              className="pl-10 pr-10 h-11 rounded-xl bg-secondary border-border"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex gap-1.5 p-1 rounded-xl bg-secondary/70 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-white text-[10px] font-bold leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC CONTENT ROUTER */}
        <div className="animate-in fade-in duration-700 delay-200">
          {selectedTab === "pools" && <BuyerPools />}
          {selectedTab === "auctions" && <BuyerAuctions />}
          {selectedTab === "orders" && <BuyerOrders />}
          {selectedTab === "analytics" && <BuyerAnalytics />}
        </div>
      </main>
    </div>
  );
}
