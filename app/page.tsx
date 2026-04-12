"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { LoginComponent } from "@/components/auth/login-component";
import { motion, AnimatePresence } from "framer-motion";

// Flow: / → onboarding (role select) → login → /farmer or /buyer
// If already logged in: / → redirect to /{role}

type AppStep = "loading" | "onboarding" | "login" | "redirecting";

export default function AgriLinkApp() {
  const router = useRouter();
  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setUserEmail = useAppStore((state) => state.setUserEmail);
  const setUserName = useAppStore((state) => state.setUserName);

  const [step, setStep] = useState<AppStep>("loading");
  const [selectedRole, setSelectedRole] = useState<"farmer" | "buyer">("farmer");

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      // ?reset=true → full logout, back to onboarding
      if (urlParams.get("reset") === "true") {
        localStorage.removeItem("agrilink-onboarded");
        setHasOnboarded(false);
        setIsLoggedIn(false);
        window.history.replaceState({}, "", "/");
        setStep("onboarding");
        return;
      }

      const hasOnboarded = localStorage.getItem("agrilink-onboarded");

      if (hasOnboarded && isLoggedIn) {
        // Fully authenticated — go straight to dashboard
        setHasOnboarded(true);
        setStep("redirecting");
        router.replace(`/${userRole}`);
      } else if (hasOnboarded && !isLoggedIn) {
        // Completed onboarding before but not logged in — show login
        setHasOnboarded(true);
        setStep("login");
      } else {
        // Fresh user — show onboarding
        setStep("onboarding");
      }
    } catch (error) {
      console.warn("LocalStorage unavailable.", error);
      setStep("onboarding");
    }
  }, []);

  const handleOnboardingComplete = (role: "farmer" | "buyer") => {
    localStorage.setItem("agrilink-onboarded", "true");
    setHasOnboarded(true);
    setUserRole(role);
    setSelectedRole(role);
    setStep("login");
  };

  const handleLogin = (role: "farmer" | "buyer") => {
    // In a real app, validate credentials here.
    // For now: accept any non-empty email/password and set the user as logged in.
    setIsLoggedIn(true);
    setUserRole(role);
    setStep("redirecting");
    router.push(`/${role}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStep("login");
    router.replace("/");
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

  // step === "onboarding"
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