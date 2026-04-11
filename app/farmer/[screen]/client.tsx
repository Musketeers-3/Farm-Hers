"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SellFlow } from "@/components/farmer/sell-flow";
import { AuctionScreen } from "@/components/auction/auction-screen";
import { TrackingScreen } from "@/components/farmer/tracking-screen";
import { MarketScreen } from "@/components/farmer/market-screen";
import { ProfileScreen } from "@/components/farmer/profile-screen";
import { NotificationsScreen } from "@/components/farmer/notifications-screen";
import { EarningsScreen } from "@/components/farmer/earnings-screen";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";

export function FarmerScreenClient({ screen }: { screen: string }) {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasOnboarded) {
      router.replace("/");
    }
  }, [mounted, hasOnboarded, router]);

  if (!mounted || !hasOnboarded) {
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
      default:
        router.replace("/farmer");
        return null;
    }
  };

  return (
    <>
      {renderScreen()}
      <BoloAssistant />
    </>
  );
}