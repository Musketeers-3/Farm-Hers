"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Home, Package, Clock, GitCompare, AlertTriangle, ShoppingBag, BookOpen, MessageCircle, TrendingUp, Search, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shelf", icon: Package, label: "Shelf" },
  { href: "/routine", icon: Clock, label: "Routine" },
  { href: "/compare", icon: GitCompare, label: "Compare" },
  { href: "/conflicts", icon: AlertTriangle, label: "Conflicts" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/advisory", icon: BookOpen, label: "Advisory" },
  { href: "/assistant", icon: MessageCircle, label: "Assistant" },
  { href: "/progress", icon: TrendingUp, label: "Progress" },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-warm-solid h-16 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-coral flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">S</span>
            </div>
            <span className="font-serif text-xl font-bold text-brown-dark">Skin Sync</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-rose/20 text-rose-dark"
                      : "text-taupe hover:text-rose-dark hover:bg-rose/10"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full glass-warm flex items-center justify-center text-taupe hover:text-rose-dark transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full glass-warm flex items-center justify-center text-taupe hover:text-rose-dark transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />
          </button>
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose/30">
            <div className="w-full h-full bg-gradient-to-br from-peach to-rose-light" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar for Additional Nav */}
      <aside className="hidden lg:flex fixed left-4 top-24 bottom-4 w-16 flex-col items-center py-4 glass-warm rounded-2xl z-40">
        <nav className="flex-1 flex flex-col items-center gap-2 mt-2">
          {navItems.slice(6).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
                  isActive
                    ? "bg-rose/20 text-rose-dark"
                    : "text-taupe hover:text-rose-dark hover:bg-rose/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="absolute left-14 px-2 py-1 rounded-md bg-brown-dark text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-warm-solid">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-coral flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">S</span>
            </div>
            <span className="font-serif text-lg font-bold text-brown-dark">Skin Sync</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full glass-warm flex items-center justify-center text-taupe">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full glass-warm flex items-center justify-center text-taupe relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-coral rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-warm-solid border-t border-rose/10">
        <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-rose-dark"
                    : "text-taupe"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-gradient-to-br from-rose/30 to-peach/30"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "text-rose-dark")} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 md:pt-24 lg:ml-24 pb-24 md:pb-8 px-4 md:px-8">
        {children}
      </main>
    </div>
  )
}
