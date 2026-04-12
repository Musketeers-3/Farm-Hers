"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { AnimatePresence, motion } from "framer-motion";

export default function RootPage() {
  const router = useRouter();
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);
  const setUserRole = useAppStore((state) => state.setUserRole);

  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("agrilink-session");
    const onboarded = localStorage.getItem("agrilink-onboarded");
    const savedRole = localStorage.getItem("agrilink-user-role");

    if (session === "active" && onboarded === "true" && savedRole) {
      setHasOnboarded(true);
      setUserRole(savedRole as "farmer" | "buyer");
      router.replace(`/${savedRole}`);
    } else {
      setIsMounting(false);
    }
  }, [router, setHasOnboarded, setUserRole]);

  if (isMounting) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="auth-flow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full"
      >
        <OnboardingScreen
          onComplete={(role) => {
            localStorage.setItem("agrilink-onboarded", "true");
            localStorage.setItem("agrilink-user-role", role);
            localStorage.setItem("agrilink-session", "active");

            setUserRole(role);
            setHasOnboarded(true);

            router.push(`/${role}`);
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
