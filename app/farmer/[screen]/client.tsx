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
import { BoloAssistant } from "@/components/bolo/bolo-assistant";
import { Loader2 } from "lucide-react";
import { FarmerDemands } from "@/components/farmer/farmer-demands";
import FarmerPools from "@/components/farmer/farmer-pools";

export function FarmerScreenClient({ screen }: { screen: string }) {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Define valid screens to prevent invalid navigation loops
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
  // Fixes the "Cannot update a component while rendering" error
  useEffect(() => {
    if (mounted && !VALID_SCREENS.includes(screen)) {
      console.warn(`Invalid screen: ${screen}. Redirecting to /farmer...`);
      router.replace("/farmer");
    }
  }, [mounted, screen, router]);

  if (!mounted || !hasOnboarded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
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
        // Return a loader while the useEffect handles the router.replace
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        );
    }
  };

  return (
    <>
      {renderScreen()}
      <BoloAssistant />
    </>
  );
}
