"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { BottomNav } from "./bottom-nav"
import { 
  ArrowLeft, TrendingUp, TrendingDown, Gavel, Truck, 
  CreditCard, CloudRain, Check, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "price" | "auction" | "order" | "payment" | "weather"
  title: string
  message: string
  time: string
  read: boolean
}

const sampleNotifications: Notification[] = [
  { id: "1", type: "price", title: "Wheat price rising", message: "Wheat prices up 3.5% at Ludhiana Mandi. Consider selling now.", time: "2m ago", read: false },
  { id: "2", type: "auction", title: "Auction ending soon", message: "Your wheat auction ends in 15 minutes. Current bid: ₹2,450/q", time: "15m ago", read: false },
  { id: "3", type: "order", title: "Order shipped", message: "Your 50q wheat order has been picked up and is in transit.", time: "1h ago", read: false },
  { id: "4", type: "payment", title: "Payment received", message: "₹1,12,500 credited to your account for Order #AG-1247", time: "3h ago", read: true },
  { id: "5", type: "weather", title: "Rain expected", message: "Heavy rainfall predicted tomorrow. Plan harvest accordingly.", time: "5h ago", read: true },
  { id: "6", type: "price", title: "Mustard price drop", message: "Mustard prices fell 2.1% across Punjab mandis.", time: "8h ago", read: true },
  { id: "7", type: "order", title: "Quality verified", message: "Your rice shipment passed quality check. Payment processing.", time: "1d ago", read: true },
  { id: "8", type: "auction", title: "New bid received", message: "A new bid of ₹5,400/q placed on your mustard auction.", time: "1d ago", read: true },
]

const iconMap = {
  price: TrendingUp,
  auction: Gavel,
  order: Truck,
  payment: CreditCard,
  weather: CloudRain,
}

const colorMap = {
  price: "bg-primary/10 text-primary",
  auction: "bg-agri-gold/15 text-agri-earth",
  order: "bg-chart-3/10 text-chart-3",
  payment: "bg-agri-success/10 text-agri-success",
  weather: "bg-chart-4/10 text-chart-4",
}

export function NotificationsScreen() {
  const setActiveScreen = useAppStore((state) => state.setActiveScreen)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [filter, setFilter] = useState<string>("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter)

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="max-w-lg mx-auto px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveScreen("home")}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-accent transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.8} />
              </button>
              <div>
                <h1 className="text-xl font-serif font-bold text-foreground">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={clearAll} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All" },
              { id: "price", label: "Prices" },
              { id: "auction", label: "Auctions" },
              { id: "order", label: "Orders" },
              { id: "payment", label: "Payments" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Check className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm">No notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const Icon = iconMap[notif.type]
              return (
                <button
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all",
                    notif.read ? "bg-card" : "bg-primary/[0.03] border border-primary/10",
                    "hover:bg-secondary"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorMap[notif.type])}>
                      <Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={cn("text-sm font-semibold text-foreground truncate", !notif.read && "text-primary")}>
                          {notif.title}
                        </h3>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
