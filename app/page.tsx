"use client";

import { useState, useEffect } from "react";
import { useAppStore, useHydrated } from "@/lib/store";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { LoginComponent } from "@/components/auth/login-component";
import { motion, AnimatePresence } from "framer-motion";

type AppStep = "loading" | "onboarding" | "login" | "redirecting";

export default function AgriLinkApp() {
  const hydrated = useHydrated();
  const router = useRouter();
  const setUserRole = useAppStore((state) => state.setUserRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);

  const [step, setStep] = useState<AppStep>("loading");
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">(
    "farmer",
  );

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
        window.location.href = "/login";
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
    // Using router.push is better for Next.js performance than window.location
    router.push("/login");
  };
  const handleLogin = (role: "farmer" | "buyer") => {
    setIsLoggedIn(true);
    setUserRole(role);
    setTimeout(() => router.push(`/${role}`), 300);
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

  if (step === "login") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <LoginComponent
            role={selectedRole}
            onBack={() => setStep("onboarding")}
            onLogin={handleLogin}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="onboarding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </motion.div>
    </AnimatePresence>
  );
}
