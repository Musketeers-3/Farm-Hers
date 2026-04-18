"use client";

import { useAppStore, useTranslation } from "@/lib/store";
import { AgriLinkLogo } from "@/components/agrilink-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WeatherWidget } from "./weather-widget";
import { MarketInsightCard } from "./market-insight-card";
import { CommoditiesGrid } from "./commodities-grid";
import { CommunityPulse } from "./community-pulse";
import { MyFieldsCard } from "./my-fields-card";
import { SearchBar } from "./search-bar";
import { AIRecommendationCard } from "./ai-recommendation-card";

import {
  Bell,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  Wallet,
  X,
  Loader2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ─── Location Picker Modal ────────────────────────────────────────────────────
interface LocationPickerModalProps {
  isOpen: boolean;
  currentLocation: string;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

function LocationPickerModal({
  isOpen,
  currentLocation,
  onClose,
  onConfirm,
}: LocationPickerModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentLocation || "");
      setGeoError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 120);
    }
  }, [isOpen, currentLocation]);

  const handleDetect = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser.");
      return;
    }
    setIsDetecting(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          setInputValue(city);
        } catch {
          setGeoError("Could not detect city. Please type manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setGeoError("Location access denied. Please type your city below.");
        setIsDetecting(false);
      },
    );
  };

  const handleConfirm = () => {
    const trimmed = inputValue.trim();
    if (trimmed) onConfirm(trimmed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full"
          >
            <div className="bg-white dark:bg-[#0d1f10]/95 dark:backdrop-blur-xl rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 space-y-4 border-0 dark:border dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-[15px] font-black text-[#14532d] dark:text-emerald-300">Change Location</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#15803d]/50 dark:text-emerald-400/60 uppercase tracking-widest">
                  City Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  placeholder="e.g. Ludhiana, Nashik, Jaipur..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[15px] text-gray-800 dark:text-gray-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>

              <button
                onClick={handleDetect}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/25 active:scale-[0.98] transition disabled:opacity-60"
              >
                {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" strokeWidth={2.5} />}
                {isDetecting ? "Detecting..." : "Auto-detect my location"}
              </button>

              {geoError && <p className="text-xs text-red-500 text-center -mt-1 px-2">{geoError}</p>}

              <button
                onClick={handleConfirm}
                disabled={!inputValue.trim()}
                className="w-full py-4 rounded-2xl bg-[#16a34a] text-white font-black text-[15px] hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40 shadow-sm"
              >
                Save Location
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Corporate Demands Banner ─────────────────────────────────────────────────
export function CorporateDemandsBanner() {
  const router = useRouter();
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { setActiveScreen("demands"); router.push("/farmer/demands"); }}
      className="w-full relative overflow-hidden rounded-[32px] p-6 sm:p-8 text-left group
        border border-emerald-500/30 dark:border-white/[0.09]
        bg-emerald-500/10 dark:bg-white/[0.05]
        backdrop-blur-sm dark:backdrop-blur-xl
        shadow-lg shadow-emerald-500/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        transition-all duration-300"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 dark:bg-emerald-400/10 rounded-full blur-[50px] group-hover:scale-110 transition-transform duration-700" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.08] shadow-sm border border-emerald-100 dark:border-white/[0.1] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform backdrop-blur-sm">
            <Building2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Corporate Demands</h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Live</span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-white/50">
              Direct high-volume contracts from verified enterprise buyers.
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 dark:bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-all duration-300 ml-4">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Farmer Dashboard ────────────────────────────────────────────────────
export function FarmerDashboard() {
  const router = useRouter();
  const userName = useAppStore((state) => state.userName);
  const userLocation = useAppStore((state) => state.userLocation);
  const setUserLocation = useAppStore((state) => state.setUserLocation);
  const t = useTranslation();

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [earnings, setEarnings] = useState<number | null>(null);
  const [earningsGrowth, setEarningsGrowth] = useState<number | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";
  const toggleDarkMode = () => setTheme(isDark ? "light" : "dark");

  useEffect(() => {
    const fetchEarnings = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("farmerId", "==", user.uid));
        const snap = await getDocs(q);
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        let thisTotal = 0, lastTotal = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.status !== "payment-released") return;
          const createdAt = new Date(data.createdAt);
          if (createdAt >= thisMonthStart) thisTotal += data.totalAmount || 0;
          else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) lastTotal += data.totalAmount || 0;
        });
        setEarnings(thisTotal);
        setEarningsGrowth(lastTotal > 0 ? Math.round(((thisTotal - lastTotal) / lastTotal) * 1000) / 10 : null);
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
      } finally {
        setEarningsLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const handleLocationChange = async (newCity: string) => {
    setUserLocation(newCity);
    setLocationModalOpen(false);
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), { location: newCity });
      } catch (err) { console.error("Failed to save location:", err); }
    }
  };

  const formatEarnings = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const formattedDate = format(new Date(), "EEEE, dd MMM yyyy");

  return (
    <div className="min-h-screen pb-28 lg:pb-8 relative overflow-x-hidden">

      {/* ── FIXED BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Light mode: soft green gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#f0fdf4] to-white transition-opacity duration-500 ${mounted && isDark ? "opacity-0" : "opacity-100"}`} />

        {/* Dark mode: farmers_bg.jpg with heavy scrim */}
        {mounted && isDark && (
          <>
            <Image
              src="/images/farmers_bg.jpg"
              alt=""
              fill
              priority
              className="object-fill object-center"
              style={{ opacity: 0.8 }}
            />
            {/* Primary dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020c04]/85 via-[#040f06]/75 to-[#020c04]/92" />
            {/* Radial vignette for depth */}
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,20,8,0.3) 0%, rgba(2,8,3,0.7) 100%)" }}
            />
          </>
        )}
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-[#020c04]/75 backdrop-blur-2xl transition-all duration-300 border-b border-transparent dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <AgriLinkLogo size="sm" className="scale-105 origin-left" />

            <div className="flex items-center gap-3.5">
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="w-10.5 h-10.5 rounded-2xl bg-white dark:bg-white/[0.07] flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-white/[0.12] transition-all duration-200 shadow-sm border-0 dark:border dark:border-white/[0.08]"
                  aria-label="Toggle Dark Mode"
                >
                  {isDark
                    ? <Sun className="w-5.5 h-5.5 text-emerald-300" strokeWidth={2} />
                    : <Moon className="w-5.5 h-5.5 text-[#14532d]" strokeWidth={2} />
                  }
                </button>
              )}

              <div className="hidden sm:block scale-105 bg-[#f2f8f5] dark:bg-white/[0.07] rounded-2xl shadow-sm p-1 border border-emerald-100/20 dark:border-white/[0.08]">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => router.push("/farmer/notifications")}
                className="relative w-10.5 h-10.5 rounded-2xl bg-[#f2f8f5] dark:bg-white/[0.07] flex items-center justify-center shadow-sm border-0 dark:border dark:border-white/[0.08]"
              >
                <Bell className="w-5.5 h-5.5 text-[#14532d] dark:text-emerald-300" strokeWidth={2} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#f2f8f5] dark:border-transparent" />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-4 pt-1">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-[#14532d] dark:text-white leading-tight tracking-tight">
                {t.hello},{" "}
                <span className="text-[#16a34a] dark:text-emerald-400">
                  {userName ? userName.split(" ")[0] : "Farmer"}
                </span>
              </h1>
              <p className="text-[10px] text-[#15803d]/40 dark:text-white/30 tracking-[0.15em] uppercase font-black">
                {formattedDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="sm:hidden block scale-95 origin-right">
                <LanguageSwitcher />
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/[0.07] shadow-sm border-0 dark:border dark:border-white/[0.09] backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4 text-[#16a34a] dark:text-emerald-400" strokeWidth={2.5} />
                <span className="text-[13px] font-black text-[#14532d] dark:text-white truncate max-w-[110px]">
                  {userLocation || "Location"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#15803d]/30 dark:text-white/25" strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* RIGHT SIDEBAR — glass container */}
          <div className="lg:col-span-5 flex flex-col order-1 lg:order-2 lg:sticky lg:top-36">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[40px]
                border border-white/40 dark:border-white/[0.08]
                bg-white/40 dark:bg-black/[0.35]
                backdrop-blur-xl
                shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                p-2"
            >
              <div className="mb-2"><SearchBar /></div>

              <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  <WeatherWidget />
                  <MarketInsightCard />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/farmer/earnings")}
                    className="w-full relative overflow-hidden rounded-[28px] p-5 flex items-center justify-between
                      bg-emerald-50/50 dark:bg-white/[0.06]
                      border border-emerald-100/20 dark:border-white/[0.08]
                      backdrop-blur-sm dark:backdrop-blur-xl
                      shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                  >
                    <div className="text-left relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/70 uppercase tracking-widest font-black">
                          Monthly Earnings
                        </p>
                      </div>
                      <p className="text-2xl font-black text-slate-800 dark:text-white">
                        {earningsLoading ? "..." : earnings !== null ? formatEarnings(earnings) : "₹0"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {!earningsLoading && earningsGrowth !== null && (
                        <div className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                          earningsGrowth >= 0
                            ? "bg-white/80 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-red-50 dark:bg-red-400/15 text-red-600 dark:text-red-400"
                        }`}>
                          {earningsGrowth >= 0 ? "+" : ""}{earningsGrowth}%
                        </div>
                      )}
                      <span className="text-[10px] text-emerald-800/40 dark:text-white/25 font-black">vs last month</span>
                    </div>
                  </motion.button>

                  <CommunityPulse />
                </div>
              </div>
            </motion.div>
          </div>

          {/* LEFT MAIN COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
            <AIRecommendationCard />
            <CorporateDemandsBanner />
            <CommoditiesGrid />
            <MyFieldsCard />
          </div>

        </div>
      </main>

      <LocationPickerModal
        isOpen={locationModalOpen}
        currentLocation={userLocation || ""}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={handleLocationChange}
      />
    </div>
  );
}
