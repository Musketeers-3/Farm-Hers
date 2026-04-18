"use client";

import { useState, useEffect } from "react";
import { useAppStore, useHydrated } from "@/lib/store";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

type AppStep = "loading" | "onboarding" | "redirecting";

export default function AgriLinkApp() {
  const hydrated = useHydrated();
  const router = useRouter();
  const setUserRole = useAppStore((state) => state.setUserRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);

  const [step, setStep] = useState<AppStep>("loading");

  useEffect(() => {
    if (!hydrated) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("reset") === "true") {
        setHasOnboarded(false);
        setIsLoggedIn(false);
        window.history.replaceState({}, "", "/");
        setStep("onboarding");
        return;
      }

      const state = useAppStore.getState();

      if (state.hasOnboarded && state.isLoggedIn) {
        setStep("redirecting");
        router.replace(`/${state.userRole}`);
      } else if (state.hasOnboarded && !state.isLoggedIn) {
        setStep("redirecting"); // Keep the premium UI visible while routing
        router.replace("/login");
      } else {
        setStep("onboarding");
      }
    } catch (error) {
      setStep("onboarding");
    }
  }, [hydrated, router, setHasOnboarded, setIsLoggedIn]);

  const handleOnboardingComplete = (role: "farmer" | "buyer") => {
    setHasOnboarded(true);
    setUserRole(role);
    router.push("/login");
  };

  // 🚀 UPGRADED: Premium Glassmorphic Loading State matching the rest of the app
  if (step === "loading" || step === "redirecting") {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#dcfce7_0%,#dcfce7_20%,#bfdbfe_100%)] dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
        <div className="w-24 h-24 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-white/10 flex items-center justify-center shadow-2xl animate-pulse">
          <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
        </div>
      </div>
    );
  }

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}
