"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useAppStore, useTranslation, Screen } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, BarChart2, User, Mic, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type NavId = "home" | "sell" | "market" | "pools" | "profile";

const navItems: { id: NavId; icon: React.ElementType; path: string }[] = [
  { id: "home",    icon: Home,        path: "/farmer"         },
  { id: "sell",    icon: ShoppingBag, path: "/farmer/sell"    },
  { id: "market",  icon: BarChart2,   path: "/farmer/market"  },
  { id: "pools",   icon: Layers,      path: "/farmer/pools"   },
  
];

const GLASS_CLASSES =
  "bg-white/[0.8] dark:bg-slate-950/[0.8] backdrop-blur-[24px] border border-white/40 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]";

export function BottomNav() {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const setBoloListening  = useAppStore((state) => state.setBoloListening);
  const setActiveScreen   = useAppStore((state) => state.setActiveScreen);
  const t = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels: Record<string, string> = {
    home:    (t as any)?.home    ?? "Home",
    sell:    t?.sell             ?? "Sell",
    market:  t?.market           ?? "Market",
    pools:   (t as any)?.pools   ?? "Pools",
    profile: (t as any)?.profile ?? "Profile",
  };

  const checkIsActive = useCallback(
    (path: string) =>
      path === "/farmer" ? pathname === "/farmer" : pathname?.startsWith(path),
    [pathname],
  );

  const handleNavTap = useCallback(
    (item: (typeof navItems)[number]) => {
      router.push(item.path);
      setActiveScreen(item.id as Screen);
    },
    [router, setActiveScreen],
  );

  // 2. EARLY RETURNS HAPPEN ONLY AFTER ALL HOOKS ARE REGISTERED
  if (!mounted) return null;
  if (pathname === "/farmer/sell" || pathname?.startsWith("/farmer/sell")) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[420px] relative">
        {/* Main Nav Bar */}
        <div
          className={cn(
            "rounded-[32px] flex items-center justify-between px-2 h-[72px]",
            GLASS_CLASSES,
          )}
        >
          {/* Left Nav Items: home, sell */}
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

          {/* Centre spacer for Bolo mic */}
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

        {/* ── Floating Bolo Mic ── */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex flex-col items-center pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBoloListening(true)}
            className="relative w-20 h-20 rounded-full flex items-center justify-center group"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse group-hover:bg-emerald-500/30 transition-colors" />
            <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 border-[4px] border-white dark:border-slate-900 shadow-xl flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mic
                  className="w-9 h-9 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  fill="currentColor"
                />
              </motion.div>
            </div>
          </motion.button>
          <span className="mt-1.5 font-black text-[10px] text-emerald-700 dark:text-emerald-400 tracking-[0.2em] uppercase drop-shadow-sm">
            BOLO
          </span>
        </div>

      </div>
    </nav>
  );
}

// ── Nav Item ──────────────────────────────────────────────────────────────────
const NavItem = React.memo(function NavItem({
  item, isActive, label, onClick,
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
        isActive
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300",
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-glow"
            className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/20 dark:border-emerald-400/10 -z-10"
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
            "scale-110 translate-y-[-2px] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span className={cn(
        "text-[10px] mt-1 transition-all duration-300",
        isActive ? "font-bold opacity-100" : "font-medium opacity-70",
      )}>
        {label}
      </span>
    </button>
  );
});
NavItem.displayName = "NavItem";
