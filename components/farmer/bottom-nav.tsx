"use client";

import React, { useMemo, useCallback } from "react";
import { useAppStore, useTranslation, Screen } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type NavId = "home" | "sell" | "market" | "profile";

const navItems: { id: NavId; icon: React.ElementType; path: string }[] = [
  { id: "home", icon: Home, path: "/farmer" },
  { id: "sell", icon: ShoppingBag, path: "/farmer/sell" },
  { id: "market", icon: BarChart2, path: "/farmer/market" },
  { id: "profile", icon: User, path: "/farmer/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setBoloListening = useAppStore((state) => state.setBoloListening);
  // FIX: also pull setActiveScreen so nav taps keep Zustand in sync with the URL
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);
  const t = useTranslation();

  // FIX: added "home" and "profile" fallbacks — these keys don't exist in the
  // translations object, so t.home / t.profile would be undefined without them.
  const labels: Record<string, string> = {
    home: (t as any)?.home ?? "Home",
    sell: t?.sell ?? "Sell",
    market: t?.market ?? "Market",
    profile: (t as any)?.profile ?? "Profile",
  };

  const checkIsActive = useCallback(
    (path: string) => {
      if (path === "/farmer") {
        return pathname === "/farmer";
      }
      return pathname.startsWith(path);
    },
    [pathname],
  );

  // FIX: every nav tap does both router.push (URL) and setActiveScreen (Zustand).
  // Previously only router.push was called, so activeScreen was always stale.
  const handleNavTap = useCallback(
    (item: (typeof navItems)[number]) => {
      router.push(item.path);
      setActiveScreen(item.id as Screen);
    },
    [router, setActiveScreen],
  );

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[420px] bg-background/70 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl flex items-center justify-between px-2 py-2">
        {/* Left Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={checkIsActive(item.path)}
              onClick={() => handleNavTap(item)}
            />
          ))}
        </div>

        {/* Hero "Bolo" Button */}
        <div className="relative -top-6 px-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setBoloListening(true)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-agri-olive p-0.5 shadow-lg shadow-primary/30 flex items-center justify-center overflow-visible"
          >
            <div className="absolute inset-0.5 rounded-full bg-black/10 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]" />
            <div className="relative z-10 w-14 h-14 flex items-center justify-center overflow-hidden">
              <DotLottieReact
                src="/bolo-ai.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </motion.button>

          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary tracking-widest uppercase whitespace-nowrap drop-shadow-sm">
            {t.bolo || "BOLO"}
          </span>
        </div>

        {/* Right Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={checkIsActive(item.path)}
              onClick={() => handleNavTap(item)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

const NavItem = React.memo(
  ({
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="nav-glow"
              className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </AnimatePresence>

        <Icon
          className={cn(
            "w-5 h-5 transition-transform duration-300",
            isActive &&
              "scale-110 translate-y-[-2px] drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]",
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={cn(
            "text-[10px] mt-1 transition-all duration-300",
            isActive ? "font-bold opacity-100" : "font-medium opacity-70",
          )}
        >
          {label}
        </span>
      </button>
    );
  },
);

NavItem.displayName = "NavItem";