"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FarmerDashboard } from "@/components/farmer/farmer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";

export default function FarmerPage() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasOnboarded || !isLoggedIn) {
      router.replace("/");
    }
  }, [mounted, hasOnboarded, isLoggedIn, router]);

  if (!mounted || !hasOnboarded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20" />
        </div>
      </div>
    );
  }

  return (
    <>
      <FarmerDashboard />
      <BoloAssistant />
    </>
  );
}