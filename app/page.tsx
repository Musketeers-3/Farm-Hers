"use client";

import { useState, useEffect } from "react";
import { useAppStore, useHydrated } from "@/lib/store";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";

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
        router.replace("/login");
      } else {
        setStep("onboarding");
      }
    } catch (error) {
      setStep("onboarding");
    }
  }, [hydrated]);

  const handleOnboardingComplete = (role: "farmer" | "buyer") => {
    setHasOnboarded(true);
    setUserRole(role);
    router.push("/login");
  };

  if (step === "loading" || step === "redirecting") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return <OnboardingScreen onComplete={handleOnboardingComplete} />;
}