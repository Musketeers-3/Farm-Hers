"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { FarmerDashboard } from "@/components/farmer/farmer-dashboard";
import { motion, AnimatePresence } from "framer-motion";

// NOTE: SellFlow, AuctionScreen, TrackingScreen, MarketScreen, ProfileScreen,
// NotificationsScreen, and EarningsScreen are now rendered exclusively by
// app/farmer/[screen]/client.tsx via URL-based routing. They no longer belong
// here. Removing them resolved the dual-routing conflict introduced by the merge.

export default function AgriLinkApp() {
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const router = useRouter();
  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("reset") === "true") {
        localStorage.removeItem("agrilink-onboarded");
        setHasOnboarded(false);
        setShowOnboarding(true);
        window.history.replaceState({}, "", "/");
        return;
      }

      const hasOnboarded = localStorage.getItem("agrilink-onboarded");
      if (hasOnboarded) setHasOnboarded(true); // ← sync Zustand
      setShowOnboarding(!hasOnboarded);
    } catch (error) {
      console.warn("LocalStorage is disabled or unavailable.", error);
      setShowOnboarding(true);
    }
  }, []);

  // Premium loading state
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center transition-opacity duration-500 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <OnboardingScreen
            onComplete={(role) => {
              localStorage.setItem("agrilink-onboarded", "true");
              setHasOnboarded(true); // ← ADD THIS
              setShowOnboarding(false);
              if (role) {
                setUserRole(role);
                router.push(`/${role}`);
              }
            }}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // FIX: after onboarding completes, router.push already navigated away.
  // This fallback handles the brief render before navigation commits, and
  // also covers direct visits to "/" by authenticated users.
  if (userRole === "buyer") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="buyer-dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <BuyerDashboard />
          <BoloAssistant />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default: farmer home (brief fallback before /farmer route takes over)
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="farmer-dashboard"
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full min-h-screen"
      >
        <FarmerDashboard />
      </motion.div>
    </AnimatePresence>
  );
}
