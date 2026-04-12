"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { FarmerDashboard } from "@/components/farmer/farmer-dashboard";
import { BoloAssistant } from "@/components/bolo/bolo-assistant";

export default function FarmerPage() {
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

      // Check if they physically don't have the right local storage tokens
      if (session !== "active" || savedRole !== "farmer") {
        router.replace("/");
        return;
      }

      // If they DO have the tokens but Zustand reset (due to refresh), rehydrate it
      if (!hasOnboarded || userRole !== "farmer") {
        setHasOnboarded(true);
        setUserRole("farmer");
      }

      setIsAuthorized(true);
    }
  }, [mounted, hasOnboarded, userRole, router, setHasOnboarded, setUserRole]);

  // Show loading skeleton while checking authorization
  if (!mounted || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-primary/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <FarmerDashboard />
      <BoloAssistant />
    </div>
  );
}
