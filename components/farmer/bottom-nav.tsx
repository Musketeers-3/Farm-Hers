"use client";

import React, { useCallback } from "react";
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
  { id: "profile", icon: User,        path: "/farmer/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav entirely on the sell flow
  if (pathname === "/farmer/sell" || pathname?.startsWith("/farmer/sell/")) {
    return null;
  }

  const router = useRouter();
  const setBoloListening  = useAppStore((state) => state.setBoloListening);
  const setActiveScreen   = useAppStore((state) => state.setActiveScreen);
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

        {/* ── Main Nav Bar ──
            Light: white/80 frosted glass
            Dark:  dark green glass — same #020c04 palette as the page bg, NO reddish tint */}
        <div className="
          bg-white/80 dark:bg-[#020c04]/80
          backdrop-blur-2xl
          border border-white/50 dark:border-white/[0.09]
          shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)]
          rounded-[32px] flex items-center justify-between px-2 h-[72px]">

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
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative z-10 w-full h-full rounded-full
              bg-gradient-to-br from-[#1e4d2b] to-[#0f2916]
              border-[4px] border-white/40 dark:border-[#020c04]
              shadow-xl shadow-emerald-900/40
              flex items-center justify-center">
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
          <span className="mt-1 font-black text-[9px] text-[#1e4d2b] dark:text-emerald-400 tracking-[0.2em] uppercase drop-shadow-sm">
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
          : "text-slate-500 dark:text-white/40 hover:text-slate-800 dark:hover:text-white/70",
      )}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-glow"
            className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/[0.12] rounded-2xl border border-emerald-500/20 dark:border-emerald-400/20 -z-10"
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
          isActive && "scale-110 translate-y-[-2px] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
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
