"use client";

import React, { useCallback } from "react";
import { useAppStore, useTranslation, Screen } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, BarChart2, User, Mic, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type NavId = "home" | "sell" | "market" | "pools" | "profile";

const navItems: { id: NavId; icon: React.ElementType; path: string }[] = [
  { id: "home",    icon: Home,        path: "/farmer" },
  { id: "sell",    icon: ShoppingBag, path: "/farmer/sell" },
  { id: "market",  icon: BarChart2,   path: "/farmer/market" },
  { id: "pools",   icon: Layers,      path: "/farmer/pools" },
  { id: "profile", icon: User,        path: "/farmer/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setBoloListening = useAppStore((state) => state.setBoloListening);
  const setActiveScreen = useAppStore((state) => state.setActiveScreen);
  const t = useTranslation();

  const labels: Record<string, string> = {
    home:    (t as any)?.home    ?? "Home",
    sell:    t?.sell             ?? "Sell",
    market:  t?.market           ?? "Market",
    pools:   (t as any)?.pools   ?? "Pools",
    profile: (t as any)?.profile ?? "Profile",
  };

  const checkIsActive = useCallback(
    (path: string) =>
      path === "/farmer" ? pathname === "/farmer" : pathname.startsWith(path),
    [pathname],
  );

  const handleNavTap = useCallback(
    (item: (typeof navItems)[number]) => {
      router.push(item.path);
      setActiveScreen(item.id as Screen);
    },
    [router, setActiveScreen],
  );

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[420px] relative">

        {/* Pill bar */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.1)] rounded-[28px] flex items-center justify-between px-2 h-[72px]">

          {/* Left: home, sell */}
          <div className="flex items-center gap-1">
            {navItems.slice(0, 2).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={checkIsActive(item.path)}
                label={labels[item.id]}
                onClick={() => handleNavTap(item)}
              />
            ))}
          </div>

          {/* Centre spacer for floating mic */}
          <div className="w-20 shrink-0" />

          {/* Right: market, pools, profile */}
          <div className="flex items-center gap-1">
            {navItems.slice(2).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={checkIsActive(item.path)}
                label={labels[item.id]}
                onClick={() => handleNavTap(item)}
              />
            ))}
          </div>
        </div>

        {/* Floating Bolo mic */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBoloListening(true)}
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
            <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-[#14532d] to-[#064e3b] border-[4px] border-white shadow-lg flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mic
                  className="w-9 h-9 text-white drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  fill="white"
                />
              </motion.div>
            </div>
          </motion.button>
          <span className="mt-1 font-black text-[9px] text-[#14532d] tracking-[0.2em] uppercase">
            BOLO
          </span>
        </div>
      </div>
    </nav>
  );
}

const NavItem = React.memo(function NavItem({
  item,
  isActive,
  label,
  onClick,
}: {
  item: { id: string; icon: React.ElementType };
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-[46px] h-[56px] rounded-2xl transition-all duration-300",
        isActive ? "text-[#16a34a]" : "text-slate-400 hover:text-slate-600",
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-active-bg"
            className="absolute inset-0 bg-green-500/10 rounded-2xl border border-green-500/20 -z-10"
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
          isActive && "scale-110 -translate-y-0.5",
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={cn(
          "text-[9px] mt-0.5 tracking-widest uppercase transition-all duration-300",
          isActive ? "font-black opacity-100" : "font-medium opacity-60",
        )}
      >
        {label}
      </span>
    </button>
  );
});