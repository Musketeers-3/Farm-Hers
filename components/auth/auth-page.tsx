"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoginComponent } from "./login-component";
import { SignupComponent } from "./signup-component";
import { useAppStore } from "@/lib/store"; // ✅ add this

export default function AuthPage({ defaultView = "login" }: { defaultView?: "login" | "signup" }) {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  // ✅ add these
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (window.innerWidth / 2 - e.pageX) / 60,
        y: (window.innerHeight / 2 - e.pageY) / 60,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLoginSuccess = (role: "farmer" | "buyer") => {
    // ✅ update Zustand store so app/page.tsx redirect logic works
    setIsLoggedIn(true);
    setUserRole(role);
    setHasOnboarded(true);
    router.push(`/${role}`);
    router.refresh();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y, scale: 1.1 }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        className="fixed inset-[-10%] w-[120%] h-[120%] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LoginComponent
                onSignupClick={() => router.push("/signup")}
                onLogin={(role) => handleLoginSuccess(role)}
                mousePos={mousePos}
              />
            </motion.div>
          )}

          {view === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SignupComponent
                role="farmer"
                onLoginClick={() => router.push("/login")}
                onSignup={(data) => {
                  console.log("Signup success:", data);
                  handleLoginSuccess("farmer");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}