"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Search, Filter, Package, Gavel,
  ShoppingCart, Bell, BarChart3,
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

export function BuyerDashboard({ activeTab = "pools" }: { activeTab?: string }) {
  const setUserRole = useAppStore((s) => s.setUserRole);
  const router = useRouter();
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { key: "pools",     label: "Pools",     icon: Package },
    { key: "auctions",  label: "Auctions",  icon: Gavel,        badge: 3 },
    { key: "orders",    label: "Orders",    icon: ShoppingCart },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const currentTab = tabs.some((t) => t.key === activeTab) ? activeTab : "pools";

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden relative" style={{ backgroundColor: "#0d1a0f" }}>

      <div className="fixed inset-0 z-0">
        <Image
          src={buyerBg}
          alt=""
          fill
          priority
          className="object-cover object-bottom"
        />
        {/* ✅ CHANGE: Slightly stronger scrim to make the dark paddy-green feel deeper */}
        <div className="absolute inset-0" style={{ background: "rgba(5,12,6,0.55)" }} />
      </div>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(6,14,7,0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AgriLinkLogo size="sm" />
            <div className="hidden sm:flex items-center gap-3 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.09)" }}>
              <div className="relative w-8 h-8 rounded-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                <Image src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop" alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-white">Punjab Agro Mills</p>
                {/* ✅ CHANGE: accent color shifted to paddy-field green #4a7c59 instead of lime #4ade80 */}
                <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "#5a9e6f" }}>Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Bell className="w-4 h-4 text-white/70" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            {/* ✅ CHANGE: button green updated to deep paddy green #2d6a4f */}
            <button
              onClick={() => { setUserRole("farmer"); router.push("/farmer"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold"
              style={{ background: "#2d6a4f", color: "#fff", border: "1px solid rgba(90,158,111,0.3)", boxShadow: "0 2px 14px rgba(45,106,79,0.4)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farmer View</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 py-6 space-y-5">

        <div>
          {/* ✅ CHANGE: accent label color to paddy green */}
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#5a9e6f" }}>
            {t.welcome || "Welcome to AgriLink"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1 text-white">
            Procurement Hub
          </h1>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, mandis, or farmers..."
              className="pl-12 pr-12 h-11 rounded-xl text-sm text-white placeholder:text-white/30"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Filter className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl overflow-x-auto no-scrollbar" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}>
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/buyer/${tab.key}`}
                scroll={false}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200"
                style={isActive
                  // ✅ CHANGE: active tab uses deep paddy green #2d6a4f instead of bright #16a34a
                  ? { background: "#2d6a4f", color: "#fff", border: "1px solid rgba(90,158,111,0.35)", boxShadow: "0 2px 12px rgba(45,106,79,0.45)" }
                  : { color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }
                }
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none font-bold"
                    style={isActive ? { background: "#ef4444", color: "#fff" } : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
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
              {currentTab === "pools"     && <BuyerPools />}
              {currentTab === "auctions"  && <BuyerAuctions />}
              {currentTab === "orders"    && <BuyerOrders />}
              {currentTab === "analytics" && <StrategicAnalyticsHub />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}