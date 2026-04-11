"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FarmerDashboard } from "@/components/farmer/farmer-dashboard";
import { SellFlow } from "@/components/farmer/sell-flow";
import { AuctionScreen } from "@/components/auction/auction-screen";
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { TrackingScreen } from "@/components/farmer/tracking-screen";
import { MarketScreen } from "@/components/farmer/market-screen";
import { ProfileScreen } from "@/components/farmer/profile-screen";
import { NotificationsScreen } from "@/components/farmer/notifications-screen";
import { EarningsScreen } from "@/components/farmer/earnings-screen";
import { motion, AnimatePresence } from "framer-motion";

export default function AgriLinkApp() {
  const router = useRouter();
  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const activeScreen = useAppStore((state) => state.activeScreen);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // DEVELOPER CHEAT CODE (Stashed logic safely retained)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("reset") === "true") {
        localStorage.removeItem("agrilink-onboarded");
        setShowOnboarding(true);
        window.history.replaceState({}, "", "/");
        return;
      }

      // Normal check
      const hasOnboarded = localStorage.getItem("agrilink-onboarded");
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

  const renderFarmerScreen = () => {
    switch (activeScreen) {
      case "sell":
        return <SellFlow />;
      case "auction":
        return <AuctionScreen />;
      case "tracking":
        return <TrackingScreen />;
      case "market":
        return <MarketScreen />;
      case "profile":
        return <ProfileScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "earnings":
        return <EarningsScreen />;
      case "home":
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full min-h-screen"
        >
          {renderFarmerScreen()}
        </motion.div>
      </AnimatePresence>
      <BoloAssistant />
    </>
  );
}
