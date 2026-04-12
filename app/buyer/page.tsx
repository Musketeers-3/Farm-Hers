"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BuyerDashboard } from "@/components/buyer/buyer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";

export default function BuyerPage() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const userRole = useAppStore((state) => state.userRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const setUserRole = useAppStore((state) => state.setUserRole);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const session = localStorage.getItem("agrilink-session");
      const savedRole = localStorage.getItem("agrilink-user-role");

      if (session !== "active" || savedRole !== "buyer") {
        router.replace("/");
        return;
      }

      if (!hasOnboarded || userRole !== "buyer") {
        setHasOnboarded(true);
        setUserRole("buyer");
      }

      setIsAuthorized(true);
    }
  }, [mounted, hasOnboarded, userRole, router, setHasOnboarded, setUserRole]);

  if (!mounted || !isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-primary/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <BuyerDashboard />
      <BoloAssistant />
    </div>
  );
}
