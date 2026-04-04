"use client"

import { useAppStore, useTranslation } from "@/lib/store"
import { Home, ShoppingBag, BarChart2, User, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", icon: Home, labelKey: "home" },
  { id: "sell", icon: ShoppingBag, labelKey: "sell" },
  { id: "market", icon: BarChart2, labelKey: "market" },
  { id: "profile", icon: User, labelKey: "profile" },
] as const

export function BottomNav() {
  const activeScreen = useAppStore((state) => state.activeScreen)
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const setBoloListening = useAppStore((state) => state.setBoloListening)
  const t = useTranslation()

  const labels: Record<string, string> = {
    home: "Home",
    sell: t.sell,
    market: t.market,
    profile: "Profile",
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={labels[item.id]}
            isActive={activeScreen === item.id}
            onClick={() => setActiveScreen(item.id)}
          />
        ))}

        {/* Central Bolo Button */}
        <button
          onClick={() => setBoloListening(true)}
          className={cn(
            "relative -mt-6 w-16 h-16 rounded-full",
            "bg-gradient-to-br from-primary to-agri-olive",
            "flex items-center justify-center",
            "shadow-lg shadow-primary/30",
            "hover:scale-105 active:scale-95 transition-transform",
            "ring-4 ring-card"
          )}
        >
          <Mic className="w-7 h-7 text-white" />
          <span className="absolute -bottom-5 text-xs font-medium text-primary">
            {t.bolo}
          </span>
        </button>

        {navItems.slice(2).map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={labels[item.id]}
            isActive={activeScreen === item.id}
            onClick={() => setActiveScreen(item.id)}
          />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  id,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  id: string
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
      <span className={cn("text-xs", isActive && "font-medium")}>{label}</span>
      {isActive && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  )
}
