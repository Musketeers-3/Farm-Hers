"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Search, Filter, Package, Gavel,
  ShoppingCart, Bell, BarChart3, Sun, Moon, LogOut,
} from "lucide-react";
import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BuyerAuctions } from "./buyer-auctions";
import { BuyerPools } from "./buyer-pools";
import { BuyerOrders } from "./buyer-orders";
import StrategicAnalyticsHub from "@/app/buyer/analytics/page";
import buyerBg from "./buyer_dashboard_image.jpeg";

// ─── DARK MODE tokens ─────────────────────────────────────────────────────────
const DARK = {
  card:         "rgba(8,18,10,0.65)",
  cardStrong:   "rgba(5,14,7,0.70)",
  border:       "rgba(90,158,111,0.15)",
  blur:         "blur(18px)",
  accent:       "#5a9e6f",
  accentDark:   "#2d6a4f",
  accentBg:     "rgba(45,106,79,0.20)",
  accentBorder: "rgba(90,158,111,0.30)",
  textSub:      "rgba(255,255,255,0.55)",
  textLabel:    "rgba(255,255,255,0.38)",
  headerBg:     "rgba(6,14,7,0.80)",
  scrim:        "rgba(5,12,6,0.55)",
};

// ─── LIGHT MODE tokens ────────────────────────────────────────────────────────
const LIGHT = {
  card:         "rgba(200,225,255,0.18)",
  cardStrong:   "rgba(200,225,255,0.25)",
  border:       "rgba(180,210,255,0.30)",
  blur:         "blur(32px)",
  accent:       "#4ade80",
  accentDark:   "#16a34a",
  accentBg:     "rgba(74,222,128,0.15)",
  accentBorder: "rgba(74,222,128,0.30)",
  textSub:      "rgba(255,255,255,0.75)",
  textLabel:    "rgba(255,255,255,0.50)",
  headerBg:     "rgba(180,210,255,0.15)",
  scrim:        "rgba(5,10,20,0.42)",
};

export function BuyerDashboard({ activeTab = "pools" }: { activeTab?: string }) {
  const setUserRole = useAppStore((s) => s.setUserRole);
  const setIsLoggedIn = useAppStore((s) => s.setIsLoggedIn);
  const setUserProfile = useAppStore((s) => s.setUserProfile);
  const router = useRouter();
  const t           = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Buyer-side theme — fully independent from global.css and farmer side.
  // Uses localStorage key "buyer-theme" so the preference survives tab
  // navigations (each /buyer/[tab] route re-mounts BuyerDashboard, which
  // would otherwise reset isDark back to the default on every tab click).
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true; // SSR safe default
    const saved = localStorage.getItem("buyer-theme");
    return saved !== null ? saved === "dark" : true; // default: dark
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("buyer-theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserRole("farmer");
    router.push("/onboarding");
  };

  const G = isDark ? DARK : LIGHT;

  const tabs = [
    { key: "pools",     label: "Pools",     icon: Package },
    { key: "auctions",  label: "Auctions",  icon: Gavel,       badge: 3 },
    { key: "orders",    label: "Orders",    icon: ShoppingCart },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const currentTab = tabs.some((t) => t.key === activeTab) ? activeTab : "pools";

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden relative" style={{ backgroundColor: "#050505" }}>

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0">
        {isDark ? (
          <Image src={buyerBg} alt="" fill priority className="object-cover object-bottom" />
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
              style={{ backgroundImage: "url('/images/market-bg.jpg')" }}
            />
            <div
              className="absolute inset-0"
              style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            />
          </>
        )}
        <div className="absolute inset-0" style={{ background: G.scrim }} />
      </div>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background:           G.headerBg,
          backdropFilter:       G.blur,
          WebkitBackdropFilter: G.blur,
          borderColor:          G.border,
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">

          {/* Left — logo + user */}
          <div className="flex items-center gap-4">
            <AgriLinkLogo size="sm" />
            <div
              className="hidden sm:flex items-center gap-3 pl-4"
              style={{ borderLeft: `1px solid ${G.border}` }}
            >
              <div
                className="relative w-8 h-8 rounded-full overflow-hidden"
                style={{ border: `1px solid ${G.border}` }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
                  alt="" fill className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-white">Punjab Agro Mills</p>
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: G.accent }}>
                  Verified Buyer
                </p>
              </div>
            </div>
          </div>

          {/* Right — theme toggle + bell + farmer view */}
          <div className="flex items-center gap-2">

            {/* ── BUYER THEME TOGGLE — independent from farmer side ── */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ background: G.card, border: `1px solid ${G.border}` }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark
                ? <Sun  className="w-4 h-4 text-white/70" />
                : <Moon className="w-4 h-4 text-white/70" />
              }
            </button>

            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: G.card, border: `1px solid ${G.border}` }}
            >
              <Bell className="w-4 h-4 text-white/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            <button
              onClick={() => { setUserRole("farmer"); router.push("/farmer"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
              style={{
                background: G.accentDark,
                border:     `1px solid ${G.accentBorder}`,
                boxShadow:  "0 2px 14px rgba(22,163,74,0.35)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farmer View</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
              style={{
                background: "rgba(220,38,38,0.2)",
                border:     "1px solid rgba(220,38,38,0.4)",
              }}
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 py-6 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: G.accent }}>
            {t.welcome || "Welcome to AgriLink"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1 text-white">
            Procurement Hub
          </h1>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, mandis, or farmers..."
              className="pl-12 pr-12 h-11 rounded-xl text-sm placeholder:text-white/40"
              style={{
                background:     G.card,
                border:         `1px solid ${G.border}`,
                backdropFilter: G.blur,
                color:          "#ffffff",
                boxShadow:      "none",
              }}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: G.card, border: `1px solid ${G.border}` }}
            >
              <Filter className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1.5 p-1 rounded-2xl overflow-x-auto no-scrollbar"
          style={{ background: G.card, border: `1px solid ${G.border}`, backdropFilter: G.blur }}
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/buyer/${tab.key}`}
                scroll={false}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200"
                style={isActive
                  ? { background: G.accentDark, color: "#fff", border: `1px solid ${G.accentBorder}`, boxShadow: "0 2px 12px rgba(22,163,74,0.35)" }
                  : { color: "rgba(255,255,255,0.60)", border: "1px solid transparent" }
                }
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span
                    className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none font-bold"
                    style={isActive
                      ? { background: "#ef4444", color: "#fff" }
                      : { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.60)" }
                    }
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {currentTab === "pools"     && <BuyerPools     isDark={isDark} />}
              {currentTab === "auctions"  && <BuyerAuctions  isDark={isDark} />}
              {currentTab === "orders"    && <BuyerOrders    isDark={isDark} />}
              {currentTab === "analytics" && <StrategicAnalyticsHub />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}