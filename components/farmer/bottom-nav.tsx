"use client"
import { useAppStore, useTranslation } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { Home, ShoppingBag, BarChart2, User, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", icon: Home, label: "Home", path: "/farmer" },
  { id: "sell", icon: ShoppingBag, label: "sell", path: "/farmer/sell" },
  { id: "market", icon: BarChart2, label: "market", path: "/farmer/market" },
  { id: "profile", icon: User, label: "Profile", path: "/farmer/profile" },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const setBoloListening = useAppStore((state) => state.setBoloListening)
  const t = useTranslation()

  const labels: Record<string, string> = {
    home: "Home",
    sell: t.sell,
    market: t.market,
    profile: "Profile",
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="glass border-t border-border/40">
        <div className="flex items-center justify-around px-2 py-2.5 max-w-lg mx-auto">
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
          <button
            onClick={() => setBoloListening(true)}
            className={cn(
              "relative -mt-7 w-14 h-14 rounded-2xl",
              "bg-primary",
              "flex items-center justify-center",
              "premium-shadow-lg",
              "hover:scale-105 active:scale-95 transition-all duration-200",
              "ring-4 ring-background"
            )}
          >
            <Mic className="w-6 h-6 text-primary-foreground" strokeWidth={1.8} />
            <span className="absolute -bottom-5 text-[10px] font-semibold text-primary tracking-wide">
              {t.bolo}
            </span>
          </button>
          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={labels[item.id]}
              isActive={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>
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
        "flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all duration-200",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} strokeWidth={isActive ? 2.2 : 1.8} />
      <span className={cn("text-[10px] tracking-wide", isActive ? "font-semibold" : "font-medium")}>{label}</span>
    </button>
  )
}