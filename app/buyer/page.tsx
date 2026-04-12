"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyerPage() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 1. Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Route protection — uses isLoggedIn (the actual login flow)
  // instead of userRole which was never reliably set at this point
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
      <AnimatePresence mode="wait">
        <motion.div
          key="buyer-dashboard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full"
        >
          <BuyerDashboard />
        </motion.div>
      </AnimatePresence>
      <BoloAssistant />
    </main>
  );
}
