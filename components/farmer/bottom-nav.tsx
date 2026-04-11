"use client";

import { useAppStore, useTranslation } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const navItems = [
  { id: "home", icon: Home, label: "Home", path: "/farmer" },
  { id: "sell", icon: ShoppingBag, label: "sell", path: "/farmer/sell" },
  { id: "market", icon: BarChart2, label: "market", path: "/farmer/market" },
  { id: "profile", icon: User, label: "Profile", path: "/farmer/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setBoloListening = useAppStore((state) => state.setBoloListening);
  const t = useTranslation();

  const labels: Record<string, string> = {
    home: "Home",
    sell: t.sell,
    market: t.market,
    profile: "Profile",
  };

  // Smart path matching for nested routes
  const checkIsActive = (path: string) => {
    if (path === "/farmer") {
      return pathname === "/farmer";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Frosted Glass Pill */}
      <div className="pointer-events-auto w-full max-w-[420px] bg-background/70 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl premium-shadow flex items-center justify-between px-2 py-2">
        {/* Left Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={checkIsActive(item.path)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>

        {/* The Hero "Bolo" Button with Lottie Animation */}
        <div className="relative -top-6 px-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBoloListening(true)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-agri-olive p-0.5 shadow-lg shadow-primary/30 group flex items-center justify-center"
          >
            {/* Inner Glass Ring */}
            <div className="absolute inset-0.5 rounded-full bg-black/10 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] z-0" />

            {/* The Lottie Animation */}
            <div className="relative z-10 w-12 h-12 flex items-center justify-center overflow-hidden mix-blend-screen">
              <DotLottieReact src="/bolo-ai.lottie" loop autoplay />
            </div>
          </motion.button>

          {/* Label underneath the floating orb */}
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary tracking-wide uppercase">
            {t.bolo}
          </span>
        </div>

        {/* Right Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={checkIsActive(item.path)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

// ----------------------------------------------------------------------
// ANIMATED NAV ITEM COMPONENT
// ----------------------------------------------------------------------
function NavItem({
  id,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  id: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-colors duration-300 z-10",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
      )}
    >
      {/* The Sliding Glass Bubble Effect */}
      {isActive && (
        <motion.div
          layoutId="bottom-nav-indicator"
          className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          "w-5 h-5 relative z-10 transition-transform duration-300",
          isActive && "scale-110 drop-shadow-md",
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={cn(
          "text-[10px] tracking-wide relative z-10 mt-1 transition-all duration-300",
          isActive ? "font-bold" : "font-medium",
        )}
      >
        {label}
      </span>
    </button>
  );
}
