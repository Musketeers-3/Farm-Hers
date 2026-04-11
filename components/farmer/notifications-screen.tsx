"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "./bottom-nav";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  Gavel,
  Truck,
  CreditCard,
  CloudRain,
  CheckCircle2,
  Trash2,
  BellRing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "price" | "auction" | "order" | "payment" | "weather";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "price",
    title: "Wheat price rising",
    message: "Wheat prices up 3.5% at Ludhiana Mandi. Consider selling now.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "auction",
    title: "Auction ending soon",
    message: "Your wheat auction ends in 15 minutes. Current bid: ₹2,450/q",
    time: "15m ago",
    read: false,
  },
  {
    id: "3",
    type: "order",
    title: "Order shipped",
    message: "Your 50q wheat order has been picked up and is in transit.",
    time: "1h ago",
    read: false,
  },
  {
    id: "4",
    type: "payment",
    title: "Payment received",
    message: "₹1,12,500 credited to your account for Order #AG-1247",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    type: "weather",
    title: "Rain expected",
    message: "Heavy rainfall predicted tomorrow. Plan harvest accordingly.",
    time: "5h ago",
    read: true,
  },
  {
    id: "6",
    type: "price",
    title: "Mustard price drop",
    message: "Mustard prices fell 2.1% across Punjab mandis.",
    time: "8h ago",
    read: true,
  },
  {
    id: "7",
    type: "order",
    title: "Quality verified",
    message: "Your rice shipment passed quality check. Payment processing.",
    time: "1d ago",
    read: true,
  },
  {
    id: "8",
    type: "auction",
    title: "New bid received",
    message: "A new bid of ₹5,400/q placed on your mustard auction.",
    time: "1d ago",
    read: true,
  },
];

const iconMap = {
  price: TrendingUp,
  auction: Gavel,
  order: Truck,
  payment: CreditCard,
  weather: CloudRain,
};

const colorMap = {
  price:
    "bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
  auction:
    "bg-agri-gold/20 text-agri-earth shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
  order:
    "bg-chart-3/15 text-chart-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
  payment:
    "bg-agri-success/15 text-agri-success shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
  weather:
    "bg-chart-4/15 text-chart-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
};

export function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background pb-28 overflow-x-hidden">
      {/* ---------------------------------------------------------------------- */}
      {/* HIGH-DENSITY GLASS HEADER */}
      {/* ---------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => router.push("/farmer")}
                className="w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-accent transition-all shadow-sm shrink-0"
              >
                <ArrowLeft
                  className="w-5.5 h-5.5 text-foreground"
                  strokeWidth={1.8}
                />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-none tracking-tight">
                    Notifications
                  </h1>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  Activity Feed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-primary font-bold px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAll}
                className="w-10.5 h-10.5 rounded-xl bg-secondary/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm text-muted-foreground"
                aria-label="Clear all"
              >
                <Trash2 className="w-5 h-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Animated Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: "all", label: "All" },
              { id: "price", label: "Prices" },
              { id: "auction", label: "Auctions" },
              { id: "order", label: "Orders" },
              { id: "payment", label: "Payments" },
            ].map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-colors z-10",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="notification-filter"
                      className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* NOTIFICATION FEED */}
      {/* ---------------------------------------------------------------------- */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                <BellRing className="w-10 h-10 opacity-40" strokeWidth={1.5} />
              </div>
              <p className="text-xl font-bold text-foreground">
                All caught up!
              </p>
              <p className="text-sm mt-1">
                No notifications to show right now.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.map((notif, index) => {
                const Icon = iconMap[notif.type];
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      "w-full text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden group border",
                      notif.read
                        ? "bg-card border-border/50 hover:border-primary/30 premium-shadow"
                        : "bg-primary/5 border-primary/20 shadow-md shadow-primary/5",
                    )}
                  >
                    {/* Unread Glowing Edge */}
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}

                    <div className="flex gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                          colorMap[notif.type],
                        )}
                      >
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>

                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-bold truncate pr-2",
                              !notif.read ? "text-primary" : "text-foreground",
                            )}
                          >
                            {notif.title}
                          </h3>
                          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wider mt-0.5">
                            {notif.time}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-xs sm:text-sm leading-snug",
                            !notif.read
                              ? "text-foreground/90 font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </main>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
