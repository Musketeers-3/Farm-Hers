"use client";

import { useState, useEffect } from "react";
import { useAppStore, useHydrated } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LoginComponent } from "@/components/auth/login-component";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const userRole = useAppStore((state) => state.userRole);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // DELETE this entire useEffect
  useEffect(() => {
    if (!hydrated || !mounted) return;
    if (isLoggedIn) router.replace(`/${userRole}`);
  }, [hydrated, mounted]);

  const handleLogin = (role: "farmer" | "buyer") => {
    setIsLoggedIn(true);
    setUserRole(role);
    setTimeout(() => {
      window.location.href = `/${role}`;
    }, 300);
  };

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
          role={userRole}
          onBack={() => router.push("/")}
          onLogin={handleLogin}
        />
      </motion.div>
    </AnimatePresence>
  );
}
