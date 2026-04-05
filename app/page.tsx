"use client"

import { useAppStore } from "@/lib/store"
import { FarmerDashboard } from "@/components/farmer/farmer-dashboard"
import { SellFlow } from "@/components/farmer/sell-flow"
import { AuctionScreen } from "@/components/auction/auction-screen"
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard"
import { BoloAssistant } from "@/components/bolo/bolo-assistant"
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen"
import { TrackingScreen } from "@/components/farmer/tracking-screen"
import { MarketScreen } from "@/components/farmer/market-screen"
import { ProfileScreen } from "@/components/farmer/profile-screen"
import { NotificationsScreen } from "@/components/farmer/notifications-screen"
import { EarningsScreen } from "@/components/farmer/earnings-screen"
import { useState, useEffect } from "react"

export default function AgriLinkApp() {
  const userRole = useAppStore((state) => state.userRole)
  const activeScreen = useAppStore((state) => state.activeScreen)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasOnboarded = localStorage.getItem("agrilink-onboarded")
    if (hasOnboarded) {
      setShowOnboarding(false)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => {
      localStorage.setItem("agrilink-onboarded", "true")
      setShowOnboarding(false)
    }} />
  }

  if (userRole === "buyer") {
    return (
      <>
        <BuyerDashboard />
        <BoloAssistant />
      </>
    )
  }

  const renderFarmerScreen = () => {
    switch (activeScreen) {
      case "sell":
        return <SellFlow />
      case "auction":
        return <AuctionScreen />
      case "tracking":
        return <TrackingScreen />
      case "market":
        return <MarketScreen />
      case "profile":
        return <ProfileScreen />
      case "notifications":
        return <NotificationsScreen />
      case "earnings":
        return <EarningsScreen />
      case "home":
      default:
        return <FarmerDashboard />
    }
  }

  return (
    <>
      {renderFarmerScreen()}
      <BoloAssistant />
    </>
  )
}
