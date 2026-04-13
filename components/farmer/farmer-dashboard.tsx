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
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
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
      }
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-sm w-full"
          >
            <div className="bg-white dark:bg-[#111] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <MapPin
                      className="w-4 h-4 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h2 className="text-[15px] font-black text-[#14532d]">
                    Change Location
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* City Text Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#15803d]/50 uppercase tracking-widest">
                  City Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  placeholder="e.g. Ludhiana, Nashik, Jaipur..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[15px] text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition placeholder:text-gray-300"
                />
              </div>

              {/* Detect Button */}
              <button
                onClick={handleDetect}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-sm hover:bg-emerald-100 active:scale-[0.98] transition disabled:opacity-60"
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" strokeWidth={2.5} />
                )}
                {isDetecting ? "Detecting..." : "Auto-detect my location"}
              </button>

              {geoError && (
                <p className="text-xs text-red-500 text-center -mt-1 px-2">
                  {geoError}
                </p>
              )}

              {/* Confirm */}
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

// ─── Main Farmer Dashboard ────────────────────────────────────────────────────
export function FarmerDashboard() {
  const router = useRouter();
  const userName = useAppStore((state) => state.userName);
  const userLocation = useAppStore((state) => state.userLocation);
  const setUserLocation = useAppStore((state) => state.setUserLocation);
  const t = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [earnings, setEarnings] = useState<number | null>(null);
  const [earningsGrowth, setEarningsGrowth] = useState<number | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Fetch real earnings from Firestore orders
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
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        let thisTotal = 0;
        let lastTotal = 0;

        snap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "payment-released") return;
          const createdAt = new Date(data.createdAt);
          if (createdAt >= thisMonthStart) {
            thisTotal += data.totalAmount || 0;
          } else if (
            createdAt >= lastMonthStart &&
            createdAt <= lastMonthEnd
          ) {
            lastTotal += data.totalAmount || 0;
          }
        });

        setEarnings(thisTotal);
        if (lastTotal > 0) {
          const growth = ((thisTotal - lastTotal) / lastTotal) * 100;
          setEarningsGrowth(Math.round(growth * 10) / 10);
        } else {
          setEarningsGrowth(null);
        }
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
      } finally {
        setEarningsLoading(false);
      }
    };

    fetchEarnings();
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

  // Update Zustand + persist to Firestore
  const handleLocationChange = async (newCity: string) => {
    setUserLocation(newCity);
    setLocationModalOpen(false);

    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          location: newCity,
        });
      } catch (err) {
        console.error("Failed to save location:", err);
      }
    }
  };

  const formatEarnings = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const today = new Date();
  const formattedDate = format(today, "EEEE, dd MMM yyyy");

  return (
    <div
      className="min-h-screen pb-28 lg:pb-8"
      style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)" }}
    >
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <AgriLinkLogo size="sm" className="scale-105 origin-left" />

            <div className="flex items-center gap-3.5">
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="w-10.5 h-10.5 rounded-2xl bg-white flex items-center justify-center hover:bg-emerald-50 transition-all duration-200 shadow-sm"
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? (
                    <Sun
                      className="w-5.5 h-5.5 text-[#14532d]"
                      strokeWidth={2}
                    />
                  ) : (
                    <Moon
                      className="w-5.5 h-5.5 text-[#14532d]"
                      strokeWidth={2}
                    />
                  )}
                </button>
              )}

              <div className="hidden sm:block scale-105 bg-[#f2f8f5] rounded-2xl shadow-sm p-1 border border-emerald-100/20">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => router.push("/farmer/notifications")}
                className="relative w-10.5 h-10.5 rounded-2xl bg-[#f2f8f5] flex items-center justify-center shadow-sm"
              >
                <Bell
                  className="w-5.5 h-5.5 text-[#14532d]"
                  strokeWidth={2}
                />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#f2f8f5]" />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-4 pt-1">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-[#14532d] leading-tight tracking-tight">
                {t.hello},{" "}
                <span className="text-[#16a34a]">
                  {userName ? userName.split(" ")[0] : "Farmer"}
                </span>
              </h1>
              <p className="text-[10px] text-[#15803d]/40 tracking-[0.15em] uppercase font-black">
                {formattedDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="sm:hidden block scale-95 origin-right">
                <LanguageSwitcher />
              </div>

              {/* ── Location Button ── */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white shadow-sm border-none"
              >
                <MapPin
                  className="w-4 h-4 text-[#16a34a]"
                  strokeWidth={2.5}
                />
                <span className="text-[13px] font-black text-[#14532d] truncate max-w-[110px]">
                  {userLocation || "Location"}
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5 text-[#15803d]/30"
                  strokeWidth={3}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* UNIFIED GLASS CONTAINER */}
          <div className="lg:col-span-5 flex flex-col order-1 lg:order-2 lg:sticky lg:top-36">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[40px] border border-white/40 bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2"
            >
              <div className="mb-2">
                <SearchBar />
              </div>

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
                    className="w-full relative overflow-hidden rounded-[28px] p-5 flex items-center justify-between bg-emerald-50/50 border border-emerald-100/20 shadow-sm"
                  >
                    <div className="text-left relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        <p className="text-[10px] text-emerald-800/80 uppercase tracking-widest font-black">
                          Monthly Earnings
                        </p>
                      </div>
                      <p className="text-2xl font-black text-slate-800">
                        {earningsLoading
                          ? "..."
                          : earnings !== null
                          ? formatEarnings(earnings)
                          : "₹0"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {!earningsLoading && earningsGrowth !== null && (
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                            earningsGrowth >= 0
                              ? "bg-white/80 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {earningsGrowth >= 0 ? "+" : ""}
                          {earningsGrowth}%
                        </div>
                      )}
                      <span className="text-[10px] text-emerald-800/40 font-black">
                        vs last month
                      </span>
                    </div>
                  </motion.button>

                  <CommunityPulse />
                </div>
              </div>
            </motion.div>
          </div>

          {/* MAIN BLOCK */}
          <div className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
            <AIRecommendationCard />
            <CommoditiesGrid />
            <MyFieldsCard />
          </div>

        </div>
      </main>

      {/* ── LOCATION MODAL ── */}
      <LocationPickerModal
        isOpen={locationModalOpen}
        currentLocation={userLocation || ""}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={handleLocationChange}
      />
    </div>
  );
}