"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SellFlow } from "@/components/sell-flow";
import { AuctionScreen } from "@/components/auction/auction-screen";
import { TrackingScreen } from "@/components/farmer/tracking-screen";
import { MarketScreen } from "@/components/farmer/market-screen";
import { ProfileScreen } from "@/components/farmer/profile-screen";
import { NotificationsScreen } from "@/components/farmer/notifications-screen";
import { EarningsScreen } from "@/components/farmer/earnings-screen";
import { FarmerDemands } from "@/components/farmer/farmer-demands";
import FarmerPools from "@/components/farmer/farmer-pools";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function FarmerScreenClient({ screen }: { screen: string }) {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 🚀 FIXED: Added "demands" to prevent the infinite redirect loop bug
  const VALID_SCREENS = [
    "home",
    "sell",
    "auction",
    "tracking",
    "market",
    "profile",
    "notifications",
    "earnings",
    "pools",
    "demands",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Auth & Onboarding Guard ---
  useEffect(() => {
    if (!mounted) return;
    if (!hasOnboarded || !isLoggedIn) {
      router.replace("/");
    }
  }, [mounted, hasOnboarded, isLoggedIn, router]);

  // --- Navigation Side-Effect Guard ---
  useEffect(() => {
    if (mounted && !VALID_SCREENS.includes(screen)) {
      console.warn(`Invalid screen: ${screen}. Redirecting to /farmer...`);
      router.replace("/farmer");
    }
  }, [mounted, screen, router]);

  // 🚀 UPGRADED: Premium Glassmorphic Loading State
  if (!mounted || !hasOnboarded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-slate-950 flex items-center justify-center">
        <div className="w-24 h-24 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 flex items-center justify-center shadow-2xl animate-pulse">
          <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
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
      case "demands":
        return <FarmerDemands />;
      case "pools":
        return <FarmerPools />;
      default:
        return (
          <div className="min-h-screen bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-slate-950 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-2xl animate-pulse">
              <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            </div>
          </div>
        );
    }
  };

  // 🚀 FIXED: Removed <BoloAssistant /> to prevent double-rendering with layout.tsx
  return <>{renderScreen()}</>;
}
