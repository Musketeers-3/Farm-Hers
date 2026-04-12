"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Filter,
  Package,
  Gavel,
  ShoppingCart,
  Bell,
  Building2,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // 🚀 Added Link
import { motion, AnimatePresence } from "framer-motion"; // 🚀 Added Framer Motion

import { BuyerAuctions } from "./buyer-auctions";
import { BuyerPools } from "./buyer-pools";
import { BuyerOrders } from "./buyer-orders";
import StrategicAnalyticsHub from "@/app/buyer/analytics/page";

export function BuyerDashboard({
  activeTab = "pools",
}: {
  activeTab?: string;
}) {
  const language = useAppStore((state) => state.language);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const router = useRouter();
  const t = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");

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
    { key: "auctions", label: "Auctions", icon: Gavel, badge: 3 },
    { key: "orders", label: "Orders", icon: ShoppingCart },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isValidTab = tabs.some((tab) => tab.key === activeTab);
  const currentTab = isValidTab ? activeTab : "pools";

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* HEADER - Remains exactly the same */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AgriLinkLogo size="sm" />
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/50">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
                    alt="Company Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground leading-none">
                    Punjab Agro Mills
                  </h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    Verified Buyer
                  </p>
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-all shadow-md shadow-primary/20"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Farmer View</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 space-y-6">
        {/* SEARCH BAR AREA - Remains exactly the same */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <p className="text-xs text-primary uppercase tracking-widest font-bold">
            {t.welcome || "Welcome Back"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1 text-foreground">
            Procurement Hub
          </h1>
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, mandis, or farmers..."
              className="pl-12 pr-12 h-12 rounded-xl bg-secondary/80 border-border/50 text-base shadow-sm focus:bg-background"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <Filter className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* 🚀 TABS NAVIGATION (Now using Next.js Link for instant prefetching) */}
        <div>
          <div className="flex gap-2 p-1.5 rounded-2xl bg-secondary/50 overflow-x-auto no-scrollbar border border-border/40">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/buyer/${tab.key}`}
                  scroll={false} // Prevents the page from jumping to the top on click
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${isActive ? "text-primary" : ""}`}
                  />
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] leading-none ${isActive ? "bg-destructive text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 🚀 ANIMATED CONTENT ROUTER (Only this part fades out/in now) */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {currentTab === "pools" && <BuyerPools />}
              {currentTab === "auctions" && <BuyerAuctions />}
              {currentTab === "orders" && <BuyerOrders />}
              {currentTab === "analytics" && <StrategicAnalyticsHub />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
