"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";
import { motion, AnimatePresence } from "framer-motion";

// 1. Accept the "screen" prop from the Next.js dynamic router
export function BuyerScreenClient({ screen }: { screen: string }) {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 1. Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Route protection
  useEffect(() => {
    if (mounted && (!hasOnboarded || !isLoggedIn)) {
      router.replace("/");
    }
  }, [mounted, hasOnboarded, isLoggedIn, router]);

  // 3. Premium loading state
  if (!mounted || !hasOnboarded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 animate-ping absolute" />
          <div className="w-8 h-8 rounded-full bg-primary/40 animate-pulse relative z-10 border border-primary/20" />
        </div>
      </div>
    );
  }

  // 4. Application shell
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <BuyerDashboard activeTab={screen} />
      <BoloAssistant />
    </main>
  );
}
