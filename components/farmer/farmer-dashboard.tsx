"use client";

import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WeatherWidget } from "./weather-widget";
import { MarketInsightCard } from "./market-insight-card";
import { CommoditiesGrid } from "./commodities-grid";
import { CommunityPulse } from "./community-pulse";
import { MyFieldsCard } from "./my-fields-card";
import { BottomNav } from "./bottom-nav";
import { SearchBar } from "./search-bar";
import { AIRecommendationCard } from "./ai-recommendation-card";

import { Bell, MapPin, ChevronDown, Moon, Sun, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function FarmerDashboard() {
  const router = useRouter();
  const userName = useAppStore((state) => state.userName);
  const userLocation = useAppStore((state) => state.userLocation);
  const t = useTranslation();

  // Hydration-safe state for Dark Mode
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  const today = new Date();
  const formattedDate = format(today, "EEEE, dd MMM yyyy");

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. HEADER (Identity & Global Actions) */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <AgriLinkLogo size="sm" className="scale-105 origin-left" />

            <div className="flex items-center gap-3.5">
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all duration-200 shadow-sm"
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? (
                    <Sun
                      className="w-5.5 h-5.5 text-foreground"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Moon
                      className="w-5.5 h-5.5 text-foreground"
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              )}

              <div className="hidden sm:block scale-105">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => router.push("/farmer/notifications")}
                className="relative w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all duration-200 shadow-sm"
              >
                <Bell
                  className="w-5.5 h-5.5 text-foreground"
                  strokeWidth={1.8}
                />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-background" />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-4 border-t border-border/10 pt-3.5">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight tracking-tight">
                {t.hello},{" "}
                <span className="text-primary">{userName.split(" ")[0]}</span>
              </h1>
              <p className="text-[11px] sm:text-[12px] text-muted-foreground tracking-widest uppercase font-bold opacity-90">
                {formattedDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="sm:hidden block scale-95 origin-right">
                <LanguageSwitcher />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all shadow-sm">
                <MapPin className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span className="text-[13px] font-bold text-foreground truncate max-w-[110px]">
                  {userLocation}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. MAIN BENTO GRID ARCHITECTURE */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 lg:space-y-8">
        <div className="w-full">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* SIDEBAR BLOCK */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 order-1 lg:order-2 lg:sticky lg:top-36">
            <div className="w-full">
              <WeatherWidget />
            </div>

            <div className="w-full">
              <MarketInsightCard />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/farmer/earnings")}
              className="w-full glass-card premium-shadow rounded-3xl p-5 sm:p-6 flex items-center justify-between group border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Monthly Earnings
                  </p>
                </div>
                <p className="text-3xl font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                  ₹1.12L
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1.5 rounded-full bg-agri-success/15 text-agri-success text-xs font-bold shadow-sm">
                  +14.2%
                </div>
                <span className="text-[10px] text-muted-foreground">
                  vs last month
                </span>
              </div>
            </motion.button>

            <div className="w-full">
              <CommunityPulse />
            </div>
          </div>

          {/* MAIN BLOCK */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
            <div className="w-full">
              <AIRecommendationCard />
            </div>

            <div className="w-full">
              <CommoditiesGrid />
            </div>

            <div className="w-full">
              <MyFieldsCard />
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
